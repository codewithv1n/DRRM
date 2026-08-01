import React, { useState } from 'react';
import {
  Activity, User, LogOut, LayoutDashboard,
  ChevronRight, Menu, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ResponseUnitLayoutProps {
  children: React.ReactNode;
  activeIncidentsCount: number;
}

export default function ResponseUnitLayout({ children, activeIncidentsCount }: ResponseUnitLayoutProps) {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar - Minimal for field personnel */}
      <aside className={`fixed lg:sticky top-0 h-screen z-50 bg-orange-500 text-orange-50 flex flex-col w-64 shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center gap-3 border-b border-orange-400/60">
          <div className="bg-orange-400 p-2 rounded-xl h-11 w-11 flex items-center justify-center shrink-0 shadow-inner border border-orange-300/30">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-[18px] text-white leading-tight font-display truncate">GOVSERVE</h1>
            <p className="text-[12px] text-orange-100 font-medium truncate">Field Unit</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <div className="px-3 pt-2 pb-2 text-[11px] uppercase font-semibold tracking-widest text-orange-200">Main</div>
          <button className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/20 text-white shadow-sm font-semibold">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span className="text-sm">Active Missions</span>
            </div>
            <div className="flex items-center gap-2">
              {activeIncidentsCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{activeIncidentsCount}</span>
              )}
              <ChevronRight className="w-4 h-4 opacity-70" />
            </div>
          </button>
        </div>

        <div className="p-4 border-t border-orange-400/60">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-orange-400 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-400 flex items-center justify-center text-white shrink-0 border border-orange-300/30">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Rescue Team A</span>
                <span className="text-xs text-orange-100 truncate w-24">QC Task Force</span>
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
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer"><Menu className="w-5 h-5" /></button>
            <h2 className="text-lg font-bold text-slate-900 font-display">Field Operations</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              {activeIncidentsCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{activeIncidentsCount}</span>}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-orange-600 flex items-center justify-center text-white shadow-sm"><User className="w-5 h-5" /></div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-slate-700">Rescue Team A</span>
                <span className="text-xs text-slate-400 font-medium">Responder</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1 max-w-5xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
