import express, { Request, Response } from 'express';
import cors from 'cors';
import testRoutes from './routes/dbtestRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


app.use('/api/db-test', testRoutes);

app.get('/', (req: Request, res: Response) => {
    res.json({ message: "Server is Running" });
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});