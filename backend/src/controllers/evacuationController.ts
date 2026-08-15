import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';

export const getEvacuationCenters = async (req: Request, res: Response) => {
    try {
        const { lat, lon } = req.query;
        let query = 'SELECT * FROM evacuation_centers ORDER BY created_at DESC';
        const params: any[] = [];

        if (lat && lon) {
            query = `
                SELECT *, 
                ( 6371 * acos( cos( radians($1) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians($2) ) + sin( radians($1) ) * sin( radians( latitude ) ) ) ) AS distance 
                FROM evacuation_centers 
                WHERE latitude IS NOT NULL AND longitude IS NOT NULL
                ORDER BY distance ASC
            `;
            params.push(lat, lon);
        }

        const result = await pool.query(query, params);
        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching evacuation centers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const updateEvacuationCenterStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
        res.status(400).json({ error: 'Status is required' });
        return;
    }

    try {
        const result = await pool.query(
            'UPDATE evacuation_centers SET status = $1 WHERE evacuation_center_id = $2 RETURNING *',
            [status, id]
        );
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Evacuation center not found' });
            return;
        }
        res.status(200).json({ data: result.rows[0] });

        await logAction('Update Evacuation Center', 'Admin', `Evacuation center #${id} status changed to ${status}`, 'Admin');
    } catch (error) {
        console.error('Error updating evacuation center status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
