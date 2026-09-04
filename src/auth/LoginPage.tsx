import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, KeyRound, AlertCircle, Loader2, ArrowLeft, ShieldCheck, RefreshCw } from 'lucide-react';
import ForgotPasswordForm from './ForgotPasswordForm';

import { encryptedFetch } from '../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'LOGIN' | 'OTP_VERIFICATION' | 'FORGOT_PASSWORD'>('LOGIN');

  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tempUser, setTempUser] = useState<any>(null);

  
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr && step === 'LOGIN') {
      try {
        const user = JSON.parse(userStr);
        routeUser(user.role);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, [navigate, step]);

  const routeUser = (role: string) => {
    if (role === 'System Admin' || role === 'Admin') {
        navigate('/admin', { replace: true, state: { loginSuccess: true } });
    } else if (role === 'Barangay Admin') {
        navigate('/barangays', { replace: true, state: { loginSuccess: true } });
    } else if (role === 'Responder') {
        navigate('/responders', { replace: true });
    } else if (role === 'Citizen') {
        navigate('/citizen', { replace: true, state: { loginSuccess: true } });
    } else {
        setError('Unrecognized user role');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
        const response = await encryptedFetch(`${API_URL}/api/a2d8e3f9-715c-4d32-98ab-eb54cd8c21a3/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: username,
                password: password
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.error || 'Invalid credentials');
            setIsLoading(false);
            return;
        }

        const data = await response.json();
        const user = data.user;
        
        
        setTempUser(user);

        
        const otpRes = await encryptedFetch(`${API_URL}/api/a2d8e3f9-715c-4d32-98ab-eb54cd8c21a3/send-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, type: 'login' }),
        });

        const otpData = await otpRes.json();

        if (otpRes.ok) {
          setStep('OTP_VERIFICATION');
          setResendCooldown(60);
          setOtpValues(['', '', '', '', '', '']);
        } else {
          setError(otpData.error || 'Failed to send OTP code to your email. Ensure your email is valid.');
        }
        setIsLoading(false);
    } catch (err) {
        console.error('Login failed:', err);
        setError('Failed to connect to the server');
        setIsLoading(false);
    }
  };

  
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || otpLoading || !tempUser) return;
    setOtpLoading(true);
    setOtpError(null);

    try {
      const res = await encryptedFetch(`${API_URL}/api/a2d8e3f9-715c-4d32-98ab-eb54cd8c21a3/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempUser.email, type: 'login' }),
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
      const res = await encryptedFetch(`${API_URL}/api/a2d8e3f9-715c-4d32-98ab-eb54cd8c21a3/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempUser.email, otp: fullOtp }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
       
        localStorage.setItem('user', JSON.stringify(tempUser));
        routeUser(tempUser.role);
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
    <div className="min-h-screen flex w-full font-sans">
      
      
      <div className="hidden lg:flex w-1/2 flex-col justify-between py-10 px-12 bg-[#0B1526] text-white relative overflow-hidden">
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,52,89,0.4)_0%,transparent_70%)] pointer-events-none z-0"></div>

       
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <img 
            src="/logo-system.png" 
            alt="System Logo" 
            className="object-contain opacity-[0.12]"
            style={{ width: '520px', height: '520px' }}
          />
        </div>
        
       
        <div className="relative z-10">
          <h2 className="text-[20px] font-extrabold text-white mb-1 tracking-tight">Disaster Risk Reduction & Emergency Response</h2>
          <p className="text-[12px] text-white/60 font-medium">Republic of the Philippines • Local Government Unit</p>
        </div>

       
        <div className="w-full relative z-10 flex flex-col items-center text-center mx-auto mt-auto mb-auto" style={{ maxWidth: '500px' }}>
          <h1 className="text-[44px] font-extrabold mb-6 leading-[1.1] tracking-tight text-white">
            Disaster and <br/>
            Emergency Response
          </h1>
          <p className="text-white/70 text-[14px] leading-relaxed mx-auto font-normal" style={{ maxWidth: '420px' }}>
            A centralized digital platform for securely managing local government disaster response, incident reports, and evacuation records.
          </p>
        </div>
      </div>

      
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#FAFAFA] relative">
        {(step === 'OTP_VERIFICATION' || step === 'FORGOT_PASSWORD') && (
          <button
            onClick={() => setStep('LOGIN')}
            className="absolute left-8 top-8 p-2.5 bg-white shadow-sm border border-slate-200 text-slate-500 hover:text-slate-700 rounded-full transition-colors cursor-pointer flex items-center justify-center z-10"
            title="Go Back to Login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="w-full max-w-120 px-8">
          <div className="bg-white px-8 py-10 rounded-2xl border border-slate-100">
            
            {step === 'LOGIN' ? (
              <>
                <div className="text-left mb-8">
                  <h2 className="text-[20px] font-bold text-[#0F172A] mb-1.5 tracking-tight">Welcome Back</h2>
                  <p className="text-slate-500 text-[11px] font-medium">Sign in to access your disaster management dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4 animate-fade-in">
                  {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold text-center border border-red-100 flex items-center gap-2 justify-center">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all bg-white"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                      <button type="button" onClick={() => setStep('FORGOT_PASSWORD')} className="text-[10px] font-semibold text-[#2563EB] hover:text-blue-700 cursor-pointer">Forgot password?</button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-4 py-3 border border-slate-200/80 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all bg-white"
                        placeholder="•••••••••••••••••••••••••••••"
                      />
                    </div>
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm text-sm flex justify-center items-center min-h-11 ${isLoading ? 'opacity-80 cursor-not-allowed!' : ''}`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </div>
                </form>
              
                <div className="mt-8 text-center text-[12px] font-medium text-slate-500">
                  <span className="text-slate-400">Not registered? </span>
                  <button 
                    onClick={() => navigate('/signup')} 
                    className="text-[#2563EB] font-bold hover:underline cursor-pointer ml-1"
                  >
                    Create a Citizen Account
                  </button>
                </div>
              </>
            ) : step === 'FORGOT_PASSWORD' ? (
              <ForgotPasswordForm onBack={() => setStep('LOGIN')} />
            ) : (
             
              <div className="animate-fade-in text-center">
                <div className="inline-flex p-3 bg-blue-50 text-[#2563EB] rounded-2xl mb-4">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h2 className="text-[20px] font-bold text-[#0F172A] mb-1.5 tracking-tight">Security Verification</h2>
                <p className="text-slate-500 text-[12px] font-medium mb-1">
                  We sent a 6-digit authentication code to:
                </p>
                <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg text-xs mb-6">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{tempUser?.email}</span>
                </div>

                {otpError && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 text-xs font-bold rounded-xl flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{otpError}</span>
                  </div>
                )}

                <form onSubmit={handleVerifyOtpAndSubmit} className="space-y-6">
                  <div>
                    <div className="flex justify-center gap-2 sm:gap-3">
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
                          className="w-10 h-12 sm:w-11 sm:h-13 text-center text-xl font-extrabold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 focus:outline-none transition-all"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={otpLoading || otpValues.join('').length !== 6}
                    className="w-full bg-[#2563EB] hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-sm text-sm"
                  >
                    {otpLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify & Login</span>
                        <ShieldCheck className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-8 text-center border-t border-slate-100 pt-6">
                  <p className="text-[11px] text-slate-500 mb-2">Didn't receive the code?</p>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || otpLoading}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${otpLoading && resendCooldown === 0 ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend available in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
