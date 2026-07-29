import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import incidentRoutes from './routes/incidentRoutes';
import earlyWarningRoutes from './routes/earlyWarningRoutes';
import reliefGoodsRoutes from './routes/reliefGoodsRoutes';
import evacuationRoutes from './routes/evacuationRoutes';
import drrmRoutes from './routes/drrmRoutes';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use('/api/auth', authRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/earlywarning', earlyWarningRoutes);
app.use('/api/relief-goods', reliefGoodsRoutes);
app.use('/api/evacuations', evacuationRoutes);
app.use('/api/drrm', drrmRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Server is Running" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});