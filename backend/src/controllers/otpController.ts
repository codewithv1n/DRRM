import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';
import { logAction } from './auditLogController';

interface StoredOtp {
  otp: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
}

const otpStore: Map<string, StoredOtp> = new Map();

const sendViaBrevo = async (to: string, subject: string, html: string, senderName: string = 'GovServe DRRM Helpline 122') => {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured in environment variables.');
  }

  const fromEmail = process.env.EMAIL_USER;
  if (!fromEmail) {
    throw new Error('EMAIL_USER is not configured in environment variables.');
  }

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      sender: { name: senderName, email: fromEmail },
      to: [{ email: to }],
      subject: subject,
      htmlContent: html,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Brevo API error: ${JSON.stringify(err)}`);
  }

  return true;
};


export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, type } = req.body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({ error: 'A valid email address is required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    
    if (type === 'login' || type === 'forgot_password') {
      const userCheck = await pool.query('SELECT auth_id FROM auth WHERE email = $1', [cleanEmail]);
      if (userCheck.rows.length === 0) {
        res.status(404).json({ error: 'Email address not found in our records.' });
        return;
      }
    }

    const existing = otpStore.get(cleanEmail);
    if (existing && existing.expiresAt - Date.now() > 1.5 * 60 * 1000) {
      res.status(429).json({ error: 'Please wait 30 seconds before requesting another code.' });
      return;
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 2 * 60 * 1000;

    const emailSubject = `${otpCode} is your GovServe DRRM Verification Code`;
    
    let emailHtml = '';

    if (type === 'login') {
      emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">GovServe DRRM</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Secure Login Authentication</p>
          </div>
          <div style="padding: 28px 24px;">
            <h2 style="font-size: 16px; color: #0f172a; margin-top: 0; margin-bottom: 8px; font-weight: 700;">Login Verification Code</h2>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
              You are attempting to log in to the GovServe DRRM system. Please enter this 6-digit verification code to authenticate your account:
            </p>
            <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 20px;">
              <span style="font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #1d4ed8; font-family: monospace;">${otpCode}</span>
              <div style="font-size: 11px; color: #64748b; margin-top: 6px; font-weight: 600;">Valid for 2 minutes</div>
            </div>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
              ⚠️ If you did not attempt to log in, please secure your account immediately and ignore this email. Do not share this code with anyone.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
            GovServe DRRM • Security Team
          </div>
        </div>
      `;
    } else if (type === 'forgot_password') {
      emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">GovServe DRRM</h1>
            <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Account Recovery</p>
          </div>
          <div style="padding: 28px 24px;">
            <h2 style="font-size: 16px; color: #0f172a; margin-top: 0; margin-bottom: 8px; font-weight: 700;">Password Reset Code</h2>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
              You have requested to reset your password. Please enter this 6-digit verification code to proceed:
            </p>
            <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 18px; text-align: center; margin-bottom: 20px;">
              <span style="font-size: 34px; font-weight: 900; letter-spacing: 6px; color: #1d4ed8; font-family: monospace;">${otpCode}</span>
              <div style="font-size: 11px; color: #64748b; margin-top: 6px; font-weight: 600;">Valid for 2 minutes</div>
            </div>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
              ⚠️ If you did not request a password reset, please secure your account and ignore this email.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
            GovServe DRRM • Security Team
          </div>
        </div>
      `;
    } else {
      emailHtml = `
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
              <div style="font-size: 11px; color: #64748b; margin-top: 6px; font-weight: 600;">Valid for 2 minutes</div>
            </div>
            <p style="font-size: 12px; color: #94a3b8; line-height: 1.5; margin: 0;">
              ⚠️ If you did not request this verification code, please ignore this email. Do not share this code with anyone.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 14px 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
            GovServe DRRM • Helpline 122
          </div>
        </div>
      `;
    }

    const senderName = type === 'login' ? 'GovServe DRRM Login OTP' : type === 'forgot_password' ? 'GovServe DRRM Password Reset' : 'GovServe DRRM Helpline 122';
    await sendViaBrevo(cleanEmail, emailSubject, emailHtml, senderName);
    console.log(`[Brevo] OTP email sent successfully to ${cleanEmail}`);

    otpStore.set(cleanEmail, {
      otp: otpCode,
      expiresAt,
      attempts: 0,
      verified: false,
    });

    await logAction('Send OTP', 'Public', `Dispatched OTP email to ${cleanEmail}`, 'System');

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email inbox',
    });
  } catch (error: any) {
    console.error('[Email Send Error]:', error);
    res.status(500).json({
      error: `Failed to deliver email: ${error.message || 'Email service error'}`,
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

export const sendDonationThankYouEmail = async (email: string, fullName: string, type: string, quantity: number) => {
  if (!email || !email.includes('@')) return false;
  
  const cleanEmail = email.trim().toLowerCase();
  const subject = 'Thank You for Your Donation - GovServe DRRM';
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);">
      <div style="background: linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%); padding: 28px 24px; text-align: center; color: #ffffff;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px;">GovServe DRRM</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Relief & Donations</p>
      </div>
      <div style="padding: 28px 24px;">
        <h2 style="font-size: 16px; color: #0f172a; margin-top: 0; margin-bottom: 8px; font-weight: 700;">Thank you, ${fullName}!</h2>
        <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 20px;">
          We have received your donation request. Your kindness and generosity will go a long way in helping families affected by disasters.
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-bottom: 20px;">
          <h3 style="font-size: 12px; font-weight: 700; color: #64748b; margin-top: 0; margin-bottom: 8px; text-transform: uppercase;">Donation Details</h3>
          <p style="margin: 0; font-size: 14px; color: #0f172a;"><strong>Type:</strong> ${type}</p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #0f172a;"><strong>Quantity:</strong> ${quantity}</p>
        </div>
        <p style="font-size: 13px; color: #475569; line-height: 1.6; margin-bottom: 0;">
          Our logistics team will contact you shortly regarding the collection or drop-off of your donation. Stay safe!
        </p>
      </div>
      <div style="background-color: #f1f5f9; padding: 14px 20px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b;">
        GovServe DRRM • Donation Desk
      </div>
    </div>
  `;

  try {
    await sendViaBrevo(cleanEmail, subject, html, 'GovServe DRRM Donations');
    console.log(`[Brevo] Donation thank you email sent successfully to ${cleanEmail}`);
    return true;
  } catch (error) {
    console.error('[Email Send Error]:', error);
    return false;
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400).json({ error: 'Email, OTP, and new password are required' });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const stored = otpStore.get(cleanEmail);

    if (!stored || !stored.verified || stored.otp !== otp.toString().trim()) {
      res.status(403).json({ error: 'Unauthorized: OTP verification failed or expired.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await pool.query(
      'UPDATE auth SET password = $1 WHERE email = $2 RETURNING auth_id, role',
      [hashedPassword, cleanEmail]
    );

    if (result.rowCount === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Clear OTP after successful reset
    otpStore.delete(cleanEmail);

    await logAction('Reset Password', result.rows[0].role || 'Public', `User ${cleanEmail} reset their password`, 'System');

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now log in.',
    });
  } catch (error: any) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'Failed to reset password', details: error.message });
  }
};
