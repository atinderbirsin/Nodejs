import jwt from 'jsonwebtoken';
import languageHelper from '../../helper/language.js';
import commmonHelper from '../../models/commmon.js';

import User from '../../models/user.js';
import fn from '../../util/fn.js';
import type from '../../util/type.js';

export default async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    if (!token) {
      throw new Error(languageHelper.unauthorizedAccess);
    }

    const tokenKey = process.env.JWT_KEY;
    const decoded = jwt.verify(token, tokenKey);

    const payload = {
      _id: decoded.id,
      user_type: type.USER_TYPE.ADMIN,
    };

    const result = await User.findOne(payload);

    if (!result) {
      return res.json(commmonHelper.failure(languageHelper.unauthorizedAccess));
    }

    req.jwt_id = decoded.id;
    req.jwt_user_type = type.USER_TYPE.ADMIN;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.json(commmonHelper.failure(err.name));
    } else {
      res.json(commmonHelper.failure(fn.getError(err.message)));
    }
  }
};
