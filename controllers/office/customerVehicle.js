import path from 'path';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import commonModel from '../../models/common.js';
import User from '../../models/user.js';
import { type } from '../../util/index.js';

const __dirname = path.resolve();
const publicDirectoryPath = path.join(__dirname, './public');

const create = async (req, res) => {
  const {
    customer_id,
    name,
    status,
    description,
    vehicle_color,
    vehicle_make,
    vehicle_model,
    vehicle_number,
  } = req.body;

  try {
    if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    }

    let vehicle = await User.findOne({ 'vehicles.vehicle_number': vehicle_number });

    if (vehicle) {
      throw new Error(languageHelper.vehicleNumberAlreadyExist);
    }

    const filter = { _id: customer_id, deleted_at: null, user_type: type.USER_TYPE.CUSTOMER };

    const update = {
      $push: {
        vehicles: {
          // eslint-disable-next-line node/no-unsupported-features/es-syntax
          name,
          status,
          description,
          vehicle_color,
          vehicle_make,
          vehicle_model,
          vehicle_number,
          image: req.file ? req.file.filename : '',
          created_by: req.jwt_id,
        },
      },
    };

    const options = {
      new: true,
      runValidators: true,
      context: 'query',
      fields: { _id: false, vehicles: true },
    };

    const result = await User.findOneAndUpdate(filter, update, options);

    if (!result) {
      throw new Error(languageHelper.invalidCredentials);
    }
    vehicle = result.vehicles.pop() ?? undefined;

    if (!vehicle) {
      throw new Error(languageHelper.unableToAddVehicle);
    }

    res.json(commonModel.success(sanitize.Vehicle(vehicle)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const list = async (req, res) => {
  try {
    req.body.user_type = type.USER_TYPE.CUSTOMER;
    req.body.deleted_at = null;
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { created_at: order };
    const search = req.body.search ? { $text: { $search: req.body.search } } : {};

    // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    /* const features = new apiFeatures(User.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let users = await features.query; */

    let users = await User.aggregate([
      {
        $match: search,
      },
      {
        $match: {
          $expr: { $gt: [{ $size: '$vehicles' }, 0] },
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

    users = users.map((user) => {
      user.jwt_id = req.jwt_id;
      return sanitize.User(user, true);
    });
    const total = await User.count(req.body);

    res.json(commonModel.listSuccess(users, total, limit));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    }
    const filter = {
      _id: id,
      deleted_at: null,
      user_type: type.USER_TYPE.CUSTOMER,
    };

    const user = await User.findOne(filter);

    if (!user) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(sanitize.CustomerVehicle(user, true)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const {
    id,
    customer_id,
    name,
    status,
    description,
    vehicle_color,
    vehicle_make,
    vehicle_model,
    vehicle_number,
  } = req.body;
  try {
    const values = {};
    const created_by = req.jwt_id;

    let user = await User.findOne({ _id: customer_id });

    if (user.created_by?.toString() !== created_by) {
      return res.json(commonModel.failure(languageHelper.youDontHaveUpdatePermission));
    }

    if (name) {
      values['vehicles.$.name'] = name;
    }
    if (status) {
      values['vehicles.$.status'] = status;
    }
    if (description) {
      values['vehicles.$.description'] = description;
    }
    if (vehicle_color) {
      values['vehicles.$.vehicle_color'] = vehicle_color;
    }
    if (vehicle_make) {
      values['vehicles.$.vehicle_make'] = vehicle_make;
    }
    if (vehicle_model) {
      values['vehicles.$.vehicle_model'] = vehicle_model;
    }
    if (vehicle_number) {
      values['vehicles.$.vehicle_number'] = vehicle_number;
    }
    if (req.file) {
      values['vehicles.$.image'] = req.file.filename;
    }
    if (created_by) {
      values['vehicles.$.created_by'] = created_by;
    }

    const updateValues = { $set: values };

    let filter = {
      'vehicles._id': id,
    };

    const vehicleFilter = { _id: 0, vehicles: { $elemMatch: { _id: id } } };

    const vehicle = await User.findOne(filter, vehicleFilter);

    const options = {
      new: true,
      runValidators: true,
      context: 'query',
      // select: { _id: false, vehicles: { $elemMatch: { _id: id } } },
    };

    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    }
    if (!customer_id) {
      throw new Error(languageHelper.userIdRequired);
    } else if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    }

    if (req.file) {
      req.body.image = req.file.filename;
      helperFn.removeImage(vehicle.vehicles[0].image, `${publicDirectoryPath}/customerVehicle/`);
    }

    filter = {
      _id: customer_id,
      'vehicles._id': id,
    };

    user = await User.findOneAndUpdate(filter, updateValues, options);

    res.json(commonModel.success(sanitize.CustomerVehicle(user, true)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const remove = async (req, res) => {
  const { id, customer_id } = req.body;
  try {
    let user = await User.findOne({ _id: customer_id });

    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    } else if (!customer_id) {
      throw new Error(languageHelper.userIdRequired);
    } else if (user.created_by?.toString() !== req.jwt_id) {
      return res.json(commonModel.failure(languageHelper.youDontHaveUpdatePermission));
    }

    user = await User.findOneAndUpdate(
      { _id: customer_id },
      { $pull: { vehicles: { _id: id } } },
      { new: true }
    );

    if (!user) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(''));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const service = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    }

    const payload = {
      _id: commonModel.toObjectId(id),
      user_type: type.USER_TYPE.CUSTOMER,
      deleted_at: null,
    };

    let vehicles = await User.findOne(payload).select('-_id vehicles ');

    vehicles = vehicles.vehicles.map((vehicle) => sanitize.service(vehicle));

    res.json(commonModel.success(vehicles));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const changeStatus = async (req, res) => {
  const { id, customer_id, status } = req.body;
  try {
    const user = await User.findOne({ _id: customer_id });

    if (!customer_id) {
      throw new Error(languageHelper.userIdRequired);
    } else if (!status) {
      throw new Error(languageHelper.statusRequired);
    } else if (!id) {
      throw new Error(languageHelper.vehicleIdRequired);
    } else if (user.created_by?.toString() !== req.jwt_id) {
      throw new Error(languageHelper.youDontHaveUpdatePermission);
    }

    const values = {};

    if (status) {
      values['vehicles.$.status'] = status;
    }

    const updateValues = { $set: values };

    const filter = {
      _id: customer_id,
      'vehicles._id': id,
      deleted_at: null,
    };

    const options = {
      new: true,
      runValidators: true.valueOf,
    };

    const vehicle = await User.findOneAndUpdate(filter, updateValues, options);

    if (!vehicle) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(vehicle));
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
  changeStatus,
};
