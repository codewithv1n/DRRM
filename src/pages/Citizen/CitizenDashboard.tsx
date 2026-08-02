import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  QrCode, 
  Package, 
  Smartphone, 
  ArrowRight, 
  CloudSun,
  MapPin,
  Clock,
  BookOpen,
  Navigation,
  Sparkles,
  LocateFixed
} from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import ResidentLayout from '../../components/layout/CitizenLayout';



export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { activeAlerts, reliefClaims } = useMockData();
  const currentAlerts = activeAlerts.filter(a => a.deliveryStatus !== 'Failed');



  return (
    <ResidentLayout>
      <div className="animate-fade-in space-y-8">
        
        {/* Welcome Section with Weather Info */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">Citizen Portal</span>
            <h2 className="text-3xl font-bold text-slate-900 font-display mb-1">Welcome back, Taro Sakamoto!</h2>
            <p className="text-slate-500 text-sm">Access your digital resident card, track distributions, and check local shelter status.</p>
          </div>
          
          {/* Quick Weather Badge */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 shrink-0">
            <div className="bg-amber-100 text-amber-600 p-2.5 rounded-xl">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Brgy. Balingasa Weather</span>
              <span className="text-xs font-bold text-slate-700">Light Showers • 28°C</span>
            </div>
          </div>
        </div>

        {/* Severe Alerts Section */}
        {currentAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-start gap-4 shadow-sm relative overflow-hidden animate-pulse">
            <div className="absolute top-0 right-0 p-4">
              {currentAlerts[0].channel === 'SMS Backup' && (
                <span className="flex items-center gap-1 text-[10px] bg-red-600 text-white font-bold px-2.5 py-1 rounded-full shadow">
                  <Smartphone className="w-3 h-3" /> SMS BACKUP
                </span>
              )}
            </div>
            <div className="bg-red-100 p-3 rounded-2xl text-red-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 mb-1">Active Barangay Emergency Announcement</h3>
              <p className="text-sm text-red-700 font-medium">{currentAlerts[0].message}</p>
              <p className="text-[11px] text-red-500 mt-2.5 font-bold uppercase tracking-wider">
                {currentAlerts[0].level} • Issued {new Date(currentAlerts[0].timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}





        {/* Dashboard Sections: Operations vs Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Claims Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 font-display">Recent Relief Activities</h3>
              <button 
                onClick={() => navigate('/citizen/claim_history')}
                className="text-xs font-bold text-primary hover:text-orange-600 flex items-center gap-1"
              >
                View History <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-slate-50">
              {reliefClaims.map(claim => (
                <div key={claim.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${claim.status === 'Claimed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-slate-800 text-sm truncate">
                        {claim.status === 'Claimed' ? 'Family Food Pack' : 'Family Hygiene Kit A'}
                      </h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${claim.status === 'Claimed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Hub Scanner</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(claim.timestamp).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Actions Grid */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 font-display">Resident Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button 
                onClick={() => navigate('/citizen/id')}
                className="bg-white text-left p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between h-36 cursor-pointer"
              >
                <div className="bg-primary/10 text-primary p-2.5 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-primary transition-colors flex items-center gap-1">
                    My QR ID Pass <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-slate-400">Present code for relief scans.</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/survival_guides')}
                className="bg-white text-left p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between h-36 cursor-pointer"
              >
                <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl w-fit group-hover:bg-indigo-100 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                    Survival Guides <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-slate-400">View disaster guides.</p>
                </div>
              </button>

            </div>
            
            {/* AI Evacuation Area Recommendations */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  AI Suggested Shelters
                </h3>
                <button className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer">
                  <LocateFixed className="w-3.5 h-3.5" />
                  Sync Location
                </button>
              </div>
              
              <div className="space-y-3">
                {/* Shelter 1 */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden group hover:border-indigo-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Commonwealth Elem.</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">350m away • 45/100 Families</p>
                      </div>
                    </div>
                    <button className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 p-2 rounded-xl transition-colors cursor-pointer">
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Shelter 2 */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden group hover:border-indigo-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Holy Trinity Parish</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">800m away • 80/150 Families</p>
                      </div>
                    </div>
                    <button className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 p-2 rounded-xl transition-colors cursor-pointer">
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Shelter 3 */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden group hover:border-indigo-100 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-50 text-slate-400 p-2.5 rounded-xl">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">Brgy. Covered Court</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">1.2km away • Full (200/200)</p>
                      </div>
                    </div>
                    <button className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 p-2 rounded-xl transition-colors cursor-pointer">
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </ResidentLayout>
  );
}
