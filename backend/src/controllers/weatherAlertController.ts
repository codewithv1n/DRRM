import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';

export const logWeatherAlert = async (req: Request, res: Response) => {
    try {
        const { weather_code, temperature, precipitation, wind_speed, warning_level, message } = req.body;
        
        // Prevent duplicate logging within the last 1 hour for the same warning level
        const checkResult = await pool.query(
            `SELECT weather_alert_id FROM weather_alerts 
             WHERE warning_level = $1 
             AND created_at >= NOW() - INTERVAL '1 hour'
             LIMIT 1`,
            [warning_level]
        );

        if (checkResult.rows.length > 0) {
            return res.status(200).json({ message: 'Alert already logged recently', alert: checkResult.rows[0] });
        }

        const result = await pool.query(
            `INSERT INTO weather_alerts (weather_code, temperature, precipitation, wind_speed, warning_level, message) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [weather_code, temperature, precipitation, wind_speed, warning_level, message]
        );
        res.status(201).json(result.rows[0]);

        await logAction('Weather Alert', 'System', `Weather alert logged: ${warning_level} - ${message?.substring(0, 100)}`, 'System');
    } catch (error) {
        console.error('Error logging weather alert:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getWeatherAlerts = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM weather_alerts ORDER BY created_at DESC LIMIT 50');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching weather alerts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
