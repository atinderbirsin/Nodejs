import path from 'path';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import commonModel from '../../models/common.js';
import Device from '../../models/device.js';
import Job from '../../models/job.js';
import StockDetail from '../../models/stockDetail.js';
import User from '../../models/user.js';
import { type as types } from '../../util/index.js';

const __dirname = path.resolve();
const publicDirectoryPath = path.join(__dirname, './public');

const create = async (req, res) => {
  const {
    technician_id,
    customer_id,
    customer_vehicle_id,
    device_id,
    deadline_date,
    type,
    title,
    description,
  } = req.body;
  try {
    if (!technician_id) {
      throw new Error(languageHelper.technicianIdRequired);
    } else if (!customer_id) {
      throw new Error(languageHelper.customerIdRequired);
    } else if (!customer_vehicle_id) {
      throw new Error(languageHelper.vehicleIdRequired);
    } else if (!device_id) {
      throw new Error(languageHelper.deviceIdRequired);
    } else if (!deadline_date) {
      throw new Error(languageHelper.daedlineDateIsRequired);
    } else if (!type) {
      throw new Error(languageHelper.jobTypeIsRequired);
    } else if (!title) {
      throw new Error(languageHelper.jobTitleIsRequired);
    } else if (!description) {
      throw new Error(languageHelper.jobDescriptionIsRequired);
    }

    const office = await User.findOne({ _id: req.jwt_id, user_type: types.USER_TYPE.OFFICE });
    const technician = await User.findOne({ _id: technician_id, user_type: types.USER_TYPE.TECHNICIAN });
    const customer = await User.findOne({ _id: customer_id, user_type: types.USER_TYPE.CUSTOMER });
    let customerVehicle = await User.find(
      { 'vehicles._id': customer_vehicle_id },
      { _id: 0, vehicles: { $elemMatch: { _id: customer_vehicle_id } } }
    );
    const device = await Device.findById(device_id);
    customerVehicle = customerVehicle[0].vehicles[0];

    const availableDevicesQuantityPayload = {
      device_id,
      user_id: req.jwt_id,
      technician_id: null,
      customer_id: null,
      customer_vehicle_id: null,
      status: types.DEVICE_STATUS_TYPE.DEACTIVATED,
      serial_number: { $ne: null },
    };

    const availableDevicesQuantity = await StockDetail.find(availableDevicesQuantityPayload);

    if (!technician || !customer || !customerVehicle || !device) {
      throw new Error(languageHelper.invalidCredentials);
    } else if (type !== types.JOB_TYPE.UNINSTALLATION && availableDevicesQuantity.length === 0) {
      throw new Error(languageHelper.dontHaveEnoughQuantityToAssignJob);
    }

    if (technician.status !== types.STATUS_TYPE.ACTIVE) {
      throw new Error(languageHelper.cannotAssignJobTechnicianIsInactive);
    } else if (customer.status !== types.STATUS_TYPE.ACTIVE) {
      throw new Error(languageHelper.cannotAssignJobCustomerIsInactive);
    } else if (customerVehicle.status !== types.STATUS_TYPE.ACTIVE) {
      throw new Error(languageHelper.cannotAssignJobCustomerVehicleIsInactive);
    } else if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    }

    const serial_number = helperFn.serialNumber();
    const notes = `job created by ${office.name} for technician ${technician.name}`;
    const images = [];

    req.files.forEach((img) => images.push({ img: img.filename }));

    const payload = {
      office_id: req.jwt_id,
      sr_no: serial_number,
      technician_id: technician_id,
      device_id: device_id,
      customer_id: customer_id,
      customer_vehicle_id: customer_vehicle_id,
      deadline_date: new Date(deadline_date),
      type: type,
      status: types.JOB_STATUS_TYPE.ASSIGNED,
      title: title,
      description: description,
      images,
      logs: {
        notes,
        status: types.JOB_STATUS_TYPE.ASSIGNED,
      },
    };

    const job = await Job.create(payload);

    res.json(commonModel.success(sanitize.Job(job)));
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

    let users = await User.aggregate([
      {
        $match: search,
      },
      {
        $match: {
          user_type: {
            $eq: type.USER_TYPE.CUSTOMER,
          },
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

    user.jwt_id = req.jwt_id;

    res.json(commonModel.success(sanitize.User(user, true)));
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
      user_type: type.USER_TYPE.CUSTOMER,
    };

    let user = await User.findOne(filter);

    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    } else if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    } else if (!user) {
      throw new Error(languageHelper.invalidCredentials);
    } else if (user.created_by?.toString() !== req.jwt_id) {
      throw new Error(languageHelper.youDontHaveUpdatePermission);
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

const remove = async (req, res) => {
  const { id } = req.body;
  try {
    let user = await User.findById(id);

    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    } else if (!user) {
      throw new Error(languageHelper.invalidCredentials);
    } else if (user.created_by !== req.jwt_id) {
      throw new Error(languageHelper.youDontHaveUpdatePermission);
    }

    user = await User.findByIdAndUpdate(id, { deleted_at: Date.now() });

    res.json(commonModel.success(''));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const service = async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $match: {
          user_type: { $eq: type.USER_TYPE.CUSTOMER },
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

    res.json(commonModel.success(users));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const changeStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    let user = await User.findById(id);

    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    } else if (!status) {
      throw new Error(languageHelper.statusRequired);
    } else if (user.created_by?.toString() !== req.jwt_id) {
      throw new Error(languageHelper.youDontHaveUpdatePermission);
    }

    user = await User.findByIdAndUpdate(id, { status }, { new: true });

    if (!user) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(sanitize.User(user, true)));
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
