import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EmergencyType } from '../../data/mockData';

const API_URL = import.meta.env.VITE_API_URL;

import {
  AlertCircle,
  Camera,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  Mail,
  Loader2,
  Flame,
  Droplets,
  Activity,
  AlertTriangle,
  Navigation,
  ArrowLeft,
  Upload,
  Mountain,
  HelpCircle,
  KeyRound,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

export default function IncidentReportForm() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<'FORM' | 'OTP_VERIFICATION' | 'PHOTO_VALIDATION' | 'SUCCESS'>('FORM');

  const [formData, setFormData] = useState({
    reporterName: '',
    contactNumber: '',
    email: '',
    location: '',
    type: 'Fire' as EmergencyType,
  });

  const [otherType, setOtherType] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  // OTP State
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Resend timer countdown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            location: `${position.coords.latitude.toFixed(4)} N, ${position.coords.longitude.toFixed(4)} E (Auto-detected)`,
          }));
        },
        () => {
          alert('Unable to retrieve your location. Please type your location manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Request OTP and transition to OTP screen
  const handleInitiateOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.email.includes('@')) {
      alert('Please provide a valid email address for OTP verification.');
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'incident' }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep('OTP_VERIFICATION');
        setResendCooldown(60);
        setOtpValues(['', '', '', '', '', '']);
      } else {
        setOtpError(data.error || 'Failed to send OTP code. Please check your email.');
      }
    } catch (err) {
      console.error('Error sending OTP:', err);
      setOtpError('Cannot connect to server. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || otpLoading) return;
    setOtpLoading(true);
    setOtpError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, type: 'incident' }),
      });
      const data = await res.json();
      if (res.ok) {
        setResendCooldown(60);
      } else {
        setOtpError(data.error || 'Failed to resend OTP.');
      }
    } catch (err) {
      setOtpError('Failed to resend code.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Handle OTP digit box input
  const handleOtpBoxChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
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

  // Final incident submission
  const submitIncidentReport = async () => {
    const finalType = formData.type === 'Other' && otherType.trim() ? otherType : formData.type;

    const payload = new FormData();
    payload.append('reporterName', formData.reporterName);
    payload.append('contactNumber', formData.contactNumber);
    payload.append('reporterEmail', formData.email);
    payload.append('email', formData.email);
    payload.append('location', formData.location);
    payload.append('type', finalType);
    payload.append('isVerified', 'true'); // Email verified via OTP!
    payload.append('spamScore', hasPhoto ? '0.05' : '0.1');
    payload.append('deviceIp', '192.168.1.5');

    if (photoFile) {
      payload.append('photo', photoFile);
    }

    try {
      const response = await fetch(`${API_URL}/api/incidents`, {
        method: 'POST',
        body: payload,
      });

      if (response.ok) {
        setStep('SUCCESS');
        setShowSuccess(true);
        setFormData({ reporterName: '', contactNumber: '', email: '', location: '', type: 'Fire' });
        setOtherType('');
        setHasPhoto(false);
        setPhotoFile(null);

        setTimeout(() => {
          setShowSuccess(false);
          setStep('FORM');
        }, 5000);
      } else {
        alert('Failed to submit incident report. Please try again.');
        setStep('FORM');
      }
    } catch (error) {
      console.error('Error submitting incident:', error);
      alert('An error occurred while submitting your report. Please try again.');
      setStep('FORM');
    }
  };

  // Verify OTP code
  const handleVerifyOtpAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');

    if (fullOtp.length !== 6) {
      setOtpError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setOtpLoading(true);
    setOtpError(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp: fullOtp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (hasPhoto) {
          setStep('PHOTO_VALIDATION');
          setTimeout(() => {
            submitIncidentReport();
          }, 1800);
        } else {
          submitIncidentReport();
        }
      } else {
        setOtpError(data.error || 'Invalid verification code. Please try again.');
      }
    } catch (err) {
      setOtpError('Connection error. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Toast Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3.5 rounded-xl shadow-xl flex items-center gap-3 z-50 transition-all duration-300 animate-fade-in-down border border-emerald-400">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <div>
            <div className="font-bold text-sm">Verified Report Dispatched!</div>
            <div className="text-xs text-emerald-100">Helpline 122 response units have been notified.</div>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-700 to-blue-600 p-6 text-center text-white relative">
          {step === 'FORM' ? (
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : step === 'OTP_VERIFICATION' ? (
            <button
              onClick={() => setStep('FORM')}
              className="absolute left-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              title="Edit Form"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          ) : null}

          <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-2 backdrop-blur-sm">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Helpline 122</h1>
          <p className="text-blue-100 text-xs font-medium mt-1">Quezon City Emergency Incident Reporting Portal</p>
        </div>

        {/* STEP 1: INCIDENT FORM */}
        {step === 'FORM' && (
          <form onSubmit={handleInitiateOtp} className="p-6 md:p-8 space-y-6">
            {/* Row 1: Name & Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    name="reporterName"
                    required
                    value={formData.reporterName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    name="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                    placeholder="0912 345 6789"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> OTP Verification Required
                </span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                  placeholder="name@example.com"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                A 6-digit verification code will be sent to this email to prevent spam and verify your report.
              </p>
            </div>

            {/* Row 3: Location and Photo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Exact Location <span className="text-red-500">*</span>
                </label>
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                      placeholder="Brgy, Street, Landmark"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="flex items-center justify-center px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl transition-colors cursor-pointer"
                    title="Use Current Location"
                  >
                    <Navigation className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Upload Photo <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                {!hasPhoto ? (
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center justify-center gap-2 py-2.5 px-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 hover:border-blue-500/50 hover:text-blue-600 hover:bg-blue-50/50 cursor-pointer transition-all">
                      <Camera className="w-4 h-4" />
                      <span className="text-xs font-semibold">Camera</span>
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setPhotoFile(e.target.files[0]);
                            setHasPhoto(true);
                          }
                        }}
                      />
                    </label>
                    <label className="flex items-center justify-center gap-2 py-2.5 px-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 hover:border-blue-500/50 hover:text-blue-600 hover:bg-blue-50/50 cursor-pointer transition-all">
                      <Upload className="w-4 h-4" />
                      <span className="text-xs font-semibold">Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setPhotoFile(e.target.files[0]);
                            setHasPhoto(true);
                          }
                        }}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="w-full flex items-center justify-between px-3.5 py-2.5 border border-emerald-300 bg-emerald-50/70 text-emerald-800 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold truncate max-w-32.5">
                        {photoFile?.name || 'Photo Attached'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setHasPhoto(false);
                        setPhotoFile(null);
                      }}
                      className="text-emerald-700 hover:text-emerald-900 text-xs font-bold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Row 4: Emergency Type Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Emergency Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { type: 'Fire', icon: Flame, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
                  { type: 'Flood', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
                  { type: 'Medical', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                  { type: 'Earthquake', icon: Mountain, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
                  { type: 'Road Obstruction', icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
                  { type: 'Other', icon: HelpCircle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
                ].map((em) => {
                  const isSelected = formData.type === em.type;
                  const Icon = em.icon;
                  return (
                    <button
                      key={em.type}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, type: em.type as EmergencyType }))}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                        isSelected
                          ? `border-blue-600 bg-blue-50/50 shadow-sm shadow-blue-500/10`
                          : `border-slate-100 bg-slate-50/30 hover:border-slate-200 hover:bg-slate-50`
                      }`}
                    >
                      <div className={`p-2 rounded-xl mb-1.5 ${isSelected ? em.bg : 'bg-white shadow-xs'}`}>
                        <Icon className={`w-5 h-5 ${isSelected ? em.color : 'text-slate-400'}`} />
                      </div>
                      <span className={`text-xs font-bold text-center ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                        {em.type}
                      </span>
                    </button>
                  );
                })}
              </div>

              {formData.type === 'Other' && (
                <div className="mt-3 animate-fade-in">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Please specify emergency type</label>
                  <input
                    type="text"
                    required
                    value={otherType}
                    onChange={(e) => setOtherType(e.target.value)}
                    className="block w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    placeholder="e.g., Gas Leak, Fallen Tree, Power Outage..."
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={otpLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending Verification Code...</span>
                  </>
                ) : (
                  <>
                    <span>Proceed to Verification</span>
                    <ShieldCheck className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP VERIFICATION SCREEN */}
        {step === 'OTP_VERIFICATION' && (
          <div className="p-6 md:p-8 animate-fade-in">
            <div className="text-center max-w-md mx-auto mb-6">
              <div className="inline-flex p-3 bg-blue-50 text-blue-600 rounded-2xl mb-3">
                <KeyRound className="w-7 h-7" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Verify Your Email</h2>
              <p className="text-sm text-slate-500 mt-1">
                We sent a 6-digit verification code to:
              </p>
              <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 font-bold px-3 py-1 rounded-lg text-xs mt-2">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{formData.email}</span>
              </div>
            </div>

            {otpError && (
              <div className="max-w-md mx-auto mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtpAndSubmit} className="max-w-md mx-auto space-y-6">
              {/* 6 Digit Input Boxes */}
              <div>
                <div className="flex justify-center gap-2.5 sm:gap-3">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={digit}
                      onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      autoFocus={idx === 0}
                      className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-extrabold bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all"
                    />
                  ))}
                </div>
                <p className="text-center text-xs text-slate-400 mt-3">
                  Please check your inbox or spam folder.
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={otpLoading || otpValues.join('').length !== 6}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Submit Report</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Resend & Back controls */}
              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => setStep('FORM')}
                  className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  ← Edit Information
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendCooldown > 0 || otpLoading}
                  className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${otpLoading ? 'animate-spin' : ''}`} />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: PHOTO VALIDATION (Simulated Anti-Abuse Scanner) */}
        {step === 'PHOTO_VALIDATION' && (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl mb-4">
              <Loader2 className="w-10 h-10 animate-spin" />
            </div>
            <h3 className="font-bold text-lg text-slate-800">Verifying Photo Authenticity</h3>
            <p className="text-xs text-slate-500 mt-2 max-w-sm">
              Analyzing photo metadata, timestamp, and location tags to confirm emergency report validity...
            </p>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> Email OTP Verified • Anti-Abuse Active
            </div>
          </div>
        )}

        {/* STEP 4: SUCCESS CONFIRMATION */}
        {step === 'SUCCESS' && (
          <div className="p-10 text-center flex flex-col items-center bg-linear-to-b from-emerald-50/50 to-white">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-black text-2xl text-slate-900">Incident Report Dispatched!</h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md leading-relaxed">
              Your report has been verified via OTP and transmitted directly to the Quezon City Emergency Command Center. Response units have been notified.
            </p>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-2xl w-full max-w-sm text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Status:</span>
                <span className="font-bold text-emerald-600 uppercase">Verified & Dispatched</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Emergency Line:</span>
                <span className="font-bold text-slate-800">Helpline 122</span>
              </div>
            </div>

            <button
              onClick={() => {
                setShowSuccess(false);
                setStep('FORM');
              }}
              className="mt-6 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Submit Another Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
