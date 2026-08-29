import { useState, useEffect } from 'react';
import {
  Activity,  CheckCircle, Siren, Filter, FileText, X, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useAuditLogs } from '../../hooks/useSystemHooks';
import { generateReportHTML } from '../../data/reportTemplate';


import { encryptedFetch } from '../../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

interface DBIncident {
  incident_id: string;
  reporter_name: string;
  contact_number: string;
  location: string;
  type: string;
  status: string;
  created_at: string;
  gps_location: string | null;
  assigned_responder: string | null;
  photo_path?: string | null;
}

function timeAgo(ts: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

const RESPONSE_UNITS = ['Task Force 1', 'Task Force 2', 'Task Force 3', 'Task Force 4', 'Task Force 5'];

const addressCache = new Map<string, string>();

const LocationDisplay = ({ text, className = "" }: { text: string, className?: string }) => {
  const [displayAddress, setDisplayAddress] = useState<string>(text);

  useEffect(() => {
    if (!text) return;

    let lat: number | null = null;
    let lon: number | null = null;

    
    const dmsMatch = text.match(
      /(\d+)[°]\s*(\d+)[''′]\s*([\d.]+)[""″]?\s*([NnSs])\s*(\d+)[°]\s*(\d+)[''′]\s*([\d.]+)[""″]?\s*([EeWw])/
    );

    if (dmsMatch) {
      const latDeg = parseFloat(dmsMatch[1]);
      const latMin = parseFloat(dmsMatch[2]);
      const latSec = parseFloat(dmsMatch[3]);
      const latDir = dmsMatch[4].toUpperCase();
      const lonDeg = parseFloat(dmsMatch[5]);
      const lonMin = parseFloat(dmsMatch[6]);
      const lonSec = parseFloat(dmsMatch[7]);
      const lonDir = dmsMatch[8].toUpperCase();

      lat = latDeg + latMin / 60 + latSec / 3600;
      lon = lonDeg + lonMin / 60 + lonSec / 3600;
      if (latDir === 'S') lat = -lat;
      if (lonDir === 'W') lon = -lon;
    }

    if (lat === null || lon === null) {
      const decMatch = text.match(/([\d.-]+)\s*[Nn]?\s*,\s*([\d.-]+)\s*[Ee]?/);
      if (decMatch) {
        lat = parseFloat(decMatch[1]);
        lon = parseFloat(decMatch[2]);
      }
    }

    if (lat !== null && lon !== null && !isNaN(lat) && !isNaN(lon)) {
      const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
      if (addressCache.has(cacheKey)) {
        setDisplayAddress(addressCache.get(cacheKey)!);
        return;
      }

      const delay = Math.random() * 1000;
      const timeoutId = setTimeout(() => {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
               let simplified = data.display_name;
               const parts = data.display_name.split(', ');
               if (parts.length > 3) {
                  simplified = parts.slice(0, 3).join(', ');
               }
               addressCache.set(cacheKey, simplified);
               setDisplayAddress(simplified);
            }
          })
          .catch(err => console.error("Reverse geocoding error:", err));
      }, delay);
      
      return () => clearTimeout(timeoutId);
    } else {
      setDisplayAddress(text);
    }
  }, [text]);

  return <span className={className}>{displayAddress}</span>;
};


export default function IncidentDispatcherPanel() {
  const [incidents, setIncidents] = useState<DBIncident[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const { addAuditLog } = useAuditLogs();
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const fetchIncidents = async () => {
    try {
      const response = await encryptedFetch(`${API_URL}/api/incidents`);
      if (response.ok) {
        const data = await response.json();
        setIncidents(data);
      }
    } catch (error) {
      console.error('Failed to fetch incidents', error);
    }
  };

  useEffect(() => {
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeStatuses = ['Responding', 'Acknowledged', 'En Route', 'On Scene', 'Requesting Backup'];

  const filteredIncidents = filterStatus === 'All' 
    ? incidents 
    : filterStatus === 'Active'
      ? incidents.filter(i => activeStatuses.includes(i.status))
      : incidents.filter(i => i.status === filterStatus);

  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  const activeCount = incidents.filter(i => activeStatuses.includes(i.status)).length;
  const resolvedCount = incidents.filter(i => i.status === 'Resolved').length;

  const downloadReport = async (incident: DBIncident) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write('<html><head><title>Loading Report...</title></head><body style="font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f1f5f9; color: #64748b;"><h2>Preparing Official Report...</h2></body></html>');
    
    let resolvedLocation = incident.location;
    if (resolvedLocation.includes('N,') && resolvedLocation.includes('E')) {
      try {
         const latMatch = resolvedLocation.match(/([\d.]+)\s*N/);
         const lonMatch = resolvedLocation.match(/([\d.]+)\s*E/);
         if (latMatch && lonMatch) {
            const lat = latMatch[1];
            const lon = lonMatch[1];
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
            if (res.ok) {
                const data = await res.json();
                if (data && data.display_name) {
                   resolvedLocation = data.display_name;
                }
            }
         }
      } catch (e) {
         console.error("Geocoding failed", e);
      }
    }

    const htmlContent = generateReportHTML({ ...incident, location: resolvedLocation } as any);
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleAssign = async (incidentId: string, responderId: string, isBackup = false, currentAssigned = '') => {
    if (!responderId) return;

    if (currentAssigned.includes(responderId)) {
        setToast({ show: true, message: `${responderId} is already assigned to this incident!`, type: 'error' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
        return;
    }

    const newAssigned = isBackup && currentAssigned ? `${currentAssigned}, ${responderId}` : responderId;

    try {
      const response = await encryptedFetch(`${API_URL}/api/incidents/${incidentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Responding', assigned_responder: newAssigned }),
      });
      
      if (response.ok) {
        fetchIncidents();
        addAuditLog(isBackup ? 'Dispatch Backup Unit' : 'Dispatch Unit', 'Department Admin', `Assigned ${responderId} to incident ${incidentId}`);
        setToast({ show: true, message: `${responderId} has been successfully dispatched to Incident ${incidentId}!`, type: 'success' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
      } else {
        alert('Failed to dispatch unit. Please try again.');
      }
    } catch (error) {
      console.error('Error assigning responder:', error);
      alert('Network error. Failed to dispatch unit.');
    }
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
            <div className="text-3xl font-black text-blue-600">{activeCount}</div>
            <div className="text-xs font-semibold text-blue-600 uppercase mt-1">Active / Deployed</div>
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
              {['All', 'Pending', 'Active', 'Resolved'].map(status => (
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
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredIncidents.map(incident => {
                  let priority = 'Medium';
                  if (incident.type === 'Fire' || incident.type === 'Earthquake') priority = 'Critical';
                  else if (incident.type === 'Medical' || incident.type === 'Flood') priority = 'High';

                  return (
                  <tr key={incident.incident_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Siren className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{incident.type}</div>
                          <div className="text-xs text-slate-500 font-mono mt-0.5">{incident.incident_id}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{timeAgo(incident.created_at)}</div>
                          {incident.photo_path && (
                            <a href={`${API_URL}${incident.photo_path}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-blue-600 hover:underline mt-1 flex items-center gap-1 bg-blue-50 w-fit px-1.5 py-0.5 rounded border border-blue-100">
                                <ImageIcon className="w-3 h-3" /> View Evidence
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-700">
                        <LocationDisplay text={incident.location} />
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">{incident.reporter_name} • {incident.contact_number}</div>
                      {incident.gps_location && (
                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                          GPS: <LocationDisplay text={incident.gps_location} />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        {getStatusBadge(incident.status)}
                        {getPriorityBadge(priority)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {incident.status === 'Pending' ? (
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dispatch Unit</span>
                          <select 
                            className="text-xs border border-primary/30 rounded-lg px-2 py-1.5 bg-primary/5 text-primary font-bold focus:outline-none focus:border-primary shadow-sm cursor-pointer"
                            onChange={(e) => handleAssign(incident.incident_id, e.target.value)}
                            defaultValue=""
                          >
                            <option value="" disabled>Select Responder</option>
                            {RESPONSE_UNITS.map(unit => (
                              <option key={unit} value={unit}>{unit}</option>
                            ))}
                          </select>
                        </div>
                      ) : incident.status === 'Requesting Backup' ? (
                        <div className="flex flex-col items-end gap-2">
                           <div className="flex flex-col items-end gap-1 mb-1">
                             <span className="text-[10px] text-slate-400">Current Unit(s):</span>
                             <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">
                               {incident.assigned_responder}
                             </span>
                           </div>
                           <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider animate-pulse">Dispatch Backup</span>
                           <select 
                             className="text-xs border border-red-300 rounded-lg px-2 py-1.5 bg-red-50 text-red-700 font-bold focus:outline-none focus:border-red-500 shadow-sm cursor-pointer"
                             onChange={(e) => {
                                handleAssign(incident.incident_id, e.target.value, true, incident.assigned_responder || '');
                                e.target.value = "";
                             }}
                             defaultValue=""
                           >
                             <option value="" disabled>Select Backup Unit</option>
                             {RESPONSE_UNITS.map(unit => (
                               <option key={unit} value={unit}>{unit}</option>
                             ))}
                           </select>
                        </div>
                      ) : activeStatuses.includes(incident.status) && incident.assigned_responder ? (
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-slate-400">Assigned To:</span>
                          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">
                            {incident.assigned_responder}
                          </span>
                        </div>
                      ) : incident.status === 'Resolved' ? (
                         <div className="flex flex-col items-end gap-2">
                           <span className="text-[10px] text-slate-400 font-medium">Mission Complete</span>
                           <button 
                              onClick={() => downloadReport(incident)}
                              className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors shadow-sm cursor-pointer"
                           >
                              <FileText className="w-3.5 h-3.5" /> View PDF Report
                           </button>
                         </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">No actions available</span>
                      )}
                    </td>
                  </tr>
                )})}
                {filteredIncidents.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                      No incidents found for this status.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-6 right-6 border shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-4 flex items-center gap-4 z-50 animate-fade-in ${toast.type === 'success' ? 'bg-emerald-500 border-emerald-400' : 'bg-red-500 border-red-400'}`}>
          <div className={`p-2 rounded-xl text-white ${toast.type === 'success' ? 'bg-emerald-400/50' : 'bg-red-400/50'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">{toast.type === 'success' ? 'Dispatch Successful' : 'Dispatch Failed'}</h4>
            <p className="text-xs text-white/90">{toast.message}</p>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-2 text-white/70 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </DepartmentLayout>
  );
}
