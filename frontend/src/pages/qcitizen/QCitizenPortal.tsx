import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { initialReliefHistory } from '../../data/mockData';
import { useMockData } from '../../data/MockDataContext';
import {
  User, LogOut, Package, History, LayoutDashboard, QrCode, ChevronRight,
  AlertTriangle, X, ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActivePanel = 'dashboard' | 'qr-id' | 'claim-history';

export default function QCitizenPortal() {
  const navigate = useNavigate();
  const { broadcastAlerts } = useMockData();
  const [activePanel, setActivePanel] = useState<ActivePanel>('dashboard');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const activeAlerts = broadcastAlerts.filter(a => a.active && !dismissedAlerts.includes(a.id));

  const NavItem = ({ icon: Icon, label, panel }: { icon: any; label: string; panel: ActivePanel }) => (
    <button
      onClick={() => setActivePanel(panel)}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
        activePanel === panel
          ? 'bg-white/25 text-white shadow-sm border border-white/10'
          : 'text-orange-100/80 hover:text-white hover:bg-white/10'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4.5 h-4.5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {activePanel === panel && <ChevronRight className="w-4 h-4 opacity-50" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-slate-900">
      {/* Sidebar - Orange theme for residents */}
      <div className="w-full md:w-64 bg-linear-to-b from-[#FF8C00] to-[#E85D04] text-white flex flex-col shadow-xl z-10 shrink-0">
        <div className="p-5 flex items-center gap-3 border-b border-white/20">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm border border-white/20 h-11 w-11 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-[18px] text-white leading-tight font-display truncate">QCitizen</h1>
            <p className="text-[12px] text-orange-100 font-medium truncate">Resident Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <div className="px-3 pt-2 pb-2 text-[11px] uppercase font-semibold tracking-widest text-orange-200/60">Main</div>
          <NavItem icon={LayoutDashboard} label="My Dashboard" panel="dashboard" />
          <div className="px-3 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-orange-200/60">Services</div>
          <NavItem icon={QrCode} label="My QR ID" panel="qr-id" />
          <NavItem icon={History} label="Claim History" panel="claim-history" />
        </div>

        <div className="p-4 border-t border-white/20">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Juan Dela Cruz</span>
                <span className="text-xs text-orange-100 truncate w-24">Commonwealth</span>
              </div>
            </div>
            <button onClick={() => navigate('/login')} className="p-2 text-orange-200 group-hover:text-white transition-colors cursor-pointer">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Alert Banner */}
        {activeAlerts.map(alert => (
          <div key={alert.id} className="bg-red-500 text-white px-4 lg:px-8 py-3 flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{alert.level}</span>
                <p className="text-sm font-semibold">{alert.message}</p>
              </div>
            </div>
            <button onClick={() => setDismissedAlerts(p => [...p, alert.id])} className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        <main className="p-4 lg:p-8 flex-1 max-w-5xl mx-auto w-full">

          {/* ====== MY DASHBOARD ====== */}
          {activePanel === 'dashboard' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-900 font-display mb-1">Welcome, Juan!</h2>
                <p className="text-slate-500">Access your digital ID and track your relief claims.</p>
              </div>

              {/* Alert status banner */}
              {activeAlerts.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex items-start gap-4">
                  <div className="bg-red-100 p-3 rounded-xl shrink-0"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
                  <div>
                    <h3 className="font-bold text-red-900 mb-1">Active Emergency Alert</h3>
                    <p className="text-sm text-red-700">{activeAlerts[0].message}</p>
                    <p className="text-xs text-red-500 mt-2 font-medium">{activeAlerts[0].level} • {new Date(activeAlerts[0].timestamp).toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* Quick cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button onClick={() => setActivePanel('qr-id')} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <div className="bg-[#FF8C00]/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-[#FF8C00]/20 transition-colors"><QrCode className="w-6 h-6 text-[#E85D04]" /></div>
                  <h3 className="font-bold text-slate-900 mb-1">My Digital QCitizen ID</h3>
                  <p className="text-sm text-slate-500">View and present your personal QR code for relief distribution.</p>
                </button>
                <button onClick={() => setActivePanel('claim-history')} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                  <div className="bg-emerald-50 p-3 rounded-xl w-fit mb-4 group-hover:bg-emerald-100 transition-colors"><Package className="w-6 h-6 text-emerald-600" /></div>
                  <h3 className="font-bold text-slate-900 mb-1">Relief Claim History</h3>
                  <p className="text-sm text-slate-500">Check the status of your past and pending relief goods claims.</p>
                </button>
              </div>
            </div>
          )}

          {/* ====== MY QR ID ====== */}
          {activePanel === 'qr-id' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">My Digital QCitizen ID</h2>
                <p className="text-slate-500 mt-1">Present this QR code at distribution centers to claim relief goods.</p>
              </div>
              <div className="max-w-md mx-auto">
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden flex flex-col items-center p-8">
                  <div className="w-24 h-24 bg-slate-50 rounded-full mb-4 flex items-center justify-center border border-slate-100 shadow-inner">
                    <User className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">Juan Dela Cruz</h3>
                  <p className="text-slate-500 text-sm mb-8">Brgy. Commonwealth</p>

                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                    <QRCodeSVG value="QC-CITIZEN-0012345" size={200} level="H" includeMargin={true} />
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 mt-6">
                    <p className="text-xs text-slate-500 font-mono font-medium tracking-wider">QC-CITIZEN-0012345</p>
                  </div>
                  <p className="text-sm text-center text-slate-400 mt-6 leading-relaxed">
                    Show this code to the Barangay Admin when claiming your relief goods.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ====== CLAIM HISTORY ====== */}
          {activePanel === 'claim-history' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Relief Goods Claim History</h2>
                <p className="text-slate-500 mt-1">Track all your past and pending relief distributions.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
                  <div className="bg-[#FF8C00]/10 p-2 rounded-lg"><History className="w-5 h-5 text-[#E85D04]" /></div>
                  <h3 className="font-bold text-slate-900 text-lg">Your Claims</h3>
                </div>
                <div className="p-6 space-y-4">
                  {initialReliefHistory.map(claim => (
                    <div key={claim.id} className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50/30 hover:bg-slate-50 transition-colors">
                      <div className="bg-[#FF8C00]/10 p-3 rounded-xl border border-orange-100 text-[#E85D04]">
                        <Package className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-900">{claim.items}</h4>
                          <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                            claim.status === 'Claimed'
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                              : 'bg-amber-50 text-amber-600 border-amber-200'
                          }`}>{claim.status}</span>
                        </div>
                        <div className="flex gap-4 text-xs text-slate-500 font-medium">
                          <p>ID: <span className="font-mono text-slate-400">{claim.id}</span></p>
                          <p>•</p>
                          <p>{new Date(claim.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
