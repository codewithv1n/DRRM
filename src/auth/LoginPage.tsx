import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Map, Heart, Users, Package, Radio } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = username.toLowerCase();
    
    if (user === 'admin' || user === 'department' || user.includes('admin')) {
        navigate('/departments');
    } else if (user === 'brgy' || user === 'barangay' || user.includes('brgy')) {
        navigate('/barangays');
    } else if (user === 'rescue' || user === 'responder' || user.includes('rescue')) {
        navigate('/responders');
    } else if (user === 'juan' || user === 'resident' || user.includes('juan')) {
        navigate('/residents');
    } else {
        setError('Invalid credentials. Use: admin, brgy, rescue, or juan');
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      
      {/* Left Panel - Branding & Information */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between py-12 px-8 bg-[#0B1120] text-white relative items-center text-center">
        
        {/* Top Header */}
        <div>
          <h2 className="text-[12px] font-bold tracking-[0.2em] text-white uppercase">GOVSERVE</h2>
        </div>

        {/* Center Content */}
        <div className="max-w-125 w-full flex flex-col items-center">
          <h1 className="text-[35px] font-bold mb-4 leading-tight tracking-tight text-white">
            Disaster Risk Management<br/>Portal
          </h1>
          <p className="text-slate-400 text-[13px] leading-relaxed mb-10 font-medium px-4">
            Streamlining incident reporting, evacuation centers, relief operations, and early warnings. Click any module below to learn more.
          </p>

          <div className="flex flex-col gap-3 w-full items-center">
            <div className="flex justify-center gap-3 w-full">
              <div className="bg-[#1E293B] border border-[#334155] py-2.5 px-5 rounded-2xl flex items-center gap-2.5 cursor-pointer hover:bg-slate-700 transition-colors">
                <Heart className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-[11px] text-slate-200">Rescue Ops</span>
              </div>
              <div className="bg-[#1E293B] border border-[#334155] py-2.5 px-5 rounded-2xl flex items-center gap-2.5 cursor-pointer hover:bg-slate-700 transition-colors">
                <Users className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-[11px] text-slate-200">Evacuation</span>
              </div>
              <div className="bg-[#1E293B] border border-[#334155] py-2.5 px-5 rounded-2xl flex items-center gap-2.5 cursor-pointer hover:bg-slate-700 transition-colors">
                <Package className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-[11px] text-slate-200">Relief Goods</span>
              </div>
            </div>
            <div className="flex justify-center gap-3 w-full">
              <div className="bg-[#1E293B] border border-[#334155] py-2.5 px-5 rounded-2xl flex items-center gap-2.5 cursor-pointer hover:bg-slate-700 transition-colors">
                <Map className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-[11px] text-slate-200">Hazard Maps</span>
              </div>
              <div className="bg-[#1E293B] border border-[#334155] py-2.5 px-5 rounded-2xl flex items-center gap-2.5 cursor-pointer hover:bg-slate-700 transition-colors">
                <Radio className="w-4 h-4 text-blue-400" />
                <span className="font-semibold text-[11px] text-slate-200">Early Warning</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div>
          <p className="text-[10px] text-slate-500 font-medium">
            © GOVSERVE 
          </p>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#FAFAFA] relative">
        <div className="w-full max-w-120 px-8">
          
          <div className="bg-white px-8 py-10 rounded-2xl shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-slate-100">
            <div className="text-center mb-8">
              <h2 className="text-[20px] font-bold text-[#0F172A] mb-1.5 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 text-[11px] font-medium px-4">Sign in to access your disaster management dashboard</p>
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
            
            <div className="mt-6 text-center">
              <p className="text-[10px] text-slate-400 font-medium">
                Don't have an account yet? <a href="#" className="text-[#2563EB] font-bold hover:underline">Create Account / Register</a>
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
