import express from 'express';
import { createIncidentReport, getIncidentReports, updateIncidentReport } from '../controllers/incidentController';

const router = express.Router();

router.post('/', createIncidentReport);
router.get('/', getIncidentReports);
router.put('/:id', updateIncidentReport);

export default router;
