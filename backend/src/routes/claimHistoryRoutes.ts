import express from 'express';
import { getClaimHistory, createClaimRecord, updateClaimStatus, createBatchClaimsForBarangay } from '../controllers/claimHistoryController';

const router = express.Router();

router.get('/', getClaimHistory);
router.post('/', createClaimRecord);
router.post('/batch', createBatchClaimsForBarangay);
router.put('/:id/status', updateClaimStatus);

export default router;
