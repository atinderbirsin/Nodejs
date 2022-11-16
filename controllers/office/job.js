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
    const availableDeviceId = availableDevicesQuantity[0]._id;

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
      device_id: availableDevicesQuantity[0]._id,
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

    console.log(req.files, req.file, images);

    const job = await Job.create(payload);

    const stockPayload = {
      technician_id,
      customer_id,
      customer_vehicle_id,
      job_id: job._id,
    };

    await StockDetail.findByIdAndUpdate(availableDeviceId, stockPayload, { new: true, runValidators: true });

    res.json(commonModel.success(sanitize.Job(job)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const list = async (req, res) => {
  try {
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { created_at: order };
    const search = req.body.search ? { $text: { $search: req.body.search } } : {};

    let jobs = await Job.aggregate([
      {
        $match: search,
      },
      {
        $match: {
          office_id: { $eq: commonModel.toObjectId(req.jwt_id) },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'technician_id',
          foreignField: '_id',
          as: 'technician',
        },
      },
      { $unwind: '$technician' },
      {
        $lookup: {
          from: 'users',
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        // find a vehicle, that matches
        // to a customer
        $addFields: {
          vehicle: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$customer.vehicles',
                  cond: {
                    $eq: ['$$this._id', '$customer_vehicle_id'],
                  },
                },
              },
              0,
            ],
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

    jobs = jobs.map((job) => sanitize.Job(job));

    const total = jobs.length;
    res.json(commonModel.listSuccess(jobs, total, limit));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.jobIdRequired);
    }

    let job = await Job.aggregate([
      {
        $match: {
          _id: { $eq: commonModel.toObjectId(id) },
          office_id: { $eq: commonModel.toObjectId(req.jwt_id) },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'technician_id',
          foreignField: '_id',
          as: 'technician',
        },
      },
      { $unwind: '$technician' },
      {
        $lookup: {
          from: 'users',
          localField: 'customer_id',
          foreignField: '_id',
          as: 'customer',
        },
      },
      { $unwind: '$customer' },
      {
        // find a vehicle, that matches
        // to a customer
        $addFields: {
          vehicle: {
            $arrayElemAt: [
              {
                $filter: {
                  input: '$customer.vehicles',
                  cond: {
                    $eq: ['$$this._id', '$customer_vehicle_id'],
                  },
                },
              },
              0,
            ],
          },
        },
      },
    ]);

    if (job.length > 0) {
      job = job[0];
    } else {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(sanitize.Job(job)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const { id, status } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.jobIdRequired);
    } else if (!status) {
      throw new Error(languageHelper.statusRequired);
    } else if (status !== types.JOB_STATUS_TYPE.CANCELED) {
      throw new Error(languageHelper.invalidCredentials);
    }

    const updateVal = {
      status,
    };

    const job = await Job.findByIdAndUpdate(id, updateVal, {
      new: true,
      runValidators: true,
    });

    res.json(commonModel.success(sanitize.Job(job)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  create,
  list,
  get,
  update,
};
