import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../data/MockDataContext';
import type { EmergencyType } from '../../data/mockData';
import { AlertCircle, Camera, CheckCircle2, MapPin, Phone, User, Loader2, Search, Flame, Droplets, Activity, AlertTriangle, Navigation, ArrowLeft, Upload } from 'lucide-react';

export default function IncidentReportForm() {
  const navigate = useNavigate();
  const { addIncident } = useMockData();
  const [showSuccess, setShowSuccess] = useState(false);
  const [step, setStep] = useState<'FORM' | 'PHOTO_VALIDATION' | 'SUCCESS'>('FORM');
  
  const [formData, setFormData] = useState({
    reporterName: '',
    contactNumber: '',
    location: '',
    type: 'Fire' as EmergencyType,
  });

  const [hasPhoto, setHasPhoto] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({ ...prev, location: `${position.coords.latitude.toFixed(4)} N, ${position.coords.longitude.toFixed(4)} E (Auto-detected)` }));
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    }
  };

  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submitIncident = () => {
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
      
      setTimeout(() => {
        setShowSuccess(false);
        setStep('FORM');
      }, 4000);
    };

    if (hasPhoto) {
        setStep('PHOTO_VALIDATION');
        setTimeout(() => {
            submitIncident();
        }, 2000); 
    } else {
        submitIncident();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Toast Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50 transition-all duration-300">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Verified Report Submitted to Department Section</span>
        </div>
      )}

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-primary p-6 text-center text-white relative">
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h1 className="text-2xl font-bold text-white">Helpline 122</h1>
          <p className="text-orange-100 text-sm mt-1">Emergency Incident Report</p>
        </div>

        {step === 'FORM' && (
            <form onSubmit={handleInitialSubmit} className="p-6">
                {/* Row 1: Name and Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
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
                                placeholder="Your Name"
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
                </div>

                {/* Row 2: Location and Photo */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Exact Location</label>
                        <div className="relative flex gap-2">
                        <div className="relative flex-1">
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
                        <button
                            type="button"
                            onClick={handleGetLocation}
                            className="flex items-center justify-center px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 rounded-lg transition-colors cursor-pointer"
                            title="Use Current Location"
                        >
                            <Navigation className="w-5 h-5" />
                        </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Photo (Optional)</label>
                        {!hasPhoto ? (
                            <div className="grid grid-cols-2 gap-2">
                                <label className="flex items-center justify-center gap-2 py-2 px-1 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary/50 hover:text-primary hover:bg-primary/5 cursor-pointer transition-colors">
                                    <Camera className="w-4 h-4" />
                                    <span className="text-sm font-medium">Camera</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        capture="environment" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) setHasPhoto(true);
                                        }} 
                                    />
                                </label>
                                <label className="flex items-center justify-center gap-2 py-2 px-1 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-primary/50 hover:text-primary hover:bg-primary/5 cursor-pointer transition-colors">
                                    <Upload className="w-4 h-4" />
                                    <span className="text-sm font-medium">Upload</span>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files.length > 0) setHasPhoto(true);
                                        }} 
                                    />
                                </label>
                            </div>
                        ) : (
                            <div className="w-full flex items-center justify-between px-4 py-3.5 border-2 border-emerald-500 bg-emerald-50 text-emerald-700 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span className="text-sm font-medium">Photo Attached</span>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => setHasPhoto(false)} 
                                    className="text-emerald-700 hover:text-emerald-900 text-sm font-semibold underline cursor-pointer"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Row 3: Emergency Type */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Emergency Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { type: 'Fire', icon: Flame, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
                            { type: 'Flood', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
                            { type: 'Medical', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
                            { type: 'Road Obstruction', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
                        ].map((em) => {
                            const isSelected = formData.type === em.type;
                            const Icon = em.icon;
                            return (
                                <button
                                    key={em.type}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: em.type as EmergencyType }))}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${isSelected ? `border-primary bg-primary/5` : `border-slate-100 bg-white hover:border-slate-200`}`}
                                >
                                    <div className={`p-2 rounded-full mb-2 ${isSelected ? em.bg : 'bg-slate-50'}`}>
                                        <Icon className={`w-6 h-6 ${isSelected ? em.color : 'text-slate-400'}`} />
                                    </div>
                                    <span className={`text-sm font-medium text-center ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>{em.type}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Row 4: Submit */}
                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="w-full bg-primary hover:bg-orange-600 text-white font-semibold py-3.5 px-6 rounded-lg shadow-md transition-colors duration-200 cursor-pointer"
                    >
                        Submit
                    </button>
                </div>
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
