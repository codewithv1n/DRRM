import { useMockData } from '../../data/MockDataContext';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';
import ResponderMetricsOverview from './ResponderMetricsOverview';

const UNIT_ID = 'RES-01';


export default function ResponderDashboard() {
  const { incidents } = useMockData();
  
  const activeIncidents = incidents.filter(i => 
    i.status !== 'Resolved' && i.assignedResponder === 'Task Force 1'
  );

  return (
    <ResponseUnitLayout activeIncidentsCount={activeIncidents.length}>
      <div className="animate-fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Overview of your unit's performance and history</p>
        </div>

        {/* Metrics Overview */}
        <ResponderMetricsOverview unitId={UNIT_ID} />
      </div>
    </ResponseUnitLayout>
  );
}
