import React, { useState, useEffect } from 'react';
import { encryptedFetch } from '../../utils/encryptedFetch';
import { LogOut, History, LayoutDashboard, Megaphone, Menu, Bell, FileText, Sun, Moon, ChevronDown, Siren, Radio, Heart, CloudLightning } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../../data/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL;

const notifAddressCache: Map<string, string> = new Map();

function parseCoordinates(text: string): { lat: number; lon: number } | null {
  const dms = text.match(
    /(\d+)[°]\s*(\d+)[''′]\s*([\d.]+)[""″]?\s*([NnSs])\s*(\d+)[°]\s*(\d+)[''′]\s*([\d.]+)[""″]?\s*([EeWw])/
  );
  if (dms) {
    let lat = parseFloat(dms[1]) + parseFloat(dms[2]) / 60 + parseFloat(dms[3]) / 3600;
    let lon = parseFloat(dms[5]) + parseFloat(dms[6]) / 60 + parseFloat(dms[7]) / 3600;
    if (dms[4].toUpperCase() === 'S') lat = -lat;
    if (dms[8].toUpperCase() === 'W') lon = -lon;
    return { lat, lon };
  }
  const dec = text.match(/([\d.-]+)\s*[Nn]?\s*,\s*([\d.-]+)\s*[Ee]?/);
  if (dec) return { lat: parseFloat(dec[1]), lon: parseFloat(dec[2]) };
  return null;
}

const NotifLocationText = ({ text }: { text: string }) => {
  const [display, setDisplay] = useState(text);
  useEffect(() => {
    const coords = parseCoordinates(text);
    if (!coords) return;
    const key = `${coords.lat.toFixed(4)},${coords.lon.toFixed(4)}`;
    if (notifAddressCache.has(key)) { setDisplay(notifAddressCache.get(key)!); return; }
    const t = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lon}`)
        .then(r => r.json())
        .then(d => {
          if (d?.display_name) {
            const parts = d.display_name.split(', ');
            const simplified = parts.length > 3 ? parts.slice(0, 3).join(', ') : d.display_name;
            notifAddressCache.set(key, simplified);
            setDisplay(simplified);
          }
        }).catch(() => {});
    }, Math.random() * 1000);
    return () => clearTimeout(t);
  }, [text]);
  return <>{display}</>;
};

interface CitizenLayoutProps {
  children: React.ReactNode;
}

export default function CitizenLayout({ children }: CitizenLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'Citizen';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastReadTime, setLastReadTime] = useState(parseInt(localStorage.getItem('lastReadTime_Citizen') || '0'));
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme') === 'dark';
    }
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const hasUnread = notifications.some(n => new Date(n.time || n.created_at || Date.now()).getTime() > lastReadTime);

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const userEmail = user?.email?.trim().toLowerCase() || '';
        const userBarangay = (user?.barangay || '').toLowerCase();

        const [incRes, alertRes, weatherRes] = await Promise.all([
          encryptedFetch(`${API_URL}/api/8d72f1a6-2c98-4f3b-a9b1-54c3e80d7e6f?_t=${Date.now()}`),
          encryptedFetch(`${API_URL}/api/b2e45d81-8c43-412d-96f8-a14e9f73c6b2?_t=${Date.now()}`),
          encryptedFetch(`${API_URL}/api/2b9a7c3e-f81d-458a-8c76-bc39ef147d01?_t=${Date.now()}`)
        ]);

        const incData = incRes.ok ? await incRes.json() : [];
        const alertData = alertRes.ok ? await alertRes.json() : { data: [] };
        const weatherData = weatherRes.ok ? await weatherRes.json() : [];

        const allIncidents = Array.isArray(incData) ? incData : [];

        
        const myIncidents = userEmail
          ? allIncidents.filter((i: any) => (i.reporter_email || '').trim().toLowerCase() === userEmail)
          : [];

        const myIncidentIds = new Set(myIncidents.map((i: any) => i.incident_id || i.id));
        const nearbyIncidents = userBarangay
          ? allIncidents.filter((i: any) => {
              if (myIncidentIds.has(i.incident_id || i.id)) return false;
              const repBarangay = (i.reporter_barangay || '').toLowerCase();
              const locText = (i.location || '').toLowerCase();
              return repBarangay === userBarangay || locText.includes(userBarangay);
            })
          : [];

        
        const activeAlerts = Array.isArray(alertData) ? alertData : (alertData.data || []);
        
        
        const activeWeatherAlerts = Array.isArray(weatherData) && weatherData.length > 0 ? [weatherData[0]] : [];

        const formattedNotifs = [
          ...myIncidents.map((i: any) => ({
            id: i.incident_id || i.id,
            type: 'Incident',
            title: `Your ${i.type} report – ${i.status || 'Pending'}`,
            prefix: `Your ${i.type} report at `,
            location: i.location,
            time: i.timestamp || i.created_at || Date.now(),
            icon: Siren,
            color: i.status === 'Resolved' ? 'text-emerald-500' : 'text-red-500',
            bg: i.status === 'Resolved' ? 'bg-emerald-50' : 'bg-red-50'
          })),
          ...nearbyIncidents.map((i: any) => ({
            id: `nearby-${i.incident_id || i.id}`,
            type: 'Nearby',
            title: `Nearby ${i.type} reported`,
            prefix: `${i.type} near you at `,
            location: i.location,
            time: i.timestamp || i.created_at || Date.now(),
            icon: Siren,
            color: 'text-orange-500',
            bg: 'bg-orange-50'
          })),
          ...activeAlerts.map((a: any) => ({
            id: a.id,
            type: 'Alert',
            title: `${a.level || 'Announcement'}: ${a.title || a.message || 'New alert'}`,
            time: a.timestamp || a.created_at || Date.now(),
            icon: Radio,
            color: 'text-amber-500',
            bg: 'bg-amber-50'
          })),
          ...activeWeatherAlerts.map((w: any) => {
            const level = (w.warning_level || '').toLowerCase();
            let color = 'text-blue-500';
            let bg = 'bg-blue-50';
            if (level.includes('yellow')) {
              color = 'text-yellow-600';
              bg = 'bg-yellow-50';
            } else if (level.includes('orange')) {
              color = 'text-orange-500';
              bg = 'bg-orange-50';
            } else if (level.includes('red')) {
              color = 'text-red-500';
              bg = 'bg-red-50';
            }

            const rawLevel = w.warning_level || 'Weather Alert';
            const displayTitle = rawLevel.toLowerCase().includes('warning') 
              ? rawLevel 
              : `${rawLevel} RAINFALL WARNING`;

            return {
              id: w.weather_alert_id || `weather-${w.created_at}`,
              type: 'Weather',
              title: displayTitle,
              prefix: `${w.message || 'Weather condition advisory'}`,
              location: '',
              time: w.created_at || Date.now(),
              icon: CloudLightning,
              color,
              bg
            };
          })
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        setNotifications(formattedNotifs);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, []);

  const displayCount = notifications.length;

  // Derive title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (language === 'ph') {
      if (path.includes('alerts')) return 'Mga Alerto at Abiso';
      if (path.includes('report_logs')) return 'Aking Mga Report';
      if (path.includes('announcements')) return 'Mga Anunsyo ng Relief';
      if (path.includes('claim_history')) return 'Kasaysayan ng Pag-claim';
      if (path.includes('donation_logs')) return 'Aking Mga Donasyon';
      return 'Pangunahing Pahina';
    } else {
      if (path.includes('alerts')) return 'Alerts & Advisories';
      if (path.includes('report_logs')) return 'My Report Logs';
      if (path.includes('announcements')) return 'Relief Announcements';
      if (path.includes('claim_history')) return 'Claim History';
      if (path.includes('donation_logs')) return 'My Donations';
      return 'Dashboard';
    }
  };

  const isActive = (path: string) => {
      if (path === '/citizen' && location.pathname === '/citizen') return true;
      if (path !== '/citizen' && location.pathname.startsWith(path)) return true;
      return false;
  };

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => {
            navigate(path);
            if (window.innerWidth < 1024) {
              setSidebarOpen(false); 
            }
        }}
        className={`flex items-center px-3 py-3 mx-2 w-[calc(100%-16px)] rounded-xl transition-all cursor-pointer ${
          active
            ? 'bg-sidebar-primary/20 text-sidebar-foreground font-medium shadow-sm border border-sidebar-primary/30'
            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-sm">{label}</span>
        </div>
      </button>
    );
  };

  const GroupLabel = ({ label }: { label: string }) => (
    <div className="px-5 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-sidebar-foreground/50">{label}</div>
  );

  return (
    <div className="min-h-screen bg-background flex font-sans text-slate-900">
      
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`select-none fixed lg:sticky top-0 h-screen z-50 bg-gradient-sidebar flex flex-col w-70 shrink-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-70'}`}>
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-system.png" alt="GovServe Logo" className="w-11 h-11 object-contain shrink-0" />
          <div className="flex flex-col overflow-hidden text-white">
            <h1 className="font-bold text-[18px] text-sidebar-foreground leading-tight truncate">GovServe</h1>
            <p className="text-[12px] text-sidebar-foreground/50 font-medium truncate">Citizen Portal</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin">
          <GroupLabel label={language === 'en' ? "Modules" : "Mga Modyul"} />
          <NavItem icon={LayoutDashboard} label={language === 'en' ? "Dashboard" : "Pangunahing Pahina"} path="/citizen" />
          <GroupLabel label={language === 'en' ? "Services" : "Mga Serbisyo"} />
          <NavItem icon={FileText} label={language === 'en' ? "My Report Logs" : "Aking Mga Report"} path="/citizen/report_logs" />
          <NavItem icon={Megaphone} label={language === 'en' ? "Relief Announcements" : "Mga Anunsyo ng Relief"} path="/citizen/announcements" />
          <NavItem icon={History} label={language === 'en' ? "Claim History" : "Kasaysayan ng Pag-claim"} path="/citizen/claim_history" />
          <NavItem icon={Heart} label={language === 'en' ? "My Donations" : "Aking Mga Donasyon"} path="/citizen/donation_logs" />
        </div>


      </aside>

     
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-background">
        
        <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4 lg:px-6 shrink-0 shadow-soft">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center text-slate-800 font-bold text-lg">
              {getPageTitle()}
            </div>
          </div>
          
          <div className="flex items-center gap-4 lg:gap-6">
            <div className="flex items-center gap-2 relative">
              <div className="flex items-center mr-1 md:mr-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setLanguage('en')}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${language === 'en' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  title="Switch to English"
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ph')}
                  className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all ${language === 'ph' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                  title="Switch to Tagalog"
                >
                  PH
                </button>
              </div>

              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer mr-1"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (!isNotifOpen) {
                    const now = Date.now();
                    setLastReadTime(now);
                    localStorage.setItem('lastReadTime_Citizen', now.toString());
                  }
                }}
                className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
              </button>

              {isNotifOpen && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{displayCount} Total</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? notifications.map(n => {
                      const Icon = n.icon;
                      return (
                        <div key={n.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.bg} ${n.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 line-clamp-2">{n.location ? <>{n.prefix}<NotifLocationText text={n.location} /></> : n.title}</p>
                            <p className="text-[10px] text-slate-500 mt-1">{new Date(n.time).toLocaleString()}</p>
                          </div>
                        </div>
                      )
                    }) : (
                      <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-50 bg-slate-50 text-center">
                    <button onClick={() => setIsNotifOpen(false)} className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">Close</button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 relative">
              <button 
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-bold text-slate-700 truncate w-32">{userName}</span>
                  <span className="text-[10px] text-slate-500 truncate w-32">{user?.role || 'Citizen'}</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-bold text-xs">
                  {userInitials}
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
                  <button 
                    onClick={() => { localStorage.removeItem('user'); navigate('/login', { replace: true }); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

       
        <main className="p-4 lg:p-8 flex-1 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}

