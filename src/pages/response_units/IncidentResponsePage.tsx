import { useState, useEffect } from 'react';
import { useResources, useAuditLogs } from '../../hooks/useSystemHooks';
import { Siren, CheckCircle, Navigation, AlertTriangle, FileText, Truck, Hand, Camera, Activity } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';
import type { Incident, Resource } from '../../data/types';


import { encryptedFetch } from '../../utils/encryptedFetch';

function timeAgo(ts: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

interface IncidentCardProps {
  incident: Incident;
  assignedResources: Resource[];
  teamLeaderLabel: string;
  onUpdateStatus: (id: string, newStatus: Incident['status'], debrief?: any) => void;
}

function IncidentCard({ incident, teamLeaderLabel, onUpdateStatus }: IncidentCardProps) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">Pending</span>;
      case 'Responding':
      case 'Acknowledged':
      case 'En Route':
      case 'On Scene':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase"><Activity className="w-3 h-3" /> {status}</span>;
      case 'Requesting Backup':
        return <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase"><Siren className="w-3 h-3 animate-pulse" /> Backup Needed</span>;
      case 'Resolved':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase"><CheckCircle className="w-3 h-3" /> Resolved</span>;
      default:
        return <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">{status}</span>;
    }
  };

  const getPriorityBadge = (priority?: string) => {
    if (!priority) return null;
    let colors = 'bg-slate-100 text-slate-700';
    if (priority === 'Critical') colors = 'bg-red-100 text-red-700';
    else if (priority === 'High') colors = 'bg-orange-100 text-orange-700';
    else if (priority === 'Medium') colors = 'bg-blue-100 text-blue-700';

    return <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${colors}`}>{priority}</span>;
  };

  return (
    <>
      <tr className="hover:bg-slate-50/50 transition-colors">
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
          <div className="text-sm font-bold text-slate-700">
            {translatedLocation}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">{incident.reporterName} • {incident.contactNumber}</div>
          {incident.gpsLocation && (
            <div className="text-[10px] text-slate-400 font-mono mt-1">
              GPS: {incident.gpsLocation}
            </div>
          )}
        </td>
        <td className="px-6 py-4">
          <div className="flex flex-col gap-2 items-start">
            {getStatusBadge(incident.status)}
            {getPriorityBadge(incident.priority)}
          </div>
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex flex-col items-end gap-2">
           {!showDebrief ? (
             <>
               {(incident.status === 'Pending' || incident.status === 'Responding') && (
                  <button onClick={() => onUpdateStatus(incident.id, 'Acknowledged')} className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs shadow-sm cursor-pointer">
                     <Hand className="w-3.5 h-3.5" /> Acknowledge
                  </button>
               )}
               
               {incident.status === 'Acknowledged' && (
                  <button onClick={() => onUpdateStatus(incident.id, 'En Route')} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs shadow-sm cursor-pointer">
                     <Truck className="w-3.5 h-3.5" /> Start En Route
                  </button>
               )}

               {incident.status === 'En Route' && (
                  <button onClick={() => onUpdateStatus(incident.id, 'On Scene')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs shadow-sm cursor-pointer">
                     <Navigation className="w-3.5 h-3.5" /> Arrived On Scene
                  </button>
               )}

               {(incident.status === 'On Scene' || incident.status === 'Requesting Backup') && (
                  <div className="flex flex-col gap-2">
                     <button onClick={() => setShowDebrief(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs shadow-sm cursor-pointer">
                         <CheckCircle className="w-3.5 h-3.5" /> Resolve Mission
                     </button>
                     <button 
                       onClick={() => onUpdateStatus(incident.id, incident.status === 'Requesting Backup' ? 'On Scene' : 'Requesting Backup')} 
                       className={`font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs border cursor-pointer ${incident.status === 'Requesting Backup' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                     >
                         <AlertTriangle className="w-3.5 h-3.5" /> {incident.status === 'Requesting Backup' ? 'Cancel Backup' : 'Req Backup'}
                     </button>
                  </div>
               )}
             </>
          ) : (
             <button onClick={() => setShowDebrief(false)} className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-3 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors text-xs cursor-pointer">
                Cancel Debrief
             </button>
          )}
          </div>
        </td>
      </tr>

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
    </>
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
  const [activeTab, setActiveTab] = useState<string>('All');
  const tabs = ['All', 'Pending', 'Acknowledged', 'En Route', 'On-Scene'];

  const filteredByTab = activeTab === 'All' ? incidents : incidents.filter(i => i.status === activeTab);

  const sortedIncidents = [...filteredByTab].sort((a, b) => {
    const wA = priorityWeights[a.priority || 'Low'];
    const wB = priorityWeights[b.priority || 'Low'];
    return wB - wA; // Highest first
  });

  return (
    <div className="space-y-6">


      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => {
          const count = tab === 'All' ? incidents.length : incidents.filter(i => i.status === tab).length;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === tab ? 'bg-primary text-white shadow-sm shadow-primary/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'All' ? 'All Tasks' : tab}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      
      {/* Table Layout */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Incident Details</th>
                <th className="px-6 py-4">Location & Contact</th>
                <th className="px-6 py-4">Status & Priority</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
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
              {sortedIncidents.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No tasks found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
      const response = await encryptedFetch(`${API_URL}/api/8d72f1a6-2c98-4f3b-a9b1-54c3e80d7e6f?_t=${Date.now()}`);
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
    const interval = setInterval(fetchIncidents, 1000);
    return () => clearInterval(interval);
  }, []);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const responderName = user?.taskforce_name || user?.name || 'Task Force 1';
  const TEAM_LEADER_LABEL = `Team Leader ${responderName}`;

  
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
    
    
    setDbIncidents(prev => prev.map(i => i.incident_id === id ? { ...i, status: newStatus } : i));

    try {
      await encryptedFetch(`${API_URL}/api/8d72f1a6-2c98-4f3b-a9b1-54c3e80d7e6f/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: newStatus,
          assigned_responder: newStatus === 'Resolved' ? TEAM_LEADER_LABEL : undefined 
        }),
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

