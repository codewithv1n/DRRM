import { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import { Siren, CheckCircle, MapPin, Phone, User, Navigation, AlertTriangle, ListChecks, FileText, Truck, Hand, Camera, AlertCircle, ArrowDown } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';
import type { Incident, Resource } from '../../data/mockData';

// Fixed Team Leader identity — one account = one unit
const UNIT_ID = 'RES-01';
const TEAM_LEADER_LABEL = `${UNIT_ID} — Team Leader Juan Dela Cruz`;

interface IncidentCardProps {
  incident: Incident;
  assignedResources: Resource[];
  teamLeaderLabel: string;
  onUpdateStatus: (id: string, newStatus: Incident['status'], debrief?: any) => void;
}

function IncidentCard({ incident, assignedResources, teamLeaderLabel, onUpdateStatus }: IncidentCardProps) {
  const [showDebrief, setShowDebrief] = useState(false);
  const [debrief, setDebrief] = useState({
    rescued: 0,
    casualties: 0,
    medicalAssistance: '',
    afterActionReport: '',
    remarks: '',
    photoUploaded: false,
    resolvedBy: teamLeaderLabel
  });

  const handleResolve = () => {
    if (!debrief.afterActionReport.trim()) {
      alert('After-Action Report is required before resolving this mission.');
      return;
    }
    onUpdateStatus(incident.id, 'Resolved', { ...debrief, resolvedBy: teamLeaderLabel });
    setShowDebrief(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
      <div className={`p-4 flex justify-between items-center ${
        incident.type === 'Fire' ? 'bg-red-500 text-white' :
        incident.type === 'Flood' ? 'bg-blue-500 text-white' :
        incident.type === 'Medical' ? 'bg-green-500 text-white' :
        incident.type === 'Earthquake' ? 'bg-stone-600 text-white' :
        'bg-yellow-500 text-white'
      }`}>
        <div className="flex items-center gap-2 font-bold">
          <Siren className="w-5 h-5" />
          {incident.type} Emergency
        </div>
        <span className="text-xs bg-black/20 px-2 py-1 rounded-full font-mono">{incident.id}</span>
      </div>
      
      <div className="p-5 flex-1 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Location</p>
            <p className="text-slate-800 font-medium">{incident.location}</p>
            {incident.gpsLocation && <p className="text-[10px] text-slate-400 font-mono mt-1">Live GPS: {incident.gpsLocation}</p>}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Reporter</p>
            <p className="text-slate-800 font-medium">{incident.reporterName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Contact</p>
            <p className="text-slate-800 font-medium">{incident.contactNumber}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-xs uppercase">
            <ListChecks className="w-4 h-4" /> Assigned Resources
          </div>
          {assignedResources.length > 0 ? (
            <ul className="space-y-2 text-sm text-slate-600">
              {assignedResources.map(r => (
                <li key={r.id} className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                     <span className="font-medium text-slate-700">{r.name}</span>
                   </div>
                   <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-full uppercase tracking-wider">{r.type}</span>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-xs text-slate-400 italic">No specific equipment logged. Utilizing standard unit loadout.</p>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-slate-100 bg-slate-50 mt-auto">
         {!showDebrief ? (
            <div className="space-y-2">
              {(incident.status === 'Pending' || incident.status === 'Responding') && (
                 <button onClick={() => onUpdateStatus(incident.id, 'Acknowledged')} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <Hand className="w-5 h-5" /> Acknowledge Dispatch
                 </button>
              )}
              
              {incident.status === 'Acknowledged' && (
                 <button onClick={() => onUpdateStatus(incident.id, 'En Route')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <Truck className="w-5 h-5" /> Start En Route
                 </button>
              )}

              {incident.status === 'En Route' && (
                 <button onClick={() => onUpdateStatus(incident.id, 'On Scene')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
                    <Navigation className="w-5 h-5" /> Arrived On Scene
                 </button>
              )}

              {(incident.status === 'On Scene' || incident.status === 'Requesting Backup') && (
                 <div className="flex gap-2">
                    <button 
                      onClick={() => onUpdateStatus(incident.id, incident.status === 'Requesting Backup' ? 'On Scene' : 'Requesting Backup')} 
                      className={`flex-1 font-bold py-3 px-4 rounded-lg flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-[11px] ${incident.status === 'Requesting Backup' ? 'bg-red-600 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
                    >
                        <AlertTriangle className="w-5 h-5" /> {incident.status === 'Requesting Backup' ? 'Cancel Backup' : 'Req Backup'}
                    </button>
                    <button onClick={() => setShowDebrief(true)} className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer">
                        <CheckCircle className="w-5 h-5" /> Resolve Mission
                    </button>
                 </div>
              )}
            </div>
         ) : (
            <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200 shadow-inner">
               <div className="flex items-center justify-between border-b pb-2 mb-2">
                 <div className="flex items-center gap-2 font-bold text-slate-800">
                   <FileText className="w-4 h-4 text-emerald-600" /> Post-Mission Debrief
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase">Rescued</label>
                   <input type="number" min="0" value={debrief.rescued} onChange={e => setDebrief({...debrief, rescued: parseInt(e.target.value)||0})} className="w-full border border-slate-200 rounded-lg p-1.5 text-sm outline-none focus:border-emerald-500" />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-slate-500 uppercase">Casualties</label>
                   <input type="number" min="0" value={debrief.casualties} onChange={e => setDebrief({...debrief, casualties: parseInt(e.target.value)||0})} className="w-full border border-slate-200 rounded-lg p-1.5 text-sm outline-none focus:border-emerald-500" />
                 </div>
               </div>
               
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase">Medical Assistance Provided</label>
                 <input type="text" value={debrief.medicalAssistance} onChange={e => setDebrief({...debrief, medicalAssistance: e.target.value})} className="w-full border border-slate-200 rounded-lg p-1.5 text-sm placeholder:text-slate-300 outline-none focus:border-emerald-500" placeholder="e.g. First aid, CPR..." />
               </div>

               {/* After-Action Report — REQUIRED */}
               <div>
                 <label className="text-[10px] font-bold text-red-500 uppercase flex items-center gap-1">
                   <FileText className="w-3 h-3" /> After-Action Report *
                 </label>
                 <textarea 
                   value={debrief.afterActionReport} 
                   onChange={e => setDebrief({...debrief, afterActionReport: e.target.value})} 
                   className="w-full border border-slate-200 rounded-lg p-2 text-sm placeholder:text-slate-300 outline-none focus:border-emerald-500 resize-none"
                   rows={3}
                   placeholder="Describe the situation, actions taken, and outcome..."
                 />
                 <p className="text-[9px] text-slate-400 mt-0.5">Required before resolving. This will be logged as the official audit trail.</p>
               </div>
               
               <div>
                 <label className="text-[10px] font-bold text-slate-500 uppercase">Additional Remarks</label>
                 <input type="text" value={debrief.remarks} onChange={e => setDebrief({...debrief, remarks: e.target.value})} className="w-full border border-slate-200 rounded-lg p-1.5 text-sm placeholder:text-slate-300 outline-none focus:border-emerald-500" placeholder="Additional notes..." />
               </div>

               <div>
                 <button 
                    onClick={() => setDebrief({...debrief, photoUploaded: !debrief.photoUploaded})}
                    className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-bold transition-colors ${debrief.photoUploaded ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                     <Camera className="w-4 h-4" /> {debrief.photoUploaded ? 'After-Action Photo Uploaded' : 'Upload Scene Photo'}
                  </button>
               </div>
               
               <div className="flex gap-2 pt-2">
                 <button onClick={() => setShowDebrief(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer">Cancel</button>
                 <button onClick={handleResolve} className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer">Submit & Resolve</button>
               </div>
            </div>
         )}
      </div>
    </div>
  );
}

interface ActiveTasksQueueProps {
  incidents: Incident[];
  assignedResources: Resource[];
  teamLeaderLabel: string;
  onUpdateStatus: (id: string, newStatus: Incident['status'], debrief?: any) => void;
}

const priorityWeights: Record<string, number> = {
  'Critical': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1
};

function ActiveTasksQueue({ incidents, assignedResources, teamLeaderLabel, onUpdateStatus }: ActiveTasksQueueProps) {
  const sortedIncidents = [...incidents].sort((a, b) => {
    const wA = priorityWeights[a.priority || 'Low'];
    const wB = priorityWeights[b.priority || 'Low'];
    return wB - wA; // Highest first
  });

  if (sortedIncidents.length === 0) {
    return (
      <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Queue is Empty</h3>
        <p className="text-slate-500 mt-2">No active dispatch orders at the moment. Standby for deployment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            Task Queue
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-bold">{sortedIncidents.length}</span>
         </h2>
         <div className="text-xs text-slate-500 font-semibold flex items-center gap-1">
            <ArrowDown className="w-3 h-3" /> Sorted by Priority
         </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedIncidents.map((incident) => {
          const r = assignedResources.filter(res => res.assignedTo === incident.id);
          return (
            <div key={incident.id} className="relative">
              {/* Priority Ribbon */}
              <div className={`absolute -top-3 -right-3 z-10 text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md border-2 border-white ${
                 incident.priority === 'Critical' ? 'bg-red-600 text-white' :
                 incident.priority === 'High' ? 'bg-orange-500 text-white' :
                 incident.priority === 'Medium' ? 'bg-amber-400 text-slate-900' :
                 'bg-slate-200 text-slate-700'
              }`}>
                 {incident.priority || 'Low'} Priority
              </div>
              <IncidentCard 
                incident={incident} 
                assignedResources={r}
                teamLeaderLabel={teamLeaderLabel}
                onUpdateStatus={onUpdateStatus} 
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function IncidentResponsePage() {
  const { incidents, resources, updateIncidentStatus, addAuditLog } = useMockData();

  const activeIncidents = incidents.filter(i => 
    i.status !== 'Resolved' && i.assignedResponder === 'Task Force 1'
  );

  const handleUpdateStatus = (id: string, newStatus: Incident['status'], debrief?: any) => {
    const mockGps = `14.${Math.floor(Math.random() * 10000)} N, 121.${Math.floor(Math.random() * 10000)} E`;
    
    if (newStatus === 'Resolved') {
        const finalRemark = debrief?.remarks || 'No remarks provided.';
        addAuditLog('Mission Resolved', TEAM_LEADER_LABEL, `Incident ${id} resolved at ${mockGps}. After-Action Report: ${finalRemark}`);
    } else {
        addAuditLog(`Mission ${newStatus}`, TEAM_LEADER_LABEL, `Unit ${newStatus} for Incident ${id} at ${mockGps}`);
    }

    updateIncidentStatus(id, newStatus, mockGps, debrief);
  };

  return (
    <ResponseUnitLayout activeIncidentsCount={activeIncidents.length}>
      <div className="animate-fade-in space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Siren className="w-6 h-6 text-red-500" />
              Incident Emergency Response
            </h2>
            <p className="text-sm text-slate-500 mt-1">Manage and respond to incidents assigned to {UNIT_ID}.</p>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-xs font-bold text-slate-700">{TEAM_LEADER_LABEL}</span>
          </div>
        </div>

        {/* Task Queue */}
        <ActiveTasksQueue 
          incidents={activeIncidents} 
          assignedResources={resources} 
          teamLeaderLabel={TEAM_LEADER_LABEL} 
          onUpdateStatus={handleUpdateStatus} 
        />
      </div>
    </ResponseUnitLayout>
  );
}
