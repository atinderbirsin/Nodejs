import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import commonModel from '../../models/common.js';
import Device from '../../models/device.js';
// import { type } from '../../util/index.js';

const list = async (req, res) => {
  try {
    req.body.deleted_at = null;
    let { page, limit, sort, order } = req.body;
    limit = +limit || 10;
    page = +page || 1;
    order = +order || -1;
    sort = sort ? { [sort]: order } : { created_at: order };
    const search = req.body.search ? { $text: { $search: req.body.search } } : {};
    /* // EXECUTE QUERY
    // eslint-disable-next-line new-cap
    const features = new apiFeatures(Device.find(), req.body)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const device = await features.query; */

    let devices = await Device.aggregate([
      { $match: search },
      {
        $match: {
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

    devices = devices.map((device) => sanitize.Device(device));
    const total = await Device.count(req.body);

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
