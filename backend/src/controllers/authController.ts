import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';

const SALT_ROUNDS = 10;

export const signupResident = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, email, password, confirm_password } = req.body;

        // Validate required fields
        if (!full_name || !email || !password || !confirm_password) {
            res.status(400).json({
                error: 'Missing required fields',
                details: 'Full name, email, password, and confirm password are required.'
            });
            return;
        }

        // Check if passwords match
        if (password !== confirm_password) {
            res.status(400).json({
                error: 'Credential mismatch',
                details: 'Credentials do not match.'
            });
            return;
        }

        // Check if email already exists
        const existingUser = await pool.query(
            'SELECT id FROM residents WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            res.status(409).json({
                error: 'Email already registered',
                details: 'An account with this email address already exists.'
            });
            return;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Get the uploaded file path (if any)
        const validIdPicture = req.file ? `/uploads/${req.file.filename}` : null;

        // Insert into database
        const result = await pool.query(
            `INSERT INTO residents (full_name, email, password, valid_id_picture)
             VALUES ($1, $2, $3, $4)
             RETURNING id, full_name, email, valid_id_picture, created_at`,
            [full_name, email, hashedPassword, validIdPicture]
        );

        const newResident = result.rows[0];

        res.status(201).json({
            message: 'Account created successfully!',
            resident: {
                id: newResident?.id,
                full_name: newResident?.full_name,
                email: newResident?.email,
                valid_id_picture: newResident?.valid_id_picture,
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

        // Validate required fields
        if (!email || !password) {
            res.status(400).json({
                error: 'Missing required fields',
                details: 'Email and password are required.'
            });
            return;
        }

        // Find user by email
        const result = await pool.query(
            'SELECT id, full_name, email, password, valid_id_picture, created_at FROM residents WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            res.status(401).json({
                error: 'Invalid credentials',
                details: 'Email or password is incorrect.'
            });
            return;
        }

        const resident = result.rows[0];

        // Compare password with stored hash
        const isPasswordValid = await bcrypt.compare(password, resident?.password ?? '');

        if (!isPasswordValid) {
            res.status(401).json({
                error: 'Invalid credentials',
                details: 'Email or password is incorrect.'
            });
            return;
        }

        // Login successful
        res.status(200).json({
            message: 'Login successful!',
            resident: {
                id: resident?.id,
                full_name: resident?.full_name,
                email: resident?.email,
                valid_id_picture: resident?.valid_id_picture,
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
