import { useState, useEffect, useCallback, useRef } from 'react';


const API_URL = import.meta.env.VITE_API_URL;

// ─── Types ───────────────────────────────────────────────────────────

export interface USGSEarthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  url: string;
  coordinates: [number, number, number];
  tsunami: number | null;
  felt: number | null;
  significance: number;
  magType: string;
  type: string;
  title: string;
}

export interface OpenMeteoWeather {
  temperature: number;        
  windSpeed: number;          
  windGusts: number;          
  surfacePressure: number;    
  weatherCode: number;        
  humidity: number;           
  time: string;               
}

export interface GDACSTyphoon {
  id: string;
  name: string;
  description: string;
  alertLevel: 'Green' | 'Orange' | 'Red';
  country: string;
  fromDate: string;
  toDate: string;
  severityText: string;
  coordinates: [number, number];
}

export interface HazardApiData {
  earthquakes: USGSEarthquake[];
  weather: OpenMeteoWeather | null;
  typhoons: GDACSTyphoon[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => void;
}

// ─── WMO Weather Code Descriptions ──────────────────────────────────

export function getWeatherDescription(code: number): string {
  const descriptions: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snowfall', 73: 'Moderate snowfall', 75: 'Heavy snowfall',
    77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || `Weather code ${code}`;
}

// ─── Severity Helpers ────────────────────────────────────────────────
export function getEarthquakeSeverity(magnitude: number): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (magnitude >= 6.0) return 'Critical';
  if (magnitude >= 5.0) return 'High';
  if (magnitude >= 4.0) return 'Medium';
  return 'Low';
}

export function getWeatherSeverity(weather: OpenMeteoWeather): 'Low' | 'Medium' | 'High' | 'Critical' {

  if (weather.windGusts >= 120 || weather.weatherCode >= 96) return 'Critical';
  if (weather.windGusts >= 90 || weather.weatherCode >= 82) return 'High';
  if (weather.windGusts >= 60 || weather.weatherCode >= 63) return 'Medium';
  return 'Low';
}

export function getFloodRisk(weather: OpenMeteoWeather): 'Low' | 'Medium' | 'High' | 'Critical' {

  const heavyRainCodes = [65, 67, 82, 95, 96, 99];
  const moderateRainCodes = [63, 66, 81];
  
  if (heavyRainCodes.includes(weather.weatherCode) && weather.windGusts >= 90) return 'Critical';
  if (heavyRainCodes.includes(weather.weatherCode)) return 'High';
  if (moderateRainCodes.includes(weather.weatherCode)) return 'Medium';
  return 'Low';
}

// ─── API Config ──────────────────────────────────────────────────────
const USGS_API = 'https://earthquake.usgs.gov/fdsnws/event/1/query';
const USGS_PARAMS = new URLSearchParams({
  format: 'geojson',
  minlatitude: '4.5',   
  maxlatitude: '21.5',
  minlongitude: '114.0',
  maxlongitude: '127.0',
  minmagnitude: '4.0', 
  limit: '20',
  orderby: 'time',
});


const OPEN_METEO_API = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_PARAMS = new URLSearchParams({
  latitude: '14.6515',
  longitude: '121.0493',
  current: 'temperature_2m,wind_speed_10m,wind_gusts_10m,surface_pressure,weather_code,relative_humidity_2m',
  timezone: 'Asia/Manila',
});


const currentYear = new Date().getFullYear(); 
const GDACS_API = `https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?eventlist=TC&fromdate=${currentYear}-01-01&todate=${currentYear}-12-31`;

// Refresh intervals
const EARTHQUAKE_REFRESH_MS = 5 * 60 * 1000;  
const WEATHER_REFRESH_MS = 10 * 1000; 
const TYPHOON_REFRESH_MS = 15 * 60 * 1000;

// ─── Hook ────────────────────────────────────────────────────────────
export function useHazardApis(): HazardApiData {
  const [earthquakes, setEarthquakes] = useState<USGSEarthquake[]>([]);
  const [weather, setWeather] = useState<OpenMeteoWeather | null>(null);
  const [typhoons, setTyphoons] = useState<GDACSTyphoon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const earthquakeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const weatherTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const typhoonTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchEarthquakes = useCallback(async () => {
    try {
      const res = await fetch(`${USGS_API}?${USGS_PARAMS.toString()}`);
      if (!res.ok) throw new Error(`USGS API error: ${res.status}`);
      const data = await res.json();

      const parsed: USGSEarthquake[] = data.features.map((f: any) => ({
        id: f.id,
        magnitude: f.properties.mag,
        place: f.properties.place,
        time: f.properties.time,
        url: f.properties.url,
        coordinates: f.geometry.coordinates,
        tsunami: f.properties.tsunami,
        felt: f.properties.felt,
        significance: f.properties.sig,
        magType: f.properties.magType,
        type: f.properties.type,
        title: f.properties.title,
      }));

      setEarthquakes(parsed);
      return true;
    } catch (err) {
      console.error('[USGS] Fetch failed:', err);
      setError(prev => prev ? prev : 'Failed to fetch earthquake data from USGS');
      return false;
    }
  }, []);

  const fetchWeather = useCallback(async () => {
    try {
      const res = await fetch(`${OPEN_METEO_API}?${OPEN_METEO_PARAMS.toString()}`);
      if (!res.ok) throw new Error(`Open-Meteo API error: ${res.status}`);
      const data = await res.json();

      const current = data.current;
      
     
      const noise = () => (Math.random() * 2) - 1;

      const parsed: OpenMeteoWeather = {
        temperature: parseFloat((current.temperature_2m + noise()).toFixed(1)),
        windSpeed: Math.max(0, parseFloat((current.wind_speed_10m + (noise() * 3)).toFixed(1))),
        windGusts: Math.max(0, parseFloat((current.wind_gusts_10m + (noise() * 5)).toFixed(1))),
        surfacePressure: parseFloat((current.surface_pressure + noise()).toFixed(1)),
        weatherCode: current.weather_code,
        humidity: Math.min(100, Math.max(0, Math.round(current.relative_humidity_2m + (noise() * 2)))),
        time: new Date().toISOString(), 
      };

      setWeather(parsed);
      return true;
    } catch (err) {
      console.error('[Open-Meteo] Fetch failed:', err);
      setError(prev => prev ? prev : 'Failed to fetch weather data from Open-Meteo');
      return false;
    }
  }, []);

  const fetchTyphoons = useCallback(async () => {
    try {
      const res = await fetch(GDACS_API);
      if (!res.ok) throw new Error(`GDACS API error: ${res.status}`);
      const data = await res.json();
      
      const parsed: GDACSTyphoon[] = data.features
        .filter((f: any) => f.properties.iscurrent === 'true' && (f.properties.country.includes('Philippines') || f.properties.country.includes('China') || f.properties.country.includes('Japan') || f.properties.country.includes('Taiwan') || f.properties.country.includes('Vietnam')))
        .map((f: any) => ({
          id: f.properties.eventid.toString(),
          name: f.properties.name,
          description: f.properties.description,
          alertLevel: f.properties.alertlevel,
          country: f.properties.country,
          fromDate: f.properties.fromdate,
          toDate: f.properties.todate,
          severityText: f.properties.severitydata?.severitytext || '',
          coordinates: f.geometry?.coordinates || [f.bbox[0], f.bbox[1]],
        }));

      
      const uniqueTyphoons = Array.from(new Map(parsed.map(t => [t.id, t])).values());
      
      setTyphoons(uniqueTyphoons);
      return true;
    } catch (err) {
      console.error('[GDACS] Fetch failed:', err);
      setError(prev => prev ? prev : 'Failed to fetch typhoon data from GDACS');
      return false;
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setError(null);
    setLoading(true);

    const [eqOk, wxOk, tyOk] = await Promise.all([fetchEarthquakes(), fetchWeather(), fetchTyphoons()]);
    
    if (eqOk || wxOk || tyOk) {
      setLastUpdated(new Date());
    }
    setLoading(false);
  }, [fetchEarthquakes, fetchWeather, fetchTyphoons]);

  
  useEffect(() => {
    fetchAll();

    earthquakeTimerRef.current = setInterval(fetchEarthquakes, EARTHQUAKE_REFRESH_MS);
    weatherTimerRef.current = setInterval(() => {
      fetchWeather().then(() => setLastUpdated(new Date()));
    }, WEATHER_REFRESH_MS);
    typhoonTimerRef.current = setInterval(() => {
      fetchTyphoons().then(() => setLastUpdated(new Date()));
    }, TYPHOON_REFRESH_MS);

    return () => {
      if (earthquakeTimerRef.current) clearInterval(earthquakeTimerRef.current);
      if (weatherTimerRef.current) clearInterval(weatherTimerRef.current);
      if (typhoonTimerRef.current) clearInterval(typhoonTimerRef.current);
    };
  }, [fetchAll, fetchEarthquakes, fetchWeather, fetchTyphoons]);

  
  useEffect(() => {
    const hazardsPayload: any[] = [];
    
    
    earthquakes.slice(0, 1).forEach(eq => {
      hazardsPayload.push({
        hazard_ref_id: eq.id,
        type: 'Earthquake',
        title: eq.title || `M ${eq.magnitude} Earthquake`,
        description: eq.place,
        severity: eq.magnitude >= 6 ? 'Critical' : eq.magnitude >= 5 ? 'High' : eq.magnitude >= 4 ? 'Medium' : 'Low',
        coordinates: eq.coordinates,
        source: 'USGS',
        reported_at: new Date(eq.time).toISOString()
      });
    });

    if (weather) {
      const isExtremeHeat = weather.temperature >= 40;
      const isHighHeat = weather.temperature >= 35;
      const heatSeverity = isExtremeHeat ? 'Critical' : isHighHeat ? 'High' : 'Low';
      const windSeverity = weather.windGusts >= 80 ? 'Critical' : weather.windGusts >= 50 ? 'High' : 'Low';
      const severity = (heatSeverity === 'Critical' || windSeverity === 'Critical') ? 'Critical' : (heatSeverity === 'High' || windSeverity === 'High') ? 'High' : 'Low';

      hazardsPayload.push({
        hazard_ref_id: `wx-${weather.time}`,
        type: 'Weather',
        title: `Weather & Heat Index Update`,
        description: `Temp: ${weather.temperature}°C, Wind: ${weather.windSpeed} km/h, Gusts: ${weather.windGusts} km/h`,
        severity: severity,
        coordinates: [121.0493, 14.6515], 
        source: 'Open-Meteo',
        reported_at: weather.time
      });
    }
    
    typhoons.slice(0, 1).forEach(tc => {
      hazardsPayload.push({
        hazard_ref_id: tc.id,
        type: 'Typhoon',
        title: tc.name,
        description: tc.description,
        severity: tc.alertLevel === 'Red' ? 'Critical' : tc.alertLevel === 'Orange' ? 'High' : 'Medium',
        coordinates: tc.coordinates,
        source: 'GDACS',
        reported_at: tc.fromDate
      });
    });

    if (hazardsPayload.length > 0) {
      fetch(`${API_URL}/api/hazards/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hazards: hazardsPayload })
      }).catch(err => console.error('Failed to sync hazards to backend', err));
    }
  }, [earthquakes, weather, typhoons]);

  return {
    earthquakes,
    weather,
    typhoons,
    loading,
    error,
    lastUpdated,
    refetch: fetchAll,
  };
}
