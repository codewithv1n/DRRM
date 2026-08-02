import React, { useState } from 'react';
import {
  Home, Users, FileText, LogOut, LayoutDashboard,
  QrCode, ChevronRight, Menu, User, Bell, UserPlus
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface BarangayLayoutProps {
  children: React.ReactNode;
}

export default function BarangayLayout({ children }: BarangayLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
          isActive
            ? 'bg-orange-50 text-orange-600 font-semibold'
            : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4.5 h-4.5" />
          <span className="text-sm">{label}</span>
        </div>
        {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
      </button>
    );
  };

  const GroupLabel = ({ label }: { label: string }) => (
    <div className="px-3 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-slate-400">{label}</div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen z-50 bg-white flex flex-col w-64 shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center gap-3 border-b border-slate-100">
          <div className="bg-orange-500 p-2 rounded-xl h-11 w-11 flex items-center justify-center shrink-0 shadow-inner">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-[18px] text-slate-800 leading-tight font-display truncate">Quezon City</h1>
            <p className="text-[12px] text-slate-500 font-medium truncate">Barangay Desk</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <GroupLabel label="Main" />
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/barangays" />
          <GroupLabel label="Operations" />
          <NavItem icon={QrCode} label="Relief Claim Scanner" path="/barangays/relief_claim" />
          <NavItem icon={FileText} label="SitRep Uploader" path="/barangays/sitrep_upload" />
          <NavItem icon={Users} label="Evacuation Updater" path="/barangays/evac_updater" />
          <GroupLabel label="Citizen Management" />
          <NavItem icon={UserPlus} label="Register Citizen" path="/barangays/citizen_registry" />
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">Brgy. Admin</span>
                <span className="text-xs text-slate-500 truncate w-24">Balingasa</span>
              </div>
            </div>
            <button onClick={() => navigate('/login')} className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        <main className="p-4 lg:p-9 flex-1 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
