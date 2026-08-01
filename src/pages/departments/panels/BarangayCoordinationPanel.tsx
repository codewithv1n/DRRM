import { useState } from 'react';
import {
  Activity, AlertTriangle, ArrowUpRight, CheckCircle, Eye, FileText, Shield, Users
} from 'lucide-react';
import { useMockData } from '../../../data/MockDataContext';
import { timeAgo } from '../utils/timeAgo';
import { severityColor } from '../utils/severityColor';

export default function BarangayCoordinationPanel() {
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
