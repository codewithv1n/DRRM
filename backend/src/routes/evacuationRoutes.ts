import { Router } from 'express';
import { getEvacuationCenters, updateEvacuationCenterStatus } from '../controllers/evacuationController';

const router = Router();

router.get('/', getEvacuationCenters);
router.patch('/:id/status', updateEvacuationCenterStatus);

export default router;
