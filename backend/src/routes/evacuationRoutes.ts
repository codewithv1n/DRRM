import { Router } from 'express';
import { getEvacuationCenters, updateEvacuationCenterStatus, resetEvacuationCenterOccupancy } from '../controllers/evacuationController';

const router = Router();

router.get('/', getEvacuationCenters);
router.patch('/:id/status', updateEvacuationCenterStatus);
router.patch('/:id/reset', resetEvacuationCenterOccupancy);

export default router;
