import React, { useState } from 'react';
import {
  LayoutDashboard, Siren, Radio, Map,
  ChevronRight, Bell, Menu, User, Users, LogOut, Package, Shield
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
  pendingCount?: number;
}

export default function AdminLayout({ children, pendingCount = 0 }: AdminLayoutProps) {
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

  const SubNavItem = ({ label, path }: { label: string; path: string }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`w-full flex items-center pl-4 pr-3 py-2 rounded-r-xl transition-all cursor-pointer text-sm border-l-2 ${
          isActive
            ? 'border-black text-black font-bold bg-slate-50'
            : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
        }`}
      >
        {label}
      </button>
    );
  };

  const NavDropdown = ({ icon: Icon, label, children, activePaths }: { icon: any; label: string; children: React.ReactNode, activePaths: string[] }) => {
    const isActive = activePaths.includes(location.pathname);
    const [isOpen, setIsOpen] = useState(isActive);

    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
            isActive || isOpen
              ? 'bg-slate-50 text-slate-800 font-semibold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4.5 h-4.5" />
            <span className="text-sm">{label}</span>
          </div>
          <ChevronRight className={`w-4 h-4 opacity-70 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
        </button>
        {isOpen && (
          <div className="pl-4 space-y-1">
            {children}
          </div>
        )}
      </div>
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
          <div className="w-11 h-11 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="w-7 h-7" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-[18px] text-slate-800 leading-tight font-display truncate">QCDRRMO</h1>
            <p className="text-[12px] text-slate-500 font-medium truncate">Administrator</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1 scrollbar-thin">
          <GroupLabel label="Main" />
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/admin" />
          <GroupLabel label="Operations" />
          <NavItem icon={Siren} label="Incident Dispatcher" path="/admin/incidents" />
          <NavItem icon={Radio} label="City-Wide Alerts" path="/admin/early_warning" />
          <NavDropdown icon={Package} label="Relief" activePaths={['/admin/relief_inventory', '/admin/relief_dispatch', '/admin/validate_donations']}>
            <SubNavItem label="Inventory" path="/admin/relief_inventory" />
            <SubNavItem label="Dispatch" path="/admin/relief_dispatch" />
            <SubNavItem label="Validate Donations" path="/admin/validate_donations" />
          </NavDropdown>
          
          <GroupLabel label="Monitoring" />
          <NavItem icon={Map} label="Hazard & Evacuation Map" path="/admin/hazard_map" />
          <GroupLabel label="System" />
          <NavItem icon={Users} label="User Management" path="/admin/user_management" />
          <NavItem icon={Shield} label="Audit Logs" path="/admin/audit_logs" />

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
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto scrollbar-thin">
        {/* Header */}
        <header className="sticky top-0 z-40 h-21.5 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
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
