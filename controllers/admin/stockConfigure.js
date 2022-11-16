import commonModel from '../../models/common.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import { type } from '../../util/index.js';
import StockDetail from '../../models/stockDetail.js';

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
      $or: [{ 'device.name': keyword }, { 'device.sku_number': keyword }, { 'user.name': keyword }],
    };

    let devices = await StockDetail.aggregate([
      {
        $match: {
          deleted_at: {
            $eq: null,
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
      { $unwind: '$device' },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $match: search },
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

    const total = devices.length;
    devices = devices.map((device) => sanitize.stockItem(device));
    res.json(commonModel.listSuccess(devices, total, limit));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.idIsRequired);
    }

    let device = await StockDetail.aggregate([
      {
        $match: {
          _id: {
            $eq: commonModel.toObjectId(id),
          },
          deleted_at: {
            $eq: null,
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
      { $unwind: '$device' },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $lookup: {
          from: 'users',
          localField: 'technician_id',
          foreignField: '_id',
          as: 'technician',
        },
      },
      { $unwind: { path: '$technician', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'users',
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: { path: '$customer', preserveNullAndEmptyArrays: true } },
      {
        // find a vehicle, that matches
        // to a customer
        $addFields: {
          vehicle: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$customer.vehicles',
                  cond: {
                    $eq: ['$$this._id', '$customer_vehicle_id'],
                  },
                },
              },
              0,
            ],
          },
        },
      },
    ]);

    if (device.length > 0) {
      device = device[0];
    }

    res.json(commonModel.success(sanitize.stockItem(device)));
  } catch (err) {
    console.log(err);
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const { id, serial_number } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.idIsRequired);
    } else if (!serial_number) {
      throw new Error(languageHelper);
    }

    let device = await StockDetail.findByIdAndUpdate(
      id,
      { serial_number },
      {
        new: true,
        runValidators: true,
      }
    );

    device = await StockDetail.aggregate([
      {
        $match: {
          _id: {
            $eq: commonModel.toObjectId(id),
          },
          deleted_at: {
            $eq: null,
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
      { $unwind: '$device' },
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ]);

    if (!device) {
      throw new Error(languageHelper.invalidCredentials);
    }

    if (device.length > 0) {
      device = device[0];
    }

    res.json(commonModel.success(sanitize.stockItem(device)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  list,
  get,
  update,
};
