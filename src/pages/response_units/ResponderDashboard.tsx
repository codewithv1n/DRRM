import { useState, useEffect } from 'react';
import { encryptedFetch } from '../../utils/encryptedFetch';
import { useReliefDispatches } from '../../hooks/useSystemHooks';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';
import { Activity, Clock, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const API_URL = import.meta.env.VITE_API_URL;

export default function ResponderDashboard() {
  const { reliefDispatches } = useReliefDispatches();
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    encryptedFetch(`${API_URL}/api/incidents`)
      .then(res => res.json())
      .then(data => setIncidents(data))
      .catch(err => console.error(err));
  }, []);
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const responderName = user?.taskforce_name || user?.name || 'Task Force 1';

  const activeIncidents = incidents.filter(i => 
    i.status !== 'Resolved' && i.assigned_responder?.includes(responderName)
  );

  const deliveriesCompleted = reliefDispatches.filter(d => d.status === 'Delivered').length;

  // Compute Average Response Time
  let avgResponseTime = "N/A";
  const resolvedIncidents = incidents.filter(i => i.status === 'Resolved' && i.assigned_responder?.includes(responderName));
  if (resolvedIncidents.length > 0) {
    const totalDiff = resolvedIncidents.reduce((sum, inc) => {
      const created = new Date(inc.created_at || inc.timestamp).getTime();
      const updated = new Date(inc.updated_at || Date.now()).getTime();
      return sum + (updated - created);
    }, 0);
    const avgMs = totalDiff / resolvedIncidents.length;
    const mins = Math.floor(avgMs / 60000);
    const secs = Math.floor((avgMs % 60000) / 1000);
    avgResponseTime = `${mins}m ${secs}s`;
  }

  // Compute Bar Chart Data
  const incidentCountsByType = incidents.reduce((acc, inc) => {
    if (inc.assigned_responder?.includes(responderName)) {
      acc[inc.type] = (acc[inc.type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const barChartData = Object.entries(incidentCountsByType).map(([name, count]) => ({ name, count }));
  if (barChartData.length === 0) {
    barChartData.push({ name: 'No Data', count: 0 });
  }

  // Compute Pie Chart Data
  const reliefCountsByStatus = reliefDispatches.reduce((acc, dispatch) => {
    acc[dispatch.status] = (acc[dispatch.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = Object.entries(reliefCountsByStatus).map(([name, value]) => ({ name, value }));
  if (pieChartData.length === 0) {
    pieChartData.push({ name: 'No Data', value: 1 });
  }

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <ResponseUnitLayout activeIncidentsCount={activeIncidents.length}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Dashboard Overview</h2>
          <p className="text-slate-500 mt-1">Overview of your unit's performance and history</p>
        </div>

        {/* Metrics Overview */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metric 1: Active Missions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-default">
              <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Active Missions</p>
                <h3 className="text-2xl font-black text-slate-800">{activeIncidents.length}</h3>
              </div>
            </div>

            {/* Metric 2: Average Response Time */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-default">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Avg Response</p>
                <h3 className="text-2xl font-black text-slate-800">{avgResponseTime}</h3>
              </div>
            </div>

            {/* Metric 3: Deliveries Completed */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 cursor-default">
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
                    <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={48} />
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
      </div>
    </ResponseUnitLayout>
  );
}
