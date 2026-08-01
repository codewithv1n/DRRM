import { useState } from 'react';
import { WifiOff } from 'lucide-react';
import BarangayLayout from '../../components/layout/BarangayLayout';
import { useMockData } from '../../data/MockDataContext';
import QrScannerPanel from './QRScannerPage';
import EvacuationPanel from './EvacuationUpdatePage';
import SitrepPanel from './SitrepUploaderPage';

export const ASSIGNED_BARANGAY = "Brgy. Commonwealth";

function OverviewPanel() {
  const { actionQueue, syncQueue, isOffline, setIsOffline } = useMockData();
  
  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Barangay Operations Center</h2>
            <p className="text-slate-500">Manage local evacuation, relief goods, and situation reports for {ASSIGNED_BARANGAY}.</p>
          </div>
          
          <div className="flex items-center gap-4">
              {actionQueue.length > 0 && (
                  <button onClick={syncQueue} className="text-xs bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-full border border-amber-200 cursor-pointer">
                      Sync {actionQueue.length} Pending Actions
                  </button>
              )}
              <button 
                  onClick={() => setIsOffline(!isOffline)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer ${isOffline ? 'bg-red-500 text-white shadow-inner' : 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50'}`}
              >
                  <WifiOff className="w-4 h-4" />
                  {isOffline ? 'Offline Mode (Local Queueing)' : 'Online Mode'}
              </button>
          </div>
      </div>
      
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
         <p>Select an operation from the sidebar to begin.</p>
      </div>
    </div>
  );
}

export default function BarangayPortal() {
  const [activePanel, setActivePanel] = useState<'dashboard' | 'qr-scanner' | 'sitrep' | 'evacuation'>('dashboard');

  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard': return <OverviewPanel />;
      case 'qr-scanner': return <QrScannerPanel />;
      case 'evacuation': return <EvacuationPanel />;
      case 'sitrep': return <SitrepPanel />;
    }
  };

  return (
    <BarangayLayout activePanel={activePanel} setActivePanel={setActivePanel}>
      {renderPanel()}
    </BarangayLayout>
  );
}
