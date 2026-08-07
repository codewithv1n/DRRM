import { FileText, MapPin, Clock, ShieldAlert, CheckCircle, Clock3 } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import CitizenLayout from '../../components/layout/CitizenLayout';

export default function CitizenReportLogs() {
  const { incidents } = useMockData();
  
  // We'll show the incidents reported by Taro Sakamoto. If none, we fallback to a slice of existing incidents for demo purposes.
  const userIncidents = incidents.filter(i => i.reporterName === 'Taro Sakamoto');
  const displayIncidents = userIncidents.length > 0 ? userIncidents : incidents.slice(0, 4);

  return (
    <CitizenLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">My Incident Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Track the status of emergencies and hazards you've reported.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Report History</h3>
          </div>
          
          <div className="divide-y divide-slate-50">
            {displayIncidents.map(incident => (
              <div key={incident.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-2xl shrink-0 ${incident.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">{incident.type}</h4>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {incident.location}</span>
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(incident.timestamp).toLocaleString()}</span>
                      <span className="font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">ID: {incident.id}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  {incident.status === 'Pending' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                      <Clock3 className="w-3.5 h-3.5" /> Pending Review
                    </span>
                  )}
                  {incident.status === 'Responding' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100">
                      <Clock3 className="w-3.5 h-3.5" /> Responding
                    </span>
                  )}
                  {incident.status === 'Resolved' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle className="w-3.5 h-3.5" /> Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {displayIncidents.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                <p>You haven't reported any incidents yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
