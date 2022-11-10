import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema;

const returnOrderDetails = {
  device_name: {
    type: String,
    trim: true,
    default: '',
    required: true,
  },
  device_id: { type: ObjectId, default: null, required: true },
  sku_number: { type: String, trim: true, default: '', required: true },
  quantity: { type: Number, default: 1, trim: true, required: true },
};

const returnOrderStatusLog = [
  {
    order_status: { type: Number, default: 1, trim: true, required: true },
    log_datetime: { type: Date, default: Date.now },
    notes: { type: String, trim: true, default: '', required: false },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: null },
    deleted_at: { type: Date, default: null },
  },
];

const returnorderSchema = new mongoose.Schema({
  order_datetime: { type: Date, default: Date.now(), required: false },
  order_number: { type: String, trim: true, default: '', required: true, unique: true },
  office_id: { type: ObjectId, default: null, required: true },
  order_status: { type: Number, default: 1, trim: true, required: true },
  return_order_details: returnOrderDetails,
  return_order_status_log: returnOrderStatusLog,

  created_at: { type: Date, default: Date, select: false },
  created_by: { type: ObjectId, default: null, required: true, select: false },
  updated_at: { type: Date, default: null, select: false },
  deleted_at: { type: Date, default: null, select: false },
});

returnorderSchema.index(
  {
    shipping_status: 'text',
    order_datetime: 'text',
    order_number: 'text',
  },
  { name: 'text' }
);

const returnOrder = mongoose.model('returnOrder', returnorderSchema);

export default returnOrder;
