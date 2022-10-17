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
      message: err.message,
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

const get = (req, res) => {
  res.status(200).send('dashboard also Working');
};

const update = (req, res) => {
  res.status(200).send('dashboard also Working');
};

const remove = (req, res) => {
  res.status(200).send('dashboard also Working');
};

export default {
  create,
  list,
  get,
  update,
  remove,
};
