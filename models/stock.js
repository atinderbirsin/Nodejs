import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema;

const stockSchema = new mongoose.Schema({
  stock_datetime: { type: Date, default: Date.now, required: false },
  user_id: { type: ObjectId, default: null, required: [true, 'User id is required!'] },
  user_type: {
    type: Number,
    trim: true,
    default: '',
    enum: {
      values: [1, 2, 3, 4, 5],
      message: 'must be either office, technician or customer',
    },
  },

  device_id: { type: ObjectId, default: null, required: [true, 'Device id is required!'] },
  stock_in: { type: Number, trim: true, default: 0, required: false },
  stock_out: { type: Number, trim: true, default: 0, required: false },
  stock_return: { type: Number, trim: true, default: 0, required: false },
  stock_type: {
    type: String,
    trim: true,
    default: '',
    required: true,
    enum: {
      values: ['in', 'out', 'return'],
      message: 'must be either in, out or return',
    },
  },
  job_type: {
    type: Number,
    trim: true,
    required: false,
    default: null,
    validate: {
      validator: function (val) {
        return val === 1 || val === 2 || val === 3 || val === null;
      },
      message: 'Type should be either Insatllation, Uninstallation or Inspection',
    },
  },
  job_status: {
    type: Number,
    trim: true,
    required: false,
    default: 1,
    enum: {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, null],
      message: 'Invalid job status',
    },
  },

  remarks: { type: String, trim: true, default: '', required: true },

  ref_id: { type: ObjectId, default: null, required: [true, 'Reference id is required!'] },
  ref_type: { type: String, trim: true, default: '' },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },

  order_id: { type: ObjectId, default: null, required: false },
  job_id: { type: ObjectId, default: null, required: false },
});

const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
