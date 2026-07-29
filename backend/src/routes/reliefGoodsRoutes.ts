import express from 'express';
import { getReliefGoods, addReliefGood, getReliefGoodsLogs, addReliefGoodsLog } from '../controllers/reliefGoodsController';

const router = express.Router();

router.get('/', getReliefGoods);
router.post('/', addReliefGood);
router.get('/logs', getReliefGoodsLogs);
router.post('/logs', addReliefGoodsLog);

export default router;
