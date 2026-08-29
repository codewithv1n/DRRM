import React, { useState, useEffect } from 'react';
import { encryptedFetch } from '../../utils/encryptedFetch';
import {
  LogOut, LayoutDashboard, ChevronDown,
  Menu, Bell, Package, Siren, Sun, Moon, Map as MapIcon, Radio
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

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

interface ResponseUnitLayoutProps {
  children: React.ReactNode;
  activeIncidentsCount?: number;
}

export default function ResponseUnitLayout({ children }: ResponseUnitLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'Responder';
  const responderName = user?.taskforce_name || user?.name || 'Task Force 1';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastReadTime, setLastReadTime] = useState(parseInt(localStorage.getItem('lastReadTime_Responder') || '0'));

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

 
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const [incRes, alertRes] = await Promise.all([
          encryptedFetch(`${API_URL}/api/incidents`),
          encryptedFetch(`${API_URL}/api/announcements`)
        ]);
        
        const incData = incRes.ok ? await incRes.json() : [];
        const alertData = alertRes.ok ? await alertRes.json() : { data: [] };

        const myIncidents = (Array.isArray(incData) ? incData : []).filter((i: any) => 
            i.assigned_responder?.includes(responderName) && i.status !== 'Resolved'
        );
        const systemAlerts = Array.isArray(alertData) ? alertData : (alertData.data || []);

        const formattedNotifs = [
          ...myIncidents.map((i: any) => ({ 
            id: i.incident_id || i.id, 
            type: 'Incident', 
            title: `Assigned: ${i.type} at ${i.location}`, 
            prefix: `Assigned: ${i.type} at `,
            location: i.location,
            time: i.timestamp || i.created_at || Date.now(), 
            icon: Siren, 
            color: 'text-red-500', 
            bg: 'bg-red-50' 
          })),
          ...systemAlerts.map((a: any) => ({ 
            id: a.id || a.announcement_id, 
            type: 'Alert', 
            title: `System Alert: ${a.title || a.message}`, 
            time: a.timestamp || a.created_at || Date.now(), 
            icon: Radio, 
            color: 'text-blue-500', 
            bg: 'bg-blue-50' 
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        setNotifications(formattedNotifs);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 10000);
    return () => clearInterval(interval);
  }, [responderName]);

  const hasUnread = notifications.some(n => new Date(n.time).getTime() > lastReadTime);
  const displayCount = notifications.length;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('incidents')) return 'Incident Response';
    if (path.includes('deliveries')) return 'Relief Deliveries';
    if (path.includes('hazards')) return 'Hazard Map';
    return 'Dashboard';
  };

  const NavItem = ({ icon: Icon, label, path, badgeCount = 0 }: { icon: any; label: string; path: string; badgeCount?: number }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => navigate(path)}
        className={`flex items-center justify-between px-3 py-3 mx-2 w-[calc(100%-16px)] rounded-xl transition-all cursor-pointer ${
          isActive
            ? 'bg-sidebar-primary/20 text-sidebar-foreground font-medium shadow-sm border border-sidebar-primary/30'
            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-sm">{label}</span>
        </div>
        {badgeCount > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{badgeCount}</span>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`select-none fixed lg:sticky top-0 h-screen z-50 bg-gradient-sidebar flex flex-col w-70 shrink-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-70'}`}>
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-system.png" alt="GovServe Logo" className="w-11 h-11 object-contain shrink-0" />
          <div className="flex flex-col overflow-hidden text-white">
            <h1 className="font-bold text-[18px] text-sidebar-foreground leading-tight truncate">GovServe</h1>
            <p className="text-[12px] text-sidebar-foreground/50 font-medium truncate">Response Unit</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin">
          <div className="px-5 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-sidebar-foreground/50">Modules</div>
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/responders" />
          <NavItem icon={Siren} label="Incident Response" path="/responders/incidents" />
          <NavItem icon={Package} label="Relief Deliveries" path="/responders/deliveries" />
          <NavItem icon={MapIcon} label="Hazard Map" path="/responders/hazards" />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-background">
        {/* Header */}
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
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer mr-1"
                title="Toggle Dark Mode"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsProfileOpen(false);
                    if (!isNotificationsOpen) {
                      const now = Date.now();
                      setLastReadTime(now);
                      localStorage.setItem('lastReadTime_Responder', now.toString());
                    }
                  }}
                  className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  {hasUnread && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{displayCount} Total</span>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? notifications.map(n => {
                        const Icon = n.icon;
                        return (
                          <div 
                            key={n.id} 
                            onClick={() => {
                               if(n.type === 'Incident') navigate('/responders/incidents');
                               setIsNotificationsOpen(false);
                            }}
                            className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-3 cursor-pointer"
                          >
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
                      <button onClick={() => setIsNotificationsOpen(false)} className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer">Close</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200 relative">
              <button 
                onClick={() => {
                  setIsProfileOpen(!isProfileOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-3 hover:bg-slate-50 p-2 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex flex-col text-right">
                  <span className="text-[11px] font-bold text-slate-700 truncate w-32">{userName}</span>
                  <span className="text-[10px] text-slate-500 truncate w-32">{user?.role || 'Responder'}</span>
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

