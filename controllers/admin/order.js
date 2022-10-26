import Order from '../../models/order.js';
import apiFeatures from '../../util/apiFeatures.js';

const list = async (req, res) => {
  try {
    // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    const features = new apiFeatures(Order.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const orders = await features.query;

    res.status(200).json({
      status: 'success',
      result: orders.length,
      data: {
        orders,
      },
    });
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
  list,
  get,
  update,
};
