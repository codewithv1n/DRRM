import React, { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import {
  Home, Users, FileText, Send, LogOut, LayoutDashboard, Plus, Minus,
  QrCode, ChevronRight, Search, HelpCircle, Bell, Menu, User,
  Package, Camera, CheckCircle, MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActivePanel = 'dashboard' | 'qr-scanner' | 'sitrep' | 'evacuation';

export default function BarangayAdminDashboard() {
  const navigate = useNavigate();
  const { evacuationCounts, updateEvacuationCount, addSitReport, sitReports } = useMockData();
  const [activePanel, setActivePanel] = useState<ActivePanel>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // SitRep form
  const [sitRepForm, setSitRepForm] = useState({ situation: '', evacuees: 0, casualties: 0, damagedHouses: 0, urgentNeeds: '' });
  const [showSitRepToast, setShowSitRepToast] = useState(false);

  // QR Scanner
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scanVerified, setScanVerified] = useState(false);

  const handleSitRepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSitReport({ ...sitRepForm, barangay: 'Brgy. Commonwealth' });
    setShowSitRepToast(true);
    setSitRepForm({ situation: '', evacuees: 0, casualties: 0, damagedHouses: 0, urgentNeeds: '' });
    setTimeout(() => setShowSitRepToast(false), 3000);
  };

  const handleMockScan = () => {
    setScanResult('QC-CITIZEN-0012345');
    setScanVerified(false);
    setTimeout(() => setScanVerified(true), 1500);
  };

  // Our barangay evac center (first one)
  const localEvac = evacuationCounts[0];

  const NavItem = ({ icon: Icon, label, panel }: { icon: any; label: string; panel: ActivePanel }) => (
    <button
      onClick={() => setActivePanel(panel)}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
        activePanel === panel
          ? 'bg-primary/15 text-primary shadow-sm'
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4.5 h-4.5" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {activePanel === panel && <ChevronRight className="w-4 h-4 opacity-50" />}
    </button>
  );

  const GroupLabel = ({ label }: { label: string }) => (
    <div className="px-3 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-slate-500">{label}</div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen z-50 bg-linear-to-b from-slate-800 to-slate-900 text-slate-300 flex flex-col w-64 shrink-0 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl h-11 w-11 flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-[18px] text-white leading-tight font-display truncate">BDRRMC</h1>
            <p className="text-[12px] text-slate-400 font-medium truncate">Barangay Desk</p>
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

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">Brgy. Admin</span>
                <span className="text-xs text-slate-400 truncate w-24">Commonwealth</span>
              </div>
            </div>
            <button onClick={() => navigate('/login')} className="p-2 text-slate-400 group-hover:text-white transition-colors cursor-pointer">
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
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-sm"><User className="w-5 h-5" /></div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-slate-700">Brgy. Admin</span>
                <span className="text-xs text-slate-400 font-medium">Commonwealth</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8 flex-1 max-w-7xl mx-auto w-full">

          {/* ====== DASHBOARD ====== */}
          {activePanel === 'dashboard' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Barangay Operations Center</h2>
                <p className="text-slate-500 mt-1">Brgy. Commonwealth — Local disaster response overview.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                  <p className="text-2xl font-black text-slate-900 tabular-nums">{localEvac?.current || 0}</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Evacuees</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                  <p className="text-2xl font-black text-slate-900 tabular-nums">{sitReports.filter(s => s.barangay === 'Brgy. Commonwealth').length}</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">SitReps Sent</p>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <p className="text-2xl font-black text-slate-900 tabular-nums">{localEvac ? Math.round((localEvac.current / localEvac.capacity) * 100) : 0}%</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Center Capacity</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
                  <p className="text-2xl font-black text-slate-900 tabular-nums">0</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Relief Distributed</p>
                </div>
              </div>
              {/* Quick actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Scan QR Code', desc: 'Verify residents for relief distribution', icon: QrCode, panel: 'qr-scanner' as ActivePanel },
                  { label: 'Submit SitRep', desc: 'Send situation report to QC EOC', icon: FileText, panel: 'sitrep' as ActivePanel },
                  { label: 'Update Evacuees', desc: 'Update evacuation center headcount', icon: Users, panel: 'evacuation' as ActivePanel },
                ].map(q => (
                  <button key={q.label} onClick={() => setActivePanel(q.panel)} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
                    <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors"><q.icon className="w-6 h-6 text-primary" /></div>
                    <h3 className="font-bold text-slate-900 mb-1">{q.label}</h3>
                    <p className="text-sm text-slate-500">{q.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ====== QR SCANNER ====== */}
          {activePanel === 'qr-scanner' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Relief Goods QR Scanner</h2>
                <p className="text-slate-500 mt-1">Scan resident QR codes to verify and log relief claims.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Scanner Area */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-slate-900">QR Code Scanner</h3>
                  </div>
                  <div className="p-8 flex flex-col items-center">
                    <div className="w-64 h-64 bg-slate-900 rounded-2xl flex items-center justify-center mb-6 border-4 border-dashed border-slate-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent"></div>
                      <QrCode className="w-16 h-16 text-slate-500" />
                    </div>
                    <button onClick={handleMockScan} className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all cursor-pointer">
                      <Camera className="w-5 h-5" /> Simulate Scan
                    </button>
                  </div>
                </div>
                {/* Scan Result */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Package className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-bold text-slate-900">Verification Result</h3>
                  </div>
                  <div className="p-8">
                    {!scanResult ? (
                      <div className="text-center py-12">
                        <QrCode className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 text-sm">Scan a resident's QR code to verify their identity.</p>
                      </div>
                    ) : !scanVerified ? (
                      <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-slate-500 text-sm font-medium">Verifying resident <span className="font-mono">{scanResult}</span>...</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                          <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
                          <div>
                            <p className="font-bold text-emerald-700">Verified Resident</p>
                            <p className="text-sm text-emerald-600">Eligible for relief goods distribution.</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-sm text-slate-500">Name</span><span className="text-sm font-semibold text-slate-900">Juan Dela Cruz</span></div>
                          <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-sm text-slate-500">Citizen ID</span><span className="text-sm font-mono text-slate-600">{scanResult}</span></div>
                          <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-sm text-slate-500">Barangay</span><span className="text-sm font-semibold text-slate-900">Commonwealth</span></div>
                          <div className="flex justify-between py-2"><span className="text-sm text-slate-500">Previous Claims</span><span className="text-sm font-semibold text-slate-900">2</span></div>
                        </div>
                        <button onClick={() => { setScanResult(null); setScanVerified(false); }} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                          <CheckCircle className="w-5 h-5" /> Log as Claimed
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== SITREP UPLOADER ====== */}
          {activePanel === 'sitrep' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Situation Report (SitRep)</h2>
                <p className="text-slate-500 mt-1">Submit your barangay's situation report to the QC EOC.</p>
              </div>
              <div className="max-w-2xl">
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-500" />
                    <h3 className="font-bold text-slate-900">New SitRep — Brgy. Commonwealth</h3>
                  </div>
                  <form onSubmit={handleSitRepSubmit} className="p-6 space-y-5">
                    {showSitRepToast && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in shadow-sm">
                        <Send className="w-4 h-4" /> SitRep submitted to QC EOC!
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">General Situation</label>
                      <textarea rows={3} required value={sitRepForm.situation} onChange={e => setSitRepForm(p => ({ ...p, situation: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none transition-all text-sm" placeholder="Describe the current situation..." />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Evacuees</label>
                        <input type="number" required value={sitRepForm.evacuees} onChange={e => setSitRepForm(p => ({ ...p, evacuees: +e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Casualties</label>
                        <input type="number" required value={sitRepForm.casualties} onChange={e => setSitRepForm(p => ({ ...p, casualties: +e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Damaged Houses</label>
                        <input type="number" required value={sitRepForm.damagedHouses} onChange={e => setSitRepForm(p => ({ ...p, damagedHouses: +e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Urgent Needs</label>
                      <input type="text" value={sitRepForm.urgentNeeds} onChange={e => setSitRepForm(p => ({ ...p, urgentNeeds: e.target.value }))} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm" placeholder="e.g. Relief Goods, Medical Supplies" />
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-[0.98] cursor-pointer">
                      <Send className="w-5 h-5" /> Submit to QC EOC
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ====== EVACUATION UPDATER ====== */}
          {activePanel === 'evacuation' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Evacuation Center Updater</h2>
                <p className="text-slate-500 mt-1">Update the headcount at your local evacuation center.</p>
              </div>
              <div className="max-w-xl">
                {evacuationCounts.map(ec => {
                  const pct = Math.round((ec.current / ec.capacity) * 100);
                  return (
                    <div key={ec.centerId} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden mb-6">
                      <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-slate-900">{ec.name}</h3>
                      </div>
                      <div className="p-8 text-center flex flex-col items-center">
                        <p className="text-slate-500 font-medium mb-4 text-sm">Current Occupants</p>
                        <div className="flex items-center gap-6 mb-6">
                          <button onClick={() => updateEvacuationCount(ec.centerId, -1)} className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                            <Minus className="w-6 h-6" />
                          </button>
                          <div className="text-6xl font-black text-slate-900 w-32 text-center tabular-nums">{ec.current}</div>
                          <button onClick={() => updateEvacuationCount(ec.centerId, 1)} className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer">
                            <Plus className="w-6 h-6" />
                          </button>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                          <div className={`h-3 rounded-full transition-all ${pct >= 100 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                        </div>
                        <p className="text-sm text-slate-500 font-medium">{ec.current} / {ec.capacity} ({pct}% capacity)</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
