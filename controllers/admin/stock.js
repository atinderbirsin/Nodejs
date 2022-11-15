import commonModel from '../../models/common.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import { type } from '../../util/index.js';
import Stock from '../../models/stock.js';
import StockDetail from '../../models/stockDetail.js';

const create = async (req, res) => {
  const { device_id, quantity } = req.body;
  try {
    if (!device_id) {
      throw new Error(languageHelper.deviceIdRequired);
    } else if (!quantity) {
      throw new Error(languageHelper.quantityRequired);
    } else if (quantity <= 0) {
      throw new Error(languageHelper.quantityShouldBeGreaterThanOrEqaualToOne);
    }

    const vendorId = type.VENDOR_ID;
    const vendorName = type.VENDOR_NAME;

    const remarks = `VENDOR (${vendorName}) --> ADMIN (${type.ADMIN_NAME})`;

    const stockPayload = {
      stock_datetime: Date.now(),

      user_id: type.ADMIN_ID, // to
      user_type: type.USER_TYPE.ADMIN,
      device_id: device_id,

      stock_type: type.STOCK_TYPE.IN, // in
      stock_in: quantity,
      stock_return: 0,
      stock_out: 0,
      job_type: null,
      job_status: null,

      remarks: remarks,
      ref_id: vendorId, // from
      ref_type: type.USER_TYPE.VENDOR,

      order_id: null,
    };

    await Stock.create(stockPayload);

    const log = 'Device is currently In-active';

    let i = 0;

    do {
      const stockDetailPayload = {
        user_id: type.ADMIN_ID,
        device_id: device_id,
        status: type.DEVICE_STATUS_TYPE.DEACTIVATED,
        logs: {
          log,
        },
      };

      // eslint-disable-next-line no-await-in-loop
      await StockDetail.create(stockDetailPayload);

      i += 1;
    } while (i < Number(quantity));

    res.json(commonModel.success());
  } catch (err) {
    console.log(err);
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const list = async (req, res) => {
  try {
    req.body.deleted_at = null;
    req.body.user_type = type.USER_TYPE.ADMIN;
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { stock_datetime: order };
    const keyword = { $regex: req.body.search || '' };
    const search = {
      $or: [{ 'device.name': keyword }, { 'device.sku_number': keyword }],
    };

    let stocks = await Stock.aggregate([
      {
        $match: {
          deleted_at: {
            $eq: null,
          },
          user_type: {
            $eq: type.USER_TYPE.ADMIN,
          },
        },
      },
      {
        $lookup: {
          from: 'devices',
          localField: 'device_id',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'order_id',
          foreignField: '_id',
          as: 'order',
        },
      },
      { $match: search },
      {
        $group: {
          _id: '$device_id',
          stock_in: { $sum: '$stock_in' },
          stock_out: { $sum: '$stock_out' },
          stock_return: { $sum: '$stock_return' },
          stock_type: { $first: '$stock_type' },
          stock_datetime: { $first: '$stock_datetime' },
          device_id: { $first: '$device_id' },
          device_name: { $first: '$device.name' },
          device_sku_number: { $first: '$device.sku_number' },
        },
      },
      { $unwind: '$device_name' },
      { $unwind: '$device_sku_number' },
      {
        $sort: sort,
      },
      {
        $skip: (+page - 1) * +limit,
      },
      {
        $limit: +limit,
      },
    ]);

    const total = stocks.length;
    stocks = stocks.map((stock) => sanitize.stockList(stock));
    res.json(commonModel.listSuccess(stocks, total, limit));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const history = async (req, res) => {
  const { device_id } = req.body;
  try {
    if (!device_id) {
      throw new Error(languageHelper.deviceIdRequired);
    }

    req.body.deleted_at = null;
    req.body.user_type = type.USER_TYPE.ADMIN;
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { stock_datetime: order };
    const keyword = { $regex: req.body.search || '' };
    const search = {
      $or: [
        { 'user.name': keyword },
        { 'user.code': keyword },
        { 'ref.name': keyword },
        { 'ref.code': keyword },
        { 'stock.remarks': keyword },
      ],
    };

    const stocks = await Stock.aggregate([
      {
        $lookup: {
          from: 'devices',
          localField: 'device_id',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'ref_id',
          foreignField: '_id',
          as: 'ref',
        },
      },
      { $unwind: '$device' },
      { $unwind: '$user' },
      { $unwind: '$ref' },
      { $match: search },
      {
        $group: {
          _id: '$_id',
          device_id: { $first: '$device._id' },
          device_name: { $first: '$device.name' },
          device_sku_number: { $first: '$device.sku_number' },
          ref_id: { $first: '$ref._id' },
          ref_code: { $first: '$ref.code' },
          ref_name: { $first: '$ref.name' },
          ref_type: { $first: '$ref.user_type' },
          remarks: { $first: '$remarks' },
          stock_datetime: { $first: '$stock_datetime' },
          stock_in: { $first: '$stock_in' },
          stock_out: { $first: '$stock_out' },
          stock_return: { $first: '$stock_return' },
          stock_type: { $first: '$stock_type' },
          user_id: { $first: '$user._id' },
          user_code: { $first: '$user.code' },
          user_name: { $first: '$user.name' },
          user_type: { $first: '$user.user_type' },
        },
      },
      {
        $match: {
          device_id: { $eq: commonModel.toObjectId(device_id) },
          deleted_at: null,
          user_type: type.USER_TYPE.ADMIN,
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: (+page - 1) * +limit,
      },
      {
        $limit: +limit,
      },
    ]);

    const total = stocks.length;
    res.json(commonModel.listSuccess(stocks, total, limit));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  create,
  list,
  history,
};
