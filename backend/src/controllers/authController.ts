import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';

const SALT_ROUNDS = 10;

export const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, username, email, password, confirm_password, role = 'resident' } = req.body;

        if (!name || !username || !password || !confirm_password) {
            res.status(400).json({
                error: 'Missing required fields',
                details: 'name, username, password, and confirm password are required.'
            });
            return;
        }

        if (password !== confirm_password) {
            res.status(400).json({
                error: 'Credential mismatch',
                details: 'Passwords do not match.'
            });
            return;
        }

        const cleanUsername = username.trim().toLowerCase();
        
        // Check if username already exists in the auth table
        const existingUser = await pool.query('SELECT auth_id FROM auth WHERE LOWER(TRIM(username)) = $1', [cleanUsername]);

        if (existingUser.rows.length > 0) {
            res.status(409).json({
                error: 'Username already registered',
                details: 'An account with this username already exists.'
            });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

        const result = await pool.query(
            `INSERT INTO auth (name, username, email, password, role, profile_picture)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING auth_id AS id, name, username, email, role, profile_picture, created_at`,
            [name.trim(), cleanUsername, email ? email.trim() : null, hashedPassword, role, profile_picture]
        );
        
        const newUser = result.rows[0];
        
        res.status(201).json({
            message: 'Account created successfully!',
            user: newUser,
            role: newUser.role
        });
    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({
                error: 'Missing required fields',
                details: 'Username and password are required.'
            });
            return;
        }

        const cleanUsername = username.trim().toLowerCase();

        // Check the unified auth table
        const result = await pool.query(
            'SELECT auth_id AS id, name, username, email, password, role, profile_picture, created_at FROM auth WHERE LOWER(TRIM(username)) = $1',
            [cleanUsername]
        );

        if (result.rows.length === 0) {
            res.status(401).json({
                error: 'Invalid credentials',
                details: 'Username or password is incorrect.'
            });
            return;
        }

        const user = result.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password ?? '');
        
        if (!isPasswordValid) {
            res.status(401).json({
                error: 'Invalid credentials',
                details: 'Username or password is incorrect.'
            });
            return;
        }

        // Remove password from response
        delete user.password;
        
        res.status(200).json({
            message: 'Login successful!',
            user,
            role: user.role
        });

    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};



