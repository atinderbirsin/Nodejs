import Device from '../../models/device.js';
import apiFeatures from '../../util/apiFeatures.js';

const create = async (req, res) => {
  try {
    const device = await Device.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        device,
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
    // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    const features = new apiFeatures(Device.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const device = await features.query;

    res.status(200).json({
      status: 'success',
      result: device.length,
      data: {
        device: device,
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
    const device = await Device.findById(req.body.id);

    res.status(200).json({
      status: 'success',
      data: {
        device,
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
    const device = await Device.findByIdAndUpdate(req.body.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        device,
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
    await Device.findByIdAndUpdate(req.body.id, {
      deleted_at: Date.now(),
    });

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
