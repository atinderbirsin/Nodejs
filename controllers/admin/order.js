import commonModel from '../../models/common.js';
import Order from '../../models/order.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import { type } from '../../util/index.js';

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
  const { id, order_status, shipping_status } = req.body;
  try {
    let order = await Order.findById(id);

    if (order.order_status === type.ORDER_STATUS_TYPE.DELIVERED) {
      throw new Error(languageHelper.invalidCredentials);
    }

    if (!id) {
      throw new Error(languageHelper.orderIdRequired);
    } else if (!order) {
      throw new Error(languageHelper.orderCompleted);
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
        type.ORDER_STATUS_TYPE_TEXT[order.order_status]
      }
      to ${type.ORDER_STATUS_TYPE_TEXT[order_status]}`,
    };

    // { _id: person._id },
    // { $push: { friends: friend } },
    const updateVal = { $push: { order_status_log } };

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
