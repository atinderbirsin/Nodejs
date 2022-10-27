import jwt from 'jsonwebtoken';
import { languageHelper, helperFn } from '../../helper/index.js';
import commonHelper from '../../models/common.js';
import User from '../../models/user.js';
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
      return res.json(commonHelper.failure(languageHelper.unauthorizedAccess));
    }

    req.jwt_id = decoded.id;
    req.jwt_user_type = type.USER_TYPE.ADMIN;

    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.json(commonHelper.failure(err.name));
    } else {
      res.json(commonHelper.failure(helperFn.getError(err.message)));
    }
  }
};
