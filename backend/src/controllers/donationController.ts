import { Request, Response } from 'express';
import pool from '../config/db';
import { logAction } from './auditLogController';
import { sendDonationThankYouEmail } from './otpController';

export const createDonation = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, email, donation_type, quantity } = req.body;
        const photo_path = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            `INSERT INTO donation_pending 
            (full_name, email, donation_type, quantity, photo_path) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [full_name, email, donation_type, parseInt(quantity) || 1, photo_path]
        );

        // Send Thank You Email asynchronously
        if (email) {
            sendDonationThankYouEmail(email, full_name, donation_type, parseInt(quantity) || 1).catch(err => {
                console.error("Failed to send thank you email:", err);
            });
        }

        res.status(201).json({
            message: "Donation submitted successfully",
            donation: result.rows[0]
        });

        await logAction('Submit Donation', 'Public', `Donation submitted by ${full_name}: ${donation_type} x${quantity}`, full_name || 'Anonymous');
    } catch (error) {
        console.error("Error creating donation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAllPendingDonations = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT * FROM donation_pending ORDER BY created_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching pending donations:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markDonationReceived = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const getResult = await pool.query(`SELECT * FROM donation_pending WHERE donation_pending_id = $1`, [id]);
        if (getResult.rowCount === 0) {
            res.status(404).json({ message: "Donation not found" });
            return;
        }
        const donation = getResult.rows[0];

        await pool.query(
            `INSERT INTO donation_logs (full_name, email, donation_type, quantity, photo_path) 
             VALUES ($1, $2, $3, $4, $5)`,
            [donation.full_name, donation.email, donation.donation_type, donation.quantity, donation.photo_path]
        );

        await pool.query(`DELETE FROM donation_pending WHERE donation_pending_id = $1`, [id]);
        
        const category = donation.donation_type || 'Others';
        const quantity = donation.quantity || 1;

        await pool.query(
            `INSERT INTO relief_inventory (category, quantity) 
             VALUES ($1, $2)
             ON CONFLICT (category) DO UPDATE 
             SET quantity = relief_inventory.quantity + EXCLUDED.quantity, last_updated = CURRENT_TIMESTAMP`,
            [category, quantity]
        );

        res.status(200).json({
            message: "Donation marked as received, moved to logs and added to inventory",
            donation
        });

        await logAction('Receive Donation', 'System Admin', `Received donation from ${donation.full_name}: ${donation.donation_type} x${donation.quantity}`, 'Admin');
    } catch (error) {
        console.error("Error updating donation:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getDonationLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            `SELECT * FROM donation_logs ORDER BY received_at DESC`
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching donation logs:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
