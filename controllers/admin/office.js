import User from '../../models/user.js';

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
    const users = await User.find({ user_type: '2' });

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

export default {
  create,
  list,
  get,
  update,
  remove,
};
