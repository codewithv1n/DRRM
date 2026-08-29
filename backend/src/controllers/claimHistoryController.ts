import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';


export const getClaimHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        
        await pool.query(`
            UPDATE citizen_relief_history 
            SET status = 'Cancelled' 
            WHERE status = 'Pending' AND valid_until < CURRENT_DATE
        `);

        const { email, barangay } = req.query;

        let result;
        if (email) {
            result = await pool.query(
                `SELECT * FROM citizen_relief_history WHERE citizen_email = $1 ORDER BY claimed_at DESC`,
                [(email as string).trim().toLowerCase()]
            );
        } else if (barangay) {
            
            result = await pool.query(
                `SELECT c.* FROM citizen_relief_history c
                 JOIN auth a ON c.citizen_email = a.email
                 WHERE a.barangay = $1
                 ORDER BY c.claimed_at DESC`,
                [barangay]
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
        const { status, item_name, quantity, barangay } = req.body;

        let result;
        if (item_name && quantity !== undefined) {
            result = await pool.query(
                `UPDATE citizen_relief_history SET status = $1, item_name = $2, quantity = $3 WHERE citizen_relief_history_id = $4 RETURNING *`,
                [status, item_name, quantity, id]
            );

            if (status === 'Claimed' && barangay) {
                await pool.query(
                    `UPDATE barangay_relief_inventory 
                     SET quantity = GREATEST(0, quantity - $3)
                     WHERE barangay = $1 AND type = $2`,
                    [barangay, item_name, quantity]
                );
            }
        } else {
            result = await pool.query(
                `UPDATE citizen_relief_history SET status = $1 WHERE citizen_relief_history_id = $2 RETURNING *`,
                [status, id]
            );
        }

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

export const createBatchClaimsForBarangay = async (req: Request, res: Response): Promise<void> => {
    try {
        const { barangay, item_name, quantity, remarks, valid_until } = req.body;

        if (!barangay || !item_name) {
            res.status(400).json({ message: 'barangay and item_name are required.' });
            return;
        }

        
        const citizensResult = await pool.query(
            `SELECT name, email FROM auth WHERE barangay = $1 AND role = 'Citizen'`,
            [barangay]
        );

        const citizens = citizensResult.rows;

        if (citizens.length === 0) {
            res.status(404).json({ message: 'No citizens found in this barangay.' });
            return;
        }

       
        let insertedCount = 0;
        for (const citizen of citizens) {
            const remarkText = valid_until ? `Valid until: ${valid_until}` : (remarks || null);

            await pool.query(
                `INSERT INTO citizen_relief_history 
                (citizen_email, citizen_name, item_name, quantity, status, remarks, valid_until) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    citizen.email.trim().toLowerCase(),
                    citizen.name,
                    item_name,
                    parseInt(quantity) || 1,
                    'Pending',
                    remarkText,
                    valid_until || null
                ]
            );
            insertedCount++;
        }

        await logAction('Batch Relief Claim', 'Barangay Admin', `Created ${insertedCount} pending claims for ${barangay}: ${item_name}`, 'Admin');

        res.status(201).json({
            message: `Successfully created ${insertedCount} pending claims for ${barangay}.`,
            count: insertedCount
        });
    } catch (error) {
        console.error('Error creating batch claim records:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
