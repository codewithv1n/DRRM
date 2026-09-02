import { useState, useEffect } from 'react';
import { Clock, Waves, Wind, RefreshCw, AlertTriangle, Loader2, Thermometer, Droplets, Gauge, Activity } from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import HazardMap from '../../components/HazardMap';
import { useHazardApis } from '../../hooks/useHazardApis';


import { encryptedFetch } from '../../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

function timeAgo(ts: string | number) {
  const timestamp = typeof ts === 'number' ? ts : new Date(ts).getTime();
  const mins = Math.max(0, Math.floor((Date.now() - timestamp) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}



// ─── Helpers ──────────────────────────────────────────────────────────
function getBadgeStyle(severity: string) {
  switch (severity) {
    case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
    case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
    case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
    default: return 'bg-blue-100 text-blue-700 border-blue-200';
  }
}


// ─── Main Page ───────────────────────────────────────────────────────

export default function HazardMapPanel() {
  const { weather, loading, error, lastUpdated, refetch } = useHazardApis();

  const [dbHazards, setDbHazards] = useState<any[]>([]);
  const [dbIncidents, setDbIncidents] = useState<any[]>([]);

  const fetchDbHazards = async () => {
    try {
      const res = await encryptedFetch(`${API_URL}/api/c3e5a2d9-f714-486c-b291-fe6d953281a4`);
      if (res.ok) {
        const data = await res.json();
        setDbHazards(data.data || data || []);
      }
    } catch (err) {
      console.error('Error fetching db hazards:', err);
    }
  };

  useEffect(() => {
    fetchDbHazards();
    const interval = setInterval(fetchDbHazards, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch incidents from DB for map markers
  const fetchDbIncidents = async () => {
    try {
      const res = await encryptedFetch(`${API_URL}/api/8d72f1a6-2c98-4f3b-a9b1-54c3e80d7e6f`);
      if (res.ok) {
        const data = await res.json();
        setDbIncidents(data || []);
      }
    } catch (err) {
      console.error('Error fetching incidents:', err);
    }
  };

  useEffect(() => {
    fetchDbIncidents();
    const interval = setInterval(fetchDbIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = dbIncidents.filter(i => i.status === 'Pending').length;

  // Update DB hazards when manual refetch completes
  useEffect(() => {
    if (!loading) {
      fetchDbHazards();
    }
  }, [loading, lastUpdated]);

  // Combine feeds into a single table data array
  const tableRows = dbHazards.map(hazard => {
    const Icon = hazard.type === 'Earthquake' ? Activity : hazard.type === 'Typhoon' ? Wind : hazard.type === 'Weather' ? Thermometer : Waves;
    return {
      id: hazard.hazard_report_id,
      title: hazard.title,
      source: hazard.source,
      icon: Icon,
      desc: hazard.description,
      severity: hazard.severity,
      time: hazard.reported_at ? timeAgo(hazard.reported_at) : 'Just now'
    };
  });

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Hazard Map Monitoring</h2>
            <p className="text-slate-500 mt-1">Real-time Quezon City hazard data from Open-Meteo APIs</p>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-slate-400">
                Last updated: {lastUpdated.toLocaleTimeString('en-PH')}
              </span>
            )}
            <button
              onClick={refetch}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button onClick={refetch} className="ml-auto text-xs font-bold underline hover:no-underline">Retry</button>
          </div>
        )}

        {/* Real-time Weather Metrics — actual API values */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading && !weather ? (
            <>
              {[1,2,3,4].map(i => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm animate-pulse">
                  <div className="flex justify-between mb-3">
                    <div className="w-20 h-4 bg-slate-200 rounded" />
                    <div className="w-8 h-8 bg-slate-200 rounded-lg" />
                  </div>
                  <div className="w-16 h-7 bg-slate-200 rounded" />
                  <div className="w-24 h-3 bg-slate-100 rounded mt-2" />
                </div>
              ))}
            </>
          ) : weather ? (
            <>
              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temperature</span>
                  <div className="p-2 rounded-lg bg-red-50 text-red-500">
                    <Thermometer className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{weather.temperature}</span>
                  <span className="text-sm font-bold text-slate-400">°C</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Quezon City • Open-Meteo API</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Humidity</span>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                    <Droplets className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{weather.humidity}</span>
                  <span className="text-sm font-bold text-slate-400">%</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Quezon City • Open-Meteo API</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wind Speed </span>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                    <Wind className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{weather.windSpeed}</span>
                  <span className="text-sm font-bold text-slate-400">km/h</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Wind pressure • Open-Meteo API</p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pressure</span>
                  <div className="p-2 rounded-lg bg-violet-50 text-violet-500">
                    <Gauge className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">{weather.surfacePressure}</span>
                  <span className="text-sm font-bold text-slate-400">hPa</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">Surface pressure • Open-Meteo API</p>
              </div>
            </>
          ) : null}
        </div>

        {/* Map Container */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm relative z-0">
          <div className="w-full h-100 rounded-xl overflow-hidden relative">
            <HazardMap incidents={dbIncidents} weather={weather} />
          </div>
          
          {/* Floating Map Legend */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-xl z-10 max-w-50">
            <h4 className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
              <span>Map Legend</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h4>
            
            {/* Hazards Section */}
            <div className="space-y-1.5 text-xs font-semibold text-slate-700 mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-dashed border-blue-500 bg-blue-500/20 rounded-sm shrink-0"></div>
                <span>Flood Warning Area</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-1 bg-rose-500 rounded-full shrink-0"></div>
                <span>Fault Line</span>
              </div>
            </div>

            <div className="border-t border-slate-200/80 my-2"></div>

            {/* Incidents Section with SVG Pin Icons */}
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Incidents
            </div>
            <div className="space-y-1.5 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm border border-white shrink-0"></span>
                <span>Fire</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm border border-white shrink-0"></span>
                <span>Flood</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border border-white shrink-0"></span>
                <span>Medical</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm border border-white shrink-0"></span>
                <span>Earthquake</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm border border-white shrink-0"></span>
                <span>Road Obstruction</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm border border-white shrink-0"></span>
                <span>Other</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Hazards API Section */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-slate-800">Live Hazard Feeds</h3>
            {loading && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
          </div>
          <p className="text-xs text-slate-400 mb-4">Quezon City area data from Open-Meteo Weather API, plus GDACS for Typhoons.</p>

          {/* Unified Table Row */}
          <div className="mt-4 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider">
                    <th className="px-5 py-4 font-bold">Hazard & Source</th>
                    <th className="px-5 py-4 font-bold">Description</th>
                    <th className="px-5 py-4 font-bold">Severity</th>
                    <th className="px-5 py-4 font-bold">Time / Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loading && tableRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                        <span className="text-sm">Loading hazard feeds...</span>
                      </td>
                    </tr>
                  ) : tableRows.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-5 py-10 text-center text-slate-400">
                        <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        <span className="text-sm">No active alerts or announcements.</span>
                      </td>
                    </tr>
                  ) : (
                    tableRows.map((row) => {
                      const badgeClass = getBadgeStyle(row.severity);
                      const Icon = row.icon;
                      return (
                        <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-5 py-4 align-top">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-50 text-blue-500 rounded-lg shrink-0 mt-0.5">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-900">{row.title}</p>
                                <span className="inline-block mt-1 text-[9px] font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                  {row.source}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4 align-top max-w-xs">
                            <p className="text-xs text-slate-600 leading-relaxed">{row.desc}</p>
                          </td>
                          <td className="px-5 py-4 align-top">
                            <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-md border ${badgeClass}`}>
                              {row.severity.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-5 py-4 align-top whitespace-nowrap">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                              <Clock className="w-3.5 h-3.5" />
                              {row.time}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </DepartmentLayout>
  );
}
