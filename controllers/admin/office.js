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
    // Step 1(A) Creating a query
    const queryObj = req.body;
    queryObj.user_type = 2;
    const excludedFields = ['limit', 'sort', 'page', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Step 1(B) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(lte|lt|gte|gt)\b/g, (match) => `$${match}`);

    const query = User.find(JSON.parse(queryStr));
    // const users = await User.find({ user_type: '2' });

    // Step 2 Sorting
    if (req.body.query) {
      const sortBy = req.body.query.split(',').join(' ');
      query.sort(sortBy);
    } else {
      query.sort('-created_at');
    }

    // Step 3 selecting fields
    if (req.body.fields) {
      const fields = req.body.fields.split(',').join(' ');
      query.select(fields);
    } else {
      query.select('-__v');
    }

    // EXECUTE QUERY
    const users = await query;

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
