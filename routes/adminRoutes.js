import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  account,
  office,
  technician,
  customer,
  deviceAttribute,
  device,
  order,
} from '../controllers/admin/index.js';
import auth from '../middleware/admin/auth.js';

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

const router = express.Router();

router.post('/login', userUpload.none(), account.login);
router.post('/dashboard', userUpload.none(), account.dashboard);

router.post('/office/create', auth, userUpload.single('image'), office.create);
router.post('/office/list', auth, userUpload.none(), office.list);
router.post('/office/get', auth, userUpload.none(), office.get);
router.post('/office/update', auth, userUpload.single('image'), office.update);
router.post('/office/delete', auth, userUpload.none(), office.remove);
router.post('/office/stats', auth, userUpload.none(), office.userStats);

router.post('/technician/create', auth, userUpload.single('image'), technician.create);
router.post('/technician/list', auth, userUpload.none(), technician.list);
router.post('/technician/get', auth, userUpload.none(), technician.get);
router.post('/technician/update', auth, userUpload.single('image'), technician.update);
router.post('/technician/delete', auth, userUpload.none(), technician.remove);

router.post('/customer/create', auth, userUpload.single('image'), customer.create);
router.post('/customer/list', auth, userUpload.none(), customer.list);
router.post('/customer/get', auth, userUpload.none(), customer.get);
router.post('/customer/update', auth, userUpload.single('image'), customer.update);
router.post('/customer/delete', auth, userUpload.none(), customer.remove);
router.post('/customer/service', customer.service);

router.post('/device-attribute/create', auth, userUpload.none(), deviceAttribute.create);
router.post('/device-attribute/list', auth, deviceAttribute.list);
router.post('/device-attribute/get', auth, deviceAttribute.get);
router.post('/device-attribute/update', auth, deviceAttribute.update);
router.post('/device-attribute/delete', auth, deviceAttribute.remove);

router.post('/device/create', device.create);
router.post('/device/list', device.list);
router.post('/device/get', device.get);
router.post('/device/update', device.update);
router.post('/device/delete', device.remove);

router.post('/order/list', order.list);
router.post('/order/get', order.get);
router.post('/order/update', order.update);

export default router;
