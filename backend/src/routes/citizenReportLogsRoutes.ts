import express from 'express';
import { getCitizenReports } from '../controllers/citizenReportLogsController';

const router = express.Router();

router.get('/', getCitizenReports);

export default router;
