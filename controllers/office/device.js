import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import commonModel from '../../models/common.js';
import Device from '../../models/device.js';
import StockDetail from '../../models/stockDetail.js';
// import { type } from '../../util/index.js';

const list = async (req, res) => {
  try {
    req.body.deleted_at = null;
    let { page, limit, sort, order, filter } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { created_at: order };
    const search = req.body.search ? { $text: { $search: req.body.search } } : {};
    const officeId = commonModel.toObjectId(req.jwt_id);
    const match =
      filter === 'unassigned'
        ? { user_id: { $eq: officeId }, customer_vehicle_id: { $eq: null } }
        : { user_id: { $eq: officeId } };
    /* // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    const features = new apiFeatures(Device.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const device = await features.query; */

    let devices = await StockDetail.aggregate([
      { $match: search },
      { $match: match },
      {
        $lookup: {
          from: 'devices',
          localField: 'device_id',
          foreignField: '_id',
          as: 'device',
        },
      },
      // {
      //   $lookup: {
      //     from: 'users',
      //     let: { vehicle_id: '$_id' },
      //     pipeline: [{ $match: { $expr: { $in: ['customer_vehicle_id', '$vehicles._id'] } } }],
      //     as: 'vehicle',
      //   },
      // },
      // {
      //   $lookup: {
      //     from: 'users.vehicles',
      //     localField: 'customer_vehicle_id',
      //     foreignField: '_id',
      //     as: 'vehicle',
      //   },
      // },
      { $unwind: '$device' },
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

    devices = devices.map((device) => sanitize.stockDevice(device));
    const total = devices.length;

    res.json(commonModel.listSuccess(devices, total, limit));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) {
      throw new Error(languageHelper.deviceIdRequired);
    }

    const device = await Device.findById(id);

    res.json(commonModel.success(sanitize.Device(device)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  list,
  get,
};
