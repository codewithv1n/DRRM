import pool from '../config/db';
import { Request, Response } from 'express';

/**
 * Helper function to log an action to the audit_logs table.
 * Can be imported and called from any controller.
 */
export const logAction = async (
    action: string,
    userRole: string = 'System',
    details: string = '',
    userName: string = 'System'
): Promise<void> => {
    try {
        await pool.query(
            `INSERT INTO audit_logs (action, user_role, user_name, details) VALUES ($1, $2, $3, $4)`,
            [action, userRole, userName, details]
        );
    } catch (error) {
        console.error('Failed to write audit log:', error);
    }
};

export const getAuditLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const { action, limit } = req.query;
        let query = 'SELECT * FROM audit_logs';
        const params: any[] = [];
        const conditions: string[] = [];

        if (action && typeof action === 'string') {
            conditions.push(`action ILIKE $${params.length + 1}`);
            params.push(`%${action}%`);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        query += ' ORDER BY created_at DESC';

        const rowLimit = parseInt(limit as string) || 200;
        query += ` LIMIT $${params.length + 1}`;
        params.push(rowLimit);

        const result = await pool.query(query, params);
        res.status(200).json({
            success: true,
            logs: result.rows
        });
    } catch (error: any) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ error: 'Failed to fetch audit logs', details: error.message });
    }
};

export const createAuditLog = async (req: Request, res: Response): Promise<void> => {
    try {
        const { action, user_role, user_name, details } = req.body;

        if (!action) {
            res.status(400).json({ error: 'Action is required' });
            return;
        }

        const result = await pool.query(
            `INSERT INTO audit_logs (action, user_role, user_name, details) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [action, user_role || 'System', user_name || 'System', details || '']
        );

        res.status(201).json({
            success: true,
            log: result.rows[0]
        });
    } catch (error: any) {
        console.error('Error creating audit log:', error);
        res.status(500).json({ error: 'Failed to create audit log', details: error.message });
    }
};
