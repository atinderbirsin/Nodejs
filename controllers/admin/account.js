import { helperFn } from '../../helper/index.js';
import languageHelper from '../../helper/language.js';
import sanitize from '../../helper/sanitize.js';
import commonModel from '../../models/common.js';
import User from '../../models/user.js';
import { type } from '../../util/index.js';

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
      user_type: type.USER_TYPE.ADMIN,
    };

    let user = await User.findOne(filter);

    if (!user || !commonModel.compareHash(password, user.password)) {
      return res.json(commonModel.failure('Invalid details!'));
    }

    const token = commonModel.generateToken(user._id, user.user_type);

    const update = { token: token };
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

export default { login, dashboard };
