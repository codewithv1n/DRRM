import { Clock, Activity, CloudLightning, Waves, Wind } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import DepartmentLayout from '../../components/layout/AdminLayout';
import HazardMap from '../../components/HazardMap';
import LiveHazardChart from '../../components/LiveHazardChart';

function timeAgo(ts: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

export default function HazardMapPanel() {
  const { incidents } = useMockData();
  const pendingCount = incidents ? incidents.filter(i => i.status === 'Pending').length : 0;

  const liveHazards = [
    { id: 'PHIVOLCS-01', type: 'Earthquake', severity: 'High', source: 'PHIVOLCS API', title: 'Magnitude 5.2 Earthquake', desc: '12km NE of Quezon City. Expect aftershocks.', time: new Date(Date.now() - 12 * 60000).toISOString(), icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
    { id: 'PAGASA-01', type: 'Typhoon', severity: 'Critical', source: 'PAGASA API', title: 'Tropical Storm Signal No. 2', desc: 'Heavy rainfall and strong winds expected in the next 24 hours.', time: new Date(Date.now() - 45 * 60000).toISOString(), icon: Wind, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { id: 'NOAH-01', type: 'Flood', severity: 'Medium', source: 'Project NOAH API', title: 'Marikina River Alert Level 2', desc: 'Water level at 16 meters. Prepare for possible evacuation.', time: new Date(Date.now() - 5 * 60000).toISOString(), icon: Waves, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  ];

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Hazard Map Monitoring</h2>
          <p className="text-slate-500 mt-1">Monitor live API hazard zones</p>
        </div>

        {/* Real-time Hazard Sensors Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <LiveHazardChart 
            title="Marikina River" 
            color="#3b82f6" 
            baseline={15.2} 
            variance={0.4} 
            unit="m" 
            icon={Waves} 
          />
          <LiveHazardChart 
            title="Seismic Monitor" 
            color="#f43f5e" 
            baseline={0.02} 
            variance={0.08} 
            unit="m/s²" 
            icon={Activity} 
          />
          <LiveHazardChart 
            title="Wind Gusts" 
            color="#f59e0b" 
            baseline={65} 
            variance={12} 
            unit="km/h" 
            icon={Wind} 
          />
          <LiveHazardChart 
            title="Atmos. Pressure" 
            color="#8b5cf6" 
            baseline={1002} 
            variance={3} 
            unit="hPa" 
            icon={CloudLightning} 
          />
        </div>

        {/* Map Container */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm relative z-0">
          <div className="w-full h-100 rounded-xl overflow-hidden relative">
            <HazardMap incidents={incidents} />
          </div>
          
          {/* Floating Map Legend */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-lg z-10">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Hazard Zones</h4>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-dashed border-blue-500 bg-blue-500/20 rounded-sm"></div>
                Flood Warning Area
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-rose-500"></div>
                Fault Line
              </div>
            </div>
          </div>
        </div>

        {/* Live Hazards API Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CloudLightning className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-slate-800">Live Hazard Feeds</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {liveHazards.map(hazard => (
              <div key={hazard.id} className={`bg-white rounded-2xl border ${hazard.border} shadow-sm overflow-hidden flex flex-col relative`}>
                <div className="p-5 flex-1 relative z-10">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`p-2.5 rounded-xl ${hazard.bg} ${hazard.color}`}>
                      <hazard.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">{hazard.source}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">{hazard.title}</h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{hazard.desc}</p>
                </div>
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between mt-auto relative z-10">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    hazard.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    hazard.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {hazard.severity} RISK
                  </span>
                  <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {timeAgo(hazard.time)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </DepartmentLayout>
  );
}
