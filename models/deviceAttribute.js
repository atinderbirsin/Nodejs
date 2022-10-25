import mongoose from 'mongoose';

const deviceAttributeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: '',
    required: [true, 'Device attribute must have a name'],
  },
  status: {
    type: Number,
    trim: true,
    default: 0,
    required: true,
    validate: {
      validator: function (val) {
        return val === 1 || val === 0;
      },
      message: 'Status should be either active or inactive',
    },
  },
  image: { type: String, trim: true, default: '', required: false },

  created_at: { type: Date, default: Date, required: false, select: false },
  updated_at: { type: Date, default: null, required: false, select: false },
  deleted_at: { type: Date, default: null, required: false, select: false },
});

const DeviceAttribute = mongoose.model(
  'DeviceAttribute',
  deviceAttributeSchema
);

export default DeviceAttribute;
