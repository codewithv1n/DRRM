import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import donationRoutes from './routes/donationRoutes';
import authRoutes from './routes/authRoutes';
import inventoryRoutes from './routes/inventoryRoutes';
import incidentRoutes from './routes/incidentRoutes';
import announcementRoutes from './routes/announcementRoutes';
import hazardRoutes from './routes/hazardRoutes';
import evacuationRoutes from './routes/evacuationRoutes';
import sitrepRoutes from './routes/sitrepRoutes';
import reliefRequestRoutes from './routes/reliefRequestRoutes';
import weatherAlertRoutes from './routes/weatherAlertRoutes';
import auditLogRoutes from './routes/auditLogRoutes';
import otpRoutes from './routes/otpRoutes';
import claimHistoryRoutes from './routes/claimHistoryRoutes';
import citizenReportLogsRoutes from './routes/citizenReportLogsRoutes';
import { encryptResponse } from './middleware/encryption';



const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(encryptResponse);

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use('/api/7e8a93b4-f02a-4f51-b8f9-dc4813c01f68', donationRoutes);
app.use('/api/a2d8e3f9-715c-4d32-98ab-eb54cd8c21a3', authRoutes);
app.use('/api/a2d8e3f9-715c-4d32-98ab-eb54cd8c21a3', otpRoutes);
app.use('/api/9f7a5b3d-1a8c-4f5e-bd29-dc81f203874e', otpRoutes);
app.use('/api/1e8d64f2-9c7a-4a5b-98df-ba24ef51379c', inventoryRoutes);
app.use('/api/8d72f1a6-2c98-4f3b-a9b1-54c3e80d7e6f', incidentRoutes);
app.use('/api/b2e45d81-8c43-412d-96f8-a14e9f73c6b2', announcementRoutes);
app.use('/api/c3e5a2d9-f714-486c-b291-fe6d953281a4', hazardRoutes);
app.use('/api/d4a8b7f1-59c3-421e-8fd9-bc37ea495201', evacuationRoutes);
app.use('/api/e5b9d3c8-61f2-498b-9a74-cd185e492b67', sitrepRoutes);
app.use('/api/f1d8c2e9-8473-4f2b-bc6a-35a1de7c94b2', reliefRequestRoutes);
app.use('/api/2b9a7c3e-f81d-458a-8c76-bc39ef147d01', weatherAlertRoutes);
app.use('/api/3f8d2b9e-c714-459f-9a8b-cd781e649a32', auditLogRoutes);
app.use('/api/8b5a3c9e-d14f-4592-8c67-bf14e7a83d95', claimHistoryRoutes);
app.use('/api/9e4d5b2c-a81c-4231-9f7b-cd831a29f5e4', claimHistoryRoutes);
app.use('/api/7c8b2d1e-9a4f-4581-bc79-fe358a914c62', citizenReportLogsRoutes);


app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Server is Running" });
});

const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});