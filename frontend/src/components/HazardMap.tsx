import { useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

export default function HazardMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [121.0493, 14.6515],
      zoom: 13,
      minZoom: 12,
      maxZoom: 18,
    });

    map.current = m;

    m.on('error', (e) => {
      console.error('[MapLibre] Error:', e);
    });

    m.on('load', () => {
      m.resize();
    });

    m.addControl(new maplibregl.NavigationControl(), 'top-right');
    m.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        trackUserLocation: true,
      }),
      'top-right'
    );

    return () => {
      m.remove();
      map.current = null;
    };
  }, []);

  return (
    <>
      <style>{`
        .maplibregl-user-location-dot, .mapboxgl-user-location-dot {
          background-color: #22c55e !important;
          width: 15px !important;
          height: 15px !important;
        }
        .maplibregl-user-location-dot::before, .mapboxgl-user-location-dot::before {
          background-color: #22c55e !important;
        }
        .maplibregl-user-location-dot::after, .mapboxgl-user-location-dot::after {
          border: 3px solid #ffffff !important;
          background-color: #22c55e !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35) !important;
          width: 21px !important;
          height: 21px !important;
          left: -3px !important;
          top: -3px !important;
        }
      `}</style>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '300px', position: 'relative', zIndex: 0 }}
      />
    </>
  );
}

