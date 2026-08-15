import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import { logAction } from './auditLogController';

const SALT_ROUNDS = 10;

export const adminCreateAccount = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role, barangay, name, email, password, contactNumber, address, familyMembers } = req.body;

        if (!name || !email || !password || !role) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }

        const cleanEmail = email.trim().toLowerCase();
        
        
        const existingUser = await pool.query('SELECT auth_id FROM auth WHERE email = $1 OR username = $1', [cleanEmail]);

        if (existingUser.rows.length > 0) {
            res.status(409).json({ error: 'Email already registered' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const responderStatus = role === 'Responder' ? 'available' : null;
        const familyMembersJson = familyMembers ? JSON.stringify(familyMembers) : null;

        const result = await pool.query(
            `INSERT INTO auth (name, username, email, password, role, barangay, contact_number, address, family_members, responder_status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING auth_id AS id, name, email, role, created_at`,
            [name.trim(), cleanEmail, cleanEmail, hashedPassword, role, barangay || null, contactNumber || null, address || null, familyMembersJson, responderStatus]
        );
        
        const newUser = result.rows[0];
        
        await logAction('Create Account', 'System Admin', `Created ${role} account for ${name.trim()} (${cleanEmail})`, 'Admin');
        
        res.status(201).json({
            message: 'Account created successfully!',
            user: newUser
        });
    } catch (error: any) {
        console.error('Admin create account error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

export const adminDisplayAllusers = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query(
            "SELECT auth_id AS id, name, email, role, barangay, created_at FROM auth WHERE role != 'System Admin'"
        );
        res.status(200).json({
            success: true,
            users: result.rows
        });
    } catch (error: any) {
        console.error('Fetch users error:', error);
        res.status(500).json({ error: 'Failed to fetch users', details: error.message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }

        const result = await pool.query('SELECT * FROM auth WHERE email = $1 OR username = $1', [email.trim().toLowerCase()]);
        
        if (result.rows.length === 0) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Return user data without password
        const { password: _, ...userData } = user;
        
        await logAction('User Login', userData.role || 'User', `${userData.name} logged in (${userData.email})`, userData.name);
        
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userData
        });
    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};
