import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';

export const getSitreps = async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM sitreps_reports ORDER BY created_at DESC');
        res.status(200).json({ data: result.rows });
    } catch (error) {
        console.error('Error fetching sitreps:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const createSitrep = async (req: Request, res: Response) => {
    const { barangay, general_situation, evacuee_count, damage_severity, last_updated_by, evacuation_center } = req.body;
    
    const eoc_name = evacuation_center || 'Not Specified';

    if (!barangay || !general_situation || !damage_severity || !last_updated_by) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        const result = await pool.query(
            `INSERT INTO sitreps_reports 
            (barangay, eoc_name, general_situation, evacuee_count, damage_severity, last_updated_by) 
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [barangay, eoc_name, general_situation, evacuee_count || 0, damage_severity, last_updated_by]
        );

        res.status(201).json({ data: result.rows[0] });

        await logAction('Create Sitrep', 'Barangay Admin', `Sitrep submitted for ${barangay}: ${damage_severity} damage, ${evacuee_count || 0} evacuees`, last_updated_by || 'Barangay Admin');
    } catch (error) {
        console.error('Error creating sitrep:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const acknowledgeSitrep = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            `UPDATE sitreps_reports SET status = 'Acknowledged' WHERE sitreps_id = $1 RETURNING *`,
            [id]
        );
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'Sitrep not found' });
            return;
        }
        const sitrep = result.rows[0];
        const barangay = sitrep.barangay;
        const totalEvacuees = Number(sitrep.evacuee_count) || 0;

        if (totalEvacuees >= 0) {
            const centersRes = await pool.query('SELECT evacuation_center_id FROM evacuation_centers WHERE barangay = $1', [barangay]);
            const centers = centersRes.rows;
            
            if (centers.length > 0) {
                const perCenter = Math.floor(totalEvacuees / centers.length);
                const remainder = totalEvacuees % centers.length;

                for (let i = 0; i < centers.length; i++) {
                    const center = centers[i];
                    const toAssign = perCenter + (i === 0 ? remainder : 0);
                    await pool.query(
                        'UPDATE evacuation_centers SET current_occupants = $1 WHERE evacuation_center_id = $2',
                        [toAssign, center.evacuation_center_id]
                    );
                }
            }
        }

        res.status(200).json({ data: sitrep });

        await logAction('Acknowledge Sitrep', 'Admin', `Acknowledged sitrep #${id}`, 'Admin');
    } catch (error) {
        console.error('Error acknowledging sitrep:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
