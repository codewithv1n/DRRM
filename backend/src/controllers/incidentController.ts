import { Request, Response } from 'express';
import pool from '../config/db';

export const createIncidentReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { hazard_type, severity, description, address, latitude, longitude, resident_id } = req.body;

        // Validate required fields
        if (!hazard_type || !severity || !address) {
            res.status(400).json({
                error: 'Missing required fields',
                details: 'hazard_type, severity, and address are required.'
            });
            return;
        }

        // Validate hazard_type
        const validHazardTypes = ['flood', 'fire', 'other'];
        if (!validHazardTypes.includes(hazard_type)) {
            res.status(400).json({
                error: 'Invalid hazard type',
                details: `hazard_type must be one of: ${validHazardTypes.join(', ')}`
            });
            return;
        }

        // Validate severity
        const validSeverities = ['low', 'moderate', 'high', 'critical'];
        if (!validSeverities.includes(severity)) {
            res.status(400).json({
                error: 'Invalid severity',
                details: `severity must be one of: ${validSeverities.join(', ')}`
            });
            return;
        }



        let senderName = null;
        if (resident_id) {
            const residentResult = await pool.query('SELECT name FROM residents WHERE resident_id = $1', [resident_id]);
            if (residentResult.rows.length > 0) {
                senderName = residentResult.rows[0].name;
            }
        }

        const result = await pool.query(
            `INSERT INTO incident_reports (resident_id, sender_name, hazard_type, severity, description, address, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING report_id, resident_id, sender_name, hazard_type, severity, description, address, latitude, longitude, status, created_at`,
            [resident_id || null, senderName, hazard_type, severity, (description || '').trim(), address.trim(), latitude || null, longitude || null]
        );

        const newReport = result.rows[0];

        res.status(201).json({
            message: 'Incident report submitted successfully!',
            report: newReport
        });

    } catch (error: any) {
        console.error('Create incident report error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

export const getIncidentReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const { type } = req.query;

        let query = `SELECT report_id, resident_id, sender_name, hazard_type, severity, description, address, latitude, longitude, status, created_at
                      FROM incident_reports`;
        const params: string[] = [];

        if (type && type !== 'all') {
            query += ` WHERE hazard_type = $1`;
            params.push(type as string);
        }

        query += ` ORDER BY created_at DESC`;

        const result = await pool.query(query, params);

        res.status(200).json({
            reports: result.rows
        });

    } catch (error: any) {
        console.error('Get incident reports error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};
