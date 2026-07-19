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
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [121.0493, 14.6515],
      zoom: 14.6,
      minZoom: 14,
      maxZoom: 20,
      pitch: 45,
      bearing: -15,
      fadeDuration: 150, 
      crossSourceCollisions: false,
      attributionControl: {
        compact: true,
      },
    });

    m.on('style.load', () => {
    const style = m.getStyle();
    if (style && style.layers) {
    let buildingSource = '';
    let buildingSourceLayer = '';

    style.layers.forEach((layer) => {
      if (layer.type === 'symbol') {
        const id = layer.id.toLowerCase();
        const isMajorPlace = id.includes('place') || 
                           id.includes('suburb') || 
                           id.includes('neighbourhood') || 
                           id.includes('district') || 
                           id.includes('city') || 
                           id.includes('town') ||
                           id.includes('village') ||
                           id.includes('hamlet');
            
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
         const isRoad = id.includes('road') || 
                        id.includes('street') || 
                        id.includes('path') || 
                        id.includes('pedestrian') || 
                        id.includes('service') || 
                        id.includes('tunnel') || 
                        id.includes('bridge') || 
                        id.includes('link') ||
                        id.includes('minor') ||
                        id.includes('major');

         if (isRoad) {
           const isMajorHighway = id.includes('highway') || 
                                 id.includes('motorway') || 
                                 id.includes('trunk') || 
                                 id.includes('primary');
              
              layer.paint = layer.paint || {};
              if (isMajorHighway) {
                (layer.paint as any)['line-color'] = '#cbd5e1';
              } else {
                (layer.paint as any)['line-color'] = '#475569';
              }
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
          const currentLayers = m.getStyle().layers;
          let firstSymbolId = '';
          if (currentLayers) {
            for (const layer of currentLayers) {
              if (layer.type === 'symbol') {
                firstSymbolId = layer.id;
                break;
              }
            }
          }

          
          // 3d cursor map
          if (buildingSource && buildingSourceLayer && !m.getLayer('3d-buildings')) {
           
            m.addLayer({
              id: 'building-outlines',
              source: buildingSource,
              'source-layer': buildingSourceLayer,
              type: 'line',
              paint: {
                'line-color': '#64748b',
                'line-width': 1.2,
                'line-opacity': 0.8
              }
            }, firstSymbolId || undefined);

            
            m.addLayer({
              id: '3d-buildings',
              source: buildingSource,
              'source-layer': buildingSourceLayer,
              type: 'fill-extrusion',
              minzoom: 13,
              paint: {
                'fill-extrusion-color': '#f8fafc',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  0,
                  14.5,
                  ['coalesce', ['get', 'render_height'], ['get', 'height'], 15]
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  13,
                  0,
                  14.5,
                  ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0]
                ],
                'fill-extrusion-opacity': 0.85
              }
            }, firstSymbolId || undefined);
          }
        });
      }
    });

    map.current = m;

    m.on('error', (e) => {
      console.error('[MapLibre] Error:', e);
    });


    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
      trackUserLocation: true,
      showUserLocation: true,
      showAccuracyCircle: true,
    });
    m.addControl(geolocate, 'top-right');
    m.addControl(new maplibregl.NavigationControl(), 'top-right');


    const resizeObserver = new ResizeObserver(() => {
      m.resize();
    });

    if (mapContainer.current) {
      resizeObserver.observe(mapContainer.current);
    }

    m.on('load', () => {
      m.resize();
      geolocate.trigger();
    });

    return () => {
      resizeObserver.disconnect();
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
