import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export const createAnnouncement = async (req: Request, res: Response) => {
    try {
        const { level, message, delivery_status } = req.body;
        const result = await pool.query(
            `INSERT INTO announcements (level, message, delivery_status) 
             VALUES ($1, $2, $3) RETURNING *`,
            [level, message, delivery_status || 'Sent']
        );

        const announcement = result.rows[0];
        res.status(201).json(announcement);

        await logAction('Create Announcement', 'Admin', `Broadcast ${level} alert: ${message.substring(0, 100)}`, 'Admin');

        try {
            const usersResult = await pool.query(
                `SELECT push_token FROM auth WHERE push_token IS NOT NULL`
            );

            const messages = [];
            for (let user of usersResult.rows) {
                if (!Expo.isExpoPushToken(user.push_token)) continue;
                messages.push({
                    to: user.push_token,
                    sound: 'default' as const,
                    title: `${level || 'Announcement'}`,
                    body: message || 'New announcement from DRRM',
                    data: { announcementId: announcement.id, type: 'announcement' },
                    channelId: 'default',
                });
            }

            if (messages.length > 0) {
                const chunks = expo.chunkPushNotifications(messages as any);
                for (let chunk of chunks) {
                    await expo.sendPushNotificationsAsync(chunk);
                }
                console.log(`Sent announcement push to ${messages.length} device(s)`);
            }
        } catch (pushError) {
            console.error('Error sending announcement push notifications:', pushError);
            // Don't fail the request if push fails
        }
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
