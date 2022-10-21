import mongoose, { Schema } from 'mongoose';

const { ObjectId } = Schema;

const access_token = [
  { type: String, trim: true, default: '', required: false },
];

const userSchema = new mongoose.Schema(
  {
    user_type: {
      type: Number,
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
    code: {
      type: String,
      trim: true,
      default: '',
      unique: true,
      required: true,
    },
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
    password: {
      type: String,
      trim: true,
      default: '',
      required: true,
      select: false,
    },
    access_token,
    status: { type: Number, trim: true, default: 0, required: true },
    image: { type: String, trim: true, default: '', required: false },
    forgot_otp: {
      type: String,
      trim: true,
      default: '',
      required: false,
      select: false,
    },
    /* slug: { type: string } */
    created_at: { type: Date, default: Date, required: false, select: false },
    created_by: {
      type: ObjectId,
      default: null,
      required: false,
      select: false,
    },

    updated_at: { type: Date, default: null, required: false, select: false },
    deleted_at: { type: Date, default: null, required: false, select: false },
  }
  /* { To add virtual properties
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  } */
);

/* userSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
}); Function to calculate virtual property value */

/* DOCUMENT MIDDLEWARE: runs before .save() and .create()
Middleware that runs before document is being saved in database
userSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();           
}); */

/* DOCUMENT MIDDLEWARE: runs before .save() and .create()
Middleware that runs before document is being saved in database
userSchema.pre('save', function (next) {
  console.log('Document is being saved...');
  next();           
}); */

/* DOCUMENT MIDDLEWARE: runs after .save() and . create()
Middleware that runs after document has been saved in database
userSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
}); */

const User = mongoose.model('User', userSchema);

export default User;
