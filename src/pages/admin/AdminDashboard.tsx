import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TrendingUp,  Siren, Package, Gift, Home, CheckCircle2, X } from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';



const API_URL = import.meta.env.VITE_API_URL;

function OverviewPanel({ incidents, pendingCount }: { incidents: any[], pendingCount: number }) {
  const [evacuationCenters, setEvacuationCenters] = useState<any[]>([]);
  const [reliefInventory, setReliefInventory] = useState<any[]>([]);
  const [pendingDonationsCount, setPendingDonationsCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const invRes = await fetch(`${API_URL}/api/inventory`);
        if (invRes.ok) setReliefInventory(await invRes.json());
        
        const donRes = await fetch(`${API_URL}/api/donations/pending`);
        if (donRes.ok) {
          const donData = await donRes.json();
          setPendingDonationsCount(donData.length);
        }

        const evRes = await fetch(`${API_URL}/api/evacuation-centers`);
        if (evRes.ok) {
          const evData = await evRes.json();
          setEvacuationCenters(evData.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const categoryTotals = reliefInventory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.quantity || 0);
    return acc;
  }, {} as Record<string, number>);
  
  const currentTotal = reliefInventory.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0);

  const CATEGORY_COLORS = {
    'Food & Water': 'text-blue-500',
    'Clothes & Blankets': 'text-purple-500',
    'Medical Supplies': 'text-red-500',
    'Hygiene Kits': 'text-emerald-500',
    'Others': 'text-slate-500',
    'Default': 'text-slate-400'
  };
  
  const bgColors = {
    'Food & Water': 'bg-blue-500',
    'Clothes & Blankets': 'bg-purple-500',
    'Medical Supplies': 'bg-red-500',
    'Hygiene Kits': 'bg-emerald-500',
    'Others': 'bg-slate-500',
    'Default': 'bg-slate-400'
  };

  const chartSegments = Object.entries(categoryTotals).map(([cat, val]) => ({
    category: cat,
    value: val as number,
    color: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS['Default'],
    bgColor: bgColors[cat as keyof typeof bgColors] || bgColors['Default']
  }));

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0]; // YYYY-MM-DD
  });

  const incidentCountsByDate = incidents.reduce((acc, inc) => {
    const date = new Date(inc.created_at).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const graphData = last7Days.map(dateStr => {
    const dateObj = new Date(dateStr);
    return {
      name: daysOfWeek[dateObj.getDay()],
      incidents: incidentCountsByDate[dateStr] || 0
    };
  });
  
  const statCards = [
    { label: 'Total Incidents', value: incidents.length, icon: Siren, iconBg: 'bg-red-100 text-red-600', sub: `${pendingCount} pending` },
    { label: 'Pending Donations', value: pendingDonationsCount, icon: Gift, iconBg: 'bg-amber-100 text-amber-600', sub: 'Awaiting validation' },
    { label: 'Evacuation Centers', value: evacuationCenters.length, icon: Home, iconBg: 'bg-emerald-100 text-emerald-600', sub: 'Active shelters' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* System Status Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Central Command Center</h2>
          <p className="text-slate-500 mt-1">Real-time city-wide situational awareness</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-3 rounded-lg ${card.iconBg}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-slate-500 text-sm font-medium">{card.label}</h3>
                <p className="text-2xl font-bold text-slate-800">{card.value}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Two-column: Hazard Monitoring + Inventory Status */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Incident Trends Graph */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              Incident Growth Chart
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Last 7 Days</span>
          </div>
          <div className="p-6 flex-1 bg-white flex items-center justify-center min-h-75">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graphData} margin={{ top: 20, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="incidents" name="Incidents" stroke="#2563EB" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Measurement */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-4 h-4 text-slate-400" />
             Relief Goods Inventory Measurement
            </h3>
          </div>
          <div className="flex flex-col items-center justify-center p-8">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <div className="w-full h-full" style={{ animation: 'spin 1.5s cubic-bezier(0.1, 0.7, 0.1, 1) 1' }}>
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="14" fill="transparent" className="text-slate-100" />
                {(() => {
                  let cumulativePct = 0;
                  return chartSegments.map((seg) => {
                    const radius = 40;
                    const C = 2 * Math.PI * radius;
                    const pct = currentTotal > 0 ? Number(seg.value) / currentTotal : 0;
                    if (pct === 0) return null;
                    const dashLength = pct * C;
                    const dashGap = C - dashLength;
                    const offset = -(cumulativePct * C);
                    cumulativePct += pct;
                    return (
                      <circle 
                        key={seg.category}
                        cx="50" cy="50" r="40" 
                        stroke="currentColor" 
                        strokeWidth="14" 
                        fill="transparent" 
                        strokeDasharray={`${dashLength} ${dashGap}`} 
                        strokeDashoffset={offset} 
                        className={`transition-all duration-1000 ${seg.color}`} 
                      />
                    );
                  });
                })()}
              </svg>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="flex flex-col items-center justify-center text-center bg-white rounded-full w-27.5 h-27.5 shadow-sm">
                  <span className="text-2xl font-black text-slate-800 font-display leading-none">{currentTotal.toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total Items</span>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-3 w-full px-2">
              {chartSegments.map(seg => (
                <div key={seg.category} className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <div className={`w-3 h-3 rounded-full ${seg.bgColor}`} />
                  <span className="text-xs font-semibold text-slate-700">{seg.category}</span>
                  <span className="text-xs font-bold text-slate-900 ml-1">{seg.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DepartmentDashboard() {
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch(`${API_URL}/api/incidents`);
        if (res.ok) setIncidents(await res.json());
      } catch (error) {
        console.error('Error fetching incidents', error);
      }
    };
    fetchIncidents();
    const interval = setInterval(fetchIncidents, 10000);
    return () => clearInterval(interval);
  }, []);

  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  
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
    <DepartmentLayout pendingCount={pendingCount}>
      <OverviewPanel incidents={incidents} pendingCount={pendingCount} />
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
    </DepartmentLayout>
  );
}
