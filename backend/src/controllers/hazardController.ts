import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';

export const getAllHazards = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT * FROM hazard_reports ORDER BY reported_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching hazards:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const syncHazards = async (req: Request, res: Response): Promise<void> => {
    const { hazards } = req.body;
    
    if (!hazards || !Array.isArray(hazards)) {
        res.status(400).json({ error: 'Invalid payload. Expected an array of hazards.' });
        return;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        await client.query("DELETE FROM hazard_reports WHERE source IN ('Open-Meteo', 'GDACS', 'USGS')");

      
        for (const h of hazards) {
            await client.query(`
                INSERT INTO hazard_reports (type, title, description, severity, coordinates, source, reported_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [
                h.type,
                h.title,
                h.description || '',
                h.severity || 'Unknown',
                h.coordinates ? JSON.stringify(h.coordinates) : null,
                h.source,
                h.reported_at
            ]);
        }

        await client.query('COMMIT');

        await logAction('Sync Hazards', 'System', `Synced ${hazards.length} hazard reports from external sources`, 'System');

        res.status(200).json({ message: 'Hazards synced successfully', count: hazards.length });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error syncing hazards:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
};
