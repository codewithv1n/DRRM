import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';


const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'System Admin' || user.role === 'Admin') navigate('/admin', { replace: true, state: { loginSuccess: true } });
        else if (user.role === 'Barangay Admin') navigate('/barangays', { replace: true, state: { loginSuccess: true } });
        else if (user.role === 'Responder') navigate('/responders', { replace: true });
        else if (user.role === 'Citizen') navigate('/citizen', { replace: true, state: { loginSuccess: true } });
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch(`${API_URL}/api/auth/login`, {
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
            return;
        }

        const data = await response.json();
        const role = data.user.role;
        localStorage.setItem('user', JSON.stringify(data.user));

        // Route based on role
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
    } catch (err) {
        console.error('Login failed:', err);
        setError('Failed to connect to the server');
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

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#FAFAFA] relative">
        <div className="w-full max-w-120 px-8">
          
          <div className="bg-white px-8 py-10 rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-slate-100">
            <div className="text-left mb-8">
              <h2 className="text-[20px] font-bold text-[#0F172A] mb-1.5 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 text-[11px] font-medium">Sign in to access your disaster management dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs font-bold text-center border border-red-100">
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
                    placeholder="admin@gov.ph"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[10px] font-semibold text-[#2563EB] hover:text-blue-700">Forgot password?</a>
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
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 cursor-pointer shadow-sm text-sm"
                >
                  Sign In 
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
          </div>
          
        </div>
      </div>
    </div>
  );
}
