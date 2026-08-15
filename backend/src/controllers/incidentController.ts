import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';

export const createIncident = async (req: Request, res: Response) => {
    try {
        const { reporterName, contactNumber, email, reporterEmail, location, type, isVerified, gpsLocation, deviceIp, spamScore } = req.body;
        const photo_path = req.file ? `/uploads/${req.file.filename}` : null;
        const finalEmail = (reporterEmail || email || null)?.trim().toLowerCase();

        const result = await pool.query(
            `INSERT INTO incident_reports 
            (reporter_name, contact_number, reporter_email, location, type, photo_path, is_verified, gps_location, device_ip, spam_score) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [
                reporterName, 
                contactNumber,
                finalEmail, 
                location, 
                type, 
                photo_path, 
                isVerified === 'true' || isVerified === true,
                gpsLocation || null,
                deviceIp || null,
                parseFloat(spamScore) || 0.0
            ]
        );

        await logAction('Create Incident', 'Public', `Incident reported: ${type} at ${location} by ${reporterName} (${finalEmail || 'no email'})`, reporterName || 'Anonymous');

        res.status(201).json({
            message: 'Incident report submitted successfully',
            incident: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating incident report:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const getIncidents = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM incident_reports ORDER BY created_at DESC');
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

        await logAction('Update Incident Status', 'Admin', `Incident #${id} status changed to ${status}${assigned_responder ? `, assigned to ${assigned_responder}` : ''}`, 'Admin');

        res.status(200).json({
            message: 'Incident status updated successfully',
            incident: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating incident status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
