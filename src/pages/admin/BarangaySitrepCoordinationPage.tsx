import { useState, useEffect } from 'react';
import { 
  Building2, Users, AlertTriangle, Search, Filter, 
  CheckCircle2, Clock, Eye, Download, ShieldAlert, X, Send
} from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';

export default function BarangaySitrepCoordinationPage() {
  const [barangaySitReps, setBarangaySitReps] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [selectedSitRep, setSelectedSitRep] = useState<any | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const fetchSitreps = () => {
    fetch('http://localhost:3000/api/sitreps')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const aggregated = Object.values(data.data.reduce((acc: any, item: any) => {
            const barangay = item.barangay;
            if (!acc[barangay]) {
              acc[barangay] = {
                id: item.id,
                barangay: item.barangay,
                generalSituation: item.general_situation,
                evacueeCount: Number(item.evacuee_count) || 0,
                casualties: Number(item.casualties) || 0,
                householdCount: Number(item.household_count) || 0,
                damageSeverity: item.damage_severity,
                status: item.status,
                lastUpdatedBy: item.last_updated_by,
                timestamp: item.created_at
              };
            } else {
              acc[barangay].evacueeCount += Number(item.evacuee_count) || 0;
              acc[barangay].casualties += Number(item.casualties) || 0;
              acc[barangay].householdCount += Number(item.household_count) || 0;
              // Update with latest string/status fields based on timestamp
              if (new Date(item.created_at) > new Date(acc[barangay].timestamp)) {
                acc[barangay].id = item.id;
                acc[barangay].generalSituation = item.general_situation;
                acc[barangay].damageSeverity = item.damage_severity;
                acc[barangay].status = item.status;
                acc[barangay].lastUpdatedBy = item.last_updated_by;
                acc[barangay].timestamp = item.created_at;
              }
            }
            return acc;
          }, {}));
          
          setBarangaySitReps(aggregated as any[]);
        }
      })
      .catch(err => console.error("Error fetching sitreps:", err));
  };

  useEffect(() => {
    fetchSitreps();
  }, []);

  // Calculate Summary Metrics
  const totalReports = barangaySitReps.length;
  const totalEvacuees = barangaySitReps.reduce((sum, item) => sum + item.evacueeCount, 0);
  const criticalCount = barangaySitReps.filter(item => item.damageSeverity === 'Critical' || item.damageSeverity === 'Severe').length;

  // Filtered SitReps
  const filteredSitReps = barangaySitReps.filter(rep => {
    const matchesSearch = rep.barangay.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rep.lastUpdatedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All' || rep.damageSeverity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleAcknowledge = async (id: string, barangay: string) => {
    try {
      const res = await fetch(`http://localhost:3000/api/sitreps/${id}/acknowledge`, { method: 'PATCH' });
      if (res.ok) {
        setActionSuccess(`SitRep from Barangay ${barangay} has been acknowledged.`);
        fetchSitreps();
        setTimeout(() => setActionSuccess(null), 3500);
      }
    } catch (error) {
      console.error("Error acknowledging sitrep:", error);
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 w-fit"><ShieldAlert className="w-3.5 h-3.5" /> Critical</span>;
      case 'Severe':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1 w-fit"><AlertTriangle className="w-3.5 h-3.5" /> Severe</span>;
      case 'Moderate':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit"><Clock className="w-3.5 h-3.5" /> Moderate</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3.5 h-3.5" /> Minor</span>;
    }
  };

  return (
    <DepartmentLayout>
      <div className="animate-fade-in space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-3">
              
              Barangay SitRep Coordination
            </h2>
            <p className="text-slate-500 mt-1">
              Consolidated Situation Reports submitted by Quezon City Barangays to the EOC Command Center
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => alert("SitRep Summary exported as official PDF report.")}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Export Summary Report
            </button>
          </div>
        </div>

        {/* Action Alert Toast */}
        {actionSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              {actionSuccess}
            </div>
            <button onClick={() => setActionSuccess(null)} className="text-emerald-600 hover:text-emerald-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Reports Received</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalReports}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Barangay submissions</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Total Evacuees</p>
              <h3 className="text-3xl font-extrabold text-blue-600 mt-1">{totalEvacuees.toLocaleString()}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Individuals in ECs</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Critical / Severe</p>
              <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{criticalCount}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Barangays needing priority</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* SitRep Table Container */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] overflow-hidden mt-2">
          <div className="p-5 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-slate-500 mt-0.5">Showing {filteredSitReps.length} of {totalReports} total reports</p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by Barangay..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="text-xs font-bold text-slate-500 shrink-0 mr-1 hidden md:inline-block">Severity:</span>
                {['All', 'Critical', 'Severe', 'Moderate', 'Minor'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setSeverityFilter(sev)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      severityFilter === sev
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                  <th className="py-4 px-6">Barangay</th>
                  <th className="py-4 px-6">Damage Level</th>
                  <th className="py-4 px-6">Evacuee Count</th>
                  <th className="py-4 px-6">Households</th>
                  <th className="py-4 px-6">Last Updated By</th>
                  <th className="py-4 px-6">Timestamp</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredSitReps.length > 0 ? (
                  filteredSitReps.map((rep) => {
                    const isAck = rep.status === 'Acknowledged';
                    return (
                      <tr key={rep.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                            <span>Brgy. {rep.barangay}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {getSeverityBadge(rep.damageSeverity)}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {rep.evacueeCount.toLocaleString()} pax
                        </td>
                        <td className="py-4 px-6 text-slate-600">
                          {rep.householdCount.toLocaleString()} families
                        </td>
                        <td className="py-4 px-6 text-slate-600 text-xs">
                          {rep.lastUpdatedBy}
                        </td>
                        <td className="py-4 px-6 text-slate-500 text-xs">
                          {new Date(rep.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedSitRep(rep)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <Eye className="w-3.5 h-3.5" /> Details
                            </button>
                            
                            <button
                              onClick={() => handleAcknowledge(rep.id, rep.barangay)}
                              disabled={isAck}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                isAck
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                              }`}
                            >
                              {isAck ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Send className="w-3.5 h-3.5" />}
                              {isAck ? 'ACKNOWLEDGED' : 'Acknowledge'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No situation reports match your search criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Modal View */}
        {selectedSitRep && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-6 animate-in fade-in zoom-in duration-200">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    Official SitRep Detail
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                    Barangay {selectedSitRep.barangay}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submitted by {selectedSitRep.lastUpdatedBy} on {new Date(selectedSitRep.timestamp).toLocaleString()}
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedSitRep(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Severity */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Damage Severity</span>
                  <div className="mt-1">{getSeverityBadge(selectedSitRep.damageSeverity)}</div>
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Report Status</span>
                  <div className="mt-1 font-bold text-xs text-slate-700">
                    {selectedSitRep.status === 'Acknowledged' ? 'Acknowledged by EOC' : 'Pending EOC Review'}
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                  <span className="text-xs font-bold text-slate-400 uppercase">Evacuees Registered</span>
                  <p className="text-2xl font-extrabold text-blue-600 mt-1">{selectedSitRep.evacueeCount.toLocaleString()} pax</p>
                </div>
                <div className="p-4 rounded-xl border border-slate-100 bg-white">
                  <span className="text-xs font-bold text-slate-400 uppercase">Affected Households</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{selectedSitRep.householdCount.toLocaleString()} families</p>
                </div>
              </div>

              {/* General Situation Summary */}
              <div>
                <h4 className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-2">
                  General Situation Assessment
                </h4>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-xl text-sm text-slate-700 leading-relaxed">
                  Evacuation centers are actively receiving residents from low-lying zones in Barangay {selectedSitRep.barangay}. Relief items (family food packs and hygiene kits) are urgently requested for displaced families. Lifelines (water and electricity) remain under continuous monitoring by BDRRMC officers.
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedSitRep(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleAcknowledge(selectedSitRep.id, selectedSitRep.barangay);
                    setSelectedSitRep(null);
                  }}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Acknowledge & Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DepartmentLayout>
  );
}
