import { useState, useEffect } from 'react';
import { useMockData } from '../../data/MockDataContext';
import { Activity, Clock, Users, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function ResponderMetricsOverview({ }: { unitId: string }) {
  const { incidents, reliefDispatches } = useMockData();
  const [evacuationCenters, setEvacuationCenters] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/evacuation-centers')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          setEvacuationCenters(data.data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // Unit-level metrics
  const activeMissions = incidents.filter(i => i.status !== 'Resolved' && i.assignedResponder === 'Task Force 1').length;
  const totalEvacuees = evacuationCenters.reduce((sum: number, ec: any) => sum + Number(ec.current_occupants || 0), 0);
  const deliveriesCompleted = reliefDispatches.filter(d => d.status === 'Delivered').length;

  // Mock Average Response Time
  const avgResponseTime = "14m 30s";

  // Chart Data - Using all incidents for a more populated chart display (or simulate unit history)
  const barChartData = [
    { name: 'Fire', count: 12 },
    { name: 'Flood', count: 18 },
    { name: 'Medical', count: 8 },
    { name: 'Rescue', count: 5 },
    { name: 'Clearing', count: 15 }
  ];

  const pieChartData = [
    { name: 'Delivered', value: 45 },
    { name: 'En Route', value: 8 },
    { name: 'Preparing', value: 12 },
    { name: 'Pending', value: 5 }
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Missions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md cursor-default">
          <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Active Missions</p>
            <h3 className="text-2xl font-black text-slate-800">{activeMissions}</h3>
          </div>
        </div>

        {/* Metric 2: Average Response Time */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md cursor-default">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Avg Response</p>
            <h3 className="text-2xl font-black text-slate-800">{avgResponseTime}</h3>
          </div>
        </div>

        {/* Metric 3: Total Evacuees */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md cursor-default">
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Citywide Evacuees</p>
            <h3 className="text-2xl font-black text-slate-800">{totalEvacuees.toLocaleString()}</h3>
          </div>
        </div>

        {/* Metric 4: Deliveries Completed */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md cursor-default">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Deliveries Done</p>
            <h3 className="text-2xl font-black text-slate-800">{deliveriesCompleted}</h3>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Activity className="w-5 h-5 text-indigo-500" />
             Historical Missions by Type
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
             <Package className="w-5 h-5 text-emerald-500" />
             Overall Relief Delivery Status
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieChartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
