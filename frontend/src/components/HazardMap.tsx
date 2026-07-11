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
          'google-hybrid': {
            type: 'raster',
            tiles: ['https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}&scale=2'],
            tileSize: 256,
            maxzoom: 20,
            attribution: 'Tiles &copy; Google'
          }
        },
        layers: [
          {
            id: 'satellite-background',
            type: 'raster',
            source: 'google-hybrid',
            paint: {
              'raster-opacity': 1.0,
              'raster-resampling': 'nearest'
            }
          }
        ]
      },
      center: [121.0493, 14.6515], 
      zoom: 14.2,
      minZoom: 11,
      maxZoom: 20, 
      pitch: 0, 
      bearing: 0, 
      attributionControl: {
        compact: true,
      },
    });

    map.current = m;

    m.on('error', (e) => {
      console.error('[MapLibre] Error:', e);
    });

  
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true,
    });
    m.addControl(geolocate, 'top-right');
    m.addControl(new maplibregl.NavigationControl(), 'top-right');

    m.on('load', () => {
      m.resize();
      
      
      geolocate.trigger();
    });

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
        .maplibregl-user-location-accuracy-circle, .mapboxgl-user-location-accuracy-circle {
          display: none !important;
        }
      `}</style>
      <div
        ref={mapContainer}
        style={{ width: '100%', height: '350px', position: 'relative', zIndex: 0 }}
      />
    </>
  );
}
