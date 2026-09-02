import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {  
  CheckCircle2,
  X, 
  ArrowRight, 
  CloudSun,
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  MapPin,
  Navigation,
  Sparkles,
  LocateFixed,
  AlertTriangle,
  Clock,
  XCircle,
  CheckCircle,
  Package
} from 'lucide-react';

import ResidentLayout from '../../components/layout/CitizenLayout';
import { useLanguage } from '../../data/LanguageContext';
import { useEvacuationAI } from '../../hooks/useEvacuationAI';




import { encryptedFetch } from '../../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

export default function CitizenDashboard() {
  const { language } = useLanguage();
  const { getAIRecommendedShelters } = useEvacuationAI();
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

  const [isSyncing, setIsSyncing] = useState(false);
  const [shelters, setShelters] = useState<any[]>([]);
  const [userName, setUserName] = useState('Resident');
  const [weather, setWeather] = useState<{ temp: number; description: string; code: number } | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [selectedShelterMap, setSelectedShelterMap] = useState<string | null>(null);
  const [recentClaims, setRecentClaims] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.name) setUserName(user.name);
      }
    } catch (e) {
      console.warn('Could not parse user from localStorage');
    }
  }, []);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=14.676&longitude=121.0437&current=temperature_2m,weather_code&timezone=Asia%2FManila')
      .then(res => res.json())
      .then(data => {
        if (data?.current) {
          const code = data.current.weather_code;
          let desc = 'Clear Sky';
          if ([0].includes(code)) desc = 'Clear Sky';
          else if ([1, 2, 3].includes(code)) desc = 'Partly Cloudy';
          else if ([45, 48].includes(code)) desc = 'Foggy';
          else if ([51, 53, 55].includes(code)) desc = 'Drizzle';
          else if ([61, 63, 65].includes(code)) desc = 'Rainy';
          else if ([71, 73, 75, 77].includes(code)) desc = 'Snow';
          else if ([80, 81, 82].includes(code)) desc = 'Rain Showers';
          else if ([95, 96, 99].includes(code)) desc = 'Thunderstorm';
          setWeather({ temp: Math.round(data.current.temperature_2m), description: desc, code });
        }
      })
      .catch(err => console.error('Weather fetch error:', err));

    encryptedFetch(`${API_URL}/api/b2e45d81-8c43-412d-96f8-a14e9f73c6b2`)
      .then(res => res.json())
      .then(data => setActiveAlerts(data))
      .catch(err => console.error('Error fetching announcements:', err));

    const userStr = localStorage.getItem('user');
    let email = '';
    if (userStr) {
      try {
        email = JSON.parse(userStr).email;
      } catch(e) {}
    }
    if (email) {
      encryptedFetch(`${API_URL}/api/8b5a3c9e-d14f-4592-8c67-bf14e7a83d95?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setRecentClaims(data);
        })
        .catch(err => console.error('Error fetching claims:', err));
    }
  }, []);

  const fetchAndSetShelters = async (lat: number, lon: number) => {
    try {
      const dbResponse = await encryptedFetch(`${API_URL}/api/d4a8b7f1-59c3-421e-8fd9-bc37ea495201?lat=${lat}&lon=${lon}`);
      const dbData = await dbResponse.json();
      const nearbyCenters = (dbData.data || []).slice(0, 10);
      
      console.log('Nearby centers from DB:', nearbyCenters.length, nearbyCenters);

      if (nearbyCenters.length === 0) {
        alert('No evacuation centers found in the database.');
        setIsSyncing(false);
        return;
      }

      
      const dbShelters = nearbyCenters.slice(0, 3).map((c: any) => ({
        name: c.name,
        distance: c.distance ? `${c.distance.toFixed(2)}km away` : 'Nearby',
        status: `${c.current_occupants || 0}/${c.capacity} Families`,
        isFull: (c.current_occupants || 0) >= c.capacity
      }));

      try {
        const parsed = await getAIRecommendedShelters(nearbyCenters, lat, lon);
        setShelters(parsed);
        return;
      } catch (aiError) {
        console.warn('AI failed, using database results directly:', aiError);
      }

     
      setShelters(dbShelters);

    } catch (error) {
      console.error('Error fetching shelters:', error);
      alert('Failed to get evacuation recommendations. Please check if the backend server is running.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncLocation = () => {
    setIsSyncing(true);
    
    const fallbackLat = 14.6465;
    const fallbackLon = 121.0505;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchAndSetShelters(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn('Geolocation failed, using fallback location.', error);
          fetchAndSetShelters(fallbackLat, fallbackLon);
        },
        { timeout: 15000, maximumAge: 0 } 
      );
    } else {
      console.warn('Geolocation not supported, using fallback location.');
      fetchAndSetShelters(fallbackLat, fallbackLon);
    }
  };

  useEffect(() => {
    if (location.state?.loginSuccess) {
      setShowToast(true);
      window.history.replaceState({}, document.title);
      
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);



  return (
    <ResidentLayout>
      <div className="animate-fade-in space-y-8">
        
        
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">{language === 'en' ? 'Citizen Portal' : 'Portal ng Mamamayan'}</span>
            <h2 className="text-3xl font-bold text-slate-900 font-display mb-1">{language === 'en' ? `Welcome back, ${userName}!` : `Maligayang pagbabalik, ${userName}!`}</h2>
            <p className="text-slate-500 text-sm">{language === 'en' ? 'Access your track distributions, and check local shelter status.' : 'Tingnan ang iyong digital resident card, subaybayan ang mga relief goods, at suriin ang mga shelter.'}</p>
          </div>
          

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 shrink-0">
            <div className={`p-2.5 rounded-xl ${weather && [61,63,65,80,81,82,95,96,99].includes(weather.code) ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
              {weather && [95,96,99].includes(weather.code) ? <CloudLightning className="w-5 h-5" /> :
               weather && [61,63,65,80,81,82].includes(weather.code) ? <CloudRain className="w-5 h-5" /> :
               weather && [1,2,3,45,48,51,53,55].includes(weather.code) ? <Cloud className="w-5 h-5" /> :
               weather && [0].includes(weather.code) ? <Sun className="w-5 h-5" /> :
               <CloudSun className="w-5 h-5" />}
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Quezon City</span>
              <span className="text-xs font-bold text-slate-700">{weather ? `${weather.description} • ${weather.temp}°C` : 'Loading...'}</span>
            </div>
          </div>
        </div>


        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 h-full">
          
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] h-full flex flex-col space-y-5">
              <div className="flex items-center justify-between shrink-0">
                <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  {language === 'en' ? 'City Advisories' : 'Mga Abiso ng Lungsod'}
                </h3>
              </div>
              
              <div className="space-y-3 flex-1 overflow-y-auto scrollbar-thin pr-2">
                {activeAlerts.length > 0 ? activeAlerts.slice(0, 3).map((alert, idx) => (
                  <div key={alert.id || idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex gap-4 hover:bg-slate-100/50 transition-colors">
                    <div className={`p-3 rounded-xl h-fit border shrink-0 ${
                      alert.level?.includes('Red') || alert.level?.includes('Critical') ? 'bg-rose-100/50 border-rose-200 text-rose-600' :
                      alert.level?.includes('Warning') || alert.level?.includes('Orange') ? 'bg-amber-100/50 border-amber-200 text-amber-600' :
                      'bg-blue-100/50 border-blue-200 text-blue-600'
                    }`}>
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-md">{alert.level || 'Alert'}</h4>
                      <p className="text-slate-500 text-sm mt-1 leading-relaxed line-clamp-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-[11px] font-medium text-slate-400">{language === 'en' ? 'Issued' : 'Inilabas'} {new Date(alert.created_at || alert.timestamp || new Date()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                     {language === 'en' ? 'No active city advisories at the moment.' : 'Walang aktibong abiso ang lungsod sa ngayon.'}
                  </div>
                )}
              </div>
            </div>


          </div>

          
          <div className="lg:col-span-5 space-y-8">
           
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 font-display">{language === 'en' ? 'Recent Relief Activities' : 'Mga Kamakailang Aktibidad'}</h3>
                <button 
                  onClick={() => navigate('/citizen/claim_history')}
                  className="text-xs font-bold text-primary hover:text-orange-600 flex items-center gap-1 bg-primary/5 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors"
                >
                  {language === 'en' ? 'View History' : 'Tingnan ang Kasaysayan'} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              
              <div className="space-y-3 max-h-62.5 overflow-y-auto scrollbar-thin pr-2">
                {recentClaims.length > 0 ? (
                  recentClaims.map((claim, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          claim.status === 'Claimed' ? 'bg-emerald-100 text-emerald-600' :
                          claim.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                          'bg-amber-100 text-amber-600'
                        }`}>
                          <Package className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{claim.item_name}</p>
                          <p className="text-xs text-slate-500">{new Date(claim.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {claim.status === 'Claimed' && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                        {claim.status === 'Pending' && <Clock className="w-4 h-4 text-amber-500" />}
                        {claim.status === 'Cancelled' && <XCircle className="w-4 h-4 text-red-500" />}
                        <span className={`text-xs font-bold ${
                          claim.status === 'Claimed' ? 'text-emerald-600' :
                          claim.status === 'Cancelled' ? 'text-red-600' :
                          'text-amber-600'
                        }`}>{claim.status}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 min-h-40 flex items-center justify-center">
                    <p className="text-slate-400 text-sm">{language === 'en' ? 'No recent relief activities.' : 'Walang kamakailang aktibidad sa relief.'}</p>
                  </div>
                )}
              </div>
            </div>
            
            
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  {language === 'en' ? 'AI Suggested Shelters' : 'Mga Mungkahing Shelter ng AI'}
                </h3>
                <button 
                  onClick={handleSyncLocation}
                  disabled={isSyncing}
                  className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSyncing ? <div className="w-3.5 h-3.5 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" /> : <LocateFixed className="w-3.5 h-3.5" />}
                  {isSyncing ? (language === 'en' ? 'Syncing...' : 'Nag-sync...') : (language === 'en' ? 'Sync Location' : 'I-sync ang Lokasyon')}
                </button>
              </div>
              
              <div className="space-y-3 max-h-62.5 overflow-y-auto scrollbar-thin pr-2">
                {shelters.length === 0 ? (
                  <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
                    <div className="bg-indigo-100/50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">{language === 'en' ? 'Please Sync Your Location' : 'Pakisync ang Iyong Lokasyon'}</h4>
                    <p className="text-xs text-slate-500 max-w-62.5 mx-auto">
                      {language === 'en' ? 'Click the "Sync Location" button above to find the nearest and safest evacuation centers.' : 'I-click ang pindutan na "I-sync ang Lokasyon" sa itaas upang mahanap ang pinakamalapit at pinakaligtas na evacuation center.'}
                    </p>
                  </div>
                ) : (
                  shelters.map((shelter, idx) => (
                    <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative overflow-hidden group hover:bg-slate-100/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${shelter.isFull ? 'bg-slate-200/50 text-slate-400' : (idx === 0 ? 'bg-emerald-100/50 text-emerald-600' : 'bg-amber-100/50 text-amber-600')}`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{shelter.name}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{shelter.distance} • {shelter.status}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSelectedShelterMap(shelter.name)}
                          title={language === 'en' ? 'View on Google Maps' : 'Tingnan sa Google Maps'}
                          className="bg-white border border-slate-100 shadow-sm hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 p-2 rounded-xl transition-colors cursor-pointer"
                        >
                          <Navigation className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>

      
      {showToast && (
        <div className="fixed top-6 right-6 bg-emerald-500 border border-emerald-400 shadow-[0_10px_40px_rgba(16,185,129,0.3)] rounded-2xl p-4 flex items-center gap-4 z-50 animate-fade-in">
          <div className="bg-emerald-400/50 text-white p-2 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Login Successful</h4>
            <p className="text-xs text-emerald-50">Welcome back to your dashboard!</p>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-2 text-emerald-200 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      
      {selectedShelterMap && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-3xl border border-slate-100 relative flex flex-col h-[70vh] md:h-[80vh]">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 bg-white shrink-0">
              <h3 className="font-bold text-slate-800 font-display flex items-center gap-3 text-lg">
                <div className="bg-indigo-50 p-2 rounded-xl">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                {selectedShelterMap}
              </h3>
              <button 
                onClick={() => setSelectedShelterMap(null)}
                className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 p-2.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="w-full h-full bg-slate-100 grow">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedShelterMap + ' Quezon City')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </ResidentLayout>
  );
}
