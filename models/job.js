import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema;

const service_images = [
  {
    img: { type: String, trim: true, required: false },
  },
];

const logs = [
  {
    service_images,
    notes: { type: String, trim: true, required: true },
    status: { type: Number, default: 1, required: true },
    created_at: { type: Date, default: Date.now },
  },
];

const images = [
  {
    img: { type: String, trim: true, required: false },
  },
];

const jobSchema = new mongoose.Schema({
  sr_no: { type: String, trim: true, default: '', required: false },
  job_datetime: { type: Date, default: Date.now, required: false },
  office_id: { type: ObjectId, default: null, required: [true, 'Office id is required!'] },
  technician_id: { type: ObjectId, default: null, required: [true, 'Tehnician id is required!'] },
  customer_id: { type: ObjectId, default: null, required: [true, 'Customer id is required!'] },
  customer_vehicle_id: {
    type: ObjectId,
    default: null,
    required: [true, 'Customer vehicle id is required!'],
  },
  type: {
    type: Number,
    trim: true,
    default: '',
    enum: {
      values: [1, 2, 3],
      message: 'must be either Installation, Uninstallation or Inspection',
    },
  },

  device_id: { type: ObjectId, default: null, required: [true, 'Device id is required!'] },
  deadline_date: { type: Date, default: null, required: [true, 'Job deadline date is required!'] },
  status: { type: Number, trim: true, default: 1, required: false },
  quantity: { type: Number, trim: true, default: 1, required: false },
  title: { type: String, trim: true, default: '', required: [true, 'Title is required!'] },
  description: { type: String, trim: true, default: '', required: [true, 'Description is required!'] },
  images,

  logs,

  created_at: { type: Date, default: Date.now, required: false, select: false },
  updated_at: { type: Date, default: null, required: false, select: false },
  deleted_at: { type: Date, default: null, required: false, select: false },
});

const Job = mongoose.model('Job', jobSchema);

export default Job;
