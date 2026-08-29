import React, { useState, useEffect } from 'react';
import { encryptedFetch } from '../../utils/encryptedFetch';
import {
  LayoutDashboard, Siren, Radio, Map as MapIcon,
  ChevronRight, ChevronDown, Bell, Menu, Users, LogOut, Package, Shield, FileText, Home, Sun, Moon
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

interface AdminLayoutProps {
  children: React.ReactNode;
  pendingCount?: number;
}

const GroupLabel = ({ label }: { label: string }) => (
  <div className="px-5 pt-6 pb-2 text-[11px] uppercase font-semibold tracking-widest text-sidebar-foreground/50">{label}</div>
);

const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
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

const SubNavItem = ({ label, path }: { label: string; path: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = location.pathname === path;
  return (
    <button
      onClick={() => navigate(path)}
      className={`flex items-center pl-10 pr-3 py-2 mx-2 w-[calc(100%-16px)] rounded-xl transition-all cursor-pointer text-sm ${
        isActive
          ? 'bg-sidebar-primary/20 text-sidebar-foreground font-medium'
          : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
      }`}
    >
      {label}
    </button>
  );
};

const NavDropdown = ({ icon: Icon, label, children, activePaths }: { icon: any; label: string; children: React.ReactNode, activePaths: string[] }) => {
  const location = useLocation();
  const isActive = activePaths.includes(location.pathname);
  const [isOpen, setIsOpen] = useState(isActive);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between px-3 py-3 mx-2 w-[calc(100%-16px)] rounded-xl transition-all cursor-pointer ${
          isActive || isOpen
            ? 'text-sidebar-foreground bg-sidebar-accent font-medium'
            : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5" />
          <span className="text-sm">{label}</span>
        </div>
        <ChevronRight className={`w-4 h-4 opacity-70 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="space-y-1 pb-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if (!localStorage.getItem('user')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userName = user?.name || 'Admin';
  const userInitials = userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [lastReadTime, setLastReadTime] = useState(parseInt(localStorage.getItem('lastReadTime_Admin') || '0'));
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
        const [incRes, donRes, alertRes] = await Promise.all([
          encryptedFetch(`${API_URL}/api/incidents?_t=${Date.now()}`),
          encryptedFetch(`${API_URL}/api/donations/pending?_t=${Date.now()}`),
          encryptedFetch(`${API_URL}/api/announcements?_t=${Date.now()}`)
        ]);
        
        const incData = incRes.ok ? await incRes.json() : [];
        const donData = donRes.ok ? await donRes.json() : { data: [] };
        const alertData = alertRes.ok ? await alertRes.json() : { data: [] };

        const pendingIncidents = (Array.isArray(incData) ? incData : []).filter((i: any) => i.status === 'Pending');
        const pDonations = Array.isArray(donData) ? donData : (donData.data || []);
        const activeAlerts = Array.isArray(alertData) ? alertData : (alertData.data || []);
        const failedAlerts = activeAlerts.filter((a: any) => (a.deliveryStatus || a.delivery_status) === 'Failed');

        const formattedNotifs = [
          ...pendingIncidents.map((i: any) => ({ 
            id: i.incident_id || i.id, 
            type: 'Incident', 
            title: `New ${i.type} at ${i.location}`, 
            prefix: `New ${i.type} at `,
            location: i.location,
            time: i.timestamp || i.created_at || Date.now(), 
            icon: Siren, 
            color: 'text-red-500', 
            bg: 'bg-red-50' 
          })),
          ...pDonations.map((d: any) => ({ 
            id: d.donation_id || d.id, 
            type: 'Donation', 
            title: `Pending donation from ${d.full_name || d.donor_name || d.donorName || 'Unknown'}`, 
            time: d.eta || d.created_at || Date.now(), 
            icon: Package, 
            color: 'text-emerald-500', 
            bg: 'bg-emerald-50' 
          })),
          ...failedAlerts.map((a: any) => ({ 
            id: a.id, 
            type: 'Alert', 
            title: `Failed Alert: ${a.level}`, 
            time: a.timestamp || a.created_at || Date.now(), 
            icon: Radio, 
            color: 'text-amber-500', 
            bg: 'bg-amber-50' 
          }))
        ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        setNotifications(formattedNotifs);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 1000);
    return () => clearInterval(interval);
  }, []);

  const displayCount = notifications.length;

  // Derive title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('incidents')) return 'Incident Dispatcher';
    if (path.includes('early_warning')) return 'City-Wide Alerts';
    if (path.includes('sitrep_coordination')) return 'Barangay SitReps';
    if (path.includes('evacuation_centers')) return 'Evacuation Centers';
    if (path.includes('relief') || path.includes('validate_donations')) return 'Relief Operations';
    if (path.includes('hazard_map')) return 'Hazard Map';
    if (path.includes('user_management')) return 'User Management';
    if (path.includes('audit_logs')) return 'Audit Logs';
    return 'Dashboard';
  };



  return (
    <div className="min-h-screen bg-background flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`select-none fixed lg:sticky top-0 h-screen z-50 bg-gradient-sidebar flex flex-col w-70 shrink-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:-ml-70'}`}>
        <div className="p-6 flex items-center gap-3">
          <img src="/logo-system.png" alt="GovServe Logo" className="w-11 h-11 object-contain shrink-0" />
          <div className="flex flex-col overflow-hidden text-white">
            <h1 className="font-bold text-[18px] text-sidebar-foreground leading-tight truncate">GovServe</h1>
            <p className="text-[12px] text-sidebar-foreground/50 font-medium truncate">Administrator</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 space-y-1 scrollbar-thin">
          <GroupLabel label="Modules" />
          <NavItem icon={LayoutDashboard} label="Dashboard" path="/admin" />
          
          <GroupLabel label="Operations" />
          <NavItem icon={Siren} label="Incident Dispatcher" path="/admin/incidents" />
          <NavItem icon={Radio} label="City-Wide Announcement" path="/admin/early_warning" />
          <NavItem icon={FileText} label="Barangay SitReps" path="/admin/sitrep_coordination" />
          <NavDropdown icon={Package} label="Relief Services" activePaths={['/admin/relief_inventory', '/admin/relief_dispatch', '/admin/validate_donations']}>
            <SubNavItem label="Inventory" path="/admin/relief_inventory" />
            <SubNavItem label="Dispatch" path="/admin/relief_dispatch" />
            <SubNavItem label="Donations" path="/admin/validate_donations" /> 
          </NavDropdown>
          
          <GroupLabel label="Monitoring" />
          <NavItem icon={MapIcon} label="Hazard Maps" path="/admin/hazard_map" />
          <NavItem icon={Home} label="Evacuation Centers" path="/admin/evacuation_centers" />
          
          <GroupLabel label="System" />
          <NavItem icon={Users} label="User Management" path="/admin/user_management" />
          <NavItem icon={Shield} label="Audit Logs" path="/admin/audit_logs" />
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
                    localStorage.setItem('lastReadTime_Admin', now.toString());
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
                  <span className="text-[10px] text-slate-500 truncate w-32">{user?.role || 'Admin'}</span>
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

        {/* Content */}
        <main className="p-4 lg:p-8 flex-1 max-w-[1600px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
