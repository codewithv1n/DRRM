import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';

export const getAllReliefRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT * FROM responder_relief_mission ORDER BY timestamp DESC`
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
            `INSERT INTO responder_relief_mission (barangay, type, quantity, status, taskforce_assigned) 
             VALUES ($1, $2, $3, 'Pending', 'Unassigned') 
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
            `UPDATE responder_relief_mission 
             SET status = $1, taskforce_assigned = COALESCE($2, taskforce_assigned)
             WHERE mission_id = $3
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

export const markReliefDelivered = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { signatoryName } = req.body;
        const photoPath = req.file ? req.file.path : null;

        const missionResult = await pool.query(
            `SELECT * FROM responder_relief_mission WHERE mission_id = $1`,
            [id]
        );

        if (missionResult.rowCount === 0) {
            res.status(404).json({ message: "Relief request not found" });
            return;
        }

        const mission = missionResult.rows[0];

        const insertResult = await pool.query(
            `INSERT INTO barangay_relief_delivered_logs (mission_id, barangay, type, quantity, taskforce_assigned, signatory_name, photo_path)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [mission.mission_id, mission.barangay, mission.type, mission.quantity, mission.taskforce_assigned, signatoryName, photoPath]
        );

        await pool.query(
            `INSERT INTO barangay_relief_inventory (barangay, type, quantity)
             VALUES ($1, $2, $3)
             ON CONFLICT (barangay, type)
             DO UPDATE SET quantity = barangay_relief_inventory.quantity + EXCLUDED.quantity`,
            [mission.barangay, mission.type, mission.quantity]
        );

        await pool.query(`DELETE FROM responder_relief_mission WHERE mission_id = $1`, [id]);

        res.status(200).json({
            message: "Relief request marked as delivered successfully",
            log: insertResult.rows[0]
        });

        await logAction('Relief Delivered', mission.taskforce_assigned || 'Responder', `Delivered ${mission.quantity} ${mission.type} to ${mission.barangay}. Signed by: ${signatoryName}`, 'Responder');
    } catch (error) {
        console.error("Error marking relief delivered:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDeliveredLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT * FROM barangay_relief_delivered_logs ORDER BY timestamp DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching delivered logs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
