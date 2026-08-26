import express from 'express';
import { getAllInventory, addInventoryItem, getBarangayInventory } from '../controllers/inventoryController';

const router = express.Router();

router.get('/', getAllInventory);
router.get('/barangay', getBarangayInventory);
router.post('/', addInventoryItem);

export default router;
