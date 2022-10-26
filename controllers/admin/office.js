import bcryptjs from 'bcryptjs';
import sanitize from '../../helper/sanitize.js';
import commmonModel from '../../models/commmon.js';
import User from '../../models/user.js';
import { apiFeatures, constant, fn, type } from '../../util/index.js';

const create = async (req, res) => {
  const emailExist = await User.findOne({
    email: req.body.email,
  });

  const mobileNumberExist = await User.findOne({
    dial_code: req.body.dial_code,
    mobile_number: req.body.mobile_number,
  });

  try {
    let error;

    if (emailExist) {
      error = 'Email is already taken';
    } else if (mobileNumberExist) {
      error = 'Mobile number is already taken';
    } else if (req.fileValidationError) {
      error = 'Image must be of valid format';
    }

    if (error) {
      return res.json(commmonModel.failure(error));
    }

    req.body.password = await bcryptjs.hash(
      req.body.password,
      constant.hashLength
    );
    req.body.user_type = type.USER_TYPE.OFFICE;
    req.body.image = req.file ? req.file.filename : '';
    req.body.code = fn.serialNumber();
    req.body.reference_code = type.ADMIN_CODE;
    req.body.created_by = req.jwt_id;

    const user = await User.create(req.body);

    res.json(commmonModel.success(sanitize.User(user, true)));
  } catch (err) {
    res.json(commmonModel.failure(fn.getError(err.message)));
  }
};

const list = async (req, res) => {
  try {
    req.body.user_type = type.USER_TYPE.OFFICE;

    // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    const features = new apiFeatures(User.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    let users = await features.query;
    users = users.map((user) => sanitize.User(user, true));
    const total = await User.countDocuments(req.body);
    const limit = +req.body.limit;

    res.json(commmonModel.listSuccess(users, total, limit));
  } catch (err) {
    res.json(commmonModel.failure(fn.getError(err.message)));
  }
};

const get = async (req, res) => {
  try {
    const user = await User.findById(req.body.id);

    res.json(commmonModel.success(sanitize.User(user, true)));
  } catch (err) {
    res.json(commmonModel.failure(fn.getError(err.message)));
  }
};

const update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(commmonModel.success(sanitize.User(user, true)));
  } catch (err) {
    res.json(commmonModel.failure(fn.getError(err.mmessage)));
  }
};

const remove = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, { deleted_at: Date.now() });

    res.json(commmonModel.success(''));
  } catch (err) {
    res.json(commmonModel.failure(fn.getError(err.message)));
  }
};

const userStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $match: { user_type: { $gte: 2 } },
      },
      {
        $group: {
          _id: '$user_type',
          /* name: { $toUpper: '$name' }, */
          numUsers: { $sum: 1 },
          activeUsers: { $sum: '$status' },
          avgActiveUsers: { $avg: '$status' },
          min: { $min: '$status' },
          max: { $max: '$status' },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $match: { _id: { $ne: 5 } },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const monthlyPlan = async (req, res) => {
  try {
    const year = +req.body.year;

    const plans = await User.aggregate([
      {
        $unwind: 'startDates',
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' }, // Search aggregation pipeline operators on google
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      {
        $addFields: { month: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: { numTourStarts: -1 }, // Entry which has maximum tours is first (descending order)
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plans,
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
  create,
  list,
  get,
  update,
  userStats,
  monthlyPlan,
  remove,
};
