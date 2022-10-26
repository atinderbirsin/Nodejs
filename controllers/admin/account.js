import sanitize from '../../helper/sanitize.js';
import commonModel from '../../models/commmon.js';
import User from '../../models/user.js';
import { fn, type } from '../../util/index.js';

const login = async (req, res) => {
  const { email, password } = req.body;

  let error;

  if (!email) {
    error = 'Email address is required';
  } else if (!password) {
    error = 'Password is required';
  }

  if (error) {
    return res.json(commonModel.failure(error));
  }

  try {
    const filter = {
      email: email,
      user_type: type.USER_TYPE.ADMIN,
    };

    let user = await User.findOne(filter);

    if (!user || !commonModel.compareHash(password, user.password)) {
      return res.json(commonModel.failure('Invalid details!'));
    }

    const token = commonModel.generateToken(user._id, user.userType);

    const update = { token: token };
    const options = { new: true };
    user = await User.findByIdAndUpdate(user._id.toString(), update, options);

    res.json(commonModel.success(sanitize.user(user, false)));
  } catch (err) {
    res.json(commonModel.failure(fn.getError(err.message)));
  }
};

const dashboard = (req, res) => {
  res.status(200).send('dashboard also Working');
};

export default { login, dashboard };
