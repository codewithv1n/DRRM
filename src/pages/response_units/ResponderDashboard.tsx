import { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import { CheckCircle, Truck } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';
import DashboardHeader from './DashboardHeader';
import IncidentCard from './IncidentCard';

export default function ResponderDashboard() {
  const { incidents, updateIncidentStatus, isOffline, setIsOffline, actionQueue, syncQueue, addAuditLog } = useMockData();
  
  const [selectedUnit, setSelectedUnit] = useState('RES-01');
  const responderUnits = ['RES-01', 'RES-02', 'RES-03', 'RES-04'];

  // For this prototype, the responder sees only active incidents assigned specifically to their selected unit
  const activeIncidents = incidents.filter(i => 
    i.status !== 'Resolved' && i.assignedResponder === selectedUnit
  );

  const handleUpdateStatus = (id: string, newStatus: 'Responding' | 'Resolved', remark?: string) => {
    // Simulate getting GPS location
    const mockGps = `14.${Math.floor(Math.random() * 10000)} N, 121.${Math.floor(Math.random() * 10000)} E`;
    
    if (newStatus === 'Resolved') {
        const finalRemark = remark || 'No remarks provided.';
        addAuditLog('Mission Resolved', selectedUnit, `Incident ${id} resolved at ${mockGps}. Remarks: ${finalRemark}`);
    } else {
        addAuditLog('Mission Responding', selectedUnit, `Unit dispatched to Incident ${id} at ${mockGps}`);
    }

    updateIncidentStatus(id, newStatus, mockGps);
  };

  return (
    <ResponseUnitLayout activeIncidentsCount={activeIncidents.length}>
      <DashboardHeader 
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        actionQueueCount={actionQueue.length}
        syncQueue={syncQueue}
      />

      {/* Unit Selector */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
            <Truck className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">Active Response Unit</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Select your assigned vehicle/unit</p>
          </div>
        </div>
        <select 
          value={selectedUnit}
          onChange={(e) => setSelectedUnit(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer"
        >
          {responderUnits.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeIncidents.map((incident) => (
          <IncidentCard 
            key={incident.id} 
            incident={incident} 
            onUpdateStatus={handleUpdateStatus} 
          />
        ))}

        {activeIncidents.length === 0 && (
          <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800">All Clear for {selectedUnit}</h3>
            <p className="text-slate-500 mt-2">No active dispatch orders at the moment. Standby for deployment.</p>
          </div>
        )}
      </div>
    </ResponseUnitLayout>
  );
}