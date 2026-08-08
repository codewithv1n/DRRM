import React, { useState, useEffect } from 'react';
import {
  LogOut, LayoutDashboard,
  Menu, Bell, Package, Siren
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ResponseUnitLayoutProps {
  children: React.ReactNode;
  activeIncidentsCount?: number;
}

export default function ResponseUnitLayout({ children, activeIncidentsCount = 0 }: ResponseUnitLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'Responder';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('incidents')) return 'Incident Response';
    if (path.includes('deliveries')) return 'Relief Deliveries';
    return 'Dashboard';
  };

  const NavItem = ({ icon: Icon, label, path, badgeCount = 0 }: { icon: any; label: string; path: string; badgeCount?: number }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center justify-between px-3 py-3 mx-2 w-[calc(100%-16px)] rounded-xl transition-all cursor-pointer ${
          isActive
            ? 'bg-sidebar-primary/20 text-sidebar-foreground font-medium shadow-sm border border-sidebar-primary/30'
            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-sm">{label}</span>
        </div>
        {badgeCount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{badgeCount}</span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`select-none fixed lg:sticky top-0 h-screen z-50 bg-gradient-sidebar flex flex-col w-70 shrink-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-70'}`}>
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-system.png" alt="GovServe Logo" className="w-11 h-11 object-contain shrink-0" />
          <div className="flex flex-col overflow-hidden text-white">
            <h1 className="font-bold text-[18px] text-sidebar-foreground leading-tight truncate">GovServe</h1>
            <p className="text-[12px] text-sidebar-foreground/50 font-medium truncate">Response Unit</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin">
          <div className="px-5 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-sidebar-foreground/50">Modules</div>
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/responders" />
          <NavItem icon={Siren} label="Incident Response" path="/responders/incidents" badgeCount={activeIncidentsCount} />
          <NavItem icon={Package} label="Relief Deliveries" path="/responders/deliveries" />
        </div>

        <div className="p-4 mt-auto border-t border-sidebar-accent">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-sidebar-accent transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sidebar-accent flex items-center justify-center text-sidebar-foreground shrink-0">
                <span className="text-xs font-bold">{userInitials}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white truncate w-32">{userName}</span>
                <span className="text-[11px] text-slate-500 truncate w-32">{user?.email || 'Rescue Unit'}</span>
              </div>
            </div>
            <button onClick={() => { localStorage.removeItem('user'); navigate('/login', { replace: true }); }} className="p-2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-soft">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center text-slate-800 font-bold text-lg">
              {getPageTitle()}
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2 relative">
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <Bell className="w-5 h-5" />
                {activeIncidentsCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
              </button>
            </div>
            
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-bold text-slate-700 truncate w-32">{userName}</span>
                <span className="text-[10px] text-slate-500 truncate w-32">{user?.role || 'Responder'}</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

         <main className="p-4 lg:p-8 flex-1 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
