import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';

export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const { level, message, delivery_status } = req.body;
        const result = await pool.query(
            `INSERT INTO announcements (level, message, delivery_status) 
             VALUES ($1, $2, $3) RETURNING *`,
            [level, message, delivery_status || 'Sent']
        );
        res.status(201).json(result.rows[0]);

        await logAction('Create Announcement', 'Admin', `Broadcast ${level} alert: ${message.substring(0, 100)}`, 'Admin');
    } catch (error) {
        console.error('Error creating announcement:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getAnnouncements = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM announcements ORDER BY created_at DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
