import { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import {
  Send, Radio, AlertTriangle, LayoutDashboard, LogOut,
  Building2, Map, Users, ChevronRight, Search, HelpCircle, Bell, Menu, User,
  BarChart3, Siren, CheckCircle, Clock, Activity, FileText, ArrowUpRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ActivePanel = 'dashboard' | 'incidents' | 'early-warning' | 'map' | 'coordination';

export default function DepartmentAdminDashboard() {
  const { incidents, broadcastAlerts, addBroadcastAlert, sitReports, evacuationCounts, assignIncidentResponder } = useMockData();
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState<ActivePanel>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Early Warning state
  const [alertLevel, setAlertLevel] = useState('Level 1: Normal');
  const [broadcastMessage, setBroadcastMessage] = useState('QC DRRMO Advisory: Please be alert and prepare for possible evacuation.');
  const [showBroadcastToast, setShowBroadcastToast] = useState(false);

  const handleBroadcast = () => {
    addBroadcastAlert({ message: broadcastMessage, level: alertLevel, active: true });
    setShowBroadcastToast(true);
    setTimeout(() => setShowBroadcastToast(false), 3000);
  };

  // Stats
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  const respondingCount = incidents.filter(i => i.status === 'Responding').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;
  const totalEvacuees = evacuationCounts.reduce((sum, ec) => sum + ec.current, 0);

  // --- Nav Components ---
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
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col overflow-hidden">
            <h1 className="font-bold text-[18px] text-white leading-tight font-display truncate">QC EOC</h1>
            <p className="text-[12px] text-slate-400 font-medium truncate">Department Admin</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
          <GroupLabel label="Main" />
          <NavItem icon={LayoutDashboard} label="Dashboard" panel="dashboard" />
          <GroupLabel label="Operations" />
          <NavItem icon={Siren} label="Incident Dispatcher" panel="incidents" />
          <NavItem icon={Radio} label="Early Warning System" panel="early-warning" />
          <GroupLabel label="Monitoring" />
          <NavItem icon={Map} label="Hazard & Evacuation Map" panel="map" />
          <NavItem icon={BarChart3} label="Barangay Coordination" panel="coordination" />
        </div>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <User className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-white">EOC Head</span>
                <span className="text-xs text-slate-400 truncate w-24">admin@qc.gov.ph</span>
              </div>
            </div>
            <button onClick={() => navigate('/login')} className="p-2 text-slate-400 group-hover:text-white transition-colors cursor-pointer">
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex relative w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search incidents, barangays..." className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-slate-400 text-slate-900" />
            </div>
          </div>
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"><HelpCircle className="w-5 h-5" /></button>
            <button className="relative text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
              <Bell className="w-5 h-5" />
              {pendingCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center font-bold">{pendingCount}</span>}
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary to-blue-600 flex items-center justify-center text-white shadow-sm"><User className="w-5 h-5" /></div>
              <div className="hidden sm:flex flex-col">
                <span className="text-sm font-semibold text-slate-700">EOC Head</span>
                <span className="text-xs text-slate-400 font-medium">Super Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-8 flex-1 max-w-7xl mx-auto w-full">

          {/* ====== DASHBOARD PANEL ====== */}
          {activePanel === 'dashboard' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">City-Wide Overview</h2>
                <p className="text-slate-500 mt-1">Real-time monitoring of all incidents and operations across Quezon City.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Pending', value: pendingCount, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
                  { label: 'Responding', value: respondingCount, icon: Activity, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'Resolved', value: resolvedCount, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
                  { label: 'Total Evacuees', value: totalEvacuees, icon: Users, color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
                ].map((stat) => (
                  <div key={stat.label} className={`${stat.bg} border rounded-2xl p-5 flex items-center gap-4`}>
                    <div className={`p-3 rounded-xl ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
                    <div>
                      <p className="text-2xl font-black text-slate-900 tabular-nums">{stat.value}</p>
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Recent Incidents Quick View */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" /> Latest Incidents</h3>
                  <button onClick={() => setActivePanel('incidents')} className="text-primary text-sm font-semibold flex items-center gap-1 hover:underline cursor-pointer">View All <ArrowUpRight className="w-4 h-4" /></button>
                </div>
                <div className="divide-y divide-slate-100">
                  {incidents.slice(0, 5).map(inc => (
                    <div key={inc.id} className="p-4 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm text-slate-500 font-medium">{inc.id}</span>
                        <span className="text-sm text-slate-700 font-medium">{inc.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${inc.type === 'Fire' ? 'bg-red-50 text-red-600 border-red-100' : inc.type === 'Flood' ? 'bg-blue-50 text-blue-600 border-blue-100' : inc.type === 'Medical' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{inc.type}</span>
                        <span className={`px-2 py-1 rounded-md text-xs font-semibold border ${inc.status === 'Pending' ? 'bg-slate-100 text-slate-600 border-slate-200' : inc.status === 'Responding' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{inc.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====== INCIDENT DISPATCHER ====== */}
          {activePanel === 'incidents' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Incident Dispatcher</h2>
                <p className="text-slate-500 mt-1">Manage and dispatch response units to emergency tickets.</p>
              </div>
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2"><Siren className="w-5 h-5 text-red-500" /> All Emergency Tickets</h3>
                  <span className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">{incidents.filter(i => i.status !== 'Resolved').length} Active</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-500 text-sm bg-slate-50/30">
                        <th className="p-4 font-semibold">Ticket ID</th>
                        <th className="p-4 font-semibold">Location</th>
                        <th className="p-4 font-semibold">Type</th>
                        <th className="p-4 font-semibold">Reporter</th>
                        <th className="p-4 font-semibold">Status</th>
                        <th className="p-4 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidents.map(inc => (
                        <tr key={inc.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 text-sm font-mono font-medium text-slate-600">{inc.id}</td>
                          <td className="p-4 text-sm text-slate-700">{inc.location}</td>
                          <td className="p-4 text-sm"><span className={`px-2 py-1 rounded-md text-xs font-semibold border ${inc.type === 'Fire' ? 'bg-red-50 text-red-600 border-red-100' : inc.type === 'Flood' ? 'bg-blue-50 text-blue-600 border-blue-100' : inc.type === 'Medical' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{inc.type}</span></td>
                          <td className="p-4 text-sm text-slate-500">{inc.reporterName}</td>
                          <td className="p-4 text-sm"><span className={`px-2 py-1 rounded-md text-xs font-semibold border ${inc.status === 'Pending' ? 'bg-slate-100 text-slate-600 border-slate-200' : inc.status === 'Responding' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{inc.status}</span></td>
                          <td className="p-4">
                            {inc.status === 'Pending' ? (
                              <button onClick={() => assignIncidentResponder(inc.id, 'QC Task Force')} className="text-xs bg-primary hover:bg-primary/90 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer">Dispatch Unit</button>
                            ) : inc.status === 'Responding' ? (
                              <span className="text-xs text-blue-600 font-semibold">{inc.assignedResponder || 'Dispatched'}</span>
                            ) : (
                              <span className="text-xs text-emerald-600 font-semibold">Closed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                      {incidents.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-400">No incidents reported yet.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ====== EARLY WARNING SYSTEM ====== */}
          {activePanel === 'early-warning' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Early Warning System</h2>
                <p className="text-slate-500 mt-1">Broadcast city-wide alerts and advisories to all residents.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Broadcast Panel */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-red-50/30 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-red-500" />
                    <h3 className="font-bold text-slate-900">Alert Broadcaster</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    {showBroadcastToast && (
                      <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in shadow-sm">
                        <Send className="w-4 h-4" /> SMS Broadcast Sent Successfully!
                      </div>
                    )}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Alert Level</label>
                      <select value={alertLevel} onChange={e => setAlertLevel(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all text-sm font-medium">
                        <option>Level 1: Normal</option>
                        <option>Level 2: Heightened Monitoring</option>
                        <option>Level 3: Pre-Evacuation</option>
                        <option>Level 4: Forced Evacuation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Broadcast Message</label>
                      <textarea rows={4} value={broadcastMessage} onChange={e => setBroadcastMessage(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none transition-all text-sm" />
                    </div>
                    <button onClick={handleBroadcast} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98] cursor-pointer">
                      <Send className="w-5 h-5" /> Broadcast SMS Now
                    </button>
                  </div>
                </div>
                {/* Broadcast History */}
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-500" />
                    <h3 className="font-bold text-slate-900">Broadcast History</h3>
                  </div>
                  <div className="p-4 space-y-3 max-h-125 overflow-y-auto">
                    {broadcastAlerts.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">No broadcasts sent yet.</p>}
                    {broadcastAlerts.map(alert => (
                      <div key={alert.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full">{alert.level}</span>
                          <span className="text-xs text-slate-400">{new Date(alert.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm text-slate-700">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== HAZARD & EVACUATION MAP ====== */}
          {activePanel === 'map' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Hazard & Evacuation Map</h2>
                <p className="text-slate-500 mt-1">City-wide view of hazard zones and evacuation center capacity.</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden h-125 flex items-center justify-center">
                  <div className="text-center p-8">
                    <Map className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive Map</h3>
                    <p className="text-sm text-slate-400">MapLibre integration with hazard pins and evacuation markers will render here.</p>
                    <p className="text-xs text-slate-300 mt-2">Coordinates: 14.6760° N, 121.0437° E (Quezon City)</p>
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-slate-900">Evacuation Centers</h3>
                  </div>
                  <div className="p-4 space-y-3">
                    {evacuationCounts.map(ec => {
                      const pct = Math.round((ec.current / ec.capacity) * 100);
                      const isFull = pct >= 100;
                      return (
                        <div key={ec.centerId} className="p-4 rounded-xl border border-slate-100 bg-slate-50/30">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-bold text-slate-900 leading-tight">{ec.name}</h4>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${isFull ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>{isFull ? 'Full' : 'Open'}</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mb-1">
                            <div className={`h-2 rounded-full transition-all ${isFull ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(pct, 100)}%` }}></div>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{ec.current} / {ec.capacity} ({pct}%)</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ====== BARANGAY COORDINATION ====== */}
          {activePanel === 'coordination' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-display">Barangay DRRM Coordination</h2>
                <p className="text-slate-500 mt-1">Consolidated situation reports from 142 barangays.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total Evacuees', value: totalEvacuees, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-100' },
                  { label: 'SitReps Received', value: sitReports.length, color: 'text-emerald-500', bg: 'bg-emerald-50 border-emerald-100' },
                  { label: 'Total Casualties', value: sitReports.reduce((s, r) => s + r.casualties, 0), color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
                  { label: 'Damaged Houses', value: sitReports.reduce((s, r) => s + r.damagedHouses, 0), color: 'text-amber-500', bg: 'bg-amber-50 border-amber-100' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border rounded-2xl p-5`}>
                    <p className="text-2xl font-black text-slate-900 tabular-nums">{s.value}</p>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* SitRep Feed */}
              <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5 text-slate-500" /> Situation Reports</h3>
                  <button className="text-sm bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"><ArrowUpRight className="w-4 h-4" /> Export to Social Services</button>
                </div>
                <div className="divide-y divide-slate-100">
                  {sitReports.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">No SitReps received yet. Barangay Admins submit these during disasters.</div>}
                  {sitReports.map(sr => (
                    <div key={sr.id} className="p-4 hover:bg-slate-50/80 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-bold text-slate-900 text-sm">{sr.barangay}</span>
                          <span className="text-xs text-slate-400 ml-2">{new Date(sr.timestamp).toLocaleString()}</span>
                        </div>
                        <span className="font-mono text-xs text-slate-400">{sr.id}</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-2">{sr.situation}</p>
                      <div className="flex gap-4 text-xs text-slate-500 font-medium">
                        <span>Evacuees: <strong className="text-slate-700">{sr.evacuees}</strong></span>
                        <span>Casualties: <strong className="text-red-600">{sr.casualties}</strong></span>
                        <span>Damaged: <strong className="text-amber-600">{sr.damagedHouses}</strong></span>
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
