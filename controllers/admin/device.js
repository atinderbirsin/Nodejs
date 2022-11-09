import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import commonModel from '../../models/common.js';
import Device from '../../models/device.js';
import { type } from '../../util/index.js';

const create = async (req, res) => {
  let { attributes } = req.body;
  try {
    if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    }

    if (Array.isArray(attributes)) {
      attributes = attributes.map((attribute) => JSON.parse(attribute));
    } else {
      attributes = JSON.parse(attributes);
    }

    const payload = {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...req.body,
      attributes,
    };

    const device = await Device.create(payload);

    res.json(commonModel.success(sanitize.Device(device)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const list = async (req, res) => {
  try {
    req.body.deleted_at = null;
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { created_at: order };
    const search = req.body.search ? { $text: { $search: req.body.search } } : {};
    /* // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    const features = new apiFeatures(Device.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const device = await features.query; */

    let devices = await Device.aggregate([
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

    devices = devices.map((device) => sanitize.Device(device));
    const total = await Device.count(req.body);

    res.json(commonModel.listSuccess(devices, total, limit));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.deviceIdRequired);
    }

    const device = await Device.findById(id);

    res.json(commonModel.success(sanitize.Device(device)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  let { id, attributes } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.deviceIdRequired);
    }

    if (Array.isArray(attributes)) {
      attributes = attributes.map((attribute) => JSON.parse(attribute));
    } else {
      attributes = JSON.parse(attributes);
    }

    const payload = {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...req.body,
      attributes,
    };

    const device = await Device.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    res.json(commonModel.success(sanitize.Device(device)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const remove = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.deviceIdRequired);
    }

    const device = await Device.findByIdAndUpdate(id, {
      deleted_at: Date.now(),
    });

    if (!device) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success());
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const service = async (req, res) => {
  try {
    const devices = await Device.aggregate([
      {
        $match: {
          status: { $eq: type.STATUS_TYPE.ACTIVE },
          deleted_at: {
            $eq: null,
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
        },
      },
    ]);

    res.json(commonModel.success(devices));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  create,
  list,
  get,
  update,
  remove,
  service,
};
