import { Users, Radio, Shield, TrendingUp, Clock, MapPin, Siren } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import DepartmentLayout from '../../components/layout/DepartmentLayout';
function OverviewPanel() {
  const { incidents, evacuationCenters, activeAlerts, auditLogs } = useMockData();

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
          <h2 className="text-2xl font-bold text-slate-900 font-display">Department Dashboard</h2>
          <p className="text-slate-500 mt-1">Real-time city-wide situational awareness</p>
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

export default function DepartmentDashboard() {
  const { incidents } = useMockData();
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <OverviewPanel />
    </DepartmentLayout>
  );
}
