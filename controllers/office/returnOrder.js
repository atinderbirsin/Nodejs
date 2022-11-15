/* eslint-disable prefer-arrow-callback */
import commonModel from '../../models/common.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import User from '../../models/user.js';
import StockDetail from '../../models/stockDetail.js';
import Device from '../../models/device.js';
import returnOrder from '../../models/returnOrder.js';
import { type } from '../../util/index.js';

const place = async (req, res) => {
  const { device_id, quantity } = req.body;
  try {
    const device = await Device.findById(device_id);
    const office = await User.findById(req.jwt_id);

    if (!device_id) {
      throw new Error(languageHelper.deviceIdRequired);
    } else if (!quantity) {
      throw new Error(languageHelper.quantityRequired);
    } else if (!device) {
      throw new Error(languageHelper.invalidCredentials);
    }

    const officeId = req.jwt_id;

    let availableQuantity = (
      await StockDetail.find({
        user_id: officeId,
        device_id,
        technician_id: null,
        customer_vehicle_id: null,
      })
    ).length;

    let returnOrderPlacedQuantity = 0;

    const returnOrdersPlaced = await returnOrder.find({
      office_id: req.jwt_id,
      order_status: type.ORDER_STATUS_TYPE.PENDING,
      device_id,
    });

    if (returnOrdersPlaced.length > 0) {
      returnOrdersPlaced.forEach(function (order) {
        returnOrderPlacedQuantity += order.return_order_details.quantity;
      });
    }

    availableQuantity -= returnOrderPlacedQuantity;

    if (availableQuantity < quantity || availableQuantity === 0) {
      throw new Error(languageHelper.notEnoughStockPlaceRetrunOrder);
    }

    const order_number = helperFn.serialNumber();

    const returnOrderDetails = {
      device_name: device.name,
      device_id: device._id,
      sku_number: device.sku_number,
      quantity: quantity,
    };

    const returnOrderStatusLog = {
      order_status: type.ORDER_STATUS_TYPE.PENDING,
      notes: `Order No: #${order_number} , Order placed by ${office.name}`,
    };

    const payload = {
      order_number,
      office_id: req.jwt_id,
      order_status: type.ORDER_STATUS_TYPE.PENDING,
      return_order_details: returnOrderDetails,
      return_order_status_log: returnOrderStatusLog,
      created_by: req.jwt_id,
    };

    const order = await returnOrder.create(payload);

    res.json(commonModel.success(sanitize.returnOrder(order)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const list = async (req, res) => {
  try {
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { order_datetime: order };
    const search = req.body.search ? { $text: { $search: req.body.search } } : {};

    let orders = await returnOrder.aggregate([
      {
        $match: search,
      },
      {
        $match: { office_id: { $eq: commonModel.toObjectId(req.jwt_id) } },
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

    orders = orders.map((O) => sanitize.returnOrder(O));
    const total = orders.length;
    res.json(commonModel.listSuccess(orders, total, limit));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.orderIdRequired);
    }

    const order = await returnOrder.findById(id);

    if (!order) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(sanitize.returnOrder(order)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  place,
  list,
  get,
};
