import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';

const SALT_ROUNDS = 10;

export const signupResident = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, confirm_password } = req.body;

        
        if (!name || !email || !password || !confirm_password) {
            res.status(400).json({
                error: 'Missing required fields',
                details: 'name, email, password, and confirm password are required.'
            });
            return;
        }

       
        if (password !== confirm_password) {
            res.status(400).json({
                error: 'Credential mismatch',
                details: 'Credentials do not match.'
            });
            return;
        }

        const cleanEmail = email.trim().toLowerCase();

        
        const existingUser = await pool.query(
            'SELECT resident_id FROM residents WHERE LOWER(TRIM(email)) = $1',
            [cleanEmail]
        );

        if (existingUser.rows.length > 0) {
            res.status(409).json({
                error: 'Email already registered',
                details: 'An account with this email address already exists.'
            });
            return;
        }

        
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

       
        const profile_picture = req.file ? `/uploads/${req.file.filename}` : null;

        
        const result = await pool.query(
            `INSERT INTO residents (name, email, password, profile_picture)
             VALUES ($1, $2, $3, $4)
             RETURNING resident_id, name, email, profile_picture, created_at`,
            [name.trim(), cleanEmail, hashedPassword, profile_picture]
        );

        const newResident = result.rows[0];

        res.status(201).json({
            message: 'Account created successfully!',
            resident: {
                resident_id: newResident?.resident_id,
                name: newResident?.name,
                email: newResident?.email,
                profile_picture: newResident?.profile_picture,
                created_at: newResident?.created_at
            }
        });

    } catch (error: any) {
        console.error('Signup error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};

export const loginResident = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        
        if (!email || !password) {
            res.status(400).json({
                error: 'Missing required fields',
                details: 'Email and password are required.'
            });
            return;
        }

        const cleanEmail = email.trim().toLowerCase();

        
        const result = await pool.query(
            'SELECT resident_id, name, email, password, profile_picture, created_at FROM residents WHERE LOWER(TRIM(email)) = $1',
            [cleanEmail]
        );

        if (result.rows.length === 0) {
            res.status(401).json({
                error: 'Invalid credentials',
                details: 'Email or password is incorrect.'
            });
            return;
        } 

        const resident = result.rows[0];

        
        const isPasswordValid = await bcrypt.compare(password, resident?.password ?? '');

        if (!isPasswordValid) {
            res.status(401).json({
                error: 'Invalid credentials',
                details: 'Email or password is incorrect.'
            });
            return;
        }

        
        res.status(200).json({
            message: 'Login successful!',
            resident: {
                resident_id: resident?.resident_id,
                name: resident?.name,
                email: resident?.email,
                profile_picture: resident?.profile_picture,
                created_at: resident?.created_at
            }
        });

    } catch (error: any) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
};



