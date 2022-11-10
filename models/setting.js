import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
  about_us: { type: String, trim: true, default: '', required: true },
  privacy_policy: { type: String, trim: true, default: '', required: true },
  term_condition: { type: String, trim: true, default: '', required: true },
  help: { type: String, trim: true, default: '', required: true },

  created_at: { type: Date, default: Date, required: false, select: false },
  updated_at: { type: Date, default: null, required: false, select: false },
  deleted_at: { type: Date, default: null, required: false, select: false },
});

const Setting = mongoose.model('Setting', settingSchema);

export default Setting;
