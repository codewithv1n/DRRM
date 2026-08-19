import express from 'express';
import { getClaimHistory, createClaimRecord, updateClaimStatus } from '../controllers/claimHistoryController';

const router = express.Router();

router.get('/', getClaimHistory);
router.post('/', createClaimRecord);
router.put('/:id/status', updateClaimStatus);

export default router;
