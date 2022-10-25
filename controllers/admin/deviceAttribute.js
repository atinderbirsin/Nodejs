import DeviceAttribute from '../../models/deviceAttribute.js';
import apiFeatures from '../../util/apiFeatures.js';

const create = async (req, res) => {
  try {
    const deviceAttribute = await DeviceAttribute.create(req.body);

    res.status(200).json({
      status: 'success',
      data: {
        deviceAttribute,
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
    const features = new apiFeatures(DeviceAttribute.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const deviceAttributes = await features.query;

    res.status(200).json({
      status: 'success',
      result: deviceAttributes.length,
      data: {
        device_attribute: deviceAttributes,
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
    const deviceAttribute = await DeviceAttribute.findById(req.body.id);

    res.status(200).json({
      status: 'success',
      data: {
        deviceAttribute,
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
    const deviceAttribute = await DeviceAttribute.findByIdAndUpdate(
      req.body.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        deviceAttribute,
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
    await DeviceAttribute.findByIdAndUpdate(req.body.id, {
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
