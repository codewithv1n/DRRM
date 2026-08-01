import { useState } from 'react';
import {
  Activity, AlertTriangle, CheckCircle, Shield, Siren, Zap
} from 'lucide-react';
import { useMockData } from '../../../data/MockDataContext';
import { timeAgo } from '../utils/timeAgo';
import { incidentTypeColor } from '../utils/incidentTypeColor';

const RESPONSE_UNITS = ['RES-01', 'RES-02', 'RES-03', 'RES-04', 'RES-05'];

export default function IncidentDispatcherPanel() {
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
