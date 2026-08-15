import { Router } from 'express';
import { getAllReliefRequests, addReliefRequest, updateReliefRequestStatus } from '../controllers/reliefRequestController';

const router = Router();

router.get('/', getAllReliefRequests);
router.post('/', addReliefRequest);
router.put('/:id/status', updateReliefRequestStatus);

export default router;
