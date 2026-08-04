import React, { useState } from 'react';
import { LogOut, History, LayoutDashboard, Megaphone, ChevronRight, Menu, Bell, BellRing, FileText, Shield, Search, Moon, HelpCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface CitizenLayoutProps {
  children: React.ReactNode;
}

export default function CitizenLayout({ children }: CitizenLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            setSidebarOpen(false); 
        }}
        className={`flex items-center justify-between px-3 py-3 mx-2 w-[calc(100%-16px)] rounded-xl transition-all cursor-pointer ${
          active
            ? 'bg-[#2563EB] text-white font-medium shadow-sm'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-sm">{label}</span>
        </div>
        {active && <ChevronRight className="w-4 h-4 opacity-70" />}
      </button>
    );
  };

  const GroupLabel = ({ label }: { label: string }) => (
    <div className="px-5 pt-6 pb-2 text-[10px] uppercase font-bold tracking-widest text-slate-500">{label}</div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen z-50 bg-[#0B1120] flex flex-col w-70 shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2563EB] text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-600/20">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex flex-col overflow-hidden text-white">
            <h1 className="font-bold text-[15px] text-white leading-tight truncate">GOVSERVE</h1>
            <p className="text-[11px] text-slate-400 font-medium truncate">Citizen Portal</p>
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

        <div className="p-4 mt-auto">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1E293B] flex items-center justify-center text-slate-300 shrink-0">
                <span className="text-xs font-bold">TS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Taro Sakamoto </span>
                <span className="text-[11px] text-slate-500 truncate w-24">Balingasa</span>
              </div>
            </div>
            <button onClick={() => navigate('/login')} className="p-2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-[#F8FAFC]">
        {/* Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:flex items-center text-slate-800 font-bold text-lg">
              {getPageTitle()}
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input 
                type="text" 
                placeholder="Search applications, records..."
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <Moon className="w-5 h-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <HelpCircle className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <Bell className="w-5 h-5" />
              </button>
            </div>
            
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-bold text-slate-700">Taro Sakamoto</span>
                <span className="text-[10px] text-slate-500">Citizen</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                TS
              </div>
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
