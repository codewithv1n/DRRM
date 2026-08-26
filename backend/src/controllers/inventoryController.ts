import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';

export const getAllInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT * FROM admin_relief_inventory ORDER BY last_updated DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addInventoryItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, quantity } = req.body;
        
        const result = await pool.query(
            `INSERT INTO admin_relief_inventory (category, quantity) 
             VALUES ($1, $2) 
             ON CONFLICT (category) DO UPDATE 
             SET quantity = admin_relief_inventory.quantity + EXCLUDED.quantity, last_updated = CURRENT_TIMESTAMP
             RETURNING *`,
            [category, parseInt(quantity as any) || 0]
        );

        res.status(201).json({
            message: "Item added to inventory successfully",
            item: result.rows[0]
        });

        await logAction('Add Inventory', 'Admin', `Added ${quantity} of ${category} to inventory`, 'Admin');
    } catch (error) {
        console.error("Error adding inventory item:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getBarangayInventory = async (req: Request, res: Response): Promise<void> => {
    try {
        const { barangay } = req.query;
        if (!barangay) {
            res.status(400).json({ message: "barangay query parameter is required" });
            return;
        }

        const result = await pool.query(
            `SELECT * FROM barangay_relief_inventory WHERE barangay = $1 ORDER BY updated_at DESC`,
            [barangay]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching barangay inventory:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
