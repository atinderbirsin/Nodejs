import bcryptjs from 'bcryptjs';
import path from 'path';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import commonModel from '../../models/common.js';
import Order from '../../models/order.js';
import returnOrder from '../../models/returnOrder.js';
import StockDetail from '../../models/stockDetail.js';
import User from '../../models/user.js';
import { constant, type } from '../../util/index.js';

const __dirname = path.resolve();
const publicDirectoryPath = path.join(__dirname, './public');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      throw new Error(languageHelper.emailAddressRequired);
    } else if (!helperFn.isEmailValid(email)) {
      throw new Error(languageHelper.invalidEmailAddress);
    } else if (!password) {
      throw new Error(languageHelper.passwordRequired);
    }

    const filter = {
      email: email,
      user_type: type.USER_TYPE.OFFICE,
    };

    let user = await User.findOne(filter);

    if (!user || !commonModel.compareHash(password, user.password)) {
      return res.json(commonModel.failure('Invalid details!'));
    }

    const token = commonModel.generateToken(user._id, user.user_type);

    const update = { token: token };
    const options = { new: true };
    user = await User.findByIdAndUpdate(user._id.toString(), update, options);

    res.json(commonModel.success(sanitize.admin(user, false)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const dashboard = async (req, res) => {
  try {
    const officeId = commonModel.toObjectId(req.jwt_id);

    const devices = await StockDetail.find({ user_id: officeId, customer_vehicle_id: null });
    const assigned_devices = await StockDetail.find({
      user_id: officeId,
      customer_vehicle_id: { $ne: null },
    });
    const orders = await Order.find({ office_id: officeId });
    const returnOrders = await returnOrder.find({ office_id: officeId });

    // Month array for stats starts
    const month_array = [
      '', // month number starts at 1, so the 0th element can be anything
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    // Month array for stats ends

    // Order stats code starts
    month_array.shift(); // to remove empty string at index 0

    const order_stats = [];

    month_array.forEach((month) => {
      const placeholder = {
        month: month,
        orders: 0,
      };
      order_stats.push(placeholder);
      orders.forEach((order) => {
        const orderMonth = month_array[new Date(order.order_datetime).getMonth()];

        if (orderMonth === month) {
          placeholder.orders += 1;
        }
      });
    });

    // Order stats code ends

    // Order Return stats code starts
    const retrun_order_stats = [];

    month_array.forEach((month) => {
      const placeholder = {
        month: month,
        orders: 0,
      };
      retrun_order_stats.push(placeholder);
      returnOrders.forEach((order) => {
        const returnOrderMonth = month_array[new Date(order.order_datetime).getMonth()];

        if (returnOrderMonth === month) {
          placeholder.orders += 1;
        }
      });
    });

    const stats = {
      unassigned_devices: devices.length,
      available_devices: devices.length,
      assigned_devices: assigned_devices.length,
      orders: orders.length,
      return_orders: returnOrders.length,
      order_stats: order_stats,
      retrun_order_stats: retrun_order_stats,
    };

    res.json(commonModel.success(stats));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const { password } = req.body;
  try {
    const filter = {
      _id: req.jwt_id,
      deleted_at: null,
      user_type: type.USER_TYPE.OFFICE,
    };

    let user = await User.findOne(filter);

    if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    } else if (!user) {
      throw new Error(languageHelper.invalidCredentials);
    }

    if (password) {
      req.body.password = await bcryptjs.hash(password, constant.hashLength);
    }
    if (req.file) {
      req.body.image = req.file.filename;
      helperFn.removeImage(user.image, `${publicDirectoryPath}/user/`);
    }

    user = await User.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
      context: 'query',
    });

    res.json(commonModel.success(sanitize.User(user, true)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  try {
    const user = await User.findById(req.jwt_id);

    if (!user) {
      res.json(commonModel.failure(languageHelper.InvalidToken));
    }

    res.json(commonModel.success(sanitize.User(user, true)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default { login, dashboard, update, get };
