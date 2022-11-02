import commonModel from '../../models/common.js';
import Order from '../../models/order.js';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import Device from '../../models/device.js';

const list = async (req, res) => {
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

    const devices = orders.map((O) => sanitize.Device(O));
    const total = await Device.count(req.body);

    res.json(commonModel.listSuccess(devices, total, limit));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  const { id } = req.body.id;
  try {
    if (!id) {
      throw new Error(languageHelper.orderIdRequired);
    }

    const order = await Order.findById(id);

    if (!order) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(order));
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
