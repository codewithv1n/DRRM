import { 
  AlertTriangle, 
  CloudRain, 
  Wind, 
  Thermometer, 
  Info,
  Waves,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { encryptedFetch } from '../../utils/encryptedFetch';
import ResidentLayout from '../../components/layout/CitizenLayout';
import { useLanguage } from '../../data/LanguageContext';


const API_URL = import.meta.env.VITE_API_URL;

export default function CitizenAlerts() {
  const { language } = useLanguage();
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [weather, setWeather] = useState<{ temp: number, humidity: number, precip: number, wind: number, code: number } | null>(null);

  useEffect(() => {
    // Fetch announcements
    encryptedFetch(`${API_URL}/api/announcements`)
      .then(res => res.json())
      .then(data => setActiveAlerts(data))
      .catch(err => console.error('Error fetching announcements:', err));

    // Fetch weather data for Quezon City
    fetch('https://api.open-meteo.com/v1/forecast?latitude=14.676&longitude=121.0437&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FManila')
      .then(res => res.json())
      .then(data => {
        if (data && data.current) {
          const currentCode = data.current.weather_code;
          setWeather({
            temp: data.current.temperature_2m,
            humidity: data.current.relative_humidity_2m,
            precip: data.current.precipitation,
            wind: data.current.wind_speed_10m,
            code: currentCode
          });

          const redCodes = [65, 67, 82, 96, 99];
          const orangeCodes = [63, 81, 95];
          const yellowCodes = [51, 53, 55, 56, 57, 61, 66, 71, 73, 75, 77, 80, 85, 86];
          
          let level = '';
          let msg = '';
          if (redCodes.includes(currentCode)) { level = 'RED'; msg = 'Severe flooding is expected. Take immediate precautionary measures and evacuate if necessary.'; }
          else if (orangeCodes.includes(currentCode)) { level = 'ORANGE'; msg = 'Threatening flooding is expected. Please monitor weather conditions and take precautionary measures.'; }
          else if (yellowCodes.includes(currentCode)) { level = 'YELLOW'; msg = 'Flooding is possible in low-lying areas. Monitor the weather condition.'; }

          if (level) {
            encryptedFetch(`${API_URL}/api/weather-alerts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                weather_code: currentCode,
                temperature: data.current.temperature_2m,
                precipitation: data.current.precipitation,
                wind_speed: data.current.wind_speed_10m,
                warning_level: level,
                message: msg
              })
            }).catch(e => console.error('Error logging weather:', e));
          }
        }
      })
      .catch(err => console.error('Error fetching weather:', err));
  }, []);

  const getWeatherWarning = (code: number) => {
    const redCodes = [65, 67, 82, 96, 99];
    const orangeCodes = [63, 81, 95];
    const yellowCodes = [51, 53, 55, 56, 57, 61, 66, 71, 73, 75, 77, 80, 85, 86];

    if (redCodes.includes(code)) return { title: 'RED RAINFALL WARNING', bg: 'bg-rose-500', border: 'border-rose-400', text: 'text-rose-100', textDark: 'text-rose-50', badge: 'bg-rose-600/80', desc: 'Severe flooding is expected. Take immediate precautionary measures and evacuate if necessary.', icon: <AlertTriangle className="w-10 h-10 text-white" /> };
    if (orangeCodes.includes(code)) return { title: 'ORANGE RAINFALL WARNING', bg: 'bg-orange-500', border: 'border-orange-400', text: 'text-orange-100', textDark: 'text-orange-50', badge: 'bg-orange-600/80', desc: 'Threatening flooding is expected. Please monitor weather conditions and take precautionary measures.', icon: <CloudRain className="w-10 h-10 text-white" /> };
    if (yellowCodes.includes(code)) return { title: 'YELLOW RAINFALL WARNING', bg: 'bg-amber-500', border: 'border-amber-400', text: 'text-amber-100', textDark: 'text-amber-50', badge: 'bg-amber-600/80', desc: 'Flooding is possible in low-lying areas. Monitor the weather condition.', icon: <CloudRain className="w-10 h-10 text-white" /> };
    
    return { title: 'NORMAL WEATHER', bg: 'bg-emerald-500', border: 'border-emerald-400', text: 'text-emerald-100', textDark: 'text-emerald-50', badge: 'bg-emerald-600/80', desc: 'Weather conditions are currently normal. No active rainfall warnings in Quezon City.', icon: <Info className="w-10 h-10 text-white" /> };
  };

  const warning = weather ? getWeatherWarning(weather.code) : null;

  return (
    <ResidentLayout>
      <div className="animate-fade-in space-y-6">
        
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 font-display">{language === 'en' ? 'Early Warning & Advisories' : 'Mga Maagang Babala at Abiso'}</h2>
          <p className="text-slate-500 mt-1">{language === 'en' ? 'Real-time alerts and weather updates for Quezon City residents.' : 'Real-time na alerto at update sa panahon para sa mga residente ng Quezon City.'}</p>
        </div>

        {/* Current Warning Banner */}
        {warning && (
          <div className={`${warning.bg} rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border ${warning.border}`}>
            <div className="absolute top-0 right-0 -mr-8 -mt-8 opacity-20 pointer-events-none">
              <CloudRain className="w-64 h-64" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
              <div className="bg-white/20 p-4 rounded-2xl shrink-0 backdrop-blur-sm border border-white/20 shadow-inner">
                {warning.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`${warning.badge} border ${warning.border} text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm shadow-sm`}>
                    {weather?.code && weather.code >= 51 ? (language === 'en' ? 'Active Warning' : 'Aktibong Babala') : (language === 'en' ? 'Status Update' : 'Update sa Katayuan')}
                  </span>
                  <span className={`${warning.text} text-xs font-medium flex items-center gap-1`}><Clock className="w-3 h-3" /> {language === 'en' ? 'Live Updates' : 'Live na Update'}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black font-display tracking-wide mb-2">{warning.title}</h3>
                <p className={`${warning.textDark} font-medium md:text-lg leading-relaxed max-w-2xl`}>
                  {warning.desc}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Advisories */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              {language === 'en' ? 'City Advisories' : 'Mga Abiso ng Lungsod'}
            </h3>
            
            <div className="space-y-4">
              {activeAlerts.length > 0 ? activeAlerts.map(alert => (
                <div key={alert.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                  <div className={`p-3 rounded-xl h-fit border shrink-0 ${
                    alert.level.includes('Red') || alert.level.includes('Critical') ? 'bg-rose-50 border-rose-100 text-rose-600' :
                    alert.level.includes('Warning') || alert.level.includes('Orange') ? 'bg-amber-50 border-amber-100 text-amber-600' :
                    'bg-blue-50 border-blue-100 text-blue-600'
                  }`}>
                    {alert.level.includes('Red') || alert.level.includes('Critical') ? <AlertTriangle className="w-6 h-6" /> :
                     alert.level.includes('Warning') || alert.level.includes('Orange') ? <AlertTriangle className="w-6 h-6" /> :
                     <Info className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{alert.level}</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="flex items-center gap-1 text-xs font-semibold text-slate-600"><ShieldAlert className="w-3.5 h-3.5" /> {alert.channel || (language === 'en' ? 'System Alert' : 'Alerto ng Sistema')}</span>
                      <span className="text-xs text-slate-400">{language === 'en' ? 'Issued' : 'Inilabas'} {new Date(alert.created_at || alert.timestamp || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center p-8 text-slate-500 bg-white rounded-2xl border border-slate-100 shadow-sm">
                   {language === 'en' ? 'No active city advisories at the moment.' : 'Walang aktibong abiso ang lungsod sa ngayon.'}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar: Current Weather */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-800 font-display flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-indigo-500" />
              {language === 'en' ? 'Local Weather' : 'Lokal na Panahon'}
            </h3>
            
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-slate-500 font-medium text-sm uppercase tracking-widest">Quezon City</p>
                  <h4 className="text-4xl font-black text-slate-900 mt-1">{weather ? `${Math.round(weather.temp)}°C` : '--°C'}</h4>
                </div>
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shadow-inner">
                  {weather && weather.code >= 51 ? <CloudRain className="w-8 h-8 text-blue-500" /> : <Thermometer className="w-8 h-8 text-orange-500" />}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><CloudRain className="w-4 h-4 text-blue-400" /> {language === 'en' ? 'Precipitation' : 'Pag-ulan'}</span>
                  <span className="font-bold text-slate-800">{weather ? `${weather.precip} mm` : '--'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Wind className="w-4 h-4 text-emerald-400" /> {language === 'en' ? 'Wind Speed' : 'Bilis ng Hangin'}</span>
                  <span className="font-bold text-slate-800">{weather ? `${weather.wind} km/h` : '--'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100">
                  <span className="text-slate-500 text-sm flex items-center gap-2"><Waves className="w-4 h-4 text-cyan-400" /> {language === 'en' ? 'Humidity' : 'Halumigmig'}</span>
                  <span className="font-bold text-slate-800">{weather ? `${weather.humidity}%` : '--'}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                 <p className="text-xs text-indigo-800 font-medium leading-relaxed text-center">
                   {weather && weather.code >= 51 ? (language === 'en' ? 'Rainy conditions detected. Keep umbrellas and rain gear ready.' : 'May napansing pag-ulan. Ihanda ang inyong mga payong at panangga sa ulan.') : (language === 'en' ? 'Conditions are relatively clear. Stay hydrated and aware of any rapid changes.' : 'Maaliwalas ang panahon. Manatiling hydrated at maging alerto sa anumang pagbabago.')}
                 </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </ResidentLayout>
  );
}
