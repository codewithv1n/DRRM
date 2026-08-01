import { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import DepartmentLayout from '../../components/layout/DepartmentLayout';
import OverviewPanel from './panels/OverviewPanel';
import IncidentDispatcherPanel from './panels/IncidentDispatcherPanel';
import EarlyWarningPanel from './panels/EarlyWarningPanel';
import HazardMapPanel from './panels/HazardMapPanel';
import BarangayCoordinationPanel from './panels/BarangayCoordinationPanel';

export default function DepartmentDashboard() {
  const [activePanel, setActivePanel] = useState<'dashboard' | 'incidents' | 'early-warning' | 'map' | 'coordination'>('dashboard');
  const { incidents } = useMockData();
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;

  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard': return <OverviewPanel />;
      case 'incidents': return <IncidentDispatcherPanel />;
      case 'early-warning': return <EarlyWarningPanel />;
      case 'map': return <HazardMapPanel />;
      case 'coordination': return <BarangayCoordinationPanel />;
    }
  };

  return (
    <DepartmentLayout activePanel={activePanel} setActivePanel={setActivePanel} pendingCount={pendingCount}>
      {renderPanel()}
    </DepartmentLayout>
  );
}
