import jwt from 'jsonwebtoken';
import commmonHelper from '../../models/commmon.js';

import User from '../../models/user.js';
import type from '../../util/type.js';

export default async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const tokenKey = process.env.JWT_KEY;
    const decoded = jwt.verify(token, tokenKey);

    const payload = {
      _id: decoded.id,
      user_type: type.USER_TYPE.ADMIN,
    };

    const result = await User.findOne(payload);

    if (!result) {
      res.json(commmonHelper.failure('Unauthorized Access'));
    }

    req.jwt_id = decoded.id;
    req.jwt_user_type = type.USER_TYPE.ADMIN;

    next();
  } catch (err) {
    // let reply = helper.fn.reply(0, data, 'Unauthorized Access');
    // res.send(reply);
    // return;
  }
};
