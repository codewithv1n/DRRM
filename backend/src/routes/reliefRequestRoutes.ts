import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { getAllReliefRequests, addReliefRequest, updateReliefRequestStatus, getDeliveredLogs, markReliefDelivered } from '../controllers/reliefRequestController';

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Images only!'));
        }
    }
});

router.get('/', getAllReliefRequests);
router.get('/delivered', getDeliveredLogs);
router.post('/', addReliefRequest);
router.put('/:id/status', updateReliefRequestStatus);
router.post('/:id/deliver', upload.single('photo'), markReliefDelivered);

export default router;
