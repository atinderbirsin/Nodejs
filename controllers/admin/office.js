import bcryptjs from 'bcryptjs';
import path from 'path';
import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import commonModel from '../../models/common.js';
import User from '../../models/user.js';
import { constant, type } from '../../util/index.js';

const __dirname = path.resolve();
const publicDirectoryPath = path.join(__dirname, './public');

const create = async (req, res) => {
  const { password } = req.body;
  try {
    if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    } else if (!password || password.trim().length <= 0) {
      throw new Error(languageHelper.passwordRequired);
    }

    req.body.password = await bcryptjs.hash(req.body.password, constant.hashLength);
    req.body.user_type = type.USER_TYPE.OFFICE;
    req.body.image = req.file ? req.file.filename : '';
    req.body.code = helperFn.serialNumber();
    req.body.reference_code = type.ADMIN_CODE;
    req.body.created_by = req.jwt_id;

    const user = await User.create(req.body);

    res.json(commonModel.success(sanitize.User(user, true)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const list = async (req, res) => {
  try {
    req.body.user_type = type.USER_TYPE.OFFICE;
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
          user_type: {
            $eq: type.USER_TYPE.OFFICE,
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

    users = users.map((user) => sanitize.User(user, true));
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
      user_type: type.USER_TYPE.OFFICE,
    };

    const user = await User.findOne(filter);

    if (!user) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(sanitize.User(user, true)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const { id, password } = req.body;
  try {
    const filter = {
      _id: id,
      deleted_at: null,
      user_type: type.USER_TYPE.OFFICE,
    };

    let user = await User.findOne(filter);

    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    } else if (req.fileValidationError) {
      throw new Error(languageHelper.imageValidationError);
    } else if (!user) {
      throw new Error(languageHelper.invalidCredentials);
    }

    if (password) {
      req.body.password = await bcryptjs.hash(password, constant.hashLength);
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
    if (!id) {
      throw new Error(languageHelper.userIdRequired);
    }

    const user = await User.findByIdAndUpdate(id, { deleted_at: Date.now() });

    if (!user) {
      throw new Error(languageHelper.invalidCredentials);
    }

    res.json(commonModel.success(''));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
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
