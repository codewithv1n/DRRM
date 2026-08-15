import express from 'express';
import { logWeatherAlert, getWeatherAlerts } from '../controllers/weatherAlertController';

const router = express.Router();

router.post('/', logWeatherAlert);
router.get('/', getWeatherAlerts);

export default router;
