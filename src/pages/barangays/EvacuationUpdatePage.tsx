import { useState } from 'react';
import { Users, WifiOff, Clock, Minus, Plus } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import { ASSIGNED_BARANGAY } from './BarangayPortal';

export default function EvacuationPanel() {
  const { evacuationCenters, updateEvacuationOccupancy, isOffline, addAuditLog } = useMockData();
  const ec = evacuationCenters.find(e => e.name === 'Commonwealth Elem. School') || evacuationCenters[0];
  const [showQueueMsg, setShowQueueMsg] = useState(false);

  const handleUpdate = (amount: number) => {
    updateEvacuationOccupancy(ec.id, amount);
    if (isOffline) {
       setShowQueueMsg(true);
       setTimeout(() => setShowQueueMsg(false), 3000);
       addAuditLog('Evacuation Update', `Barangay Admin (${ASSIGNED_BARANGAY})`, `Occupancy update queued offline.`);
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Evacuation Updater</h2>
        <p className="text-slate-500">Update live capacity for {ASSIGNED_BARANGAY} centers.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-xl">
        <div className="p-5 border-b border-slate-200 bg-blue-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-blue-900">Evacuation Center Capacity</h3>
          </div>
          {isOffline && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold flex items-center gap-1"><WifiOff className="w-3 h-3"/> Offline Sync</span>}
        </div>
        <div className="p-8 text-center flex flex-col items-center justify-center relative">
          
          {showQueueMsg && (
            <div className="absolute top-2 bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full animate-fade-in-down flex items-center gap-2">
               <Clock className="w-3 h-3" /> Update queued locally
            </div>
          )}

          <p className="text-slate-500 font-medium mb-4 mt-2">Current Occupants</p>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => handleUpdate(-1)}
              className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <Minus className="w-6 h-6" />
            </button>
            
            <div className="text-6xl font-black text-slate-800 w-32 text-center tabular-nums">
              {ec.currentOccupancy}
            </div>
            
            <button 
              onClick={() => handleUpdate(1)}
              className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 w-full text-sm text-slate-500 flex justify-between">
            <span className="font-medium text-slate-700">{ec.name}</span>
            <span>Max: {ec.capacity}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
