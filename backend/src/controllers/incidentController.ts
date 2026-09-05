import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';
import { Expo } from 'expo-server-sdk';

const expo = new Expo();

export const createIncident = async (req: Request, res: Response) => {
    try {
        const { reporterName, contactNumber, email, reporterEmail, location, type, isVerified, deviceIp, spamScore } = req.body;
        const photo_path = req.file ? `/uploads/${req.file.filename}` : null;
        const finalEmail = (reporterEmail || email || null)?.trim().toLowerCase();

        const result = await pool.query(
            `INSERT INTO incident_reports 
            (reporter_name, contact_number, reporter_email, location, type, photo_path, is_verified, device_ip, spam_score) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [
                reporterName, 
                contactNumber,
                finalEmail, 
                location, 
                type, 
                photo_path, 
                isVerified === 'true' || isVerified === true,
                deviceIp || null,
                parseFloat(spamScore) || 0.0
            ]
        );

        const newIncident = result.rows[0];

        await logAction('Create Incident', 'Public', `Incident reported: ${type} at ${location} by ${reporterName} (${finalEmail || 'no email'})`, reporterName || 'Anonymous');

      
        try {
           
            const usersResult = await pool.query(
                `SELECT push_token FROM auth 
                 WHERE push_token IS NOT NULL 
                 AND ($2::text IS NULL OR email != $2)
                 AND (
                     LOWER($1) LIKE '%' || LOWER(barangay) || '%'
                     OR ($2::text IS NOT NULL AND LOWER(barangay) = (SELECT LOWER(barangay) FROM auth WHERE email = $2 LIMIT 1))
                 )`,
                [location, finalEmail]
            );

            const messages = [];
            for (let user of usersResult.rows) {
                if (!Expo.isExpoPushToken(user.push_token)) continue;
                messages.push({
                    to: user.push_token,
                    sound: 'default' as const,
                    title: `New ${type} Incident Reported`,
                    body: `Location: ${location}. Please check your dashboard for details.`,
                    data: { incidentId: newIncident.incident_id, type: 'incident' },
                    channelId: 'default',
                });
            }

            const chunks = expo.chunkPushNotifications(messages as any);
            for (let chunk of chunks) {
                await expo.sendPushNotificationsAsync(chunk);
            }
        } catch (pushError) {
            console.error('Error sending push notifications:', pushError);
            
        }

        res.status(201).json({
            message: 'Incident report submitted successfully',
            incident: newIncident
        });
    } catch (error) {
        console.error('Error creating incident report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getIncidents = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(
            `SELECT ir.*, a.barangay AS reporter_barangay
             FROM incident_reports ir
             LEFT JOIN auth a ON LOWER(TRIM(ir.reporter_email)) = LOWER(TRIM(a.email))
             ORDER BY ir.created_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching incident reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateIncidentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, assigned_responder } = req.body;

        const result = await pool.query(
            'UPDATE incident_reports SET status = $1, assigned_responder = COALESCE($2, assigned_responder) WHERE incident_id = $3 RETURNING *',
            [status, assigned_responder || null, id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Incident report not found' });
        }

        const incident = result.rows[0];

        if (status === 'Responding' && (assigned_responder || incident.assigned_responder)) {
            try {
                await pool.query(
                    `INSERT INTO deployed_incidents 
                     (incident_id, taskforce_name, reporter_name, contact_number, location, type, status, created_at)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [
                        incident.incident_id,
                        assigned_responder || incident.assigned_responder,
                        incident.reporter_name,
                        incident.contact_number,
                        incident.location,
                        incident.type,
                        incident.status,
                        incident.created_at
                    ]
                );
            } catch (err) {
                console.error('Failed to log deployment to deployed_incidents:', err);
                
            }
        }

        await logAction('Update Incident Status', 'Admin', `Incident #${id} status changed to ${status}${assigned_responder ? `, assigned to ${assigned_responder}` : ''}`, 'Admin');

        res.status(200).json({
            message: 'Incident status updated successfully',
            incident: incident
        });
    } catch (error) {
        console.error('Error updating incident status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
