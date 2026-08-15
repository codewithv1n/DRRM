import { Router } from 'express';
import { syncHazards, getAllHazards } from '../controllers/hazardController';

const router = Router();

router.get('/', getAllHazards);
router.post('/sync', syncHazards);

export default router;
