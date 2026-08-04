import { Shield, TrendingUp,  Siren, Package, Gift } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


function OverviewPanel() {
  const { incidents, auditLogs, reliefInventory, pendingDonations } = useMockData();

  const categoryTotals = reliefInventory.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);
  
  const currentTotal = reliefInventory.reduce((acc, curr) => acc + curr.quantity, 0);

  const CATEGORY_COLORS = {
    'Food': 'text-blue-500',
    'Water': 'text-cyan-500',
    'Medical': 'text-red-500',
    'Equipment': 'text-amber-500',
    'Hygiene': 'text-emerald-500',
    'Non-Food': 'text-purple-500',
    'Shelter': 'text-indigo-500',
    'Default': 'text-slate-400'
  };
  
  const bgColors = {
    'Food': 'bg-blue-500',
    'Water': 'bg-cyan-500',
    'Medical': 'bg-red-500',
    'Equipment': 'bg-amber-500',
    'Hygiene': 'bg-emerald-500',
    'Non-Food': 'bg-purple-500',
    'Shelter': 'bg-indigo-500',
    'Default': 'bg-slate-400'
  };

  const chartSegments = Object.entries(categoryTotals).map(([cat, val]) => ({
    category: cat,
    value: val,
    color: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS['Default'],
    bgColor: bgColors[cat as keyof typeof bgColors] || bgColors['Default']
  }));

  const graphData = [
    { name: 'Mon', incidents: 12 },
    { name: 'Tue', incidents: 19 },
    { name: 'Wed', incidents: 3 },
    { name: 'Thu', incidents: 5 },
    { name: 'Fri', incidents: 2 },
    { name: 'Sat', incidents: 3 },
  ];

  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  
  const statCards = [
    { label: 'Total Incidents', value: incidents.length, icon: Siren, gradient: 'from-red-500 to-rose-600', sub: `${pendingCount} pending` },
    { label: 'Pending Donations', value: pendingDonations.length, icon: Gift, gradient: 'from-amber-500 to-orange-600', sub: 'Awaiting validation' },
    { label: 'Audit Entries', value: auditLogs.length, icon: Shield, gradient: 'from-emerald-500 to-teal-600', sub: 'Immutable log' },
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card) => (
          <div key={card.label} className="relative overflow-hidden bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl bg-linear-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
              </div>
              <p className="text-3xl font-bold text-slate-900 font-display">{card.value}</p>
              <p className="text-sm font-medium text-slate-500 mt-1">{card.label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
            </div>
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${card.gradient} opacity-60`} />
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
              Incident Graph
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Last 6 Days</span>
          </div>
          <div className="p-6 flex-1 bg-white flex items-center justify-center min-h-75">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={graphData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="incidents" name="Incidents" stroke="#4b5563" strokeWidth={2} fillOpacity={1} fill="#57534e" />
              </AreaChart>
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
                    const pct = currentTotal > 0 ? seg.value / currentTotal : 0;
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
  const { incidents } = useMockData();
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <OverviewPanel />
    </DepartmentLayout>
  );
}
