import express from 'express';
import multer from 'multer';
import path from 'path';
import { createDonation, getAllPendingDonations, markDonationReceived, getDonationLogs } from '../controllers/donationController';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/4f9e1d8c-7b2a-4561-9c3f-8a0b5d4e1f7a', upload.single('photo'), createDonation);
router.get('/4f9e1d8c-7b2a-4561-9c3f-8a0b5d4e1f7a', getAllPendingDonations);
router.put('/4f9e1d8c-7b2a-4561-9c3f-8a0b5d4e1f7a/:id/receive', markDonationReceived);
router.get('/logs', getDonationLogs);

export default router;
