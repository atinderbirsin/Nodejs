import commonModel from '../../models/common.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import { type } from '../../util/index.js';
import returnOrder from '../../models/returnOrder.js';
import User from '../../models/user.js';
import Stock from '../../models/stock.js';
import StockDetail from '../../models/stockDetail.js';

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

    let order = await returnOrder.aggregate([
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

    res.json(commonModel.success(sanitize.returnOrder(order)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const { id, order_status } = req.body;
  try {
    let order = await returnOrder.findById(id);
    const office = await User.findById(order.office_id);
    const status = Number(order.order_status);

    if (status === type.ORDER_STATUS_TYPE.COMPLETED) {
      throw new Error(languageHelper.orderCompleted);
    } else if (
      status === type.ORDER_STATUS_TYPE.PENDING &&
      Number(order_status) === type.ORDER_STATUS_TYPE.COMPLETED
    ) {
      throw new Error(languageHelper.invalidCredentials);
    }

    if (!id) {
      throw new Error(languageHelper.orderIdRequired);
    } else if (!order) {
      throw new Error(languageHelper.invalidCredentials);
    }

    const return_order_status_log = {
      order_status: order_status,
      notes: `Order No: #${order.order_number} , Status changed from ${
        type.ORDER_STATUS_TYPE_TEXT[order.order_status]
      }
      to ${type.ORDER_STATUS_TYPE_TEXT[order_status]}`,
    };

    let updateVal = { $set: { order_status }, $push: { return_order_status_log } };

    order = await returnOrder.findByIdAndUpdate(id, updateVal, {
      new: true,
      runValidators: true,
    });

    if (order.order_status === type.ORDER_STATUS_TYPE.COMPLETED) {
      let remarks = `OFFICE (${office.name}) --> ADMIN (${type.ADMIN_NAME})`;
      const outData = {
        stock_datetime: Date.now(),

        user_id: office._id, // office
        user_type: type.USER_TYPE.OFFICE,
        device_id: order.return_order_details.device_id,

        stock_type: type.STOCK_TYPE.RETURN,
        stock_in: 0,
        stock_out: 0,
        stock_return: order.return_order_details.quantity,
        job_type: null,
        job_status: null,

        remarks: remarks,

        ref_id: type.ADMIN_ID, // admin
        ref_type: type.USER_TYPE.ADMIN,
        order_id: order._id,
      };
      await Stock.create(outData);
      // out stock code end

      // in stock code start
      remarks = `OFFICE (${office.name}) --> ADMIN (${type.ADMIN_NAME})`;
      const inData = {
        stock_datetime: Date.now(),

        user_id: type.ADMIN_ID, // admin
        user_type: type.USER_TYPE.ADMIN, // admin
        device_id: order.return_order_details.device_id,

        stock_type: type.STOCK_TYPE.RETURN,
        stock_out: 0,
        stock_in: 0,
        stock_return: order.return_order_details.quantity,
        job_type: null,
        job_status: null,

        remarks: remarks,

        ref_id: office._id, // office
        ref_type: type.USER_TYPE.OFFICE,
        order_id: order._id,
      };
      await Stock.create(inData);
      // in stock code end
    }

    if (order.order_status === type.ORDER_STATUS_TYPE.COMPLETED) {
      let i = 0;

      do {
        const filter = {
          user_id: office._id,
          device_id: order.return_order_details.device_id,
          technician_id: null,
          customer_id: null,
          customer_vehicle_id: null,
        };

        const notes = `Device returned by ${office.name} because device is ${
          type.DEVICE_ISSUE_TYPE_TEXT[order.issue_type]
        }`;

        const logs = {
          log: `Device has been returned because its ${type.DEVICE_ISSUE_TYPE_TEXT[order.issue_type]}`,
        };

        updateVal = {
          $set: { status: type.DEVICE_STATUS_TYPE.DECOMISSIONED, user_id: type.ADMIN_ID, notes },
          $push: { logs },
        };

        // eslint-disable-next-line no-await-in-loop
        await StockDetail.findOneAndUpdate(filter, updateVal);

        i += 1;
      } while (i < order.return_order_details.quantity);
    }

    res.json(commonModel.success(order));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const statusType = async (req, res) => {
  try {
    const result = {
      order_status_type: type.ORDER_STATUSES,
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
