import commonModel from '../../models/common.js';
import { helperFn } from '../../helper/index.js';
import Setting from '../../models/setting.js';

const create = async (req, res) => {
  try {
    let setting = await Setting.findOne();

    if (!setting) {
      setting = await Setting.create(req.body);
    }

    setting = await Setting.findOneAndUpdate({}, req.body);

    res.json(commonModel.success());
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const get = async (req, res) => {
  try {
    const setting = await Setting.findOne();

    res.json(commonModel.success(setting));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default {
  create,
  get,
};
