import React, { useState, useRef, useEffect } from 'react';
import { Mail, KeyRound, AlertCircle, Loader2, CheckCircle2, Lock } from 'lucide-react';

import { encryptedFetch } from '../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

interface ForgotPasswordFormProps {
  onBack: () => void;
}

export default function ForgotPasswordForm({ onBack }: ForgotPasswordFormProps) {
  const [step, setStep] = useState<'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS'>('EMAIL');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await encryptedFetch(`${API_URL}/api/otp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'forgot_password' })
      });
      const data = await res.json();
      if (res.ok) {
        setStep('OTP');
        setResendCooldown(60);
      } else {
        setError(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpBoxChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      const updated = [...otpValues];
      pasted.forEach((char, idx) => {
        if (idx < 6) updated[idx] = char;
      });
      setOtpValues(updated);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const digit = value.replace(/\D/g, '');
    const updated = [...otpValues];
    updated[index] = digit;
    setOtpValues(updated);

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');
    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await encryptedFetch(`${API_URL}/api/otp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: fullOtp })
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setStep('NEW_PASSWORD');
      } else {
        setError(data.error || 'Invalid verification code.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const fullOtp = otpValues.join('');
      const res = await encryptedFetch(`${API_URL}/api/otp/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: fullOtp, newPassword })
      });
      const data = await res.json();

      if (res.ok) {
        setStep('SUCCESS');
      } else {
        setError(data.error || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-fade-in text-center w-full relative">

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {step === 'EMAIL' && (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="inline-flex p-3 bg-blue-50 text-[#2563EB] rounded-2xl mb-2">
            <Mail className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-1.5 tracking-tight">Forgot Password</h2>
            <p className="text-slate-500 text-[12px] font-medium px-4">
              Enter your email address and we'll send you a code to reset your password.
            </p>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all bg-white"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:opacity-80 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm text-sm flex justify-center items-center h-11"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Verification Code'}
          </button>
        </form>
      )}

      {step === 'OTP' && (
        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div className="inline-flex p-3 bg-blue-50 text-[#2563EB] rounded-2xl mb-2">
            <KeyRound className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-1.5 tracking-tight">Verify Your Email</h2>
            <p className="text-slate-500 text-[12px] font-medium mb-1">
              We sent a 6-digit verification code to:
            </p>
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs mt-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{email}</span>
            </div>
          </div>

          <div className="flex justify-center gap-2 sm:gap-3">
            {otpValues.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { otpInputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={digit}
                onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                autoFocus={idx === 0}
                className="w-10 h-12 sm:w-11 sm:h-13 text-center text-xl font-extrabold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otpValues.join('').length !== 6}
            className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex justify-center items-center cursor-pointer disabled:cursor-not-allowed shadow-sm text-sm"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify Code'}
          </button>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <p className="text-[11px] text-slate-500 mb-2">Didn't receive the code?</p>
            <button
              type="button"
              onClick={() => handleSendOtp()}
              disabled={resendCooldown > 0 || isLoading}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>
        </form>
      )}

      {step === 'NEW_PASSWORD' && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="inline-flex p-3 bg-blue-50 text-[#2563EB] rounded-2xl mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#0F172A] mb-1.5 tracking-tight">Set New Password</h2>
            <p className="text-slate-500 text-[12px] font-medium px-4">
              Enter your new password below to regain access to your account.
            </p>
          </div>

          <div className="space-y-1.5 text-left pt-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all bg-white"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-1.5 text-left">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all bg-white"
                placeholder="••••••••••••••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:opacity-80 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm text-sm flex justify-center items-center h-11 mt-4"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reset Password'}
          </button>
        </form>
      )}

      {step === 'SUCCESS' && (
        <div className="space-y-6">
          <div className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full mb-2">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h2 className="text-[24px] font-bold text-[#0F172A] mb-2 tracking-tight">Password Reset!</h2>
            <p className="text-slate-500 text-sm">
              Your password has been successfully reset. You can now log in with your new credentials.
            </p>
          </div>
          <button
            onClick={onBack}
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm text-sm"
          >
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
