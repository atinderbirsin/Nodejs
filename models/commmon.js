import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default {
  failure: (msg = '') => ({
    status: 0,
    message: msg,
    data: {},
  }),
  success: (content, msg = 'Success') => ({
    status: 1,
    message: msg,
    data: content,
  }),
  listSuccess: (content, total, per_page, msg = 'Success') => ({
    status: 1,
    message: msg,
    result: content,
    total: total,
    per_page: per_page,
  }),
  toObjectId: (id) => mongoose.Types.ObjectId(id),
  generateToken: (userId, userType, expiry = process.env.AUTH_JWT_EXPIRY) => {
    const jwtPayload = { userId: userId, userType: userType };
    const jwtOptions = { expiresIn: expiry };
    return jwt.sign(jwtPayload, process.env.JWT_KEY, jwtOptions);
  },
  /* decodeToken: (token) => jwt.verify(token, process.env.JWT_KEY),
  generateHash: (value) => {
    const salt = bcrypt.genSaltSync(Number(process.env.PASSWORD_HASH_LENGTH));
    return bcrypt.hashSync(value, salt);
  }, */
  compareHash: (value, hash) => bcrypt.compareSync(value, hash),
};
