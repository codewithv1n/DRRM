import express from 'express';
import { adminCreateAccount, adminDisplayAllusers, login } from '../controllers/authController';

const router = express.Router();

router.post('/admin/create-account', adminCreateAccount);
router.get('/users', adminDisplayAllusers);
router.post('/login', login);

export default router;
