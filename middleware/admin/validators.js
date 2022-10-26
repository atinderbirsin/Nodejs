import User from '../../models/user.js';
import commmonModel from '../../models/commmon.js';

const alreadyExists = async (req, res, next) => {
  try {
    // email check code start
    let user = await User.find({
      email: req.body.email,
    });

    if (user) {
      return res.json(commmonModel.failure('Email is already taken'));
    }
    // email check code end

    // mobile number check code start
    user = await User.fetch({
      dial_code: req.body.dial_code,
      mobile_number: req.body.mobile_number,
    });

    if (user) {
      return res.json(commmonModel.failure('Mobile number is already taken'));
    }
    // mobile number check code end

    next();
  } catch (err) {
    res.json(
      commmonModel.failure(
        err.message.substring(err.message.indexOf(':') + 2, err.message.length)
      )
    );
  }
};

export default {
  alreadyExists,
};
