import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';


export const getClaimHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.query;

        let result;
        if (email) {
            result = await pool.query(
                `SELECT * FROM citizen_relief_history WHERE citizen_email = $1 ORDER BY claimed_at DESC`,
                [(email as string).trim().toLowerCase()]
            );
        } else {
            result = await pool.query(
                `SELECT * FROM citizen_relief_history ORDER BY claimed_at DESC`
            );
        }

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching claim history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const createClaimRecord = async (req: Request, res: Response): Promise<void> => {
    try {
        const { citizen_email, citizen_name, item_name, quantity, status, distribution_site, remarks } = req.body;

        if (!citizen_email || !citizen_name || !item_name) {
            res.status(400).json({ message: 'citizen_email, citizen_name, and item_name are required.' });
            return;
        }

        const result = await pool.query(
            `INSERT INTO citizen_relief_history 
            (citizen_email, citizen_name, item_name, quantity, status, distribution_site, remarks) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [
                citizen_email.trim().toLowerCase(),
                citizen_name,
                item_name,
                parseInt(quantity) || 1,
                status || 'Pending',
                distribution_site || null,
                remarks || null
            ]
        );

        await logAction('Relief Claim', 'Admin', `Added claim for ${citizen_name}: ${quantity || 1}x ${item_name}`, 'Admin');

        res.status(201).json({
            message: 'Claim record created successfully',
            claim: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating claim record:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const updateClaimStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const result = await pool.query(
            `UPDATE citizen_relief_history SET status = $1 WHERE citizen_relief_history_id = $2 RETURNING *`,
            [status, id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Claim record not found' });
            return;
        }

        await logAction('Update Claim Status', 'Admin', `Claim #${id} manually marked as ${status}`, 'Admin');

        res.status(200).json({
            message: 'Claim status updated successfully',
            claim: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating claim status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
