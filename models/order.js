import mongoose, { Schema } from 'mongoose';
import { helperFn } from '../helper/index.js';

const { ObjectId } = Schema;

const orderDetails = [
  {
    device_name: {
      type: String,
      trim: true,
      default: '',
      required: true,
    },
    device_id: { type: ObjectId, default: null, required: true },
    sku_number: { type: String, trim: true, default: '', required: true },
    quantity: { type: Number, default: 1, trim: true, required: true },
  },
];

const orderStatusLog = [
  {
    order_status: { type: Number, default: 1, trim: true, required: true },
    log_datetime: { type: Date, default: Date.now },
    notes: { type: String, trim: true, default: '', required: false },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null },
    deleted_at: { type: Date, default: null },
  },
];

const shippingStatusLog = [
  {
    shipping_status: { type: Number, default: 1, trim: true, required: true },
    shipping_instruction: {
      type: String,
      trim: true,
      default: '',
      required: false,
    },
    log_datetime: { type: Date, default: Date.now },
    notes: { type: String, trim: true, default: '', required: false },

    created_at: { type: Date, default: Date },
    updated_at: { type: Date, default: null },
    deleted_at: { type: Date, default: null },
  },
];

const orderSchema = new mongoose.Schema({
  order_datetime: { type: Date, default: Date.now(), required: false },
  order_number: { type: String, trim: true, default: '', required: true, unique: true },
  office_id: { type: ObjectId, default: null, required: true },
  order_status: { type: Number, default: 1, trim: true, required: true },
  shipping_status: { type: Number, default: 1, trim: true, required: true },
  shipping_instruction: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '', required: false },
  qrCode: { type: String, default: '', required: false },
  order_details: orderDetails,
  order_status_log: orderStatusLog,
  shipping_status_log: shippingStatusLog,

  created_at: { type: Date, default: Date, select: false },
  created_by: { type: ObjectId, default: null, required: true, select: false },
  updated_at: { type: Date, default: null, select: false },
  deleted_at: { type: Date, default: null, select: false },
});

// eslint-disable-next-line prefer-arrow-callback
orderSchema.pre('save', async function () {
  const qrCode = `${Date.now() + Math.floor(helperFn.randomNum(100, 5000))}.png`;
  helperFn.generateQR(this._id.toString(), qrCode);
  this.set({ qrCode });
});

orderSchema.index(
  {
    shipping_status: 'text',
    order_datetime: 'text',
    order_number: 'text',
  },
  { name: 'text' }
);

const Order = mongoose.model('Order', orderSchema);

export default Order;
