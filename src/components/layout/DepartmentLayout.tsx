import React, { useState } from 'react';
import {
  Building2, LayoutDashboard, Siren, Radio, Map,
  BarChart3, ChevronRight, Bell, Menu, User, LogOut, Package, Shield
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface DepartmentLayoutProps {
  children: React.ReactNode;
  pendingCount?: number;
}

export default function DepartmentLayout({ children, pendingCount = 0 }: DepartmentLayoutProps) {
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
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-[18px] text-slate-800 leading-tight font-display truncate">Quezon City</h1>
            <p className="text-[12px] text-slate-500 font-medium truncate">Department Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <GroupLabel label="Main" />
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/departments" />
          <GroupLabel label="Operations" />
          <NavItem icon={Siren} label="Incident Dispatcher" path="/departments/incidents" />
          <NavItem icon={Radio} label="City-Wide Alerts" path="/departments/early_warning" />
          <GroupLabel label="Monitoring" />
          <NavItem icon={Map} label="Hazard & Evacuation Map" path="/departments/hazard_map" />
          <NavItem icon={BarChart3} label="Barangay Coordination" path="/departments/barangay_coordination" />
          <NavItem icon={Package} label="Resources & Assets" path="/departments/resource_management" />
          <GroupLabel label="System" />
          <NavItem icon={Shield} label="Audit Logs" path="/departments/audit_logs" />
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-800">EOC Head</span>
                <span className="text-xs text-slate-500 truncate w-24">admin@qc.gov.ph</span>
              </div>
            </div>
            <button onClick={() => navigate('/login')} className="p-2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{pendingCount}</span>}
            </button>
          </div>
        </header>

        {/* Content */}
         <main className="lg:p-9 flex-1 max-w-500 ">
          {children}
        </main>
      </div>
    </div>
  );
}
