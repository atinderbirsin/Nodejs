import commonModel from '../../models/common.js';
import Order from '../../models/order.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import Cart from '../../models/cart.js';
import { type } from '../../util/index.js';
import Stock from '../../models/stock.js';
import User from '../../models/user.js';
import StockDetail from '../../models/stockDetail.js';

const place = async (req, res) => {
  const { shipping_instruction } = req.body;
  try {
    const officeId = req.jwt_id;
    const order_details = [];

    const cartItems = await Cart.aggregate([
      {
        $lookup: {
          from: 'devices',
          localField: 'device_id',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $match: { office_id: commonModel.toObjectId(officeId) },
      },
      {
        $unwind: '$device',
      },
    ]);

    if (cartItems.length <= 0) {
      throw new Error(languageHelper.cartEmpty);
    }

    let i = 0;

    do {
      const payload = {
        device_id: commonModel.toObjectId(cartItems[i].device_id),
        user_type: type.USER_TYPE.ADMIN,
      };

      // eslint-disable-next-line no-await-in-loop
      const quantityAvailable = await Stock.aggregate([
        {
          $match: payload,
        },
        {
          $group: {
            _id: '$device_id',
            stock_in: { $sum: '$stock_in' },
            stock_out: { $sum: '$stock_out' },
          },
        },
      ]);

      let quantity = 0;
      if (quantityAvailable.length > 0) {
        quantity = quantityAvailable[0].stock_in - quantityAvailable[0].stock_out;
      }

      if (quantity === 0) {
        throw new Error(` ${cartItems[i].device.name} is out of stock!`);
      }

      if (quantity < cartItems[i].quantity) {
        throw new Error(
          ` Insufficient ${cartItems[i].device.name} stock, We have ${quantity} quantity in our stock`
        );
      }

      const orderDetail = {
        device_name: cartItems[i].device.name,
        device_id: cartItems[i].device._id,
        sku_number: cartItems[i].device.sku_number,
        quantity: cartItems[i].quantity,
      };

      order_details.push(orderDetail);

      i += 1;
    } while (i < cartItems.length);

    const office = await User.findOne({ _id: officeId });
    const order_number = helperFn.serialNumber();

    const order_status_log = {
      order_status: type.ORDER_STATUS_TYPE.PENDING,
      notes: `Order No: #${order_number} , Order placed by ${office.name}`,
    };

    const shipping_status_log = {
      shipping_status: type.ORDER_STATUS_TYPE.PENDING,
      notes: `Order No: #${order_number} , Order placed by ${office.name}`,
      shipping_instruction,
    };

    const payload = {
      order_number,
      office_id: officeId,
      created_by: officeId,
      order_status: type.ORDER_STATUS_TYPE.PENDING,
      shipping_status: type.SHIPPING_STATUS_TYPE.PROCESSING,
      shipping_instruction,
      notes: `Order No: #${order_number} , Order placed by ${office.name}`,
      order_details,
      order_status_log,
      shipping_status_log,
    };

    const order = await Order.create(payload);

    await Cart.deleteMany({ office_id: officeId });

    res.json(commonModel.success(sanitize.Order(order)));
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

    let orders = await Order.aggregate([
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

    orders = orders.map((O) => sanitize.Order(O));

    res.json(commonModel.success(orders));
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

    const order = await Order.findById(id);

    if (!order) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(sanitize.Order(order)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const { id, shipping_status } = req.body;
  try {
    const order = await Order.findById(id);
    const office = await User.findById(req.jwt_id);

    if (!id) {
      throw new Error(languageHelper.orderIdRequired);
    } else if (!shipping_status) {
      throw new Error(languageHelper.shippingStatusRequired);
    } else if (Number(shipping_status) !== type.SHIPPING_STATUS_TYPE.DELIVERY_CONFIRMED_BY_OFFICE) {
      throw new Error(languageHelper.invalidCredentials);
    } else if (!order) {
      throw new Error(languageHelper.invalidCredentials);
    }

    if (
      order.order_status !== type.ORDER_STATUS_TYPE.ACCEPTED ||
      order.shipping_status !== type.SHIPPING_STATUS_TYPE.ARRIVED_AT_DESTINATION
    ) {
      throw new Error(languageHelper.invalidCredentials);
    }

    const order_status_log = {
      order_status: type.ORDER_STATUS_TYPE.COMPLETED,
      notes: `Order No: #${order.order_number} , Status changed from ${
        type.ORDER_STATUS_TYPE_TEXT[order.order_status]
      }
      to ${type.ORDER_STATUS_TYPE_TEXT[type.ORDER_STATUS_TYPE.COMPLETED]}`,
    };

    const shipping_status_log = {
      shipping_status: shipping_status,
      notes: `Order No: #${order.order_number} , Status changed from ${
        type.SHIPPING_STATUS_TYPE_TEXT[order.shipping_status]
      }
      to ${type.SHIPPING_STATUS_TYPE_TEXT[shipping_status]}`,
    };

    const updateVal = {
      $set: { shipping_status, order_status: type.ORDER_STATUS_TYPE.COMPLETED },
      $push: { shipping_status_log, order_status_log },
    };

    const updatedOrder = await Order.findByIdAndUpdate(id, updateVal, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      throw new Error(languageHelper.invalidCredentials);
    }

    const devices = order.order_details;
    let i = 0;
    let stock;

    do {
      const filter = {
        device_id: devices[i].device_id,
        user_id: commonModel.toObjectId(type.ADMIN_ID),
        status: type.DEVICE_STATUS_TYPE.DEACTIVATED,
      };

      const payload = {
        user_id: req.jwt_id,
        order_id: order._id,
        updated_at: new Date(),
      };

      const limit = Number(devices[i].quantity);

      // eslint-disable-next-line no-await-in-loop
      stock = await StockDetail.aggregate([{ $match: filter }, { $limit: limit }]);

      // out stock code start
      let remarks = `ADMIN (${type.ADMIN_NAME}) --> OFFICE (${office.name})`;
      const outData = {
        stock_datetime: Date.now(),

        user_id: type.ADMIN_ID, // admin
        user_type: type.USER_TYPE.ADMIN,
        device_id: devices[i].device_id,

        stock_type: type.STOCK_TYPE.OUT, // out
        stock_in: 0,
        stock_return: 0,
        stock_out: devices[i].quantity,
        job_type: null,
        job_status: null,

        remarks: remarks,

        ref_id: req.jwt_id, // office
        ref_type: type.USER_TYPE.OFFICE,
        order_id: order._id,
        job_id: null,
      };
      // eslint-disable-next-line no-await-in-loop
      await Stock.create(outData);
      // out stock code end

      // in stock code start
      remarks = `ADMIN (${type.ADMIN_NAME}) --> OFFICE (${office.name})`;
      const inData = {
        stock_datetime: Date.now(),

        user_id: req.jwt_id, // office
        user_type: type.USER_TYPE.OFFICE, // office
        device_id: devices[i].device_id,

        stock_type: type.STOCK_TYPE.IN, // in
        stock_out: 0,
        stock_in: devices[i].quantity,
        stock_return: 0,
        job_type: null,
        job_status: null,

        remarks: remarks,

        ref_id: type.ADMIN_ID, // admin
        ref_type: type.USER_TYPE.ADMIN,
        order_id: order._id,
        job_id: null,
      };
      // eslint-disable-next-line no-await-in-loop
      await Stock.create(inData);
      // in stock code end

      let j = 0;
      do {
        filter.serial_number = { $ne: null };

        // eslint-disable-next-line no-await-in-loop
        await StockDetail.updateOne(filter, payload);

        j += 1;
      } while (j < stock.length);

      i += 1;
    } while (i < devices.length);

    res.json(commonModel.success(updatedOrder));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  place,
  list,
  get,
  update,
};
