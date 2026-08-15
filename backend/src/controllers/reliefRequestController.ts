import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';

export const getAllReliefRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT * FROM relief_request ORDER BY timestamp DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching relief requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addReliefRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { barangay, type, quantity } = req.body;
        
        const result = await pool.query(
            `INSERT INTO relief_request (barangay, type, quantity, status) 
             VALUES ($1, $2, $3, 'Pending') 
             RETURNING *`,
            [barangay, type, parseInt(quantity as any) || 0]
        );

        res.status(201).json({
            message: "Relief request added successfully",
            request: result.rows[0]
        });

        await logAction('Relief Request', 'Barangay Admin', `Relief request: ${quantity} ${type} for ${barangay}`, 'Barangay Admin');
    } catch (error) {
        console.error("Error adding relief request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateReliefRequestStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status, vehicle } = req.body;

        const result = await pool.query(
            `UPDATE relief_request 
             SET status = $1, vehicle = COALESCE($2, vehicle)
             WHERE id = $3
             RETURNING *`,
            [status, vehicle || null, id]
        );

        if (result.rowCount === 0) {
            res.status(404).json({ message: "Relief request not found" });
            return;
        }

        res.status(200).json({
            message: "Relief request updated successfully",
            request: result.rows[0]
        });

        await logAction('Update Relief Request', 'Admin', `Relief request #${id} status changed to ${status}`, 'Admin');
    } catch (error) {
        console.error("Error updating relief request:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
