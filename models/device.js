import mongoose from 'mongoose';

const attributes = [
  {
    name: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },

    created_at: { type: Date, default: Date.now, select: false },
    updated_at: { type: Date, default: null, select: false },
    deleted_at: { type: Date, default: null, select: false },
  },
];

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: '',
    required: [true, 'Device must have a name'],
  },
  sku_number: {
    type: String,
    trim: true,
    default: '',
    unique: true,
    required: true,
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
      message: `Device status should be active or inactive`,
    },
  },
  image: { type: String, trim: true, default: '', required: false },
  description: { type: String, trim: true, default: '', requried: false },
  attributes: attributes,

  created_at: { type: Date, default: Date, required: false, select: false },
  updated_at: { type: Date, default: null, required: false, select: false },
  deleted_at: { type: Date, default: null, required: false, select: false },
});

const Device = mongoose.model('Device', deviceSchema);

export default Device;
