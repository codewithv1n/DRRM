import { Router } from 'express';
import { getEvacuationCenters, addEvacuationCenter, updateEvacuationCenterStatus } from '../controllers/evacuationController';

const router = Router();

router.get('/', getEvacuationCenters);
router.post('/', addEvacuationCenter);
router.put('/:id/status', updateEvacuationCenterStatus);

export default router;
