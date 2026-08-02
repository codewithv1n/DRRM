import { WifiOff } from 'lucide-react';

interface DashboardHeaderProps {
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  actionQueueCount: number;
  syncQueue: () => void;
}

export default function DashboardHeader({ isOffline, setIsOffline, actionQueueCount, syncQueue }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Field Operations</h2>
        <p className="text-slate-500">View your assigned emergencies and update status.</p>
      </div>
      
      {/* Global Offline Toggle (For testing) */}
      <div className="flex flex-wrap items-center gap-4">
          {actionQueueCount > 0 && (
              <button onClick={syncQueue} className="text-xs bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-full border border-amber-200 cursor-pointer">
                  Sync {actionQueueCount} Pending Actions
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
  );
}
