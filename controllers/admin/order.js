import commonModel from '../../models/common.js';
import Order from '../../models/order.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';

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
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.orderIdRequired);
    }

    const order = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(order));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  list,
  get,
  update,
};
