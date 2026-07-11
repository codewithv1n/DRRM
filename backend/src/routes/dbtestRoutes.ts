import express, { Request, Response } from 'express';
import pool from '../config/db'; 

const router = express.Router();

router.get('/db-test', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            message: "Successfully connected to PostgreSQL 16 database!",
            timestamp: result.rows[0].now
        });
    } catch (error: any) {
        console.error("Database connection error:", error);
        res.status(500).json({
            error: "Failed to connect to database",
            details: error.message
        });
    }
});

export default router;