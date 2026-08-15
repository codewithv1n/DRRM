import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {  
  Package, 
  CheckCircle2,
  X, 
  ArrowRight, 
  CloudSun,
  Cloud,
  Sun,
  CloudRain,
  CloudLightning,
  MapPin,
  Clock,
  BookOpen,
  Navigation,
  Sparkles,
  LocateFixed,
  BellRing
} from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import ResidentLayout from '../../components/layout/CitizenLayout';




const API_URL = import.meta.env.VITE_API_URL;

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const { reliefClaims } = useMockData();
  const [isSyncing, setIsSyncing] = useState(false);
  const [shelters, setShelters] = useState<any[]>([]);
  const [userName, setUserName] = useState('Resident');
  const [weather, setWeather] = useState<{ temp: number; description: string; code: number } | null>(null);

  // Load user name from localStorage
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

  // Fetch real-time weather
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
  }, []);

  const fetchAndSetShelters = async (lat: number, lon: number) => {
    try {
      // 1. Fetch nearest evacuation centers from our database (sorted by distance)
      const dbResponse = await fetch(`${API_URL}/api/evacuation-centers?lat=${lat}&lon=${lon}`);
      const dbData = await dbResponse.json();
      const nearbyCenters = (dbData.data || []).slice(0, 10);
      
      console.log('Nearby centers from DB:', nearbyCenters.length, nearbyCenters);

      if (nearbyCenters.length === 0) {
        alert('No evacuation centers found in the database.');
        setIsSyncing(false);
        return;
      }

      // Format the DB results into display-ready data as fallback
      const dbShelters = nearbyCenters.slice(0, 3).map((c: any) => ({
        name: c.name,
        distance: c.distance ? `${c.distance.toFixed(2)}km away` : 'Nearby',
        status: `${c.current_occupants || 0}/${c.capacity} Families`,
        isFull: (c.current_occupants || 0) >= c.capacity
      }));

      // 2. Try AI to pick the best 3
      try {
        const contextText = nearbyCenters.map((c: any) => 
          `- ${c.name} (Barangay: ${c.barangay}, Capacity: ${c.current_occupants || 0}/${c.capacity}, Distance: ${c.distance ? c.distance.toFixed(2) + 'km' : 'Unknown'})`
        ).join('\n');

        const aiResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY || ''}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system", 
                content: "You are a disaster management AI for Quezon City. Based on the provided list of nearby evacuation centers, select the 3 BEST shelters for the user. Prioritize those with available capacity (current_occupants < capacity) and shorter distances. Respond ONLY with a valid JSON array of exactly 3 shelters. No markdown, no backticks, no explanation. Just the JSON array. Format: [{\"name\": \"...\", \"distance\": \"...\", \"status\": \"...\", \"isFull\": false}]"
              },
              {
                role: "user", 
                content: `Here are the nearest evacuation centers to my location:\n${contextText}\n\nPick the 3 best shelters.`
              }
            ],
            temperature: 0.1
          })
        });
        
        const aiData = await aiResponse.json();
        console.log('AI response:', aiData);
        
        if (aiData.choices && aiData.choices[0]) {
          const text = aiData.choices[0].message.content.trim();
          console.log('AI text:', text);
          const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(jsonStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setShelters(parsed);
            return;
          }
        }
      } catch (aiError) {
        console.warn('AI failed, using database results directly:', aiError);
      }

      // 3. Fallback: use database-sorted results directly
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
    
    // Default fallback to Quezon City Hall coordinates if location is blocked
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
        { timeout: 5000 } // Wait max 5 seconds before fallback
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
        
        {/* Welcome Section with Weather Info */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">Citizen Portal</span>
            <h2 className="text-3xl font-bold text-slate-900 font-display mb-1">Welcome back, {userName}!</h2>
            <p className="text-slate-500 text-sm">Access your digital resident card, track distributions, and check local shelter status.</p>
          </div>
          
          {/* Quick Weather Badge */}
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







        {/* Dashboard Sections: Operations vs Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Recent Claims Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 font-display">Recent Relief Activities</h3>
              <button 
                onClick={() => navigate('/citizen/claim_history')}
                className="text-xs font-bold text-primary hover:text-orange-600 flex items-center gap-1"
              >
                View History <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-slate-50">
              {reliefClaims.map(claim => (
                <div key={claim.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${claim.status === 'Claimed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-slate-800 text-sm truncate">
                        {claim.status === 'Claimed' ? 'Family Food Pack' : 'Family Hygiene Kit A'}
                      </h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${claim.status === 'Claimed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Hub Scanner</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(claim.timestamp).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Quick Actions Grid */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 font-display">Resident Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button 
                onClick={() => navigate('/citizen/alerts')}
                className="bg-white text-left p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between h-36 cursor-pointer"
              >
                <div className="bg-primary/10 text-primary p-2.5 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-primary transition-colors flex items-center gap-1">
                    Alerts & Advisories <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-slate-400">View active city warnings.</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/survival_guides')}
                className="bg-white text-left p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between h-36 cursor-pointer"
              >
                <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl w-fit group-hover:bg-indigo-100 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                    Survival Guides <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-slate-400">View disaster guides.</p>
                </div>
              </button>

            </div>
            
            {/* AI Evacuation Area Recommendations */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  AI Suggested Shelters
                </h3>
                <button 
                  onClick={handleSyncLocation}
                  disabled={isSyncing}
                  className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 hover:bg-indigo-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSyncing ? <div className="w-3.5 h-3.5 border-2 border-indigo-700 border-t-transparent rounded-full animate-spin" /> : <LocateFixed className="w-3.5 h-3.5" />}
                  {isSyncing ? 'Syncing...' : 'Sync Location'}
                </button>
              </div>
              
              <div className="space-y-3">
                {shelters.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-center">
                    <div className="bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MapPin className="w-6 h-6 text-indigo-500" />
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">Please Sync Your Location</h4>
                    <p className="text-xs text-slate-500 max-w-62.5 mx-auto">
                      Click the "Sync Location" button above to find the nearest and safest evacuation centers.
                    </p>
                  </div>
                ) : (
                  shelters.map((shelter, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] relative overflow-hidden group hover:border-indigo-100 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${shelter.isFull ? 'bg-slate-50 text-slate-400' : (idx === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600')}`}>
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 text-sm">{shelter.name}</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">{shelter.distance} • {shelter.status}</p>
                          </div>
                        </div>
                        <button className="bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 p-2 rounded-xl transition-colors cursor-pointer">
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

      {/* Welcome Toast */}
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
    </ResidentLayout>
  );
}
