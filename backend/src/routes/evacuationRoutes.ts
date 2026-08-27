import { Router } from 'express';
import { getEvacuationCenters, updateEvacuationCenterStatus, resetEvacuationCenterOccupancy, getAIRecommendation } from '../controllers/evacuationController';

const router = Router();

router.get('/', getEvacuationCenters);
router.post('/ai-recommendation', getAIRecommendation);
router.patch('/:id/status', updateEvacuationCenterStatus);
router.patch('/:id/reset', resetEvacuationCenterOccupancy);

export default router;
