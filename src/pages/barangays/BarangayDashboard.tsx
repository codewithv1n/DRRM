import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Package, FileText, Bell, CloudLightning, Activity, Waves, Wind, Clock, Archive, CheckCircle2, X } from 'lucide-react';
import BarangayLayout from '../../components/layout/BarangayLayout';
import { useHazardApis } from '../../hooks/useHazardApis';

const API_URL = import.meta.env.VITE_API_URL;

export const ASSIGNED_BARANGAY = "Balingasa";

function timeAgo(ts: string) {
  const mins = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

export default function BarangayPortal() {
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);

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
    <BarangayLayout>
      <OverviewPanel />
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
    </BarangayLayout>
  );
}

function OverviewPanel() {
  useHazardApis(); 
  const [barangaySitReps, setBarangaySitReps] = useState<any[]>([]);
  const [reliefClaims, setReliefClaims] = useState<any[]>([]);
  const [activeAlerts, setActiveAlerts] = useState<any[]>([]);
  const [liveHazards, setLiveHazards] = useState<any[]>([]);
  const [reliefInventory, setReliefInventory] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const claimsRes = await fetch(`${API_URL}/api/relief-claims`);
        if (claimsRes.ok) setReliefClaims(await claimsRes.json());
        
        const sitRes = await fetch(`${API_URL}/api/sitreps`);
        if (sitRes.ok) {
          const data = await sitRes.json();
          setBarangaySitReps(data.data || []);
        }

        const alertRes = await fetch(`${API_URL}/api/announcements`);
        if (alertRes.ok) {
          const data = await alertRes.json();
          setActiveAlerts(data.data || data || []);
        }

        const hazardRes = await fetch(`${API_URL}/api/hazards`);
        if (hazardRes.ok) {
          const data = await hazardRes.json();
          setLiveHazards(data.data || data || []);
        }

        const invRes = await fetch(`${API_URL}/api/inventory`);
        if (invRes.ok) {
          setReliefInventory(await invRes.json());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const sitRep = barangaySitReps.find(sr => sr.barangay === ASSIGNED_BARANGAY);
  
  const pendingClaims = reliefClaims.filter(c => c.status === 'Pending').length;
  const claimedRelief = reliefClaims.filter(c => c.status === 'Claimed').length;
  
  const totalInventory = reliefInventory.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Barangay Operations Center</h2>
            <p className="text-slate-500">Manage relief goods, and situation reports for {ASSIGNED_BARANGAY}.</p>
          </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium">Relief Distributed</h3>
              <p className="text-2xl font-bold text-slate-800">{claimedRelief}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">{pendingClaims} claims pending</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium">Relief Inventory</h3>
              <p className="text-2xl font-bold text-slate-800">{totalInventory}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Available items</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium">Latest SitRep</h3>
              <p className="text-lg font-bold text-slate-800 truncate">{sitRep?.damage_severity || 'None'}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Damage severity reported</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Recent Announcements
            </h3>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-125">
            {activeAlerts.filter(a => !['Critical', 'Warning', 'Red Alert'].includes(a.level)).length > 0 ? (
              activeAlerts.filter(a => !['Critical', 'Warning', 'Red Alert'].includes(a.level)).map(alert => (
                <div key={alert.id} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      alert.level === 'Critical' ? 'bg-red-100 text-red-700' :
                      alert.level === 'Warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.level}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(alert.created_at || alert.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">{alert.message}</p>
                  <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                    <span className="capitalize">{alert.channel}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span className={`${
                      (alert.deliveryStatus || alert.delivery_status) === 'Sent' ? 'text-emerald-600' : 
                      (alert.deliveryStatus || alert.delivery_status) === 'Failed' ? 'text-red-600' : 'text-amber-600'
                    }`}>{(alert.deliveryStatus || alert.delivery_status)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500">
                <p>No recent announcements.</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between shrink-0">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CloudLightning className="w-5 h-5 text-amber-500" />
              Live Hazard Reports
            </h3>
          </div>
          <div className="divide-y divide-slate-100 overflow-y-auto max-h-125">
            {liveHazards.map((hazard, index) => {
              const Icon = hazard.type === 'Earthquake' ? Activity : hazard.type === 'Typhoon' ? Wind : Waves;
              const severityBg = hazard.severity === 'Critical' ? 'bg-red-50' : hazard.severity === 'High' ? 'bg-orange-50' : 'bg-blue-50';
              const severityColor = hazard.severity === 'Critical' ? 'text-red-600' : hazard.severity === 'High' ? 'text-orange-600' : 'text-blue-600';
              
              return (
              <div key={hazard.hazard_report_id || index} className="p-6 hover:bg-slate-50 transition-colors flex gap-4">
                <div className={`p-3 rounded-xl h-fit shrink-0 ${severityBg} ${severityColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{hazard.source}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium"><Clock className="w-3 h-3" /> {hazard.reported_at ? timeAgo(hazard.reported_at) : 'Just now'}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">{hazard.title}</h4>
                  <p className="text-sm text-slate-600 mb-2 leading-relaxed">{hazard.description}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    hazard.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    hazard.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {hazard.severity} RISK
                  </span>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  );
}

