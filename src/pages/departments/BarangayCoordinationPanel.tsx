import {
  Activity, AlertTriangle, Eye, Users
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

function severityColor(severity: string) {
  switch (severity) {
    case 'Critical': return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' };
    case 'Severe': return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-500' };
    case 'Moderate': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' };
    default: return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' };
  }
}

export default function BarangayCoordinationPanel() {
  const { barangaySitReps, incidents } = useMockData();
  const pendingCount = incidents ? incidents.filter(i => i.status === 'Pending').length : 0;

  const totalEvacuees = barangaySitReps.reduce((s, r) => s + r.evacueeCount, 0);
  const criticalCount = barangaySitReps.filter(r => r.damageSeverity === 'Critical').length;
  const severeCount = barangaySitReps.filter(r => r.damageSeverity === 'Severe').length;

  return (
    <DepartmentLayout pendingCount={pendingCount}>
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Barangay Coordination</h2>
          <p className="text-slate-500 mt-1">City-wide consolidation of Situation Reports from 142 barangays</p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
    </div>
    </DepartmentLayout>
  );
}
