import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export const logWeatherAlert = async (req: Request, res: Response) => {
    try {
        const { weather_code, temperature, precipitation, wind_speed, warning_level, message } = req.body;
        
        
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

        const weatherAlert = result.rows[0];

        await logAction('Weather Alert', 'System', `Weather alert logged: ${warning_level} - ${message?.substring(0, 100)}`, 'System');

        
        try {
            const usersResult = await pool.query(
                `SELECT push_token FROM auth WHERE push_token IS NOT NULL`
            );

            const rawLevel = warning_level || 'Weather Alert';
            const displayTitle = rawLevel.toLowerCase().includes('warning') ? rawLevel : `${rawLevel} RAINFALL WARNING`;

            const messages = [];
            for (let user of usersResult.rows) {
                if (!Expo.isExpoPushToken(user.push_token)) continue;
                messages.push({
                    to: user.push_token,
                    sound: 'default' as const,
                    title: displayTitle,
                    body: message || 'Weather condition advisory. Please check your DRRM app for details.',
                    data: { weatherAlertId: weatherAlert.weather_alert_id, type: 'weather' },
                    channelId: 'default',
                });
            }

            if (messages.length > 0) {
                const chunks = expo.chunkPushNotifications(messages as any);
                for (let chunk of chunks) {
                    await expo.sendPushNotificationsAsync(chunk);
                }
                console.log(`Sent weather alert push to ${messages.length} device(s)`);
            }
        } catch (pushError) {
            console.error('Error sending weather alert push notifications:', pushError);
            
        }

        res.status(201).json(weatherAlert);
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
