import { useState, useEffect } from 'react';
import { encryptedFetch } from '../../utils/encryptedFetch';
import { 
  FileText, Search, CheckCircle2,  
  Users,  Eye, X, PlusCircle 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ASSIGNED_BARANGAY } from './BarangayDashboard';
import BarangayLayout from '../../components/layout/BarangayLayout';


const API_URL = import.meta.env.VITE_API_URL;

interface SitRepLogItem {
  id: string;
  reportNumber: string;
  submittedAt: string;
  generalSituation: string;
  evacueesCount: number;
  damageSeverity: string;
  eocName: string;
  status: string;
  submittedBy: string;
}

export default function SitrepLogsPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<SitRepLogItem | null>(null);
  const [logs, setLogs] = useState<SitRepLogItem[]>([]);
  const [totalEvacuees, setTotalEvacuees] = useState(0);

  useEffect(() => {
    encryptedFetch(`${API_URL}/api/sitreps`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const mapped: SitRepLogItem[] = data.data
            .filter((item: any) => item.barangay === ASSIGNED_BARANGAY)
            .map((item: any) => ({
              id: item.sitreps_id,
              reportNumber: 'SitRep-' + (item.sitreps_id || 'XXXXXX').substring(0,6).toUpperCase(),
              submittedAt: item.created_at,
              generalSituation: item.general_situation,
              evacueesCount: item.evacuee_count,
              damageSeverity: item.damage_severity,
              eocName: item.eoc_name,
              status: item.status,
              submittedBy: item.last_updated_by
            }));
          setLogs(mapped);
        }
      })
      .catch(err => console.error("Error fetching sitreps:", err));

    encryptedFetch(`${API_URL}/api/evacuation-centers`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const brgyEvacs = data.data.filter((ec: any) => ec.barangay === ASSIGNED_BARANGAY);
          const total = brgyEvacs.reduce((sum: number, ec: any) => sum + Number(ec.current_occupants || 0), 0);
          setTotalEvacuees(total);
        }
      })
      .catch(err => console.error("Error fetching evac centers:", err));
  }, []);

  const filteredLogs = logs.filter(log => 
    log.reportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.generalSituation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <BarangayLayout>
      <div className="animate-fade-in space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              SitRep Logs & History
            </h2>
            <p className="text-slate-500 mt-1">
              Official records of Situation Reports submitted by Barangay {ASSIGNED_BARANGAY} to QC EOC
            </p>
          </div>

          <button 
            onClick={() => navigate('/barangays/sitrep_upload')}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-sm transition-all cursor-pointer w-fit"
          >
            <PlusCircle className="w-4 h-4" />
            Submit New SitRep
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Reports</span>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{logs.length}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Logged in system</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Evacuees</span>
              <h3 className="text-2xl font-extrabold text-blue-600 mt-1">{totalEvacuees} pax</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">Across active sites</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">EOC Sync Status</span>
              <h3 className="text-xl font-extrabold text-emerald-600 mt-1 flex items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" /> Synced
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">All SitReps delivered</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs by keyword or report #..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Submitted SitRep Trajectory</h3>
            <span className="text-xs text-slate-500 font-medium">Barangay {ASSIGNED_BARANGAY}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-4 px-6">Report ID</th>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6">Evacuation Center</th>
                  <th className="py-4 px-6">Evacuees</th>
                  <th className="py-4 px-6">Damage Severity</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6 font-bold text-slate-800">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>{log.reportNumber}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 text-xs">
                        {new Date(log.submittedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {log.eocName || 'N/A'}
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {log.evacueesCount} pax
                      </td>
                      <td className="py-4 px-6 text-slate-600">
                        {log.damageSeverity}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {log.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setSelectedLog(log)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Log
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No SitRep logs found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal for View Details */}
        {selectedLog && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 space-y-5 animate-in fade-in zoom-in duration-200">
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    SitRep Detail Record
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 mt-1">{selectedLog.reportNumber}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submitted on {new Date(selectedLog.submittedAt).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-center">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Evacuees</span>
                  <p className="font-bold text-slate-800 text-lg">{selectedLog.evacueesCount}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">Damage</span>
                  <p className="font-bold text-slate-800 text-lg">{selectedLog.damageSeverity}</p>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 uppercase">EOC Name</span>
                  <p className="font-bold text-slate-800 text-sm mt-1 truncate px-1" title={selectedLog.eocName || 'N/A'}>{selectedLog.eocName || 'N/A'}</p>
                </div>
              </div>

              {/* General Situation */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  General Situation Report
                </label>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
                  {selectedLog.generalSituation}
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between text-xs text-blue-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>RLS Signature Verified: {selectedLog.submittedBy}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close Log
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BarangayLayout>
  );
}
