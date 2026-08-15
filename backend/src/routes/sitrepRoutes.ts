import { Router } from 'express';
import { getSitreps, createSitrep, acknowledgeSitrep } from '../controllers/sitrepController';

const router = Router();

router.get('/', getSitreps);
router.post('/', createSitrep);
router.patch('/:id/acknowledge', acknowledgeSitrep);

export default router;
