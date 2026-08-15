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

router.post('/pending', upload.single('photo'), createDonation);
router.get('/pending', getAllPendingDonations);
router.put('/pending/:id/receive', markDonationReceived);
router.get('/logs', getDonationLogs);

export default router;
