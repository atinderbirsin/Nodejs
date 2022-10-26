import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema;

const orderDetails = [
  {
    device_id: { type: ObjectId, default: null, required: true },
    quantity: { type: Number, default: 1, trim: true },
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
    prev_instruction: {
      type: String,
      trim: true,
      default: '',
      required: false,
    },
    new_instruction: { type: String, trim: true, default: '', required: false },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null },
    deleted_at: { type: Date, default: null },
  },
];

const orderSchema = new mongoose.Schema({
  order_datetime: { type: Date, default: null, required: false },
  order_number: { type: String, trim: true, default: '', required: true },
  office_id: { type: ObjectId, default: null, required: true },
  order_status: { type: Number, default: 1, trim: true, required: true },
  shipping_status: { type: Number, default: 1, trim: true, required: true },
  shipping_instruction: { type: String, trim: true, default: '' },
  notes: { type: String, trim: true, default: '', required: false },
  qrCode: { type: String, default: '', required: false },
  orderDetails,
  orderStatusLog,
  shippingStatusLog,

  created_at: { type: Date, default: Date.now },
  created_by: { type: ObjectId, default: null, required: true },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
