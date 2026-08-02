import { useEffect, useRef } from 'react';
import { Clock, Activity, CloudLightning, Waves, Wind } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import DepartmentLayout from '../../components/layout/DepartmentLayout';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

function timeAgo(ts: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

export default function HazardMapPanel() {
  const { evacuationCenters, incidents } = useMockData();
  const pendingCount = incidents ? incidents.filter(i => i.status === 'Pending').length : 0;
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  const liveHazards = [
    { id: 'PHIVOLCS-01', type: 'Earthquake', severity: 'High', source: 'PHIVOLCS API', title: 'Magnitude 5.2 Earthquake', desc: '12km NE of Quezon City. Expect aftershocks.', time: new Date(Date.now() - 12 * 60000).toISOString(), icon: Activity, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
    { id: 'PAGASA-01', type: 'Typhoon', severity: 'Critical', source: 'PAGASA API', title: 'Tropical Storm Signal No. 2', desc: 'Heavy rainfall and strong winds expected in the next 24 hours.', time: new Date(Date.now() - 45 * 60000).toISOString(), icon: Wind, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
    { id: 'NOAH-01', type: 'Flood', severity: 'Medium', source: 'Project NOAH API', title: 'Marikina River Alert Level 2', desc: 'Water level at 16 meters. Prepare for possible evacuation.', time: new Date(Date.now() - 5 * 60000).toISOString(), icon: Waves, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  ];

  useEffect(() => {
    if (map.current) return;
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
      center: [121.050, 14.650],
      zoom: 11.5,
      minZoom: 11,
      maxBounds: [
        [120.9500, 14.5500], // Southwest boundary
        [121.1500, 14.8000]  // Northeast boundary
      ]
    });

    map.current.on('load', () => {
      if (!map.current) return;

      // Hazard 1: Flood Zone (Lasso Box / Polygon) - Near Diliman / Kamuning
      map.current.addSource('hazard-flood', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [121.035, 14.630],
              [121.060, 14.630],
              [121.060, 14.650],
              [121.035, 14.650],
              [121.035, 14.630]
            ]]
          },
          properties: {}
        }
      });
      map.current.addLayer({
        id: 'hazard-flood-fill',
        type: 'fill',
        source: 'hazard-flood',
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.2
        }
      });
      map.current.addLayer({
        id: 'hazard-flood-line',
        type: 'line',
        source: 'hazard-flood',
        paint: {
          'line-color': '#2563eb',
          'line-width': 3,
          'line-dasharray': [2, 2] // Lasso dashed effect
        }
      });

      // Hazard 2: Earthquake Radius (Lasso Box / Polygon) - Centered in QC
      map.current.addSource('hazard-quake', {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [121.040, 14.660],
              [121.070, 14.660],
              [121.070, 14.680],
              [121.040, 14.680],
              [121.040, 14.660]
            ]]
          },
          properties: {}
        }
      });
      map.current.addLayer({
        id: 'hazard-quake-fill',
        type: 'fill',
        source: 'hazard-quake',
        paint: {
          'fill-color': '#f43f5e',
          'fill-opacity': 0.2
        }
      });
      map.current.addLayer({
        id: 'hazard-quake-line',
        type: 'line',
        source: 'hazard-quake',
        paint: {
          'line-color': '#e11d48',
          'line-width': 3,
          'line-dasharray': [2, 2]
        }
      });
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Hazard & Evacuation Monitor</h2>
          <p className="text-slate-500 mt-1">Monitor live API hazard zones and manage evacuation center occupancies</p>
        </div>

        {/* Map Container */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm relative z-0">
          <div ref={mapContainer} className="w-full h-100 rounded-xl overflow-hidden" />
          
          {/* Floating Map Legend */}
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-slate-200 shadow-lg z-10">
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Hazard Zones</h4>
            <div className="space-y-1.5 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-dashed border-blue-500 bg-blue-500/20 rounded-sm"></div>
                Flood Warning Area
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-dashed border-rose-500 bg-rose-500/20 rounded-sm"></div>
                Earthquake Risk Zone
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

        <div className="border-t border-slate-200 my-8"></div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-bold text-slate-800">Evacuation Centers</h3>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
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

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}
