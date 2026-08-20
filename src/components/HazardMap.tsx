import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export interface IncidentMarker {
  incident_id: string;
  location: string;
  type: string;
  status: string;
  reporter_name?: string;
  contact_number?: string;
  created_at?: string;
  gps_location?: string | null;
  assigned_responder?: string | null;
}

interface HazardMapProps {
  incidents?: IncidentMarker[];
  weather?: any;
  height?: string;
}

// Known Quezon City Barangay coordinates [longitude, latitude] for instant 0ms resolution
const QC_BARANGAY_COORDS: Record<string, [number, number]> = {
  // District 1
  'alicia': [121.0267, 14.6567],
  'bagong pag-asa': [121.0367, 14.6542],
  'bahay toro': [121.0256, 14.6653],
  'balingasa': [121.0017, 14.6505],
  'bungad': [121.0203, 14.6486],
  'damar': [120.9958, 14.6453],
  'damayan': [121.0117, 14.6408],
  'del monte': [121.0142, 14.6419],
  'katipunan': [121.0175, 14.6467],
  'lourdes': [121.0028, 14.6306],
  'maharlica': [121.0003, 14.6322],
  'manresa': [121.0069, 14.6425],
  'mariblo': [121.0131, 14.6444],
  'masambong': [121.0092, 14.6469],
  'ns amoranto': [121.0039, 14.6372],
  'n.s. amoranto': [121.0039, 14.6372],
  'amoranto': [121.0039, 14.6372],
  'paang bundok': [120.9961, 14.6342],
  'pag-ibig sa nayon': [120.9983, 14.6514],
  'paltok': [121.0158, 14.6461],
  'paraiso': [121.0150, 14.6389],
  'phil-am': [121.0336, 14.6492],
  'project 6': [121.0389, 14.6592],
  'ramon magsaysay': [121.0286, 14.6606],
  'saint peter': [121.0017, 14.6347],
  'salvacion': [120.9992, 14.6300],
  'san antonio': [121.0183, 14.6450],
  'san isidro labrador': [120.9989, 14.6317],
  'san jose': [120.9944, 14.6406],
  'santa cruz': [121.0167, 14.6367],
  'santa teresita': [120.9972, 14.6319],
  'santo domingo': [121.0078, 14.6317],
  'santo cristo': [121.0264, 14.6597],
  'siena': [121.0097, 14.6389],
  'talayan': [121.0156, 14.6344],
  'vasra': [121.0456, 14.6547],
  'veterans village': [121.0206, 14.6531],
  'west triangle': [121.0364, 14.6439],

  // District 2
  'bagong silangan': [121.1189, 14.6986],
  'batasan hills': [121.1008, 14.6869],
  'batasan': [121.1008, 14.6869],
  'commonwealth': [121.0858, 14.6983],
  'holy spirit': [121.0772, 14.6836],
  'payatas': [121.1097, 14.7128],

  // District 3
  'amihan': [121.0667, 14.6289],
  'bagumbuhay': [121.0664, 14.6247],
  'bagumbayan': [121.0811, 14.6044],
  'bayanihan': [121.0683, 14.6231],
  'blue ridge a': [121.0714, 14.6225],
  'blue ridge b': [121.0736, 14.6256],
  'camp aguinaldo': [121.0639, 14.6083],
  'claro': [121.0639, 14.6267],
  'dioquino zobel': [121.0672, 14.6219],
  'duyan-duyan': [121.0689, 14.6331],
  'e. rodriguez': [121.0617, 14.6269],
  'east kamias': [121.0611, 14.6322],
  'escaler': [121.0750, 14.6367],
  'libis': [121.0806, 14.6111],
  'loyola heights': [121.0767, 14.6417],
  'mangga': [121.0650, 14.6250],
  'marilag': [121.0681, 14.6278],
  'matandang balara': [121.0833, 14.6611],
  'milagrosa': [121.0667, 14.6236],
  'pansol': [121.0811, 14.6450],
  'quirino 2-a': [121.0667, 14.6333],
  'quirino 2-b': [121.0650, 14.6306],
  'quirino 2-c': [121.0633, 14.6300],
  'quirino 3-a': [121.0656, 14.6350],
  'san roque': [121.0639, 14.6214],
  'silangan': [121.0617, 14.6289],
  'socorro': [121.0583, 14.6208],
  'cubao': [121.0542, 14.6186],
  'tagumpay': [121.0689, 14.6242],
  'ugong norte': [121.0694, 14.5956],
  'villa maria clara': [121.0647, 14.6256],
  'west kamias': [121.0539, 14.6319],
  'white plains': [121.0711, 14.6056],

  // District 4
  'bagong lipunan ng crame': [121.0528, 14.6083],
  'botocan': [121.0597, 14.6406],
  'central': [121.0506, 14.6472],
  'damayang lagi': [121.0267, 14.6233],
  'don manuel': [121.0117, 14.6217],
  'dona aurora': [121.0083, 14.6233],
  'dona imelda': [121.0167, 14.6150],
  'dona josefa': [121.0050, 14.6267],
  'horseshoe': [121.0417, 14.6150],
  'immaculate conception': [121.0472, 14.6222],
  'kalusugan': [121.0317, 14.6233],
  'kamuning': [121.0389, 14.6306],
  'kaunlaran': [121.0472, 14.6150],
  'kristong hari': [121.0361, 14.6217],
  'krus na ligas': [121.0689, 14.6486],
  'laging handa': [121.0347, 14.6361],
  'malaya': [121.0567, 14.6450],
  'mariana': [121.0367, 14.6200],
  'obrando': [121.0389, 14.6267],
  'paligsahan': [121.0278, 14.6317],
  'pinagkaisahan': [121.0472, 14.6267],
  'pinyahan': [121.0489, 14.6389],
  'roxas': [121.0278, 14.6367],
  'sacred heart': [121.0389, 14.6367],
  'san isidro': [121.0389, 14.6200],
  'san martin de porres': [121.0528, 14.6150],
  'san vicente': [121.0622, 14.6542],
  'santo nino': [121.0139, 14.6250],
  'santol': [121.0139, 14.6183],
  'sikatuna village': [121.0583, 14.6444],
  'south triangle': [121.0361, 14.6389],
  'tatalon': [121.0167, 14.6250],
  'teachers village east': [121.0583, 14.6486],
  'teachers village west': [121.0539, 14.6486],
  'up campus': [121.0689, 14.6539],
  'up village': [121.0567, 14.6514],
  'valencia': [121.0361, 14.6111],

  // District 5
  'bagbag': [121.0369, 14.6961],
  'capri': [121.0389, 14.7111],
  'fairview': [121.0664, 14.7083],
  'greater lagro': [121.0689, 14.7189],
  'gulod': [121.0392, 14.7183],
  'kaligayahan': [121.0472, 14.7317],
  'nagkaisang nayon': [121.0267, 14.7150],
  'novaliches proper': [121.0442, 14.7233],
  'novaliches': [121.0442, 14.7233],
  'pasong putik proper': [121.0639, 14.7333],
  'san agustin': [121.0389, 14.7067],
  'san bartolome': [121.0356, 14.7058],
  'santa lucia': [121.0539, 14.7178],
  'sta. lucia': [121.0539, 14.7178],
  'santa monica': [121.0472, 14.7183],

  // District 6
  'apolonio samson': [121.0083, 14.6556],
  'baesa': [121.0139, 14.6694],
  'balumbato': [121.0056, 14.6611],
  'culiat': [121.0542, 14.6653],
  'new era': [121.0611, 14.6639],
  'pasong tamo': [121.0544, 14.6789],
  'sangandaan': [121.0250, 14.6722],
  'sauyo': [121.0389, 14.6861],
  'talipapa': [121.0261, 14.6878],
  'tandang sora': [121.0456, 14.6739],
  'unang sigaw': [121.0028, 14.6567],
};

const geocodeCache = new Map<string, [number, number] | null>();


function normalizeBarangayName(name: string): string {
  return name
    .toLowerCase()
    .replace(/^(brgy\.?|barangay)\s*/i, '')
    .replace(/\bqc\b/i, '')
    .replace(/quezon city/i, '')
    .replace(/philippines/i, '')
    .replace(/[(),]/g, '')
    .trim();
}


function parseCoordinates(location: string): [number, number] | null {
  if (!location) return null;

  
  const dmsMatch = location.match(/([\d.-]+)\s*[Nn]?\s*,\s*([\d.-]+)\s*[Ee]?/);
  if (dmsMatch) {
    const val1 = parseFloat(dmsMatch[1]);
    const val2 = parseFloat(dmsMatch[2]);
    if (!isNaN(val1) && !isNaN(val2)) {
      if (val1 >= 14 && val1 <= 15 && val2 >= 120 && val2 <= 122) {
        return [val2, val1]; 
      }
      
      if (val1 >= 120 && val1 <= 122 && val2 >= 14 && val2 <= 15) {
        return [val1, val2];
      }
    }
  }

  return null;
}


async function resolveLocationCoords(locationStr: string, id: string): Promise<[number, number]> {
  if (!locationStr) return [121.0493, 14.6515];

  
  const parsed = parseCoordinates(locationStr);
  if (parsed) return parsed;

 
  const normalized = normalizeBarangayName(locationStr);
  if (QC_BARANGAY_COORDS[normalized]) {
    return QC_BARANGAY_COORDS[normalized];
  }

  
  for (const [key, coords] of Object.entries(QC_BARANGAY_COORDS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }


  const cacheKey = locationStr.trim().toLowerCase();
  if (geocodeCache.has(cacheKey) && geocodeCache.get(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  
  try {
    const searchQuery = locationStr.toLowerCase().includes('quezon')
      ? locationStr
      : `${locationStr}, Quezon City, Philippines`;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
    );
    const data = await res.json();
    if (data && data.length > 0) {
      const coords: [number, number] = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
      geocodeCache.set(cacheKey, coords);
      return coords;
    }
  } catch (err) {
    console.warn('Geocoding error:', err);
  }

  
  let hash = 0;
  for (let i = 0; i < (id || locationStr).length; i++) {
    hash = ((hash << 5) - hash) + (id || locationStr).charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = ((Math.abs(hash) % 100) - 50) * 0.0006;
  const offsetLng = (((Math.abs(hash * 31)) % 100) - 50) * 0.0006;
  return [121.0493 + offsetLng, 14.6515 + offsetLat];
}

function getIncidentColor(type: string): string {
  const t = type?.toLowerCase() || '';
  if (t.includes('fire')) return '#ef4444'; 
  if (t.includes('flood')) return '#3b82f6'; 
  if (t.includes('earthquake')) return '#a855f7'; 
  if (t.includes('medical')) return '#10b981'; 
  if (t.includes('road') || t.includes('vehicular') || t.includes('obstruction') || t.includes('accident')) return '#f97316'; // Orange
  return '#eab308'; // Amber
}

function getStatusBadgeHtml(status: string, color: string): string {
  let badgeColor = color;
  let bg = `${color}20`;
  let text = status || 'Pending';

  return `<span style="display: inline-flex; align-items: center; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; padding: 2px 8px; border-radius: 9999px; background: ${bg}; color: ${badgeColor}; border: 1px solid ${badgeColor}40;">${text}</span>`;
}

export default function HazardMap({ incidents = [], weather, height = '380px' }: HazardMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const animationRef = useRef<number | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [121.0493, 14.6515], 
      zoom: 12,
      minZoom: 11,
      maxZoom: 19,
      pitch: 45,
      bearing: -12,
      attributionControl: { compact: true },
    });

    m.on('style.load', () => {
      const style = m.getStyle();
      if (style && style.layers) {
        let buildingSource = '';
        let buildingSourceLayer = '';

        style.layers.forEach((layer) => {
          if (layer.type === 'symbol') {
            const id = layer.id.toLowerCase();
            const isMajorPlace =
              id.includes('place') ||
              id.includes('suburb') ||
              id.includes('neighbourhood') ||
              id.includes('district') ||
              id.includes('city') ||
              id.includes('town');

            layer.layout = layer.layout || {};
            if (isMajorPlace) {
              layer.layout.visibility = 'visible';
              layer.paint = layer.paint || {};
              (layer.paint as any)['text-color'] = '#1e293b';
              (layer.paint as any)['text-halo-color'] = '#ffffff';
              (layer.paint as any)['text-halo-width'] = 1.5;
            } else {
              layer.layout.visibility = 'none';
            }
          }

          if (layer.type === 'line') {
            const id = layer.id.toLowerCase();
            if (id.includes('road') || id.includes('street') || id.includes('highway') || id.includes('motorway')) {
              layer.paint = layer.paint || {};
              (layer.paint as any)['line-color'] = id.includes('highway') ? '#cbd5e1' : '#94a3b8';
            }
          }

          if (layer.type === 'fill' && layer.id.includes('building')) {
            buildingSource = (layer as any).source;
            buildingSourceLayer = (layer as any)['source-layer'] || (layer as any).sourceLayer;
            layer.layout = layer.layout || {};
            layer.layout.visibility = 'none';
          }
        });

        m.setStyle(style);

        m.once('idle', () => {
          if (buildingSource && buildingSourceLayer && !m.getLayer('3d-buildings')) {
            m.addLayer({
              id: '3d-buildings',
              source: buildingSource,
              'source-layer': buildingSourceLayer,
              type: 'fill-extrusion',
              minzoom: 13.5,
              paint: {
                'fill-extrusion-color': '#f1f5f9',
                'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13.5, 0, 15, ['coalesce', ['get', 'height'], 15]],
                'fill-extrusion-opacity': 0.8,
              },
            });
          }
        });
      }
    });

    m.addControl(new maplibregl.NavigationControl(), 'top-right');

    const resizeObserver = new ResizeObserver(() => {
      m.resize();
    });

    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    m.on('load', () => {
      m.resize();

      // Flood zones
      if (!m.getSource('hazard-flood')) {
        m.addSource('hazard-flood', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [121.030, 14.640],
                  [121.050, 14.645],
                  [121.055, 14.630],
                  [121.035, 14.625],
                  [121.030, 14.640],
                ],
              ],
            },
            properties: {},
          },
        });
        m.addLayer({
          id: 'hazard-flood-fill',
          type: 'fill',
          source: 'hazard-flood',
          paint: {
            'fill-color': '#3b82f6',
            'fill-opacity': 0.2,
          },
        });
        m.addLayer({
          id: 'hazard-flood-line',
          type: 'line',
          source: 'hazard-flood',
          paint: {
            'line-color': '#2563eb',
            'line-width': 2,
            'line-dasharray': [2, 2],
          },
        });
      }

      
      if (!m.getSource('hazard-quake')) {
        m.addSource('hazard-quake', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [
                [121.110, 14.730],
                [121.095, 14.700],
                [121.085, 14.680],
                [121.075, 14.650],
                [121.072, 14.630],
                [121.070, 14.610],
                [121.065, 14.590],
              ],
            },
            properties: {},
          },
        });
        m.addLayer({
          id: 'hazard-quake-line',
          type: 'line',
          source: 'hazard-quake',
          paint: {
            'line-color': '#f43f5e',
            'line-width': 3.5,
          },
        });
      }

      
      let startTime = 0;
      function animateHazards(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const opacity = 0.25 + Math.sin(elapsed / 400) * 0.15;

        if (map.current) {
          if (map.current.getLayer('hazard-flood-fill')) {
            map.current.setPaintProperty('hazard-flood-fill', 'fill-opacity', opacity);
          }
          if (map.current.getLayer('hazard-quake-line')) {
            map.current.setPaintProperty('hazard-quake-line', 'line-opacity', opacity + 0.3);
          }
        }
        animationRef.current = requestAnimationFrame(animateHazards);
      }
      animationRef.current = requestAnimationFrame(animateHazards);
    });

    map.current = m;

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      markersRef.current.forEach((mk) => mk.remove());
      markersRef.current = [];
      resizeObserver.disconnect();
      m.remove();
      map.current = null;
    };
  }, []);

  
  useEffect(() => {
    if (!incidents) return;

    let isCancelled = false;

    const renderMarkers = async () => {
      
      const resolvedList: Array<{ incident: IncidentMarker; coords: [number, number] }> = [];

      for (const incident of incidents) {
        if (isCancelled) return;
        const loc = incident.location || incident.gps_location || '';
        const coords = await resolveLocationCoords(loc, incident.incident_id);
        resolvedList.push({ incident, coords });
      }

      if (isCancelled) return;

     
      const checkAndAdd = () => {
        if (!map.current) {
          setTimeout(checkAndAdd, 100);
          return;
        }

        const m = map.current;

        
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];

        resolvedList.forEach(({ incident, coords }) => {
          const color = getIncidentColor(incident.type);

          
          const rootEl = document.createElement('div');
          rootEl.className = 'incident-marker-root';

          rootEl.innerHTML = `
            <div class="incident-marker-inner">
              <div class="incident-wave-ring" style="border-color: ${color};"></div>
              <div class="incident-wave-ring incident-wave-ring-delay" style="border-color: ${color};"></div>
              <svg class="incident-pin-svg" viewBox="0 0 36 52" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 0C8.06 0 0 8.06 0 18c0 12.6 18 34 18 34s18-21.4 18-34C36 8.06 27.94 0 18 0z" 
                      fill="${color}" />
                <circle cx="18" cy="17" r="8" fill="#ffffff" />
              </svg>
            </div>
          `;

          const popup = new maplibregl.Popup({
            offset: [0, -48],
            closeButton: true,
            closeOnClick: false,
            maxWidth: '280px',
            className: 'incident-map-popup',
          }).setHTML(`
            <div style="font-family: system-ui, -apple-system, sans-serif; padding: 2px 0;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${color};"></span>
                  <strong style="font-size: 13px; color: #0f172a; font-weight: 700;">${incident.type}</strong>
                </div>
                ${getStatusBadgeHtml(incident.status, color)}
              </div>
              <div style="font-size: 11px; color: #475569; margin-bottom: 4px; line-height: 1.4;">
                <strong>📍 Location:</strong> ${incident.location || 'Quezon City'}
              </div>
              ${incident.reporter_name ? `<div style="font-size: 11px; color: #64748b; margin-bottom: 2px;"><strong>👤 Reporter:</strong> ${incident.reporter_name}</div>` : ''}
              ${incident.contact_number ? `<div style="font-size: 11px; color: #64748b; margin-bottom: 2px;"><strong>📞 Contact:</strong> ${incident.contact_number}</div>` : ''}
              ${incident.assigned_responder ? `<div style="font-size: 11px; color: #2563eb; font-weight: 600; margin-top: 4px;">🚨 Assigned: ${incident.assigned_responder}</div>` : ''}
            </div>
          `);

          const marker = new maplibregl.Marker({
            element: rootEl,
            anchor: 'bottom',
          })
            .setLngLat(coords)
            .setPopup(popup)
            .addTo(m);

          markersRef.current.push(marker);
        });
      };

      checkAndAdd();
    };

    renderMarkers();

    return () => {
      isCancelled = true;
    };
  }, [incidents]);

  
  useEffect(() => {
    if (!map.current || !weather) return;

    const isRaining = weather.weatherCode >= 61;
    const fillColor = isRaining ? '#ef4444' : '#3b82f6';
    const lineColor = isRaining ? '#dc2626' : '#2563eb';

    const updateColors = () => {
      if (map.current?.getLayer('hazard-flood-fill')) {
        map.current.setPaintProperty('hazard-flood-fill', 'fill-color', fillColor);
      }
      if (map.current?.getLayer('hazard-flood-line')) {
        map.current.setPaintProperty('hazard-flood-line', 'line-color', lineColor);
      }
    };

    if (map.current.isStyleLoaded()) {
      updateColors();
    } else {
      map.current.once('idle', updateColors);
    }
  }, [weather]);

  return (
    <>
      <style>{`
        /* Map pin container — Root MUST NOT have CSS transforms */
        .incident-marker-root {
          width: 36px;
          height: 52px;
          cursor: pointer;
          pointer-events: auto;
        }

        /* Inner container handles hover animation */
        .incident-marker-inner {
          position: relative;
          width: 36px;
          height: 52px;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .incident-marker-root:hover .incident-marker-inner {
          transform: scale(1.22) translateY(-4px);
        }

        .incident-pin-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 36px;
          height: 52px;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.35));
          z-index: 3;
        }

        /* Wave animation rings directly beneath the pin point */
        .incident-wave-ring {
          position: absolute;
          bottom: -3px;
          left: 50%;
          width: 14px;
          height: 7px;
          border: 2.5px solid;
          border-radius: 50%;
          transform: translateX(-50%);
          opacity: 0;
          z-index: 1;
          pointer-events: none;
          animation: incident-wave-pulse 2.2s ease-out infinite;
        }

        .incident-wave-ring-delay {
          animation-delay: 0.8s;
        }

        @keyframes incident-wave-pulse {
          0% {
            width: 10px;
            height: 5px;
            opacity: 0.9;
            bottom: -2px;
          }
          100% {
            width: 54px;
            height: 22px;
            opacity: 0;
            bottom: -12px;
          }
        }

        /* MapLibre Popup Styling */
        .incident-map-popup .maplibregl-popup-content {
          border-radius: 14px !important;
          padding: 12px 14px !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid #e2e8f0 !important;
          background: #ffffff !important;
        }
        .incident-map-popup .maplibregl-popup-close-button {
          padding: 4px 8px !important;
          color: #94a3b8 !important;
          font-size: 16px !important;
        }
        .incident-map-popup .maplibregl-popup-close-button:hover {
          color: #0f172a !important;
          background: transparent !important;
        }
        .incident-map-popup .maplibregl-popup-tip {
          border-top-color: #ffffff !important;
        }
      `}</style>
      <div
        ref={mapContainer}
        style={{ width: '100%', height, position: 'relative', zIndex: 0 }}
      />
    </>
  );
}
