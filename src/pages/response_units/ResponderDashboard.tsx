import { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import { CheckCircle, MapPin, Phone, User, Siren, WifiOff } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';

export default function ResponderDashboard() {
  const { incidents, updateIncidentStatus, isOffline, setIsOffline, actionQueue, syncQueue, addAuditLog } = useMockData();

  // For this prototype, the responder sees all active incidents.
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved');

  const [remarks, setRemarks] = useState<{[id: string]: string}>({});

  const handleUpdateStatus = (id: string, newStatus: 'Responding' | 'Resolved') => {
    // Simulate getting GPS location
    const mockGps = `14.${Math.floor(Math.random() * 10000)} N, 121.${Math.floor(Math.random() * 10000)} E`;
    
    if (newStatus === 'Resolved') {
        const remark = remarks[id] || 'No remarks provided.';
        addAuditLog('Mission Resolved', 'Response Unit', `Incident ${id} resolved at ${mockGps}. Remarks: ${remark}`);
    } else {
        addAuditLog('Mission Responding', 'Response Unit', `Unit dispatched to Incident ${id} at ${mockGps}`);
    }

    updateIncidentStatus(id, newStatus, mockGps);
  };

  return (
    <ResponseUnitLayout activeIncidentsCount={activeIncidents.length}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Field Operations</h2>
            <p className="text-slate-500">View your assigned emergencies and update status.</p>
          </div>
          
          {/* Global Offline Toggle (For testing) */}
          <div className="flex flex-wrap items-center gap-4">
              {actionQueue.length > 0 && (
                  <button onClick={syncQueue} className="text-xs bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-full border border-amber-200">
                      Sync {actionQueue.length} Pending Actions
                  </button>
              )}
              <button 
                  onClick={() => setIsOffline(!isOffline)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${isOffline ? 'bg-red-500 text-white shadow-inner' : 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50'}`}
              >
                  <WifiOff className="w-4 h-4" />
                  {isOffline ? 'Offline Mode (Local Queueing)' : 'Online Mode'}
              </button>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeIncidents.map((incident) => (
          <div key={incident.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
            <div className={`p-4 flex justify-between items-center ${
              incident.type === 'Fire' ? 'bg-red-500 text-white' :
              incident.type === 'Flood' ? 'bg-blue-500 text-white' :
              incident.type === 'Medical' ? 'bg-green-500 text-white' :
              'bg-yellow-500 text-white'
            }`}>
              <div className="flex items-center gap-2 font-bold">
                <Siren className="w-5 h-5" />
                {incident.type} Emergency
              </div>
              <span className="text-xs bg-black/20 px-2 py-1 rounded-full">{incident.id}</span>
            </div>
            
            <div className="p-5 flex-1 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500 font-semibold uppercase">Location</p>
                  <p className="text-slate-800 font-medium">{incident.location}</p>
                  {incident.gpsLocation && <p className="text-[10px] text-slate-400 font-mono mt-1">GPS: {incident.gpsLocation}</p>}
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
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50 mt-auto">
              {incident.status === 'Pending' ? (
                <button 
                  onClick={() => handleUpdateStatus(incident.id, 'Responding')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer"
                >
                  Respond Now
                </button>
              ) : (
                <div className="space-y-3">
                  <input 
                      type="text" 
                      placeholder="Post-operation remarks..." 
                      className="w-full text-sm p-2 rounded border border-slate-300 focus:outline-none focus:border-emerald-500"
                      value={remarks[incident.id] || ''}
                      onChange={(e) => setRemarks({...remarks, [incident.id]: e.target.value})}
                  />
                  <button 
                    onClick={() => handleUpdateStatus(incident.id, 'Resolved')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {activeIncidents.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">All Clear</h3>
            <p className="text-slate-500 mt-2">No active emergencies at the moment.</p>
          </div>
        )}
      </div>
    </ResponseUnitLayout>
  );
}