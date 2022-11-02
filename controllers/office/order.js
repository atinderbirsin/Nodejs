import commonModel from '../../models/common.js';
import Order from '../../models/order.js';
import { sanitize } from '../../helper/index.js';

const place = async (req, res) => {
  try {
    // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    /* const features = new apiFeatures(Order.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders = await features.query; */
    req.body.deleted_at = null;
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { created_at: order };
    const search = req.body.search ? { $text: { $search: req.body.search } } : {};

    const orders = await Order.aggregate([
      { $match: search },
      {
        $match: {
          deleted_at: {
            $eq: null,
          },
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

    devices = orders.map((order) => sanitize.Device(order));
    const total = await Device.count(req.body);

    res.status(200).json(commonModel.listSuccess(orders, total, limit));
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const get = async (req, res) => {
  try {
    const order = await Order.findById(req.body.id);

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
  get,
  update,
};
