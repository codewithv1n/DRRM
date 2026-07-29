import express from 'express';
import { getEarlyWarnings, syncEarlyWarnings, createEarlyWarning } from '../controllers/earlyWarningController';

const router = express.Router();

router.get('/', getEarlyWarnings);
router.post('/sync', syncEarlyWarnings);
router.post('/', createEarlyWarning);

export default router;
