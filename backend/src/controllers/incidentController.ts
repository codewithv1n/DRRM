import { Request, Response } from 'express';
import pool from '../config/db';

export const createIncidentReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { hazard_type, severity, description, address, latitude, longitude, auth_id } = req.body;

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
        if (auth_id) {
            // Also enforce that the user is a resident
            const authResult = await pool.query('SELECT name, role FROM auth WHERE auth_id = $1', [auth_id]);
            if (authResult.rows.length > 0) {
                if (authResult.rows[0].role !== 'resident') {
                    res.status(403).json({ error: 'Access Denied: Only residents can submit incident reports.' });
                    return;
                }
                senderName = authResult.rows[0].name;
            }
        }

        const result = await pool.query(
            `INSERT INTO incident_reports (auth_id, sender_name, hazard_type, severity, description, address, latitude, longitude)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING report_id, auth_id, sender_name, hazard_type, severity, description, address, latitude, longitude, status, created_at`,
            [auth_id || null, senderName, hazard_type, severity, (description || '').trim(), address.trim(), latitude || null, longitude || null]
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
        const { type, auth_id } = req.query;

        let query = `SELECT report_id, auth_id, sender_name, hazard_type, severity, description, address, latitude, longitude, status, created_at
                      FROM incident_reports`;
        const params: any[] = [];
        const conditions: string[] = [];

        if (type && type !== 'all') {
            params.push(type as string);
            conditions.push(`hazard_type = $${params.length}`);
        }

        if (auth_id) {
            params.push(auth_id);
            conditions.push(`auth_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
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
