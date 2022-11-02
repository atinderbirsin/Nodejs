import mongoose, { Schema } from 'mongoose';
import Device from './device.js';

const { ObjectId } = Schema;

const deviceExist = async function (device_id) {
  const device = await Device.findOne({ _id: device_id });
  if (device) {
    return true;
  }
  return false;
};

const cartSchema = new mongoose.Schema({
  office_id: {
    type: ObjectId,
    default: null,
    required: [true, 'Office id is required!'],
  },
  device_id: {
    type: ObjectId,
    default: null,
    required: [true, 'Device id is required!'],
    immutable: false,
    validate: [
      {
        validator: deviceExist,
        message: 'Invalid device details!',
      },
    ],
  },
  quantity: {
    type: Number,
    trim: true,
    default: 1,
    required: true,
  },

  created_by: { type: ObjectId, default: null, required: true, select: false },
  created_at: { type: Date, default: Date, required: false, select: false },
  updated_at: { type: Date, default: null, required: false, select: false },
  deleted_at: { type: Date, default: null, required: false, select: false },
});

cartSchema.pre('findOneAndUpdate', async function (next) {
  // eslint-disable-next-line no-use-before-define
  const cartItem = await Cart.findOne(this.getQuery());
  this.id = cartItem?._id.toString();
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
