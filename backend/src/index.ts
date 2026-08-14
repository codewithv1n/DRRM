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

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use('/api/donations', donationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', otpRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/hazards', hazardRoutes);
app.use('/api/evacuation-centers', evacuationRoutes);
app.use('/api/sitreps', sitrepRoutes);
app.use('/api/relief-requests', reliefRequestRoutes);
app.use('/api/weather-alerts', weatherAlertRoutes);
app.use('/api/audit-logs', auditLogRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Server is Running" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});