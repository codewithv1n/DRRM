import { useState, useEffect } from 'react';
import { useResources, useAuditLogs } from '../../hooks/useSystemHooks';
import { Siren, CheckCircle, MapPin, User, Navigation, AlertTriangle, ListChecks, FileText, Truck, Hand, Camera, AlertCircle, ArrowDown } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';
import type { Incident, Resource } from '../../data/types';


import { encryptedFetch } from '../../utils/encryptedFetch';
interface IncidentCardProps {
  incident: Incident;
  assignedResources: Resource[];
  teamLeaderLabel: string;
  onUpdateStatus: (id: string, newStatus: Incident['status'], debrief?: any) => void;
}

function IncidentCard({ incident, assignedResources, teamLeaderLabel, onUpdateStatus }: IncidentCardProps) {
  const [showDebrief, setShowDebrief] = useState(false);
  const [debrief, setDebrief] = useState({
    rescued: '' as number | string,
    casualties: '' as number | string,
    medicalAssistance: '',
    afterActionReport: '',
    remarks: '',
    photoUploaded: false,
    resolvedBy: teamLeaderLabel
  });
  const [translatedLocation, setTranslatedLocation] = useState(incident.location);

  useEffect(() => {
    let isMounted = true;
    if (incident.location.includes('N') && incident.location.includes('E')) {
      const latMatch = incident.location.match(/([\d.]+)\s*N/);
      const lonMatch = incident.location.match(/([\d.]+)\s*E/);
      if (latMatch && lonMatch) {
         fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latMatch[1]}&lon=${lonMatch[1]}`)
           .then(res => res.json())
           .then(data => {
              if (isMounted && data && data.display_name) {
                 setTranslatedLocation(data.display_name);
              }
           })
           .catch(e => console.error("Geocoding failed", e));
      }
    } else {
       setTranslatedLocation(incident.location);
    }
    return () => { isMounted = false; };
  }, [incident.location]);

  const handleResolve = () => {
    if (!debrief.afterActionReport.trim()) {
      alert('After-Action Report is required before resolving this mission.');
      return;
    }
    onUpdateStatus(incident.id, 'Resolved', { ...debrief, resolvedBy: teamLeaderLabel });
    setShowDebrief(false);
  };

  const bgColor = incident.type === 'Fire' ? 'bg-red-500' :
                  incident.type === 'Flood' ? 'bg-blue-500' :
                  incident.type === 'Medical' ? 'bg-green-500' :
                  incident.type === 'Earthquake' ? 'bg-stone-600' :
                  'bg-yellow-500';
  
  const priorityBgColor = incident.priority === 'Critical' ? 'bg-red-700 text-white' :
                          incident.priority === 'High' ? 'bg-orange-600 text-white' :
                          incident.priority === 'Medium' ? 'bg-amber-400 text-slate-900' :
                          'bg-slate-200 text-slate-700';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        
        {/* Left Status Indicator */}
        <div className={`lg:w-56 p-5 flex flex-col justify-center shrink-0 ${bgColor}`}>
          <div className="flex items-center gap-2 font-bold text-white text-lg mb-1">
            <Siren className="w-5 h-5" />
            {incident.type}
          </div>
          <span className="text-xs text-white/90 font-mono bg-black/20 px-2 py-0.5 rounded-md inline-block w-fit mb-3">
            {incident.id}
          </span>
          <div className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm w-fit ${priorityBgColor}`}>
            {incident.priority || 'Low'} Priority
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex-1 p-5 flex flex-col md:flex-row gap-6 lg:gap-8 justify-between items-center">
          
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Location</p>
                <p className="text-sm md:text-base text-slate-800 font-bold">{translatedLocation}</p>
                {incident.gpsLocation && <p className="text-[10px] text-slate-400 font-mono mt-1">Live GPS: {incident.gpsLocation}</p>}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reporter & Contact</p>
                <p className="text-sm text-slate-800 font-medium">{incident.reporterName} <span className="text-slate-300 mx-1">•</span> {incident.contactNumber}</p>
              </div>
            </div>
          </div>

          <div className="md:w-64 w-full bg-slate-50 p-3 rounded-lg border border-slate-100 shrink-0">
            <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-[10px] uppercase tracking-wider">
              <ListChecks className="w-3.5 h-3.5" /> Assigned Resources
            </div>
            {assignedResources.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {assignedResources.map(r => (
                  <span key={r.id} className="text-[10px] font-medium bg-white border border-slate-200 px-2 py-1 rounded-md text-slate-700 shadow-sm flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                    {r.name}
                  </span>
                ))}
              </div>
            ) : (
               <p className="text-xs text-slate-400 italic">Standard unit loadout.</p>
            )}
          </div>
          
        </div>

        {/* Right Action Buttons */}
        <div className="lg:w-64 p-5 bg-slate-50 border-l border-slate-100 flex flex-col justify-center shrink-0 space-y-2">
          {!showDebrief ? (
             <>
               {(incident.status === 'Pending' || incident.status === 'Responding') && (
                  <button onClick={() => onUpdateStatus(incident.id, 'Acknowledged')} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm cursor-pointer">
                     <Hand className="w-4 h-4" /> Acknowledge
                  </button>
               )}
               
               {incident.status === 'Acknowledged' && (
                  <button onClick={() => onUpdateStatus(incident.id, 'En Route')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm cursor-pointer">
                     <Truck className="w-4 h-4" /> Start En Route
                  </button>
               )}

               {incident.status === 'En Route' && (
                  <button onClick={() => onUpdateStatus(incident.id, 'On Scene')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm cursor-pointer">
                     <Navigation className="w-4 h-4" /> Arrived On Scene
                  </button>
               )}

               {(incident.status === 'On Scene' || incident.status === 'Requesting Backup') && (
                  <div className="flex flex-col gap-2">
                     <button onClick={() => setShowDebrief(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm cursor-pointer">
                         <CheckCircle className="w-4 h-4" /> Resolve Mission
                     </button>
                     <button 
                       onClick={() => onUpdateStatus(incident.id, incident.status === 'Requesting Backup' ? 'On Scene' : 'Requesting Backup')} 
                       className={`w-full font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs border cursor-pointer ${incident.status === 'Requesting Backup' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                     >
                         <AlertTriangle className="w-3.5 h-3.5" /> {incident.status === 'Requesting Backup' ? 'Cancel Backup' : 'Req Backup'}
                     </button>
                  </div>
               )}
             </>
          ) : (
             <button onClick={() => setShowDebrief(false)} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm cursor-pointer">
                Cancel Debrief
             </button>
          )}
        </div>
      </div>

      {/* Centered Modal Debrief Form */}
      {showDebrief && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 p-6 rounded-2xl border border-slate-200 shadow-2xl relative">
               <button onClick={() => setShowDebrief(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               </button>
               
               <div className="flex items-center gap-2 font-bold text-slate-800 text-xl border-b border-slate-100 pb-4">
                 <FileText className="w-6 h-6 text-emerald-600" /> Post-Mission Debrief Form
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                 <div>
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Rescued Citizens</label>
                   <input type="number" min="0" value={debrief.rescued} onChange={e => setDebrief({...debrief, rescued: e.target.value === '' ? '' : parseInt(e.target.value) || 0})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow" />
                 </div>
                 <div>
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Casualties</label>
                   <input type="number" min="0" value={debrief.casualties} onChange={e => setDebrief({...debrief, casualties: e.target.value === '' ? '' : parseInt(e.target.value) || 0})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow" />
                 </div>
               </div>
               
               <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Medical Assistance Provided</label>
                 <input type="text" value={debrief.medicalAssistance} onChange={e => setDebrief({...debrief, medicalAssistance: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow" placeholder="e.g. First aid, CPR, Transported to nearest hospital..." />
               </div>

               <div>
                 <label className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                   <FileText className="w-3.5 h-3.5" /> After-Action Report (Required) *
                 </label>
                 <textarea 
                   value={debrief.afterActionReport} 
                   onChange={e => setDebrief({...debrief, afterActionReport: e.target.value})} 
                   className="w-full border border-slate-200 rounded-lg p-3 text-sm placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow resize-none"
                   rows={4}
                   placeholder="Describe the overall situation upon arrival, precise actions taken by the response unit, and the final outcome of the incident..."
                 />
               </div>
               
               <div>
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Additional Remarks</label>
                 <input type="text" value={debrief.remarks} onChange={e => setDebrief({...debrief, remarks: e.target.value})} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm placeholder:text-slate-400 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow" placeholder="Any other notes for the dispatcher..." />
               </div>

               <div className="pt-2">
                 <button 
                    onClick={() => setDebrief({...debrief, photoUploaded: !debrief.photoUploaded})}
                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg border text-sm font-bold transition-all cursor-pointer ${debrief.photoUploaded ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 shadow-sm'}`}
                  >
                     <Camera className="w-5 h-5" /> {debrief.photoUploaded ? '✓ After-Action Scene Photo Attached' : 'Attach After-Action Scene Photo'}
                  </button>
               </div>
               
               <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
                 <button onClick={() => setShowDebrief(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold py-3 rounded-lg transition-colors shadow-sm cursor-pointer">Cancel</button>
                 <button onClick={handleResolve} className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2">
                    <CheckCircle className="w-5 h-5" /> Submit Report & Resolve Mission
                 </button>
               </div>
            </div>
         </div>
      )}
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
      <div className="col-span-full bg-white p-16 text-center rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100">
          <AlertCircle className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-black text-slate-800">Queue is Empty</h3>
        <p className="text-slate-500 mt-2 text-lg">No active dispatch orders at the moment. Standby for deployment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
         <h2 className="text-xl font-black text-slate-800 flex items-center gap-3">
            Assigned Task Queue
            <span className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full font-bold">{sortedIncidents.length} Tasks</span>
         </h2>
         <div className="text-sm text-slate-500 font-semibold flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
            <ArrowDown className="w-4 h-4" /> Sorted by Priority
         </div>
      </div>
      
      {/* Horizontal Layout List */}
      <div className="flex flex-col space-y-4">
        {sortedIncidents.map((incident) => {
          const r = assignedResources.filter(res => res.assignedTo === incident.id);
          return (
            <IncidentCard 
              key={incident.id}
              incident={incident} 
              assignedResources={r}
              teamLeaderLabel={teamLeaderLabel}
              onUpdateStatus={onUpdateStatus} 
            />
          );
        })}
      </div>
    </div>
  );
}

export default function IncidentResponsePage() {
  const { resources } = useResources();
  const { addAuditLog } = useAuditLogs();
  const [dbIncidents, setDbIncidents] = useState<any[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchIncidents = async () => {
    try {
      const response = await encryptedFetch(`${API_URL}/api/incidents`);
      if (response.ok) {
        const data = await response.json();
        setDbIncidents(data);
      }
    } catch (error) {
      console.error('Failed to fetch incidents', error);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const responderName = user?.taskforce_name || user?.name || 'Task Force 1';
  const TEAM_LEADER_LABEL = `Team Leader ${responderName}`;

  // Map database format to frontend Incident interface
  const mappedIncidents: Incident[] = dbIncidents.map(dbI => {
      let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';
      if (dbI.type === 'Fire' || dbI.type === 'Earthquake') priority = 'Critical';
      else if (dbI.type === 'Medical' || dbI.type === 'Flood') priority = 'High';

      return {
          id: dbI.incident_id,
          reporterName: dbI.reporter_name,
          contactNumber: dbI.contact_number,
          location: dbI.location,
          type: dbI.type as any,
          priority,
          status: dbI.status as any,
          timestamp: dbI.created_at,
          assignedResponder: dbI.assigned_responder,
          gpsLocation: dbI.gps_location || undefined
      };
  });

  const activeIncidents = mappedIncidents.filter(i => 
    i.status !== 'Resolved' && i.assignedResponder?.includes(responderName)
  );

  const handleUpdateStatus = async (id: string, newStatus: Incident['status'], debrief?: any) => {
    const mockGps = `14.${Math.floor(Math.random() * 10000)} N, 121.${Math.floor(Math.random() * 10000)} E`;
    
    try {
      await encryptedFetch(`${API_URL}/api/incidents/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchIncidents(); // Refresh

      if (newStatus === 'Resolved') {
          const finalRemark = debrief?.remarks || 'No remarks provided.';
          addAuditLog('Mission Resolved', TEAM_LEADER_LABEL, `Incident ${id} resolved at ${mockGps}. After-Action Report: ${finalRemark}`);
      } else {
          addAuditLog(`Mission ${newStatus}`, TEAM_LEADER_LABEL, `Unit ${newStatus} for Incident ${id} at ${mockGps}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <ResponseUnitLayout activeIncidentsCount={activeIncidents.length}>
      <div className="animate-fade-in space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              Incident Emergency Response
            </h2>
            <p className="text-sm text-slate-500 mt-1">Manage and respond to incidents assigned to {responderName}.</p>
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

