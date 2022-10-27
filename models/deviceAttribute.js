import mongoose from 'mongoose';

const nameAlreadyExist = async function (name) {
  // eslint-disable-next-line no-use-before-define
  const user = await DeviceAttribute.findOne({ name });
  if (user) {
    if (this.id === user.id) {
      return true;
    }
    return false;
  }
  return true;
};

const deviceAttributeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    default: '',
    required: [true, 'Device attribute must have a name'],
    validate: [
      {
        validator: nameAlreadyExist,
        message: 'Name is already taken!',
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
      message: 'Status should be either active or inactive',
    },
  },
  image: { type: String, trim: true, default: '', required: false },

  created_at: { type: Date, default: Date, required: false, select: false },
  updated_at: { type: Date, default: null, required: false, select: false },
  deleted_at: { type: Date, default: null, required: false, select: false },
});

deviceAttributeSchema.pre('findOneAndUpdate', async function (next) {
  // eslint-disable-next-line no-use-before-define
  const user = await DeviceAttribute.findOne(this.getQuery());
  this.id = user._id.toString();
  next();
});

deviceAttributeSchema.index(
  {
    name: 'text',
  },
  { name: 'text' }
);

const DeviceAttribute = mongoose.model('DeviceAttribute', deviceAttributeSchema);

DeviceAttribute.createIndexes();

export default DeviceAttribute;
