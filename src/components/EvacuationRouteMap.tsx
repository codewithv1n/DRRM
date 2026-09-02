import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface EvacuationRouteMapProps {
  userLocation: { lat: number; lon: number };
  shelterLocation: { lat: number; lon: number };
  shelterName: string;
  height?: string;
}

export default function EvacuationRouteMap({ userLocation, shelterLocation, shelterName, height = '100%' }: EvacuationRouteMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    
    const bounds = new maplibregl.LngLatBounds()
      .extend([userLocation.lon, userLocation.lat])
      .extend([shelterLocation.lon, shelterLocation.lat]);

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      bounds: bounds,
      fitBoundsOptions: { padding: 80, maxZoom: 16 },
      attributionControl: { compact: true },
    });

    m.addControl(new maplibregl.NavigationControl(), 'top-right');

    const resizeObserver = new ResizeObserver(() => {
      m.resize();
    });

    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    m.on('load', async () => {
      m.resize();

      let routeCoordinates = [
        [userLocation.lon, userLocation.lat],
        [shelterLocation.lon, shelterLocation.lat]
      ];

      try {
        const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${userLocation.lon},${userLocation.lat};${shelterLocation.lon},${shelterLocation.lat}?overview=full&geometries=geojson`);
        const data = await res.json();
        if (data && data.routes && data.routes[0]) {
          routeCoordinates = data.routes[0].geometry.coordinates;
        }
      } catch (err) {
        console.warn('Failed to fetch route:', err);
      }

      
      m.addSource('route', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeCoordinates
          }
        }
      });

      m.addLayer({
        id: 'route-line',
        type: 'line',
        source: 'route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#0000ff', 
          'line-width': 4
        }
      });

      
      const userEl = document.createElement('div');
      userEl.innerHTML = `
        <div style="width: 24px; height: 24px; background-color: #3b82f6; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
          <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
        </div>
      `;
      new maplibregl.Marker({ element: userEl })
        .setLngLat([userLocation.lon, userLocation.lat])
        .setPopup(new maplibregl.Popup({ offset: 25, closeButton: false }).setHTML('<div style="font-weight: bold; font-size: 12px; padding: 4px;">Your Location</div>'))
        .addTo(m);

      
      const shelterEl = document.createElement('div');
      shelterEl.innerHTML = `
        <div style="position: relative; width: 32px; height: 32px;">
          <svg viewBox="0 0 24 24" fill="#4f46e5" stroke="white" stroke-width="2" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 3px rgba(0,0,0,0.3));">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.242-4.243a8 8 0 1111.314 0z" />
            <circle cx="12" cy="10" r="3" fill="white" stroke="none" />
          </svg>
        </div>
      `;
      new maplibregl.Marker({ element: shelterEl, anchor: 'bottom' })
        .setLngLat([shelterLocation.lon, shelterLocation.lat])
        .setPopup(new maplibregl.Popup({ offset: [0, -32], closeButton: false }).setHTML(`<div style="font-weight: bold; font-size: 14px; padding: 4px; color: #4f46e5;">${shelterName}</div>`))
        .addTo(m);
    });

    map.current = m;

    return () => {
      resizeObserver.disconnect();
      m.remove();
      map.current = null;
    };
  }, [userLocation, shelterLocation, shelterName]);

  return <div ref={mapContainer} style={{ width: '100%', height }} />;
}
