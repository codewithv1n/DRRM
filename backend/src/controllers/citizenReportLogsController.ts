import { Request, Response } from 'express';
import pool from '../config/db';

export const getCitizenReports = async (req: Request, res: Response) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: 'Email is required to fetch reports.' });
        }

        console.log(`Fetching reports for email: ${email}`);

        // Query the newly created citizen_report_logs table case-insensitively
        const result = await pool.query(
            'SELECT * FROM citizen_report_logs WHERE LOWER(reporter_email) = LOWER($1) ORDER BY created_at DESC',
            [email]
        );
        console.log(`Found ${result.rows.length} reports`);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching citizen reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
