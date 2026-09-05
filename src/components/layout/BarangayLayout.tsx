import React, { useState, useEffect } from 'react';
import { encryptedFetch } from '../../utils/encryptedFetch';
import {
  FileText, LogOut, LayoutDashboard, ChevronDown,
  Menu, Bell, Package, List, Megaphone, History, Building2, Sun, Moon, Siren
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';


const API_URL = import.meta.env.VITE_API_URL;

const geocodeCache = new Map<string, string>();

const translateLocation = async (locStr: string): Promise<string> => {
  if (!locStr) return locStr;
  if (!/N,.*E/.test(locStr) && !/^\d+\.\d+,\s*\d+\.\d+/.test(locStr)) return locStr;
  
  if (geocodeCache.has(locStr)) return geocodeCache.get(locStr)!;

  const match = locStr.match(/([0-9.]+)\s*[NS],\s*([0-9.]+)\s*[EW]/i) || locStr.match(/([0-9.]+),\s*([0-9.]+)/);
  if (match) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${match[1]}&lon=${match[2]}`);
      if (res.ok) {
        const data = await res.json();
        let address = data.display_name || locStr;
        if (data.address) {
          const parts = [data.address.road, data.address.village || data.address.suburb, data.address.city || data.address.town].filter(Boolean);
          if (parts.length > 0) address = parts.join(', ');
        }
        geocodeCache.set(locStr, address);
        return address;
      }
    } catch (e) {
      console.error('Geocode error:', e);
    }
  }
  
  geocodeCache.set(locStr, locStr);
  return locStr;
};interface BarangayLayoutProps {
  children: React.ReactNode;
}

export default function BarangayLayout({ children }: BarangayLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'Brgy. Admin';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastReadTime, setLastReadTime] = useState(parseInt(localStorage.getItem('lastReadTime_Barangay') || '0'));
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

  const hasUnread = notifications.some(n => new Date(n.created_at || n.timestamp || Date.now()).getTime() > lastReadTime);

  useEffect(() => {
    const userBarangay = (user?.barangay || '').toLowerCase();

    const fetchNotifs = async () => {
      try {
        const [incRes, alertRes, weatherRes] = await Promise.all([
          encryptedFetch(`${API_URL}/api/8d72f1a6-2c98-4f3b-a9b1-54c3e80d7e6f?_t=${Date.now()}`),
          encryptedFetch(`${API_URL}/api/b2e45d81-8c43-412d-96f8-a14e9f73c6b2?_t=${Date.now()}`),
          encryptedFetch(`${API_URL}/api/2b9a7c3e-f81d-458a-8c76-bc39ef147d01?_t=${Date.now()}`)
        ]);

        const incData = incRes.ok ? await incRes.json() : [];
        const alertData = alertRes.ok ? await alertRes.json() : { data: [] };
        const weatherData = weatherRes.ok ? await weatherRes.json() : [];

        const allIncidents = Array.isArray(incData) ? incData : [];
        
        const barangayIncidents = userBarangay
          ? allIncidents.filter((i: any) => {
              const repBarangay = (i.reporter_barangay || '').toLowerCase();
              const locText = (i.location || '').toLowerCase();
              return repBarangay === userBarangay || locText.includes(userBarangay);
            })
          : [];

        const activeAlerts = Array.isArray(alertData) ? alertData : (alertData.data || []);

        
        const activeWeatherAlerts = Array.isArray(weatherData) && weatherData.length > 0 ? [weatherData[0]] : [];

        const combinedPromises = [
          ...barangayIncidents.map(async (i: any) => {
            const translatedLoc = await translateLocation(i.location || '');
            return {
              id: i.incident_id || i.id,
              type: 'Incident',
              level: i.type,
              message: `${i.type} reported at ${translatedLoc} by ${i.reporter_name}`,
              created_at: i.created_at || i.timestamp,
              icon: 'siren',
              status: i.status
            };
          }),
          ...activeAlerts.map(async (a: any) => ({
            id: a.id,
            type: 'Announcement',
            level: a.level || 'Info',
            message: a.message || a.title || 'New announcement',
            created_at: a.created_at || a.timestamp,
            icon: 'megaphone'
          })),
          ...activeWeatherAlerts.map(async (w: any) => {
            const rawLevel = w.warning_level || 'Weather Alert';
            const displayTitle = rawLevel.toLowerCase().includes('warning') 
              ? rawLevel 
              : `${rawLevel} RAINFALL WARNING`;
            return {
              id: w.weather_alert_id || `weather-${w.created_at}`,
              type: 'Weather',
              level: displayTitle,
              message: w.message || 'Weather condition advisory',
              created_at: w.created_at,
              icon: 'weather'
            };
          })
        ];

        const combined = await Promise.all(combinedPromises);
        combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setNotifications(combined);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 1000);
    return () => clearInterval(interval);
  }, []);

  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('relief_inventory')) return 'Relief Inventory';
    if (path.includes('relief_requests')) return 'Relief Requests';
    if (path.includes('relief_distribution')) return 'Relief Distribution';
    if (path.includes('sitrep_upload')) return 'SitRep Uploader';
    if (path.includes('sitrep_logs')) return 'SitRep Logs';
    if (path.includes('evacuation_centers')) return 'Evacuation Centers';
    return 'Dashboard';
  };

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center px-3 py-3 mx-2 w-[calc(100%-16px)] rounded-xl transition-all cursor-pointer ${
          isActive
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
      
      <aside className={`select-none fixed lg:sticky top-0 h-screen z-50 bg-gradient-sidebar flex flex-col w-70 shrink-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-70'}`}>
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-system.png" alt="GovServe Logo" className="w-11 h-11 object-contain shrink-0" />
          <div className="flex flex-col overflow-hidden text-white">
            <h1 className="font-bold text-[18px] text-sidebar-foreground leading-tight truncate">GovServe</h1>
            <p className="text-[12px] text-sidebar-foreground/50 font-medium truncate">Barangay Admin</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin">
          <GroupLabel label="Modules" />
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/barangays" />
          <GroupLabel label="Operations" />
          <NavItem icon={Package} label="Relief Inventory" path="/barangays/relief_inventory" />
          <NavItem icon={List} label="Relief Requests" path="/barangays/relief_requests" />
          <NavItem icon={Megaphone} label="Relief Distribution" path="/barangays/relief_distribution" />
          <GroupLabel label="Monitoring" />
          <NavItem icon={Building2} label="Evacuation Monitoring" path="/barangays/evacuation_centers" />
          <NavItem icon={FileText} label="SitRep Uploader" path="/barangays/sitrep_upload" />
          <NavItem icon={History} label="SitRep Logs" path="/barangays/sitrep_logs" />
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
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer mr-1"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications) {
                    const now = Date.now();
                    setLastReadTime(now);
                    localStorage.setItem('lastReadTime_Barangay', now.toString());
                  }
                }} 
                className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
              </button>

              {showNotifications && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{notifications.length} New</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.slice(0, 8).map((notif: any) => {
                        const isIncident = notif.type === 'Incident';
                        const bg = isIncident ? 'bg-red-50' : (notif.level === 'Critical' ? 'bg-red-50' : notif.level === 'Warning' ? 'bg-amber-50' : 'bg-blue-50');
                        const color = isIncident ? 'text-red-500' : (notif.level === 'Critical' ? 'text-red-500' : notif.level === 'Warning' ? 'text-amber-500' : 'text-blue-500');
                        const NotifIcon = isIncident ? Siren : Megaphone;
                        return (
                          <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
                              <NotifIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 line-clamp-2">
                                {isIncident ? `${notif.level} Report: ` : `${notif.level} Alert: `}{notif.message}
                              </p>
                              <p className="text-[10px] text-slate-500 mt-1">
                                {new Date(notif.created_at || Date.now()).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-8 text-center text-slate-500 text-sm flex flex-col items-center">
                        <Bell className="w-8 h-8 text-slate-300 mb-2" />
                        No new notifications
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-slate-50 bg-slate-50 text-center">
                    <button onClick={() => setShowNotifications(false)} className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">Close</button>
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
                  <span className="text-[10px] text-slate-500 truncate w-32">{user?.barangay ? `Brgy. ${user.barangay}` : 'Barangay'}</span>
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

       
        <main className="p-4 lg:p-9 flex-1 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
