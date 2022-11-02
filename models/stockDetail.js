import mongoose, { Schema } from 'mongoose';

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
  // technician_id: { type: ObjectId, default: null, required: false },
  serial_number: { type: Number, default: null, required: false },
  user_id: { type: ObjectId, default: null, required: false },
  customer_vehicle_id: { type: ObjectId, default: null, required: false },
  device_id: { type: ObjectId, default: null, required: false },
  job_id: { type: ObjectId, default: null, required: false },
  status: {
    type: Number,
    trim: true,
    default: 0,
    required: [true, 'Device status is required'],
    enum: {
      values: [0, 1, 2, 3],
      message: 'Status should be either Activated, Deactivated, Installed, Uninstalled',
    },
  },
  notes: { type: String, trim: true, default: '', required: false },
  logs,

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null, select: false },
  deleted_at: { type: Date, default: null, select: false },
});

const StockDetail = mongoose.model('StockDetail', stockDetailSchema);

export default StockDetail;
