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

router.post('/login', account.login);
router.post('/dashboard', account.dashboard);

router.post('/office/create', userUpload.single('image'), office.create);
router.post('/office/list', office.list);
router.post('/office/get', office.get);
router.post('/office/update', office.update);
router.post('/office/delete', office.remove);
router.post('/office/stats', office.userStats);

router.post('/technician/create', technician.create);
router.post('/technician/list', technician.list);
router.post('/technician/get', technician.get);
router.post('/technician/update', technician.update);
router.post('/technician/delete', technician.remove);

router.post('/customer/create', customer.create);
router.post('/customer/list', customer.list);
router.post('/customer/get', customer.get);
router.post('/customer/update', customer.update);
router.post('/customer/delete', customer.remove);

router.post('/device-attribute/create', deviceAttribute.create);
router.post('/device-attribute/list', deviceAttribute.list);
router.post('/device-attribute/get', deviceAttribute.get);
router.post('/device-attribute/update', deviceAttribute.update);
router.post('/device-attribute/delete', deviceAttribute.remove);

router.post('/device/create', device.create);
router.post('/device/list', device.list);
router.post('/device/get', device.get);
router.post('/device/update', device.update);
router.post('/device/delete', device.remove);

router.post('/order/list', order.list);
router.post('/order/get', order.get);
router.post('/order/update', order.update);

export default router;
