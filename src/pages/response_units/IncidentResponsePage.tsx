import { useMockData } from '../../data/MockDataContext';
import { Siren } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';
import ActiveTasksQueue from './components/ActiveTasksQueue';
import type { Incident } from '../../data/mockData';

// Fixed Team Leader identity — one account = one unit
const UNIT_ID = 'RES-01';
const TEAM_LEADER_LABEL = `${UNIT_ID} — Team Leader Juan Dela Cruz`;

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
