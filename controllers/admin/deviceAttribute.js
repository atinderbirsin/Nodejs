import path from 'path';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import commonModel from '../../models/common.js';
import DeviceAttribute from '../../models/deviceAttribute.js';
import { type } from '../../util/index.js';

const __dirname = path.resolve();
const publicDirectoryPath = path.join(__dirname, './public');

const create = async (req, res) => {
  try {
    if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    }

    req.body.image = req.file ? req.file.filename : '';
    const deviceAttribute = await DeviceAttribute.create(req.body);

    res.json(commonModel.success(sanitize.deviceAttribute(deviceAttribute)));
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

    /* EXECUTE QUERY
    // eslint-disable-next-line new-cap
    const features = new apiFeatures(DeviceAttribute.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const deviceAttributes = await features.query; */

    let deviceAttributes = await DeviceAttribute.aggregate([
      {
        $match: search,
      },
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

    deviceAttributes = deviceAttributes.map((device) => sanitize.deviceAttribute(device));
    const total = await DeviceAttribute.count(req.body);

    res.json(commonModel.listSuccess(deviceAttributes, total, limit));
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const get = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.attributeIdRequired);
    }
    const filter = {
      _id: id,
      deleted_at: null,
    };

    const deviceAttribute = await DeviceAttribute.findOne(filter);

    if (!deviceAttribute) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(sanitize.deviceAttribute(deviceAttribute)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const { id } = req.body;
  try {
    const filter = {
      _id: id,
      deleted_at: null,
    };

    let deviceAttribute = await DeviceAttribute.findOne(filter);

    if (!id) {
      throw new Error(languageHelper.attributeIdRequired);
    } else if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    } else if (!deviceAttribute) {
      throw new Error(languageHelper.invalidCredentials);
    }

    if (req.file) {
      req.body.image = req.file.filename;
      helperFn.removeImage(deviceAttribute.image, `${publicDirectoryPath}/device/`);
    }

    deviceAttribute = await DeviceAttribute.findOneAndUpdate(filter, req.body, {
      new: true,
      runValidators: true,
    });

    if (!deviceAttribute) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(sanitize.deviceAttribute(deviceAttribute)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const remove = async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      throw new Error(languageHelper.attributeIdRequired);
    }

    const deviceAttribute = await DeviceAttribute.findByIdAndUpdate(req.body.id, {
      deleted_at: Date.now(),
    });

    if (!deviceAttribute) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(''));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const service = async (req, res) => {
  try {
    const attributes = await DeviceAttribute.aggregate([
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

    res.json(commonModel.success(attributes));
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
