import { useState } from 'react';
import {
  Activity, AlertTriangle, CheckCircle, Siren, Filter
} from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import DepartmentLayout from '../../components/layout/DepartmentLayout';

function timeAgo(ts: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

const RESPONSE_UNITS = ['RES-01', 'RES-02', 'RES-03', 'RES-04', 'RES-05'];

export default function IncidentDispatcherPanel() {
  const { incidents, assignResponder } = useMockData();
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const filteredIncidents = filterStatus === 'All' 
    ? incidents 
    : incidents.filter(i => i.status === filterStatus);

  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  const respondingCount = incidents.filter(i => i.status === 'Responding').length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  const handleAssign = (incidentId: string, responderId: string) => {
    if (!responderId) return;
    assignResponder(incidentId, responderId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">Pending</span>;
      case 'Responding':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase"><Activity className="w-3 h-3" /> Responding</span>;
      case 'Resolved':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase"><CheckCircle className="w-3 h-3" /> Resolved</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    if (!priority) return null;
    let colors = 'bg-slate-100 text-slate-700';
    if (priority === 'Critical') colors = 'bg-red-100 text-red-700';
    else if (priority === 'High') colors = 'bg-orange-100 text-orange-700';
    else if (priority === 'Medium') colors = 'bg-blue-100 text-blue-700';

    return <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${colors}`}>{priority}</span>;
  };

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Incident Dispatcher</h2>
          <p className="text-slate-500 mt-1">Receive reports, validate, and dispatch response units in a horizontal view.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-slate-800">{incidents.length}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Total Incidents</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
            <div className="text-xs font-semibold text-amber-600 uppercase mt-1">Pending</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-blue-600">{respondingCount}</div>
            <div className="text-xs font-semibold text-blue-600 uppercase mt-1">Responding</div>
          </div>
          <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-emerald-600">{resolvedCount}</div>
            <div className="text-xs font-semibold text-emerald-600 uppercase mt-1">Resolved</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Filter className="w-4 h-4 text-slate-400" /> Filter by Status:
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
              {['All', 'Pending', 'Responding', 'Resolved'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterStatus === status ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="px-6 py-4">Incident Details</th>
                  <th className="px-6 py-4">Location & Contact</th>
                  <th className="px-6 py-4">Status & Priority</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredIncidents.map(incident => (
                  <tr key={incident.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Siren className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{incident.type}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{incident.id}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{timeAgo(incident.timestamp)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-700">{incident.location}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{incident.reporterName} • {incident.contactNumber}</div>
                      {incident.gpsLocation && (
                        <div className="text-[10px] text-slate-400 font-mono mt-1">GPS: {incident.gpsLocation}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        {getStatusBadge(incident.status)}
                        {getPriorityBadge(incident.priority)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {incident.isVerified ? (
                        <div className="inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-semibold border border-emerald-100">
                          <CheckCircle className="w-3 h-3" /> Verified
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 text-[10px] bg-amber-50 text-amber-600 px-2.5 py-1 rounded-full font-semibold border border-amber-100">
                          <AlertTriangle className="w-3 h-3" /> Spam Score: {incident.spamScore}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {incident.status === 'Pending' ? (
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dispatch Unit</span>
                          <select 
                            className="text-xs border border-primary/30 rounded-lg px-2 py-1.5 bg-primary/5 text-primary font-bold focus:outline-none focus:border-primary shadow-sm cursor-pointer"
                            onChange={(e) => handleAssign(incident.id, e.target.value)}
                            value=""
                          >
                            <option value="" disabled>Select Responder</option>
                            {RESPONSE_UNITS.map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                      ) : incident.status === 'Responding' && incident.assignedResponder ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-slate-400">Assigned To:</span>
                          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">
                            {incident.assignedResponder}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">No actions available</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredIncidents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                      No incidents found for this status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}
