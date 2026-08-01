import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield, Building2, Map, Home, ClipboardList, Sun, ArrowRight } from 'lucide-react';

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
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-linear-to-br from-orange-400 via-orange-400 to-slate-700 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-orange-300/40 via-transparent to-black/20"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/10 p-2 rounded-full border border-white/20">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-wide leading-none text-slate-100">GOVSERVE</h1>
              <p className="text-[11px] text-white/80 mt-1">Disaster Management System</p>
            </div>
          </div>

          <div className="max-w-md mt-24">
            <h2 className="text-5xl font-bold mb-6 leading-tight tracking-tight text-slate-100">
              Disaster Risk <br/> Reduction & Management
            </h2>
            <p className="text-white/80 text-lg leading-relaxed mb-12 font-light">
              A comprehensive platform for incident reporting, evacuation, relief operations, and early warning.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 hover:bg-white/20 transition-colors cursor-default backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3">
                <Shield className="w-5 h-5 text-orange-200" />
                <span className="font-medium text-sm">Incidents</span>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition-colors cursor-default backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3">
                <Home className="w-5 h-5 text-orange-200" />
                <span className="font-medium text-sm">Evacuation</span>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition-colors cursor-default backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3">
                <ClipboardList className="w-5 h-5 text-orange-200" />
                <span className="font-medium text-sm">Relief Ops</span>
              </div>
              <div className="bg-white/10 hover:bg-white/20 transition-colors cursor-default backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-3">
                <Map className="w-5 h-5 text-orange-200" />
                <span className="font-medium text-sm">Early Warning</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-xs text-white/60">
          <Shield className="w-4 h-4" />
          <span>Secure Government Platform</span>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-linear-to-br from-slate-50 to-[#EBF0F7] relative">
        <div className="absolute top-8 right-8 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
           <Sun className="w-5 h-5" />
        </div>

        <div className="w-full max-w-125 px-8">
          
          <div className="bg-white p-10 rounded-4xl shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-white">
            <h2 className="text-3xl font-extrabold text-[#0F172A] mb-1.5 tracking-tight">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-8">Sign in to access the disaster management system</p>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-100/80 rounded-2xl text-slate-900 placeholder-slate-400  transition-all bg-[#F8FAFC]"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 border border-slate-100/80 rounded-2xl text-slate-900 placeholder-slate-400/50 transition-all bg-[#F8FAFC]"
                    placeholder="••••••••••••••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-medium py-3.5 px-4 rounded-full  transition-all duration-200 cursor-pointer flex justify-center items-center gap-2 mt-6"
              >
                Sign In 
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </form>
          </div>
          
          <p className="text-center text-xs text-slate-400 mt-8">
            Contact your administrator for account access.
          </p>
        </div>
      </div>
    </div>
  );
}
