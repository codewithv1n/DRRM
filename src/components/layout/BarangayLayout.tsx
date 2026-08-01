import React, { useState } from 'react';
import {
  Home, Users, FileText, LogOut, LayoutDashboard,
  QrCode, ChevronRight, Search, HelpCircle, Bell, Menu, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActivePanel = 'dashboard' | 'qr-scanner' | 'sitrep' | 'evacuation';

interface BarangayLayoutProps {
  children: React.ReactNode;
  activePanel: ActivePanel;
  setActivePanel: (panel: ActivePanel) => void;
}

export default function BarangayLayout({ children, activePanel, setActivePanel }: BarangayLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const NavItem = ({ icon: Icon, label, panel }: { icon: any; label: string; panel: ActivePanel }) => (
    <button
      onClick={() => setActivePanel(panel)}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
        activePanel === panel
          ? 'bg-white/20 text-white shadow-sm font-semibold'
          : 'text-orange-100 hover:text-white hover:bg-orange-400'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4.5 h-4.5" />
        <span className="text-sm">{label}</span>
      </div>
      {activePanel === panel && <ChevronRight className="w-4 h-4 opacity-70" />}
    </button>
  );

  const GroupLabel = ({ label }: { label: string }) => (
    <div className="px-3 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-orange-200">{label}</div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen z-50 bg-orange-500 text-orange-50 flex flex-col w-64 shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center gap-3 border-b border-orange-400/60">
          <div className="bg-orange-400 p-2 rounded-xl h-11 w-11 flex items-center justify-center shrink-0 shadow-inner border border-orange-300/30">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-[18px] text-white leading-tight font-display truncate">GOVSERVE</h1>
            <p className="text-[12px] text-orange-100 font-medium truncate">Barangay Desk</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <GroupLabel label="Main" />
          <NavItem icon={LayoutDashboard} label="Dashboard" panel="dashboard" />
          <GroupLabel label="Operations" />
          <NavItem icon={QrCode} label="QR Scanner" panel="qr-scanner" />
          <NavItem icon={FileText} label="SitRep Uploader" panel="sitrep" />
          <NavItem icon={Users} label="Evacuation Updater" panel="evacuation" />
        </div>

        <div className="p-4 border-t border-orange-400/60">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-orange-400 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-400 flex items-center justify-center text-white shrink-0 border border-orange-300/30">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Brgy. Admin</span>
                <span className="text-xs text-orange-100 truncate w-24">Commonwealth</span>
              </div>
            </div>
            <button onClick={() => navigate('/login')} className="p-2 text-orange-100 group-hover:text-white transition-colors cursor-pointer">
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
            <div className="hidden md:flex relative w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search residents, records..." className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-slate-400 text-slate-900" />
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><HelpCircle className="w-5 h-5" /></button>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><Bell className="w-5 h-5" /></button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-sm"><User className="w-5 h-5" /></div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-slate-700">Brgy. Admin</span>
                <span className="text-xs text-slate-400 font-medium">Commonwealth</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
