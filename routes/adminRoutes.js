import express from 'express';
import {
  account,
  office,
  technician,
  customer,
  customerVehicle,
  device,
  deviceAttribute,
  order,
  stock,
} from '../controllers/admin/index.js';
import auth from '../middleware/admin/auth.js';
import multer from '../middleware/admin/multer.js';

const router = express.Router();

router.post('/login', multer.userUpload.none(), account.login);
router.post('/dashboard', multer.userUpload.none(), account.dashboard);

router.post('/office/create', auth, multer.userUpload.single('image'), office.create);
router.post('/office/list', auth, multer.userUpload.none(), office.list);
router.post('/office/get', auth, multer.userUpload.none(), office.get);
router.post('/office/update', auth, multer.userUpload.single('image'), office.update);
router.post('/office/delete', auth, multer.userUpload.none(), office.remove);
router.post('/office/stats', auth, multer.userUpload.none(), office.userStats);

router.post('/technician/create', auth, multer.userUpload.single('image'), technician.create);
router.post('/technician/list', auth, multer.userUpload.none(), technician.list);
router.post('/technician/get', auth, multer.userUpload.none(), technician.get);
router.post('/technician/update', auth, multer.userUpload.single('image'), technician.update);
router.post('/technician/delete', auth, multer.userUpload.none(), technician.remove);

router.post('/customer/create', auth, multer.userUpload.single('image'), customer.create);
router.post('/customer/list', auth, multer.userUpload.none(), customer.list);
router.post('/customer/get', auth, multer.userUpload.none(), customer.get);
router.post('/customer/update', auth, multer.userUpload.single('image'), customer.update);
router.post('/customer/delete', auth, multer.userUpload.none(), customer.remove);
router.post('/customer/service', customer.service);

router.post('/customer-vehicle/create', auth, multer.vehicleUpload.single('image'), customerVehicle.create);
router.post('/customer-vehicle/list', auth, multer.vehicleUpload.none(), customerVehicle.list);
router.post('/customer-vehicle/get', auth, multer.vehicleUpload.none(), customerVehicle.get);
router.post('/customer-vehicle/update', auth, multer.vehicleUpload.single('image'), customerVehicle.update);
router.post('/customer-vehicle/delete', auth, multer.vehicleUpload.none(), customerVehicle.remove);

router.post('/device-attribute/create', auth, multer.deviceUpload.single('image'), deviceAttribute.create);
router.post('/device-attribute/list', auth, multer.deviceUpload.none(), deviceAttribute.list);
router.post('/device-attribute/get', auth, multer.deviceUpload.none(), deviceAttribute.get);
router.post('/device-attribute/update', auth, multer.deviceUpload.single('image'), deviceAttribute.update);
router.post('/device-attribute/delete', auth, multer.deviceUpload.none(), deviceAttribute.remove);

router.post('/device/create', auth, multer.deviceUpload.single('image'), device.create);
router.post('/device/list', auth, multer.deviceUpload.none(), device.list);
router.post('/device/get', auth, multer.deviceUpload.none(), device.get);
router.post('/device/update', auth, multer.deviceUpload.single('image'), device.update);
router.post('/device/delete', auth, multer.deviceUpload.none(), device.remove);

router.post('/order/list', auth, order.list);
router.post('/order/get', auth, order.get);
router.post('/order/update', auth, order.update);

router.post('/stock/create', auth, multer.deviceUpload.none(), stock.create);
router.post('/stock/list', auth, multer.deviceUpload.none(), stock.list);
router.post('/stock/history', auth, multer.deviceUpload.none(), stock.history);

export default router;
