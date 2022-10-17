import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema;

const access_token = [
  { type: String, trim: true, default: '', required: false },
];

const userSchema = new mongoose.Schema({
  user_type: {
    type: String,
    required: [true, 'user type must be between 1 to 5'],
    trim: true,
    default: '',
    enum: [1, 2, 3, 4, 5],
  },
  name: {
    type: String,
    trim: true,
    default: '',
    required: [true, 'User must have a name'],
  },
  code: { type: String, trim: true, default: '', unique: true, required: true },
  reference_code: {
    type: String,
    trim: true,
    default: '',
    required: true,
  },
  address: { type: String, trim: true, default: '', required: true },
  lat: { type: String, trim: true, default: '', required: true },
  lng: { type: String, trim: true, default: '', required: true },
  description: { type: String, trim: true, default: '' },
  dial_code: { type: String, trim: true, default: '', required: true },
  mobile_number: {
    type: String,
    trim: true,
    default: '',
    unique: true,
    required: true,
  },
  country_code: { type: String, trim: true, default: '', required: true },
  email: {
    type: String,
    trim: true,
    default: '',
    unique: true,
    required: true,
  },
  password: { type: String, trim: true, default: '', required: true },
  access_token,
  status: { type: Number, trim: true, default: 0, required: true },
  image: { type: String, trim: true, default: '', required: false },
  forgot_otp: { type: String, trim: true, default: '', required: false },

  created_at: { type: Date, default: Date, required: false },
  created_by: { type: ObjectId, default: null, required: false },

  updated_at: { type: Date, default: null, required: false },
  deleted_at: { type: Date, default: null, required: false },
});

const User = mongoose.model('User', userSchema);

export default User;
