import { useState } from 'react';
import {
  Activity, AlertTriangle, ArrowUpRight, CheckCircle, Clock, 
  Users, WifiOff, Siren, Radio, MapPin, Plus, Minus, Send,
  Shield, TrendingUp, FileText, Eye, Zap, Wifi
} from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import DepartmentLayout from '../../components/layout/DepartmentLayout';

const RESPONSE_UNITS = ['RES-01', 'RES-02', 'RES-03', 'RES-04', 'RES-05'];

// ─── Helper: time-ago string ────────────────────────────────────────────────
function timeAgo(ts: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

// ─── Helper: severity color ─────────────────────────────────────────────────
function severityColor(severity: string) {
  switch (severity) {
    case 'Critical': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
    case 'Severe': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' };
    case 'Moderate': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    default: return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
  }
}

// ─── Helper: incident type color ────────────────────────────────────────────
function incidentTypeColor(type: string) {
  switch (type) {
    case 'Fire': return 'from-red-500 to-rose-600';
    case 'Flood': return 'from-blue-500 to-indigo-600';
    case 'Medical': return 'from-emerald-500 to-teal-600';
    default: return 'from-amber-500 to-orange-600';
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// PANEL 1 — Overview Dashboard
// ═══════════════════════════════════════════════════════════════════════════════
function OverviewPanel() {
  const { incidents, evacuationCenters, activeAlerts, auditLogs, isOffline, setIsOffline, actionQueue, syncQueue } = useMockData();

  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  const respondingCount = incidents.filter(i => i.status === 'Responding').length;
  const totalEvacuees = evacuationCenters.reduce((sum, ec) => sum + ec.currentOccupancy, 0);
  const failedAlerts = activeAlerts.filter(a => a.deliveryStatus === 'Failed').length;

  const statCards = [
    { label: 'Active Incidents', value: pendingCount + respondingCount, icon: Siren, gradient: 'from-red-500 to-rose-600', sub: `${pendingCount} pending` },
    { label: 'Total Evacuees', value: totalEvacuees.toLocaleString(), icon: Users, gradient: 'from-blue-500 to-indigo-600', sub: `${evacuationCenters.length} centers` },
    { label: 'Alerts Sent', value: activeAlerts.length, icon: Radio, gradient: 'from-amber-500 to-orange-600', sub: failedAlerts > 0 ? `${failedAlerts} failed` : 'All delivered' },
    { label: 'Audit Entries', value: auditLogs.length, icon: Shield, gradient: 'from-emerald-500 to-teal-600', sub: 'Immutable log' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* System Status Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Command Center Overview</h2>
          <p className="text-slate-500 mt-1">Real-time city-wide situational awareness</p>
        </div>
        <div className="flex items-center gap-3">
          {actionQueue.length > 0 && (
            <button onClick={syncQueue} className="text-xs bg-amber-100 text-amber-700 font-bold px-4 py-2 rounded-full border border-amber-200 hover:bg-amber-200 transition-colors">
              Sync {actionQueue.length} Pending
            </button>
          )}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
              isOffline
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/25'
                : 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:shadow-md'
            }`}
          >
            {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4 text-emerald-500" />}
            {isOffline ? 'Offline (Simulated)' : 'System Online'}
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-slate-900 font-display">{card.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{card.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${card.gradient} opacity-60`} />
          </div>
        ))}
      </div>

      {/* Two-column: Recent Activity + Quick Evac Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity Feed */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Recent Activity
            </h3>
          </div>
          <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
            {auditLogs.length > 0 ? auditLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="px-6 py-3.5 hover:bg-slate-50/50 transition-colors flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700">{log.action} <span className="font-normal text-slate-400">by {log.userRole}</span></p>
                  <p className="text-xs text-slate-500 truncate">{log.details}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(log.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            )) : (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">No recent activity yet. Actions will appear here.</div>
            )}
          </div>
        </div>

        {/* Quick Evacuation Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              Evacuation Status
            </h3>
          </div>
          <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
            {evacuationCenters.map(ec => {
              const pct = Math.round((ec.currentOccupancy / ec.capacity) * 100);
              const isCritical = pct >= 90;
              return (
                <div key={ec.id} className="px-6 py-3.5">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="text-sm font-semibold text-slate-800 truncate">{ec.name}</p>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isCritical ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${isCritical ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{ec.currentOccupancy} / {ec.capacity}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// PANEL 2 — Incident Dispatcher
// ═══════════════════════════════════════════════════════════════════════════════
function IncidentDispatcherPanel() {
  const { incidents, assignResponder, auditLogs } = useMockData();
  const [assigningId, setAssigningId] = useState<string | null>(null);

  const pending = incidents.filter(i => i.status === 'Pending');
  const responding = incidents.filter(i => i.status === 'Responding');
  const resolved = incidents.filter(i => i.status === 'Resolved');

  const handleAssign = (incidentId: string, responderId: string) => {
    assignResponder(incidentId, responderId);
    setAssigningId(null);
  };

  const IncidentCard = ({ incident }: { incident: typeof incidents[0] }) => (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 animate-fade-in">
      {/* Color header */}
      <div className={`px-4 py-2.5 bg-linear-to-r ${incidentTypeColor(incident.type)} flex items-center justify-between`}>
        <div className="flex items-center gap-2 text-white">
          <Siren className="w-4 h-4" />
          <span className="text-sm font-bold">{incident.type}</span>
        </div>
        <span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm">{incident.id}</span>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <p className="text-sm font-bold text-slate-900">{incident.location}</p>
          <p className="text-xs text-slate-500">{incident.reporterName} • {incident.contactNumber}</p>
          {incident.gpsLocation && (
            <p className="text-[10px] text-slate-400 font-mono mt-1">GPS: {incident.gpsLocation}</p>
          )}
        </div>

        {/* Anti-abuse indicator */}
        {incident.isVerified ? (
          <div className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-semibold border border-emerald-100">
            <CheckCircle className="w-3 h-3" /> Verified
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-semibold border border-amber-100">
            <AlertTriangle className="w-3 h-3" /> Spam Score: {incident.spamScore}
          </div>
        )}

        <p className="text-[10px] text-slate-400">{timeAgo(incident.timestamp)}</p>

        {/* Assign responder */}
        {incident.status === 'Pending' && (
          <div className="pt-2 border-t border-slate-100">
            {assigningId === incident.id ? (
              <div className="space-y-2 animate-fade-in">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Select Response Unit</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {RESPONSE_UNITS.map(unit => (
                    <button
                      key={unit}
                      onClick={() => handleAssign(incident.id, unit)}
                      className="text-xs bg-primary/10 text-primary font-semibold px-2.5 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all"
                    >
                      {unit}
                    </button>
                  ))}
                </div>
                <button onClick={() => setAssigningId(null)} className="text-[10px] text-slate-400 hover:text-slate-600 w-full text-center mt-1">
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAssigningId(incident.id)}
                className="w-full flex items-center justify-center gap-2 text-xs bg-primary text-white font-semibold px-3 py-2.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Zap className="w-3 h-3" /> Dispatch Unit
              </button>
            )}
          </div>
        )}

        {incident.status === 'Responding' && incident.assignedResponder && (
          <div className="pt-2 border-t border-slate-100">
            <p className="text-xs text-blue-600 font-semibold flex items-center gap-1.5">
              <Activity className="w-3 h-3" /> Assigned: {incident.assignedResponder}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const KanbanColumn = ({ title, items, color, count }: { title: string; items: typeof incidents; color: string; count: number }) => (
    <div className="min-w-0">
      <div className="flex items-center gap-2 mb-4 px-1">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <h4 className="text-sm font-bold text-slate-700">{title}</h4>
        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{count}</span>
      </div>
      <div className="space-y-3">
        {items.map(inc => <IncidentCard key={inc.id} incident={inc} />)}
        {items.length === 0 && (
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-xs">
            No incidents
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Incident Dispatcher</h2>
        <p className="text-slate-500 mt-1">Receive reports, validate, and dispatch response units</p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KanbanColumn title="Pending" items={pending} color="bg-amber-500" count={pending.length} />
        <KanbanColumn title="Responding" items={responding} color="bg-blue-500" count={responding.length} />
        <KanbanColumn title="Resolved" items={resolved} color="bg-emerald-500" count={resolved.length} />
      </div>

      {/* Dispatch Audit Log */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-slate-400" />
            Immutable Dispatch Audit Trail
          </h3>
          <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {auditLogs.length} Entries
          </span>
        </div>
        <div className="max-h-72 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-slate-50">
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Time</th>
                <th className="px-6 py-3 font-semibold">Action</th>
                <th className="px-6 py-3 font-semibold">Role</th>
                <th className="px-6 py-3 font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {auditLogs.length > 0 ? auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-3 text-xs text-slate-400 whitespace-nowrap font-mono">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="px-6 py-3 font-semibold text-slate-700">{log.action}</td>
                  <td className="px-6 py-3">
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{log.userRole}</span>
                  </td>
                  <td className="px-6 py-3 text-slate-500 text-xs max-w-xs truncate">{log.details}</td>
                </tr>
              )) : (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400 text-xs">No audit entries yet. Dispatch a unit to create the first entry.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// PANEL 3 — Early Warning System
// ═══════════════════════════════════════════════════════════════════════════════
function EarlyWarningPanel() {
  const { activeAlerts, broadcastAlert, addAuditLog } = useMockData();
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Red Alert');

  const alertLevels = [
    { label: 'Red Rainfall', level: 'Red Rainfall', color: 'bg-red-500 hover:bg-red-600', icon: '🌧️' },
    { label: 'River Critical', level: 'Tullahan River Critical', color: 'bg-rose-600 hover:bg-rose-700', icon: '🌊' },
    { label: 'Signal No. 3', level: 'Signal No. 3', color: 'bg-orange-500 hover:bg-orange-600', icon: '🌀' },
    { label: 'General Alert', level: 'General Alert', color: 'bg-amber-500 hover:bg-amber-600', icon: '⚠️' },
  ];

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    broadcastAlert(selectedLevel, broadcastMessage, false);
    addAuditLog('Broadcast', 'Department Admin', `Sent primary broadcast [${selectedLevel}]: ${broadcastMessage}`);
    setBroadcastMessage('');
  };

  const handleFallbackBroadcast = (alertMsg: string) => {
    broadcastAlert('Red Alert', alertMsg, true);
    addAuditLog('Broadcast Fallback', 'Department Admin', `Triggered SMS Backup for: ${alertMsg}`);
  };

  const statusDot = (status: string) => {
    const colors: Record<string, string> = { Sent: 'bg-emerald-500', Pending: 'bg-amber-500', Failed: 'bg-red-500' };
    return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-slate-300'} animate-pulse`} />;
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Early Warning System</h2>
        <p className="text-slate-500 mt-1">Broadcast life-critical alerts with automatic failover redundancy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Broadcast Panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Alert Buttons */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Alert Levels</h3>
            <div className="grid grid-cols-2 gap-3">
              {alertLevels.map(al => (
                <button
                  key={al.level}
                  onClick={() => setSelectedLevel(al.level)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    selectedLevel === al.level
                      ? `${al.color} text-white shadow-lg scale-[1.02]`
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="text-lg">{al.icon}</span>
                  <span>{al.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compose */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Compose Broadcast</h3>
            <div className="mb-2">
              <span className="inline-block text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full mb-3">
                {selectedLevel}
              </span>
            </div>
            <textarea
              rows={4}
              value={broadcastMessage}
              onChange={e => setBroadcastMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none transition-all text-sm placeholder-slate-400"
              placeholder="Type your alert message here..."
            />
            <button
              onClick={handleBroadcast}
              disabled={!broadcastMessage.trim()}
              className="w-full mt-3 bg-linear-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
              Send via WebSocket (Primary)
            </button>
            <p className="text-[10px] text-slate-400 mt-2 text-center">Primary channel auto-retries via SMS backup on failure</p>
          </div>
        </div>

        {/* Delivery Log */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-slate-400" />
              Delivery Log
            </h3>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2.5 py-1 rounded-full">
              {activeAlerts.length} Alerts
            </span>
          </div>

          <div className="divide-y divide-slate-50 max-h-130 overflow-y-auto">
            {activeAlerts.length > 0 ? activeAlerts.map(alert => (
              <div key={alert.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">{alert.level}</span>
                    {alert.channel === 'SMS Backup' && (
                      <span className="text-[9px] font-black bg-slate-700 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">SMS Backup</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {statusDot(alert.deliveryStatus)}
                    <span className={`text-xs font-bold ${
                      alert.deliveryStatus === 'Failed' ? 'text-red-500' :
                      alert.deliveryStatus === 'Pending' ? 'text-amber-500' : 'text-emerald-600'
                    }`}>
                      {alert.deliveryStatus}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-2">{alert.message}</p>

                {alert.deliveryStatus === 'Failed' && (
                  <button
                    onClick={() => handleFallbackBroadcast(alert.message)}
                    className="mt-1 w-full text-xs bg-linear-to-r from-slate-800 to-slate-900 text-white px-3 py-2 rounded-lg font-semibold hover:from-slate-900 hover:to-black transition-all flex items-center justify-center gap-2"
                  >
                    <Radio className="w-3 h-3" /> Retry via SMS Backup Gateway
                  </button>
                )}
              </div>
            )) : (
              <div className="px-6 py-16 text-center">
                <Radio className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No alerts broadcast yet.</p>
                <p className="text-slate-300 text-xs mt-1">Send your first alert using the panel on the left.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// PANEL 4 — Hazard & Evacuation Map
// ═══════════════════════════════════════════════════════════════════════════════
function HazardMapPanel() {
  const { evacuationCenters, updateEvacuationOccupancy } = useMockData();

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Hazard & Evacuation Map</h2>
        <p className="text-slate-500 mt-1">Monitor evacuation centers with stale-data indicators and atomic occupancy controls</p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Centers', value: evacuationCenters.length, color: 'text-primary' },
          { label: 'Total Capacity', value: evacuationCenters.reduce((s, e) => s + e.capacity, 0).toLocaleString(), color: 'text-blue-600' },
          { label: 'Total Occupants', value: evacuationCenters.reduce((s, e) => s + e.currentOccupancy, 0).toLocaleString(), color: 'text-amber-600' },
          { label: 'At Capacity', value: evacuationCenters.filter(e => e.currentOccupancy >= e.capacity).length, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className={`text-2xl font-bold ${s.color} font-display`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Evacuation Center Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {evacuationCenters.map(ec => {
          const pct = Math.round((ec.currentOccupancy / ec.capacity) * 100);
          const isFull = ec.currentOccupancy >= ec.capacity;
          const minsAgo = ec.lastUpdatedAt ? Math.max(0, Math.floor((Date.now() - new Date(ec.lastUpdatedAt).getTime()) / 60000)) : 999;
          const isStale = minsAgo > 30;

          return (
            <div key={ec.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${isStale ? 'border-amber-200' : 'border-slate-100'}`}>
              {/* Header */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug pr-2">{ec.name}</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${isFull ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {isFull ? 'FULL' : 'OPEN'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">{ec.id}</p>
              </div>

              {/* Capacity Bar */}
              <div className="px-5">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-2xl font-bold text-slate-900 font-display">{pct}%</span>
                  <span className="text-xs text-slate-500 font-medium">{ec.currentOccupancy} / {ec.capacity}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isFull ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>

              {/* Stale data indicator */}
              <div className="px-5 mt-3">
                <div className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1.5 rounded-lg ${
                  isStale ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-500'
                }`}>
                  <Clock className="w-3 h-3" />
                  Last updated: {timeAgo(ec.lastUpdatedAt || '')}
                  {isStale && <span className="font-bold ml-1">⚠ STALE</span>}
                </div>
              </div>

              {/* Atomic +/- Controls */}
              <div className="px-5 py-4 mt-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adjust Occupancy</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateEvacuationOccupancy(ec.id, -10)}
                    disabled={ec.currentOccupancy <= 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-500 w-6 text-center">±10</span>
                  <button
                    onClick={() => updateEvacuationOccupancy(ec.id, 10)}
                    disabled={ec.currentOccupancy >= ec.capacity}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// PANEL 5 — Barangay Coordination
// ═══════════════════════════════════════════════════════════════════════════════
function BarangayCoordinationPanel() {
  const { barangaySitReps, addAuditLog } = useMockData();
  const [showExportModal, setShowExportModal] = useState(false);

  const totalEvacuees = barangaySitReps.reduce((s, r) => s + r.evacueeCount, 0);
  const totalHouseholds = barangaySitReps.reduce((s, r) => s + r.householdCount, 0);
  const criticalCount = barangaySitReps.filter(r => r.damageSeverity === 'Critical').length;
  const severeCount = barangaySitReps.filter(r => r.damageSeverity === 'Severe').length;

  const handleExport = () => {
    addAuditLog('Export Data', 'Department Admin', 'Exported SitReps to Social Services (PII-stripped, RA 10173 compliant)');
    setShowExportModal(false);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Barangay Coordination</h2>
          <p className="text-slate-500 mt-1">City-wide consolidation of Situation Reports from 142 barangays</p>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-2 text-sm bg-linear-to-r from-emerald-500 to-teal-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
          Export to Social Services
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{totalEvacuees.toLocaleString()}</p>
          <p className="text-xs text-slate-500 font-medium">Total Evacuees</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <FileText className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{totalHouseholds.toLocaleString()}</p>
          <p className="text-xs text-slate-500 font-medium">Affected Households</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{criticalCount}</p>
          <p className="text-xs text-slate-500 font-medium">Critical Barangays</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
              <Activity className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-display">{severeCount}</p>
          <p className="text-xs text-slate-500 font-medium">Severe Barangays</p>
        </div>
      </div>

      {/* SitRep Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Eye className="w-4 h-4 text-slate-400" />
            Situation Reports
          </h3>
          <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2.5 py-1 rounded-full">
            {barangaySitReps.length} Reports
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-[10px] text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-3 font-semibold">Barangay</th>
                <th className="px-6 py-3 font-semibold">Households</th>
                <th className="px-6 py-3 font-semibold">Evacuees</th>
                <th className="px-6 py-3 font-semibold">Damage</th>
                <th className="px-6 py-3 font-semibold">Last Updated</th>
                <th className="px-6 py-3 font-semibold">Updated By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {barangaySitReps.map(rep => {
                const sc = severityColor(rep.damageSeverity);
                return (
                  <tr key={rep.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900">Brgy. {rep.barangay}</td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium">{rep.householdCount.toLocaleString()}</td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium">{rep.evacueeCount.toLocaleString()}</td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${sc.bg} ${sc.text} border ${sc.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {rep.damageSeverity}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-xs text-slate-400">{timeAgo(rep.timestamp)}</td>
                    <td className="px-6 py-3.5 text-xs text-slate-500">{rep.lastUpdatedBy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-100 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 animate-scale-in">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Privacy-Preserving Export</h3>
                <p className="text-xs text-slate-500">RA 10173 — Data Privacy Act Compliance</p>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-5">
              <p className="text-sm text-emerald-800 leading-relaxed">
                This export will transmit <span className="font-bold">only aggregated data</span> to the Social Services Management system:
              </p>
              <ul className="mt-3 space-y-1.5 text-sm text-emerald-700">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Household counts per barangay</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Damage severity levels</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Evacuee totals</li>
              </ul>
              <div className="mt-3 pt-3 border-t border-emerald-200">
                <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                  <Shield className="w-3 h-3" /> Personal profiles and PII are automatically stripped.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="flex-1 py-3 px-4 rounded-xl bg-linear-to-r from-emerald-500 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                Confirm Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════════════════════
// MAIN — DepartmentDashboard (Panel Router)
// ═══════════════════════════════════════════════════════════════════════════════
export default function DepartmentDashboard() {
  const [activePanel, setActivePanel] = useState<'dashboard' | 'incidents' | 'early-warning' | 'map' | 'coordination'>('dashboard');
  const { incidents } = useMockData();
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;

  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard': return <OverviewPanel />;
      case 'incidents': return <IncidentDispatcherPanel />;
      case 'early-warning': return <EarlyWarningPanel />;
      case 'map': return <HazardMapPanel />;
      case 'coordination': return <BarangayCoordinationPanel />;
    }
  };

  return (
    <DepartmentLayout activePanel={activePanel} setActivePanel={setActivePanel} pendingCount={pendingCount}>
      {renderPanel()}
    </DepartmentLayout>
  );
}
