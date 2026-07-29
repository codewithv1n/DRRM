import { Router } from 'express';
import {
  getOfficers,
  addOfficer,
  updateOfficer,
  deleteOfficer,
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent
} from '../controllers/drrmController';

const router = Router();

// DRRM Officers Routes
router.get('/officers', getOfficers);
router.post('/officers', addOfficer);
router.put('/officers/:id', updateOfficer);
router.delete('/officers/:id', deleteOfficer);

// Event Schedules Routes
router.get('/events', getEvents);
router.post('/events', addEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);

export default router;
