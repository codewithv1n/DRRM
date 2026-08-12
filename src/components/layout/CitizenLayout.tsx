import React, { useState, useEffect } from 'react';
import { LogOut, History, LayoutDashboard, Megaphone, Menu, Bell, BellRing, FileText, Sun, Moon, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface CitizenLayoutProps {
  children: React.ReactNode;
}

export default function CitizenLayout({ children }: CitizenLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'Citizen';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') === 'dark';
    }
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Derive title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('alerts')) return 'Alerts & Advisories';
    if (path.includes('report_logs')) return 'My Report Logs';
    if (path.includes('announcements')) return 'Relief Announcements';
    if (path.includes('claim_history')) return 'Claim History';
    return 'Dashboard';
  };

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
            if (window.innerWidth < 1024) {
              setSidebarOpen(false); 
            }
        }}
        className={`flex items-center px-3 py-3 mx-2 w-[calc(100%-16px)] rounded-xl transition-all cursor-pointer ${
          active
            ? 'bg-sidebar-primary/20 text-sidebar-foreground font-medium shadow-sm border border-sidebar-primary/30'
            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-sm">{label}</span>
        </div>
      </button>
    );
  };

  const GroupLabel = ({ label }: { label: string }) => (
    <div className="px-5 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-sidebar-foreground/50">{label}</div>
  );

  return (
    <div className="min-h-screen bg-background flex font-sans text-slate-900">
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`select-none fixed lg:sticky top-0 h-screen z-50 bg-gradient-sidebar flex flex-col w-70 shrink-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-70'}`}>
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-system.png" alt="GovServe Logo" className="w-11 h-11 object-contain shrink-0" />
          <div className="flex flex-col overflow-hidden text-white">
            <h1 className="font-bold text-[18px] text-sidebar-foreground leading-tight truncate">GovServe</h1>
            <p className="text-[12px] text-sidebar-foreground/50 font-medium truncate">Citizen Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin">
          <GroupLabel label="Modules" />
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/citizen" />
          <GroupLabel label="Services" />
          <NavItem icon={BellRing} label="Alerts & Advisories" path="/citizen/alerts" />
          <NavItem icon={FileText} label="My Report Logs" path="/citizen/report_logs" />
          <NavItem icon={Megaphone} label="Relief Announcements" path="/citizen/announcements" />
          <NavItem icon={History} label="Claim History" path="/citizen/claim_history" />
        </div>


      </aside>

      {/* Main Content Area */}
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
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer mr-1"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <Bell className="w-5 h-5" />
              </button>
            </div>
            
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-bold text-slate-700 truncate w-32">{userName}</span>
                  <span className="text-[10px] text-slate-500 truncate w-32">{user?.role || 'Citizen'}</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
                  {userInitials}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                  <button 
                    onClick={() => { localStorage.removeItem('user'); navigate('/login', { replace: true }); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8 flex-1 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
