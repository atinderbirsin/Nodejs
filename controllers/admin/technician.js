import User from '../../models/user.js';
import apiFeatures from '../../util/apiFeatures.js';

const create = async (req, res) => {
  try {
    const user = await User.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

const list = async (req, res) => {
  try {
    req.body.user_type = 3;

    // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    const features = new apiFeatures(User.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const users = await features.query;

    res.status(200).json({
      status: 'success',
      result: users.length,
      data: {
        users,
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
    const user = await User.findById(req.body.id);

    res.status(200).json({
      status: 'success',
      data: {
        user,
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
    const user = await User.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, { deleted_at: Date.now() });

    res.status(200).json({
      status: 'success',
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
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
