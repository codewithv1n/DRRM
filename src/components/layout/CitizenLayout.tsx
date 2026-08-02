import React, { useState } from 'react';
import { User, LogOut, History, LayoutDashboard, QrCode, ChevronRight, ShieldAlert, Menu, Bell, BellRing, Info } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface CitizenLayoutProps {
  children: React.ReactNode;
}

export default function CitizenLayout({ children }: CitizenLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Helper to determine if a route is active
  const isActive = (path: string) => {
      if (path === '/citizen' && location.pathname === '/citizen') return true;
      if (path !== '/citizen' && location.pathname.startsWith(path)) return true;
      return false;
  };

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => {
            navigate(path);
            setSidebarOpen(false); 
        }}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
          active
            ? 'bg-orange-50 text-orange-600 font-semibold'
            : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4.5 h-4.5" />
          <span className="text-sm">{label}</span>
        </div>
        {active && <ChevronRight className="w-4 h-4 opacity-70" />}
      </button>
    );
  };

  const GroupLabel = ({ label }: { label: string }) => (
    <div className="px-3 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-slate-400">{label}</div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
     
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      <aside className={`fixed lg:sticky top-0 h-screen z-50 bg-white flex flex-col w-64 shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-orange-500 p-2 rounded-xl h-11 w-11 flex items-center justify-center shrink-0 shadow-inner">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-[18px] text-slate-800 leading-tight font-display truncate">Quezon City</h1>
            <p className="text-[12px] text-slate-500 font-medium truncate">Citizen Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <GroupLabel label="Main" />
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/citizen" />
          <GroupLabel label="Services" />
          <NavItem icon={BellRing} label="Alerts & Advisories" path="/citizen/alerts" />
          <NavItem icon={QrCode} label="My Citizen ID" path="/citizen/id" />
          <NavItem icon={History} label="Claim History" path="/citizen/claim_history" />
          <GroupLabel label="Information" />
          <NavItem icon={Info} label="About DRRM" path="/citizen/about" />
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">Taro Sakamoto </span>
                <span className="text-xs text-slate-500 truncate w-24">Balingasa</span>
              </div>
            </div>
            <button onClick={() => navigate('/login')} className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="lg:p-9 flex-1 max-w-500 ">
          {children}
        </main>
      </div>
    </div>
  );
}
