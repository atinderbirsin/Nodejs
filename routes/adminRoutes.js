import express from 'express';
import { account, office } from '../controllers/admin/index.js';

const router = express.Router();

router.post('/login', account.login);
router.post('/dashboard', account.dashboard);

router.post('/office/create', office.create);
router.post('/office/list', office.list);

export default router;
