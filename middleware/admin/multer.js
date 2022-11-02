import multer from "multer";
import path from 'path'


const userStorage = multer.diskStorage({
  destination: './public/user/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const userUpload = multer({
  storage: userStorage,
  fileFilter: function (req, file, cb) {
    const types = ['image/jpeg', 'image/jpeg', 'image/png', 'image/webp'];
    if (types.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      req.fileValidationError = 'Image must be of valid format';
      cb(null, false, req.fileValidationError); // false case not match
    }
  },
});

const deviceStorage = multer.diskStorage({
  destination: './public/device/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const deviceUpload = multer({
  storage: deviceStorage,
  fileFilter: function (req, file, cb) {
    const types = ['image/jpeg', 'image/jpeg', 'image/png', 'image/webp'];
    if (types.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      req.fileValidationError = 'Image must be of valid format';
      cb(null, false, req.fileValidationError); // false case not match
    }
  },
});

const vehicleStorage = multer.diskStorage({
  destination: './public/customerVehicle/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const vehicleUpload = multer({
  storage: vehicleStorage,
  fileFilter: function (req, file, cb) {
    const types = ['image/jpeg', 'image/jpeg', 'image/png', 'image/webp'];
    if (types.indexOf(file.mimetype) !== -1) {
      cb(null, true);
    } else {
      req.fileValidationError = 'Image must be of valid format';
      cb(null, false, req.fileValidationError); // false case not match
    }
  },
});


export default {
  userUpload,
  deviceUpload,
  vehicleUpload,
};
