import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
app.use('/api/residents', authRoutes);



app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Server is Running" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});