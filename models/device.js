import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema;

const skuNumberAlreadyExist = async function (sku_number) {
  // eslint-disable-next-line no-use-before-define
  const device = await Device.findOne({ sku_number });
  if (device) {
    if (this.id === device.id) {
      return true;
    }
    return false;
  }
  return true;
};

const attributes = [
  {
    attribute_id: {
      type: ObjectId,
      default: null,
      required: true,
    },
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
    required: true,
    validate: [
      {
        validator: skuNumberAlreadyExist,
        message: 'SKU number already already taken!',
      },
    ],
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

deviceSchema.pre('findOneAndUpdate', async function (next) {
  // eslint-disable-next-line no-use-before-define
  const device = await Device.findOne(this.getQuery());
  this.id = device?._id.toString();
  next();
});

deviceSchema.index(
  {
    name: 'text',
  },
  { name: 'text' }
);

const Device = mongoose.model('Device', deviceSchema);

export default Device;
