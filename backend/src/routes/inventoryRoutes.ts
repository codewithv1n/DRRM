import express from 'express';
import { getAllInventory, addInventoryItem } from '../controllers/inventoryController';

const router = express.Router();

router.get('/', getAllInventory);
router.post('/', addInventoryItem);

export default router;
