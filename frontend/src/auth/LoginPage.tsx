import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, Sun, AlertTriangle, Users, Package, Radio, Building, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/department-admin'); 
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Side - Brand & Info */}
      <div className="hidden lg:flex flex-col w-1/2 bg-linear-to-br from-[#FF8C00] via-[#E85D04] to-[#003ac0] text-white p-12 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-orange-400 blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center gap-3 mb-24">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm border border-white/20">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-wider text-white leading-none">QC DRRM</h1>
            <p className="text-xs text-orange-200 mt-1">Disaster Management System</p>
          </div>
        </div>

        <div className="relative z-10 max-w-xl mt-auto mb-20">
          <h2 className="text-5xl text-white mb-6 leading-tight">
            Streamline Your<br />Disaster Response
          </h2>
          <p className="text-white text-lg mb-10 leading-relaxed max-w-lg">
            A comprehensive platform for incident reporting, evacuation center management, relief operations, and city-wide early warning systems.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-2.5 px-5 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-orange-200" />
              <span className="text-sm font-medium">Incident Reporting</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-2.5 px-5 shadow-sm">
              <Users className="w-5 h-5 text-orange-200" />
              <span className="text-sm font-medium">Evacuation</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-2.5 px-5 shadow-sm">
              <Package className="w-5 h-5 text-orange-200" />
              <span className="text-sm font-medium">Relief Goods</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-2.5 px-5 shadow-sm">
              <Radio className="w-5 h-5 text-orange-200" />
              <span className="text-sm font-medium">Early Warning</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-auto flex items-center gap-2 text-sm text-orange-200/80 font-medium">
          <ShieldCheck className="w-4 h-4" />
          Secure Government Platform
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 bg-[#F8FAFC] relative flex flex-col justify-center items-center p-8">
        <button className="absolute top-8 right-8 p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer">
          <Sun className="w-5 h-5" />
        </button>

        <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
          <p className="text-slate-500 mb-8 text-sm">Sign in to access the disaster management system</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email / Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04] transition-all text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04] transition-all text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

           
            

            <button
              type="submit"
              className="w-full mt-4 bg-[#E85D04] hover:bg-[#D04D03] text-white font-semibold py-3 px-4 rounded-xl shadow-md hover:shadow-lg hover:shadow-[#E85D04]/20 transition-all cursor-pointer flex justify-center items-center gap-2 group"
            >
              Sign In 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>

        <p className="mt-10 text-xs text-slate-400 text-center font-medium">
          Contact your administrator for account access.
        </p>
      </div>
    </div>
  );
}
