import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { logAction } from './auditLogController';

interface StoredOtp {
  otp: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}


const otpStore = new Map<string, StoredOtp>();


const createTransporter = () => {
  const user = process.env.EMAIL_USER || process.env.SMTP_USER || process.env.MAIL_USER;
  const pass = process.env.EMAIL_PASS || process.env.SMTP_PASS || process.env.MAIL_PASS;
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : undefined;

  if (user && pass) {
    if (host) {
      return nodemailer.createTransport({
        host,
        port: port || 587,
        secure: port === 465,
        auth: { user, pass },
        family: 4,
        connectionTimeout: 5000,
        socketTimeout: 5000,
        greetingTimeout: 10000,
        pool: true,
        maxConnections: 5,
        tls: { rejectUnauthorized: false },
      } as any);
    } else {
      return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user, pass },
        family: 4,
        connectionTimeout: 5000,
        socketTimeout: 5000,
        greetingTimeout: 10000,
        pool: true,
        maxConnections: 5,
        tls: { rejectUnauthorized: false },
      } as any);
    }
  }

  return null;
};


export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

  
    const existing = otpStore.get(cleanEmail);
    if (existing && existing.expiresAt - Date.now() > 9.5 * 60 * 1000) {
      res.status(429).json({ error: 'Please wait 30 seconds before requesting another code.' });
      return;
    }

  
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; 

    const transporter = createTransporter();

    if (!transporter) {
      console.error('[OTP Service Error] EMAIL_USER or EMAIL_PASS not set in backend/.env');
      res.status(500).json({
        error: 'Email service is not configured. Please add EMAIL_USER and EMAIL_PASS (Gmail App Password) to backend/.env',
      });
      return;
    }

    
    const mailOptions = {
      from: `"GovServe DRRM Helpline 122" <${process.env.EMAIL_USER}>`,
      to: cleanEmail,
      subject: `${otpCode} is your GovServe DRRM Verification Code`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">GovServe DRRM</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Helpline 122 Incident Verification</p>
          </div>
          <div style="padding: 28px 24px;">
            <h2 style="font-size: 16px; color: #0f172a; margin-top: 0; margin-bottom: 8px; font-weight: 700;">Emergency Report Verification</h2>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
              You are submitting an emergency incident report to Helpline 122. Please enter this 6-digit verification code to authenticate your submission:
            </p>
            <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 20px;">
              <span style="font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #1d4ed8; font-family: monospace;">${otpCode}</span>
              <div style="font-size: 11px; color: #64748b; margin-top: 6px; font-weight: 600;">Valid for 10 minutes</div>
            </div>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
              ⚠️ If you did not request this verification code, please ignore this email. Do not share this code with anyone.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
            GovServe DRRM • Helpline 122
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Nodemailer] Real OTP email sent successfully to ${cleanEmail}`);

    
    otpStore.set(cleanEmail, {
      otp: otpCode,
      expiresAt,
      attempts: 0,
      verified: false,
    });

    await logAction('Send OTP', 'Public', `Dispatched OTP email to ${cleanEmail}`, 'System');

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your Gmail inbox',
    });
  } catch (error: any) {
    console.error('❌ [Nodemailer Error]:', error);
    res.status(500).json({
      error: `Failed to deliver email: ${error.message || 'Please check Gmail credentials in backend/.env'}`,
    });
  }
};


export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ error: 'Email and OTP code are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.toString().trim();

    const stored = otpStore.get(cleanEmail);

    if (!stored) {
      res.status(400).json({ error: 'No OTP requested for this email or it has expired.' });
      return;
    }

    if (Date.now() > stored.expiresAt) {
      otpStore.delete(cleanEmail);
      res.status(400).json({ error: 'OTP has expired. Please request a new code.' });
      return;
    }

    if (stored.attempts >= 5) {
      otpStore.delete(cleanEmail);
      res.status(429).json({ error: 'Too many incorrect attempts. Please request a new OTP.' });
      return;
    }

    if (stored.otp !== cleanOtp) {
      stored.attempts += 1;
      res.status(400).json({ error: 'Invalid verification code. Please check your email and try again.' });
      return;
    }

    
    stored.verified = true;

    await logAction('Verify OTP', 'Public', `Email ${cleanEmail} successfully verified via OTP`, 'System');

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!',
    });
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Failed to verify OTP', details: error.message });
  }
};
