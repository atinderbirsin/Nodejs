import express from 'express';
import {
  account,
  technician,
  customer,
  customerVehicle,
  device,
  order,
  returnOrder,
  cart,
  job,
  setting,
} from '../controllers/office/index.js';
import auth from '../middleware/office/auth.js';
import multer from '../middleware/office/multer.js';

const router = express.Router();

router.post('/login', multer.userUpload.none(), account.login);
router.post('/profile', auth, multer.userUpload.none(), account.get);
router.post('/dashboard', auth, multer.userUpload.none(), account.dashboard);
router.post('/', auth, multer.userUpload.single('image'), account.update);

router.post('/technician/create', auth, multer.userUpload.single('image'), technician.create);
router.post('/technician/list', auth, multer.userUpload.none(), technician.list);
router.post('/technician/get', auth, multer.userUpload.none(), technician.get);
router.post('/technician/update', auth, multer.userUpload.single('image'), technician.update);
router.post('/technician/delete', auth, multer.userUpload.none(), technician.remove);
// router.post('/technician/change-status', auth, multer.userUpload.none(), technician.changeStatus);

router.post('/customer/create', auth, multer.userUpload.single('image'), customer.create);
router.post('/customer/list', auth, multer.userUpload.none(), customer.list);
router.post('/customer/get', auth, multer.userUpload.none(), customer.get);
router.post('/customer/update', auth, multer.userUpload.single('image'), customer.update);
router.post('/customer/delete', auth, multer.userUpload.none(), customer.remove);
router.post('/customer/service', auth, multer.userUpload.none(), customer.service);
// router.post('/customer/change-status', auth, multer.userUpload.none(), customer.changeStatus);

router.post('/customer-vehicle/create', auth, multer.vehicleUpload.single('image'), customerVehicle.create);
router.post('/customer-vehicle/list', auth, multer.vehicleUpload.none(), customerVehicle.list);
router.post('/customer-vehicle/get', auth, multer.vehicleUpload.none(), customerVehicle.get);
router.post('/customer-vehicle/update', auth, multer.vehicleUpload.single('image'), customerVehicle.update);
router.post('/customer-vehicle/delete', auth, multer.vehicleUpload.none(), customerVehicle.remove);
router.post('/customer-vehicle/service', auth, multer.vehicleUpload.none(), customerVehicle.service);
/* router.post(
  '/customer-vehicle/change-status',
  auth,
  multer.vehicleUpload.none(),
  customerVehicle.changeStatus
); */

router.post('/cart/add', auth, multer.userUpload.none(), cart.add);
router.post('/cart/get', auth, multer.userUpload.none(), cart.get);
router.post('/cart/clear', auth, multer.userUpload.none(), cart.clear);
router.post('/cart/delete', auth, multer.userUpload.none(), cart.remove);
router.post('/cart/update', auth, multer.userUpload.none(), cart.add);

router.post('/device/list', auth, multer.deviceUpload.none(), device.list);
router.post('/device/get', auth, multer.deviceUpload.none(), device.get);

router.post('/order/place', auth, multer.userUpload.none(), order.place);
router.post('/order/list', auth, multer.userUpload.none(), order.list);
router.post('/order/get', auth, multer.userUpload.none(), order.get);
router.post('/order/qr-code', auth, multer.userUpload.none(), order.get);
router.post('/order/update', auth, multer.userUpload.none(), order.update);

router.post('/order/return/place', auth, multer.userUpload.none(), returnOrder.place);
router.post('/order/return/list', auth, multer.userUpload.none(), returnOrder.list);
router.post('/order/return/get', auth, multer.userUpload.none(), returnOrder.get);

router.post('/job/create', auth, multer.jobUpload.array('images'), job.create);
// router.post('/order/return/list', auth, multer.userUpload.none(), returnOrder.list);
// router.post('/order/return/get', auth, multer.userUpload.none(), returnOrder.get);

router.post('/content/privacyPolicy', multer.deviceUpload.none(), setting.privacyPolicy);
router.post('/content/termsCondition', multer.deviceUpload.none(), setting.termsCondition);
router.post('/content/help', multer.deviceUpload.none(), setting.help);
router.post('/content/aboutUs', multer.deviceUpload.none(), setting.aboutUs);

export default router;
