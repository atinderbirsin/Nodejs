import commonModel from '../../models/common.js';
import Order from '../../models/order.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import Cart from '../../models/cart.js';
import { type } from '../../util/index.js';
import Stock from '../../models/stock.js';
import User from '../../models/user.js';

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
        throw new Error(`${cartItems[i].device.name} is out of stock!`);
      }

      if (quantity < cartItems[i].quantity) {
        throw new Error(
          `Insufficient ${cartItems[i].device.name} stock, We have ${quantity} quantity in our stock`
        );
      }

      const orderDetail = {
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
  try {
    const order = await Order.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        order,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

export default {
  place,
  list,
  get,
  update,
};
