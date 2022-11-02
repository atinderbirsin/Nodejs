import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import Cart from '../../models/cart.js';
import commonModel from '../../models/common.js';

const add = async (req, res) => {
  const { device_id, quantity } = req.body;

  try {
    if (!device_id) {
      throw new Error(languageHelper.deviceIdRequired);
    } else if (!quantity) {
      throw new Error(languageHelper.quantityRequired);
    }

    const filter = { device_id: device_id };

    const update = {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      office_id: req.jwt_id,
      device_id,
      quantity,
      created_by: req.jwt_id,
    };

    const options = {
      new: true,
      upsert: true,
      runValidators: true,
      context: 'query',
    };

    const result = await Cart.findOneAndUpdate(filter, { $set: update }, options);

    if (!result) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(result));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  try {
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { created_at: order };

    // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    /* const features = new apiFeatures(User.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let users = await features.query; */

    let items = await Cart.aggregate([
      {
        $match: { office_id: { $eq: commonModel.toObjectId(req.jwt_id) } },
      },
      {
        $lookup: {
          from: 'devices',
          localField: 'device_id',
          foreignField: '_id',
          as: 'device',
        },
      },
      {
        $unwind: '$device',
      },
      {
        $group: {
          _id: '$_id',
          quantity: { $first: '$quantity' },
          device_name: { $first: '$device.name' },
          device_sku_number: { $first: '$device.sku_number' },
          device_image: { $first: '$device.image' },
          attributes: { $first: '$device.attributes' },
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

    items = items.map((item) => sanitize.CartItem(item));

    res.json(commonModel.success(items));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const remove = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    }

    const result = await Cart.findByIdAndDelete(id);

    if (!result) {
      throw new Error(languageHelper.itemDoesntExist);
    }

    res.json(commonModel.success(''));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const clear = async (req, res) => {
  try {
    const result = await Cart.deleteMany({ office_id: req.jwt_id });

    if (result.deletedCount === 0) {
      throw new Error(languageHelper.cartEmpty);
    }

    res.json(commonModel.success());
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  add,
  get,
  remove,
  clear,
};
