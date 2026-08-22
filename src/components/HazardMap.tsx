import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { QC_BARANGAY_COORDS } from '../data/barangayCoords';

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



const geocodeCache = new Map<string, [number, number] | null>();
const reverseGeocodeCache = new Map<string, string>();


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
                <strong>📍 Location:</strong> <span id="loc-${incident.incident_id}">${incident.location || 'Quezon City'}</span>
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

          popup.on('open', () => {
            const locStr = incident.location || incident.gps_location || '';
            if (locStr.includes('Auto-detected') || locStr.includes('N,') || locStr.includes('E')) {
               const cacheKey = `${coords[1]},${coords[0]}`;
               const el = document.getElementById(`loc-${incident.incident_id}`);
               if (!el) return;
               
               if (reverseGeocodeCache.has(cacheKey)) {
                   el.innerText = reverseGeocodeCache.get(cacheKey)!;
                   return;
               }
               
               el.innerText = 'Translating location...';
               
               fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[1]}&lon=${coords[0]}`)
                 .then(r => r.json())
                 .then(d => {
                    if (d?.display_name) {
                       const parts = d.display_name.split(', ');
                       const simplified = parts.length > 3 ? parts.slice(0, 3).join(', ') : d.display_name;
                       reverseGeocodeCache.set(cacheKey, simplified);
                       const elUpdate = document.getElementById(`loc-${incident.incident_id}`);
                       if (elUpdate) elUpdate.innerText = simplified;
                    } else {
                       el.innerText = locStr;
                    }
                 })
                 .catch(() => {
                    if (el) el.innerText = locStr;
                 });
            }
          });

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
