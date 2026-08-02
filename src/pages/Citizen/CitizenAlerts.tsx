import { 
  AlertTriangle, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Info,
  Waves,
  Clock,
  ShieldAlert
} from 'lucide-react';
import ResidentLayout from '../../components/layout/CitizenLayout';
import { useMockData } from '../../data/MockDataContext';

export default function CitizenAlerts() {
  const { activeAlerts } = useMockData();

  return (
    <ResidentLayout>
      <div className="animate-fade-in space-y-6">
        
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 font-display">Early Warning & Advisories</h2>
          <p className="text-slate-500 mt-1">Real-time alerts and weather updates for Quezon City residents.</p>
        </div>

        {/* Current Warning Banner */}
        <div className="bg-orange-500 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-orange-400">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-20 pointer-events-none">
            <CloudRain className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="bg-white/20 p-4 rounded-2xl shrink-0 backdrop-blur-sm border border-white/20 shadow-inner">
              <CloudRain className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-orange-600/80 border border-orange-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm shadow-sm">Active Warning</span>
                <span className="text-orange-100 text-xs font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Issued 2:00 PM Today</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black font-display tracking-wide mb-2">ORANGE RAINFALL WARNING</h3>
              <p className="text-orange-50 font-medium md:text-lg leading-relaxed max-w-2xl">
                Threating flooding is expected. Heavy to intense rainfall is affecting Metro Manila, particularly Quezon City. Please monitor weather conditions and take precautionary measures.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Advisories */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              City Advisories
            </h3>
            
            <div className="space-y-4">
              {activeAlerts.length > 0 ? activeAlerts.map(alert => (
                <div key={alert.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                  <div className={`p-3 rounded-xl h-fit border shrink-0 ${
                    alert.level.includes('Red') || alert.level.includes('Critical') ? 'bg-rose-50 border-rose-100 text-rose-600' :
                    alert.level.includes('Warning') || alert.level.includes('Orange') ? 'bg-amber-50 border-amber-100 text-amber-600' :
                    'bg-blue-50 border-blue-100 text-blue-600'
                  }`}>
                    {alert.level.includes('Red') || alert.level.includes('Critical') ? <AlertTriangle className="w-6 h-6" /> :
                     alert.level.includes('Warning') || alert.level.includes('Orange') ? <AlertTriangle className="w-6 h-6" /> :
                     <Info className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{alert.level}</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-600"><ShieldAlert className="w-3.5 h-3.5" /> {alert.channel}</span>
                      <span className="text-xs text-slate-400">Issued {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center p-8 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
                   No active city advisories at the moment.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Current Weather */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-indigo-500" />
              Local Weather
            </h3>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-widest">Quezon City</p>
                  <h4 className="text-4xl font-black text-slate-900 mt-1">26°C</h4>
                </div>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                  <CloudRain className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-400" /> Precipitation</span>
                  <span className="font-bold text-slate-800">80%</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Wind className="w-4 h-4 text-emerald-400" /> Wind Speed</span>
                  <span className="font-bold text-slate-800">18 km/h</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Waves className="w-4 h-4 text-cyan-400" /> Humidity</span>
                  <span className="font-bold text-slate-800">92%</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                 <p className="text-xs text-indigo-800 font-medium leading-relaxed text-center">
                   Expect thunderstorms in the afternoon and evening. Keep umbrellas and rain gear ready.
                 </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </ResidentLayout>
  );
}
