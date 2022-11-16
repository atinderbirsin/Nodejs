import commonModel from '../../models/common.js';
import Order from '../../models/order.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import { type } from '../../util/index.js';
import StockDetail from '../../models/stockDetail.js';

const list = async (req, res) => {
  try {
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { order_datetime: order };
    const search = req.body.search ? { $text: { $search: req.body.search } } : {};

    let orders = await Order.aggregate([
      {
        $match: search,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'office_id',
          foreignField: '_id',
          as: 'office',
        },
      },
      {
        $unwind: '$office',
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

    orders = orders.map((O) => sanitize.Order(O));
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

    let order = await Order.aggregate([
      {
        $match: { _id: { $eq: commonModel.toObjectId(id) } },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'office_id',
          foreignField: '_id',
          as: 'office',
        },
      },
      {
        $unwind: '$office',
      },
    ]);

    if (order.length > 0) {
      order = order[0];
    } else {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(sanitize.Order(order)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const { id, order_status, shipping_status, shipping_instruction, notes } = req.body;
  try {
    let order = await Order.findById(id);
    const orderStatus = Number(order_status);
    const shippingStatus = Number(shipping_status);

    if (orderStatus === type.ORDER_STATUS_TYPE.COMPLETED) {
      throw new Error(languageHelper.invalidCredentials);
    } else if (Number(shipping_status) === type.SHIPPING_STATUS_TYPE.DELIVERY_CONFIRMED_BY_OFFICE) {
      throw new Error(languageHelper.invalidCredentials);
    }

    if (!id) {
      throw new Error(languageHelper.orderIdRequired);
    } else if (!order) {
      throw new Error(languageHelper.invalidCredentials);
    }

    const devices = [];
    let stockDevices;
    let quantity = 0;

    if (orderStatus || shippingStatus) {
      if (
        orderStatus === type.ORDER_STATUS_TYPE.ACCEPTED ||
        shippingStatus === type.SHIPPING_STATUS_TYPE.DISPATCHED ||
        shippingStatus === type.SHIPPING_STATUS_TYPE.ARRIVED_AT_DESTINATION
      ) {
        order.order_details.forEach((device) => {
          devices.push(device.device_id);
          quantity += device.quantity;
        });

        let i = 0;

        do {
          const filter = {
            device_id: commonModel.toObjectId(devices[i]),
            user_id: commonModel.toObjectId(type.ADMIN_ID),
            technician_id: null,
            customer_id: null,
            customer_vehicle_id: null,
            serial_number: { $ne: null },
          };

          // eslint-disable-next-line no-await-in-loop
          stockDevices = await StockDetail.aggregate([
            {
              $match: filter,
            },
          ]);

          i += 1;
        } while (i < devices.length);
      }

      if (stockDevices.length === 0 || stockDevices.length < quantity) {
        throw new Error(languageHelper.devicesNotConfigured);
      }
    }

    const order_status_log = {
      order_status: order_status,
      notes: `Order No: #${order.order_number} , Status changed from ${
        type.ORDER_STATUS_TYPE_TEXT[order.order_status]
      }
      to ${type.ORDER_STATUS_TYPE_TEXT[order_status]}`,
    };

    const shipping_status_log = {
      shipping_status: shipping_status,
      notes: `Order No: #${order.order_number} , Status changed from ${
        type.SHIPPING_STATUS_TYPE_TEXT[order.shipping_status]
      }
      to ${type.SHIPPING_STATUS_TYPE_TEXT[shipping_status]}`,
    };

    let updateVal;

    if (order_status) {
      updateVal = { $set: { order_status, shipping_instruction, notes }, $push: { order_status_log } };
    } else if (shipping_status) {
      updateVal = { $set: { shipping_status, shipping_instruction, notes }, $push: { shipping_status_log } };
    }

    order = await Order.findByIdAndUpdate(id, updateVal, {
      new: true,
      runValidators: true,
    });

    res.json(commonModel.success(order));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const statusType = async (req, res) => {
  try {
    const result = {
      order_status_type: type.ORDER_STATUSES,
      shipping_status_type: type.SHIPPING_STATUSES,
    };

    res.json(commonModel.success(result));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  list,
  get,
  update,
  statusType,
};
