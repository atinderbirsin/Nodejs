import { helperFn, languageHelper, sanitize } from '../../helper/index.js';
import commonModel from '../../models/common.js';
import User from '../../models/user.js';
import { constant, type } from '../../util/index.js';
import bcryptjs from 'bcryptjs';

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      throw new Error(languageHelper.emailAddressRequired);
    } else if (!helperFn.isEmailValid(email)) {
      throw new Error(languageHelper.invalidEmailAddress);
    } else if (!password) {
      throw new Error(languageHelper.passwordRequired);
    }

    const filter = {
      email: email,
      user_type: type.USER_TYPE.OFFICE,
    };

    let user = await User.findOne(filter);

    if (!user || !commonModel.compareHash(password, user.password)) {
      return res.json(commonModel.failure('Invalid details!'));
    }

    const token = commonModel.generateToken(user._id, user.user_type);

    const update = { access_token: token };
    const options = { new: true };
    user = await User.findByIdAndUpdate(user._id.toString(), update, options);

    res.json(commonModel.success(sanitize.admin(user, false)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const dashboard = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $match: {
          user_type: {
            $gte: type.USER_TYPE.OFFICE,
            $lte: type.USER_TYPE.CUSTOMER,
          },
          deleted_at: {
            $eq: null,
          },
        },
      },
      {
        $group: {
          _id: '$user_type',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $addFields: { user_type: '$_id' },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    res.json(commonModel.success(stats));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

const update = async (req, res) => {
  const { password } = req.body;
  try {
    const filter = {
      _id: req.jwt_id,
      deleted_at: null,
      user_type: type.USER_TYPE.OFFICE,
    };

    let user = await User.findOne(filter);

    if (req.fileValidationError) {
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

const get = async (req, res) => {
  try {
    const user = await User.findById(req.jwt_id);

    if (!user) {
      res.json(commonModel.failure(languageHelper.InvalidToken));
    }

    res.json(commonModel.success(sanitize.User(user, true)));
  } catch (err) {
    res.json(commonModel.failure(helperFn.getError(err.message)));
  }
};

export default { login, dashboard, update, get };
