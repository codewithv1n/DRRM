import React, { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import type { EmergencyType } from '../../data/mockData';
import { AlertCircle, Camera, CheckCircle2, MapPin, Phone, User, ShieldAlert, Loader2, CheckSquare, Square, Search } from 'lucide-react';

export default function IncidentReportForm() {
  const { addIncident } = useMockData();
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<'FORM' | 'PHOTO_VALIDATION' | 'OTP' | 'SUCCESS'>('FORM');
  
  const [formData, setFormData] = useState({
    reporterName: '',
    contactNumber: '',
    location: '',
    type: 'Fire' as EmergencyType,
  });

  const [hasPhoto, setHasPhoto] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [otp, setOtp] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) {
        alert("Please verify you are human (CAPTCHA).");
        return;
    }

    if (hasPhoto) {
        setStep('PHOTO_VALIDATION');
        setTimeout(() => {
            setStep('OTP');
        }, 2000); // Simulate metadata validation
    } else {
        setStep('OTP');
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '1234') {
        alert("Invalid OTP. For demo purposes, use 1234.");
        return;
    }

    addIncident({
        ...formData,
        isVerified: hasPhoto, // Verified if photo metadata matched
        gpsLocation: hasPhoto ? '14.6760 N, 121.0437 E' : undefined,
        deviceIp: '192.168.1.5',
        spamScore: hasPhoto ? 0.05 : 0.4
    });

    setStep('SUCCESS');
    setShowSuccess(true);
    setFormData({ reporterName: '', contactNumber: '', location: '', type: 'Fire' });
    setHasPhoto(false);
    setCaptchaVerified(false);
    setOtp('');
    
    setTimeout(() => {
      setShowSuccess(false);
      setStep('FORM');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Toast Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 transition-all duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Verified Report Submitted to QC EOC</span>
        </div>
      )}

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-primary p-6 text-center text-white">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h1 className="text-2xl font-bold">QC DRRM Helpline 122</h1>
          <p className="text-orange-100 text-sm mt-1">Emergency Incident Report</p>
        </div>

        {step === 'FORM' && (
            <form onSubmit={handleInitialSubmit} className="p-6 space-y-5">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    name="reporterName"
                    required
                    value={formData.reporterName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary/20 focus:border-primary text-sm transition-colors"
                    placeholder="Juan Dela Cruz"
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="tel"
                    name="contactNumber"
                    required
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary/20 focus:border-primary text-sm transition-colors"
                    placeholder="0912 345 6789"
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exact Location</label>
                <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary/20 focus:border-primary text-sm transition-colors"
                    placeholder="Brgy, Street, Landmark"
                />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Type</label>
                <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-primary/20 focus:border-primary text-sm bg-white transition-colors"
                >
                <option value="Fire">Fire</option>
                <option value="Flood">Flood</option>
                <option value="Medical">Medical</option>
                <option value="Road Obstruction">Road Obstruction</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Upload Photo (Optional)</label>
                <button
                type="button"
                onClick={() => setHasPhoto(!hasPhoto)}
                className={`w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed rounded-lg transition-colors ${hasPhoto ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-300 text-slate-500 hover:border-primary/50 hover:text-primary hover:bg-primary/5'}`}
                >
                {hasPhoto ? <CheckCircle2 className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                <span className="text-sm font-medium">{hasPhoto ? 'Photo Uploaded (Metadata Attached)' : 'Tap to take a photo'}</span>
                </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center gap-3 cursor-pointer" onClick={() => setCaptchaVerified(!captchaVerified)}>
                {captchaVerified ? <CheckSquare className="w-5 h-5 text-emerald-600" /> : <Square className="w-5 h-5 text-slate-400" />}
                <span className="text-sm text-slate-700 font-medium">I am not a robot (CAPTCHA mock)</span>
            </div>

            <button
                type="submit"
                className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 cursor-pointer"
            >
                Continue
            </button>
            </form>
        )}

        {step === 'PHOTO_VALIDATION' && (
            <div className="p-12 text-center flex flex-col items-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <h3 className="font-bold text-lg text-slate-800">Analyzing Photo Metadata</h3>
                <p className="text-sm text-slate-500 mt-2">Extracting EXIF GPS coordinates and timestamp to verify report legitimacy...</p>
                <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                    <Search className="w-3 h-3" /> Anti-Abuse System Active
                </div>
            </div>
        )}

        {step === 'OTP' && (
            <form onSubmit={handleFinalSubmit} className="p-8 text-center flex flex-col items-center">
                <ShieldAlert className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="font-bold text-lg text-slate-800">Phone Verification</h3>
                <p className="text-sm text-slate-500 mt-2">We sent a verification code to <b>{formData.contactNumber}</b>. Enter it below to submit your report.</p>
                
                <input 
                    type="text" 
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="Enter OTP (Use 1234)"
                    className="mt-6 text-center text-2xl tracking-widest font-bold w-48 py-3 border-2 border-slate-300 rounded-lg focus:border-primary focus:outline-none"
                    maxLength={4}
                />

                <button
                    type="submit"
                    className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md transition-colors"
                >
                    Verify & Submit Report
                </button>
            </form>
        )}

        {step === 'SUCCESS' && (
             <div className="p-12 text-center flex flex-col items-center bg-emerald-50">
                 <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
                 <h3 className="font-bold text-xl text-slate-800">Report Verified!</h3>
                 <p className="text-sm text-slate-600 mt-2">Your report has passed anti-spam checks and has been dispatched to the nearest response unit.</p>
             </div>
        )}
      </div>
    </div>
  );
}
