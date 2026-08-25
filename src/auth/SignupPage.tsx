import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Key, X, ArrowLeft } from 'lucide-react';
import BarangayOptions from '../components/BarangayOptions';


const API_URL = import.meta.env.VITE_API_URL;

export default function SignupPage() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    role: 'Citizen',
    barangay: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    purok: '',
    email: '',
    password: ''
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password || !form.barangay) {
      showToast("Please fill all required fields", "error");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/otp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, type: 'signup' }),
      });

      const data = await response.json();
      if (!response.ok) {
        showToast(data.error || 'Failed to send OTP', 'error');
        setIsLoading(false);
        return;
      }

      showToast("OTP sent to your email!", 'success');
      setStep(2);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      showToast("Failed to connect to the server.", 'error');
    }
    setIsLoading(false);
  };


  const handleVerifyAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setIsLoading(true);

    try {
      // 1. Verify OTP
      const verifyRes = await fetch(`${API_URL}/api/otp/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, otp }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        showToast(verifyData.error || 'Invalid OTP', 'error');
        setIsLoading(false);
        return;
      }

      // 2. Create Account
      const fullName = `${form.firstName} ${form.lastName}`.trim();
      const response = await fetch(`${API_URL}/api/auth/admin/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'Citizen',
          barangay: form.barangay,
          name: fullName,
          email: form.email,
          password: form.password,
          contactNumber: form.contactNumber,
          address: form.purok
        }),
      });

      const errorData = await response.json();
      if (!response.ok) {
        showToast(`Error: ${errorData.error || 'Unknown error'}`, 'error');
        setIsLoading(false);
        return;
      }

      showToast("Account created successfully! Redirecting to login...", 'success');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("Failed to create account:", error);
      showToast("Failed to connect to the server.", 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      
      {/* Left Panel - Branding & Information */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between py-10 px-12 bg-[#0B1526] text-white relative overflow-hidden">
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,52,89,0.4)_0%,transparent_70%)] pointer-events-none z-0"></div>

        {/* Government Seal Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <img 
            src="/logo-system.png" 
            alt="System Logo" 
            className="object-contain opacity-[0.12]"
            style={{ width: '520px', height: '520px' }}
          />
        </div>
        
        {/* Top Header */}
        <div className="relative z-10">
          <h2 className="text-[20px] font-extrabold text-white mb-1 tracking-tight">Disaster Risk Reduction & Emergency Response</h2>
          <p className="text-[12px] text-white/60 font-medium">Republic of the Philippines • Local Government Unit</p>
        </div>

        {/* Center Content - overlaid on seal */}
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

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#FAFAFA] relative py-28 px-4 h-full overflow-y-auto">
        
        {/* Toast Notification */}
        <div 
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-md shadow-lg font-medium text-sm transition-all duration-300 transform ${
            toast 
              ? 'translate-x-0 opacity-100' 
              : 'translate-x-full opacity-0 pointer-events-none'
          } ${
            toast?.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          <div className="flex items-center justify-center shrink-0">
            {toast?.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <X className="w-5 h-5" />
            )}
          </div>
          <p>{toast?.message}</p>
        </div>

        <div className="w-full max-w-2xl px-4 lg:px-8">

          <div className="bg-white rounded-3xl w-full shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden p-8 relative flex flex-col">
            <button 
          onClick={() => navigate('/login')}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer z-10 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-xl">
          <UserPlus className="w-6 h-6 text-[#2563EB]" />
          Create Citizen Account
        </h3>

        {step === 1 ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Barangay</label>
                <select 
                  required
                  value={form.barangay}
                  onChange={e => setForm({...form, barangay: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select your barangay</option>
                  <BarangayOptions />
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Full Name</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text"
                    required
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={e => setForm({...form, firstName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                  <input 
                    type="text"
                    required
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={e => setForm({...form, lastName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Contact Number</label>
                  <input 
                    type="text"
                    placeholder="e.g. 09123456789"
                    value={form.contactNumber}
                    onChange={e => setForm({...form, contactNumber: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Complete Address</label>
                  <input 
                    type="text"
                    placeholder="e.g. Block 1 Lot 2, Purok 3"
                    value={form.purok}
                    onChange={e => setForm({...form, purok: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input 
                    type="email"
                    required
                    placeholder="user@example.com"
                    value={form.email}
                    onChange={e => setForm({...form, email: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Key className="w-4 h-4 text-slate-400" />
                  </div>
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm({...form, password: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
              </div>
            </div>

              <button type="submit" disabled={isLoading} className="w-full bg-[#2563EB] hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
                <UserPlus className="w-4 h-4" />
                {isLoading ? 'Sending OTP...' : 'Next: Verify Email'}
              </button>
            </form>
        ) : (
          <form onSubmit={handleVerifyAndSignup} className="space-y-4 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-bold text-slate-800">Check your email</h4>
              <p className="text-sm text-slate-500 mt-2">
                We sent a 6-digit verification code to<br/>
                <span className="font-semibold text-slate-700">{form.email}</span>
              </p>
            </div>
            
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 text-center">Verification Code</label>
              <input 
                type="text"
                required
                maxLength={6}
                placeholder="000000"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center tracking-[0.5em] text-2xl font-mono bg-slate-50 border border-slate-200 rounded-xl px-4 py-4 focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
              />
            </div>

            <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full bg-[#2563EB] hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-sm hover:shadow-md cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? 'Verifying...' : 'Create Account'}
            </button>
            
            <div className="text-center mt-6">
              <button 
                type="button" 
                onClick={() => { setStep(1); setOtp(''); }}
                className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Change email or edit details
              </button>
            </div>
          </form>
        )}
          </div>
        </div>
      </div>
    </div>
  );
}
