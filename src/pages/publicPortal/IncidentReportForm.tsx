import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EmergencyType } from '../../data/types';
import { encryptedFetch } from '../../utils/encryptedFetch';

const API_URL = import.meta.env.VITE_API_URL;
import {
  AlertCircle,
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
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';


const generateCaptchaText = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};


const drawCaptcha = (canvas: HTMLCanvasElement, text: string) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, width, height);

  
  for (let i = 0; i < 6; i++) {
    ctx.strokeStyle = `hsl(${Math.random() * 360}, 40%, 75%)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.lineTo(Math.random() * width, Math.random() * height);
    ctx.stroke();
  }

  
  for (let i = 0; i < 30; i++) {
    ctx.fillStyle = `hsl(${Math.random() * 360}, 30%, 70%)`;
    ctx.beginPath();
    ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  const fontSize = 28;
  ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
  ctx.textBaseline = 'middle';

  const startX = 20;
  const charSpacing = (width - 40) / text.length;

  for (let i = 0; i < text.length; i++) {
    ctx.save();
    const x = startX + i * charSpacing + charSpacing / 2;
    const y = height / 2 + (Math.random() * 10 - 5);
    const rotation = (Math.random() - 0.5) * 0.5;

    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.fillStyle = `hsl(${210 + Math.random() * 40}, ${60 + Math.random() * 30}%, ${25 + Math.random() * 15}%)`;
    ctx.fillText(text[i], -fontSize / 4, 0);
    ctx.restore();
  }

  
  for (let i = 0; i < 3; i++) {
    ctx.strokeStyle = `hsla(${Math.random() * 360}, 50%, 60%, 0.4)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(Math.random() * width, Math.random() * height);
    ctx.bezierCurveTo(
      Math.random() * width, Math.random() * height,
      Math.random() * width, Math.random() * height,
      Math.random() * width, Math.random() * height
    );
    ctx.stroke();
  }
};
export default function IncidentReportForm() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<'FORM' | 'PHOTO_VALIDATION' | 'SUCCESS'>('FORM');

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
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

 
  const refreshCaptcha = useCallback(() => {
    const newText = generateCaptchaText();
    setCaptchaText(newText);
    setCaptchaInput('');
    setCaptchaError(false);
 
    setTimeout(() => {
      if (canvasRef.current) {
        drawCaptcha(canvasRef.current, newText);
      }
    }, 0);
  }, []);

  useEffect(() => {
    if (step === 'FORM') {
      refreshCaptcha();
    }
  }, [step, refreshCaptcha]);

  const handleCaptchaInputChange = (value: string) => {
    setCaptchaInput(value);
    setCaptchaError(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'contactNumber') {
      const numericValue = value.replace(/\D/g, '');
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          let address = 'Auto-detected';
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            const data = await res.json();
            if (data && data.display_name) {
              const parts = data.display_name.split(', ');
              address = parts.length > 3 ? parts.slice(0, 3).join(', ') : data.display_name;
            }
          } catch (e) {
            console.warn('Reverse geocoding failed', e);
          }

          setFormData((prev) => ({
            ...prev,
            location: `${lat.toFixed(4)} N, ${lon.toFixed(4)} E (${address})`,
          }));
          setIsLocating(false);
        },
        (error) => {
          setIsLocating(false);
          let errorMsg = 'Unable to retrieve your location. Please type your location manually.';
          if (error.code === error.PERMISSION_DENIED) {
            errorMsg = 'Location access was denied. Please enable location permissions in your browser.';
          }
          alert(errorMsg);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const submitIncidentReport = async () => {
    const finalType = formData.type === 'Other' && otherType.trim() ? otherType : formData.type;

    const payload = new FormData();
    payload.append('reporterName', formData.reporterName);
    payload.append('contactNumber', formData.contactNumber);
    payload.append('reporterEmail', formData.email);
    payload.append('email', formData.email);
    payload.append('location', formData.location);
    payload.append('type', finalType);
    payload.append('isVerified', 'true'); 
    payload.append('spamScore', hasPhoto ? '0.05' : '0.1');
    payload.append('deviceIp', '192.168.1.5');

    if (photoFile) {
      payload.append('photo', photoFile);
    }

    try {
      const response = await encryptedFetch(`${API_URL}/api/8d72f1a6-2c98-4f3b-a9b1-54c3e80d7e6f`, {
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

  // Handle form submission with reCAPTCHA verification
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate CAPTCHA on submit
    if (captchaInput !== captchaText) {
      setCaptchaError(true);
      return;
    }

    setIsSubmitting(true);

    try {
      if (hasPhoto) {
        setStep('PHOTO_VALIDATION');
        setTimeout(() => {
          submitIncidentReport();
        }, 1800);
      } else {
        await submitIncidentReport();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
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
      
        <div className="bg-linear-to-r from-blue-700 to-blue-600 p-6 text-center text-white relative">
          {step === 'FORM' && (
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors cursor-pointer flex items-center justify-center"
              title="Go Back"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}

          <div className="inline-flex p-3 bg-white/10 rounded-2xl mb-2 backdrop-blur-sm">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Helpline 122</h1>
          <p className="text-blue-100 text-xs font-medium mt-1">GovServe Emergency Incident Reporting Portal</p>
        </div>

        
        {step === 'FORM' && (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
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
                    maxLength={11}
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                    placeholder="09123456789"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Email Address <span className="text-red-500">*</span>
                </label>
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
            </div>

            
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
                    disabled={isLocating}
                    className="flex items-center justify-center px-3.5 py-2.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                    title="Use Current Location"
                  >
                    {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Upload Photo <span className="text-slate-400 font-normal lowercase">(optional)</span>
                </label>
                {!hasPhoto ? (
                  <div className="w-full">
                    <label className="flex items-center justify-center gap-2 py-2.5 px-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 hover:border-blue-500/50 hover:text-blue-600 hover:bg-blue-50/50 cursor-pointer transition-all w-full">
                      <Upload className="w-4 h-4" />
                      <span className="text-xs font-semibold">Upload Photo</span>
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

            {/* Custom CAPTCHA Human Verification */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Human Verification <span className="text-red-500">*</span>
              </label>
              <div className={`p-4 rounded-2xl border-2 transition-all ${
                captchaError ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-slate-50/30'
              }`}>
                <div className="flex flex-col items-center gap-3">
                  {/* CAPTCHA Canvas */}
                  <div className="flex items-center gap-2">
                    <canvas
                      ref={canvasRef}
                      width={220}
                      height={60}
                      className="rounded-xl border border-slate-200 shadow-inner"
                      style={{ imageRendering: 'auto' }}
                    />
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                      title="Generate new CAPTCHA"
                    >
                      <RefreshCw className="w-4 h-4 text-slate-500" />
                    </button>
                  </div>

                  {/* CAPTCHA Input */}
                  <div className="w-full max-w-55">
                    <input
                      type="text"
                      value={captchaInput}
                      onChange={(e) => handleCaptchaInputChange(e.target.value)}
                      placeholder="Type the letters above"
                      maxLength={6}
                      className={`block w-full px-3.5 py-2 text-center text-sm font-bold tracking-widest border rounded-xl transition-all ${
                        captchaError
                          ? 'border-red-300 bg-red-50 text-red-700 focus:ring-red-500/20'
                          : 'border-slate-200 bg-white text-slate-800 focus:ring-blue-500/20'
                      } focus:ring-2 focus:outline-none`}
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>

                  {captchaError && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Incorrect code. Please type the letters shown above.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Submitting Report...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Emergency Report</span>
                    <ShieldCheck className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        
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
              <ShieldCheck className="w-3.5 h-3.5" /> CAPTCHA Verified • Anti-Abuse Active
            </div>
          </div>
        )}

        
        {step === 'SUCCESS' && (
          <div className="p-10 text-center flex flex-col items-center bg-linear-to-b from-emerald-50/50 to-white">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-black text-2xl text-slate-900">Incident Report Dispatched!</h3>
            <p className="text-sm text-slate-600 mt-2 max-w-md leading-relaxed">
              Your report has been verified and transmitted directly to the Quezon City Emergency Command Center. Response units have been notified.
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

