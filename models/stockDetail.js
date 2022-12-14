import mongoose, { Schema } from 'mongoose';
import { helperFn } from '../helper/index.js';

const { ObjectId } = Schema;

const logs = [
  {
    log: { type: String, trim: true, default: '', required: false },
  },
];

const stockDetailSchema = new mongoose.Schema({
  stock_datetime: { type: Date, default: Date.now, required: false },
  order_id: { type: ObjectId, default: null, required: false },
  // admin_id: { type: ObjectId, default: null, required: false },
  // office_id: { type: ObjectId, default: null, required: false },
  technician_id: { type: ObjectId, default: null, required: false },
  customer_id: { type: ObjectId, default: null, required: false },
  serial_number: { type: String, unique: true, required: false, sparse: true },
  user_id: { type: ObjectId, default: null, required: false },
  customer_vehicle_id: { type: ObjectId, default: null, required: false },
  device_id: { type: ObjectId, default: null, required: false },
  job_id: { type: ObjectId, default: null, required: false },
  qrCode: { type: String, trim: true, default: '', required: false },
  status: {
    type: Number,
    trim: true,
    default: 0,
    required: [true, 'Device status is required'],
    enum: {
      values: [1, 2, 3, 4, 5],
      message: 'Status should be either Activated, Deactivated, Installed, Uninstalled, De-comissioned',
    },
  },
  notes: { type: String, trim: true, default: '', required: false },
  logs,

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null, select: false },
  deleted_at: { type: Date, default: null, select: false },
});

stockDetailSchema.pre('save', async function () {
  const qrCode = `${Date.now() + Math.floor(helperFn.randomNum(100, 5000))}.png`;
  helperFn.generateQR(this._id.toString(), qrCode, 'stockDetail');
  this.set({ qrCode });
});

// stockDetailSchema.index(
//   {
//     name: 'text',
//     email: 'text',
//     reference_code: 'text',
//     code: 'text',
//     dial_code: 'text',
//     mobile_number: 'text',
//   },
//   { name: 'text' }
// );

const StockDetail = mongoose.model('StockDetail', stockDetailSchema);

export default StockDetail;
