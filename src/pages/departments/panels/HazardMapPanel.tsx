import { Clock, Minus, Plus } from 'lucide-react';
import { useMockData } from '../../../data/MockDataContext';
import { timeAgo } from '../utils/timeAgo';

export default function HazardMapPanel() {
  const { evacuationCenters, updateEvacuationOccupancy } = useMockData();

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Hazard & Evacuation Map</h2>
        <p className="text-slate-500 mt-1">Monitor evacuation centers with stale-data indicators and atomic occupancy controls</p>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Centers', value: evacuationCenters.length, color: 'text-primary' },
          { label: 'Total Capacity', value: evacuationCenters.reduce((s, e) => s + e.capacity, 0).toLocaleString(), color: 'text-blue-600' },
          { label: 'Total Occupants', value: evacuationCenters.reduce((s, e) => s + e.currentOccupancy, 0).toLocaleString(), color: 'text-amber-600' },
          { label: 'At Capacity', value: evacuationCenters.filter(e => e.currentOccupancy >= e.capacity).length, color: 'text-red-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className={`text-2xl font-bold ${s.color} font-display`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Evacuation Center Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {evacuationCenters.map(ec => {
          const pct = Math.round((ec.currentOccupancy / ec.capacity) * 100);
          const isFull = ec.currentOccupancy >= ec.capacity;
          const minsAgo = ec.lastUpdatedAt ? Math.max(0, Math.floor((Date.now() - new Date(ec.lastUpdatedAt).getTime()) / 60000)) : 999;
          const isStale = minsAgo > 30;

          return (
            <div key={ec.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all hover:shadow-md ${isStale ? 'border-amber-200' : 'border-slate-100'}`}>
              {/* Header */}
              <div className="px-5 pt-5 pb-3">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug pr-2">{ec.name}</h4>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${isFull ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {isFull ? 'FULL' : 'OPEN'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono">{ec.id}</p>
              </div>

              {/* Capacity Bar */}
              <div className="px-5">
                <div className="flex justify-between items-end mb-1.5">
                  <span className="text-2xl font-bold text-slate-900 font-display">{pct}%</span>
                  <span className="text-xs text-slate-500 font-medium">{ec.currentOccupancy} / {ec.capacity}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      isFull ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              </div>

              {/* Stale data indicator */}
              <div className="px-5 mt-3">
                <div className={`flex items-center gap-1.5 text-[10px] font-medium px-2.5 py-1.5 rounded-lg ${
                  isStale ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-50 text-slate-500'
                }`}>
                  <Clock className="w-3 h-3" />
                  Last updated: {timeAgo(ec.lastUpdatedAt || '')}
                  {isStale && <span className="font-bold ml-1">⚠ STALE</span>}
                </div>
              </div>

              {/* Atomic +/- Controls */}
              <div className="px-5 py-4 mt-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Adjust Occupancy</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateEvacuationOccupancy(ec.id, -10)}
                    disabled={ec.currentOccupancy <= 0}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold text-slate-500 w-6 text-center">±10</span>
                  <button
                    onClick={() => updateEvacuationOccupancy(ec.id, 10)}
                    disabled={ec.currentOccupancy >= ec.capacity}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-600 disabled:opacity-30 transition-all shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
