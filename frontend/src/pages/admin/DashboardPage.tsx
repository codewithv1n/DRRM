import {
  dashboardStats,
  evacuationCenterStatus,
  weatherData,
  recentActivity,
  activityTypeConfig,
} from '../../data/AdminData';

export default function DashboardPage() {
  const statCards = [
    {
      label: 'Pending',
      value: dashboardStats.pending,
      color: '#f59e0b',
      bg: 'rgba(245,158,11,0.08)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      label: 'Ongoing',
      value: dashboardStats.ongoing,
      color: '#ea580c',
      bg: 'rgba(234,88,12,0.08)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" />
        </svg>
      ),
    },
    {
      label: 'Resolved',
      value: dashboardStats.resolved,
      color: '#16a34a',
      bg: 'rgba(22,163,74,0.08)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    {
      label: 'Total Ngayon',
      value: dashboardStats.totalToday,
      color: '#2563eb',
      bg: 'rgba(37,99,235,0.08)',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9H21M9 21V9" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 m-0 tracking-tight">Command Center</h1>
        <p className="text-[13px] text-slate-400 mt-1">Real-time overview ng barangay operations | Hulyo 17, 2026</p>
      </div>

      {/* Typhoon Alert Banner */}
      <div
        className="flex items-center gap-4 py-4 px-5 rounded-xl border animate-[fadeIn_0.5s_ease]"
        style={{ background: 'rgba(220,38,38,0.05)', borderColor: 'rgba(220,38,38,0.2)' }}
      >
        <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-red-700 m-0">
            ⚠️ Typhoon Signal No. {weatherData.typhoonSignal}: {weatherData.typhoonName}
          </p>
          <p className="text-[12px] text-red-600/70 mt-0.5 leading-relaxed">{weatherData.advisory}</p>
        </div>
        <span className="shrink-0 text-[10px] font-bold text-white bg-red-600 px-2.5 py-1 rounded-full uppercase tracking-wider animate-[pulse-dot_2s_ease-in-out_infinite]">
          LIVE
        </span>
      </div>

      {/* Active Incidents Counter */}
      <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center gap-4 py-5 px-5 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-px"
          >
            <div
              className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: stat.bg }}
            >
              {stat.icon}
            </div>
            <div>
              <p className="text-[26px] font-bold leading-none m-0" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-1 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Middle Row: Weather + Evacuation Centers */}
      <div className="grid grid-cols-[1fr_1.5fr] gap-5 max-lg:grid-cols-1">
        {/* Weather Quick Glance */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between py-3.5 px-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 m-0">Weather (PAGASA)</h2>
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">Live</span>
          </div>
          <div className="p-5 flex flex-col gap-4">
            {/* Temperature & Condition */}
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill="rgba(37,99,235,0.06)" />
                  <path d="M24 12C20 16 16 20 16 26C16 30.4 19.6 34 24 34C28.4 34 32 30.4 32 26C32 20 28 16 24 12Z" stroke="#3b82f6" strokeWidth="2" fill="rgba(59,130,246,0.1)" />
                  <path d="M21 28L24 22L27 28" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 m-0">{weatherData.temperature}°C</p>
                <p className="text-[12px] text-slate-400 mt-0.5">{weatherData.condition}</p>
              </div>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 py-3 px-3.5 rounded-lg" style={{ background: 'rgba(37,99,235,0.04)' }}>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Humidity</span>
                <span className="text-sm font-bold text-slate-700">{weatherData.humidity}%</span>
              </div>
              <div className="flex flex-col gap-1 py-3 px-3.5 rounded-lg" style={{ background: 'rgba(37,99,235,0.04)' }}>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Wind</span>
                <span className="text-sm font-bold text-slate-700">{weatherData.windSpeed} km/h</span>
              </div>
            </div>

            {/* Rainfall Signal */}
            <div className="flex items-center justify-between py-3 px-4 rounded-lg border" style={{ background: 'rgba(234,88,12,0.04)', borderColor: 'rgba(234,88,12,0.15)' }}>
              <span className="text-[12px] font-medium text-slate-600">Rainfall Warning</span>
              <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full uppercase">{weatherData.rainfallSignal}</span>
            </div>
          </div>
        </div>

        {/* Evacuation Center Status */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between py-3.5 px-5 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-800 m-0">Evacuation Center Status</h2>
            <span className="text-[11px] text-slate-400 font-medium">{evacuationCenterStatus.length} centers</span>
          </div>
          <div className="flex flex-col">
            {evacuationCenterStatus.map((center) => {
              const percent = Math.round((center.current / center.capacity) * 100);
              const barColor =
                center.status === 'closed' ? '#94a3b8' :
                percent >= 100 ? '#ef4444' :
                percent >= 75 ? '#f59e0b' : '#22c55e';
              const statusLabel =
                center.status === 'closed' ? 'CLOSED' :
                percent >= 100 ? 'FULL' : 'OPEN';
              const statusColor =
                center.status === 'closed' ? { color: '#64748b', bg: 'rgba(100,116,139,0.1)' } :
                percent >= 100 ? { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' } :
                { color: '#16a34a', bg: 'rgba(22,163,74,0.1)' };

              return (
                <div key={center.id} className="flex items-center gap-4 py-4 px-5 border-b border-slate-50 last:border-b-0 transition-colors hover:bg-slate-50/50">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-semibold text-slate-700 m-0 truncate">{center.name}</h3>
                      <span
                        className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ color: statusColor.color, background: statusColor.bg }}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: `${Math.min(percent, 100)}%`,
                            background: barColor,
                          }}
                        />
                      </div>
                      <span className="shrink-0 text-[11px] font-bold text-slate-500 min-w-[36px] text-right">
                        {percent}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5">
                      {center.current} / {center.capacity} evacuees
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between py-3.5 px-5 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-800 m-0">Recent Activity</h2>
          <span className="text-[11px] text-slate-400 font-medium">Ngayong araw</span>
        </div>
        <div className="flex flex-col divide-y divide-slate-50">
          {recentActivity.map((activity) => {
            const config = activityTypeConfig[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-3.5 py-3.5 px-5 transition-colors hover:bg-slate-50/50">
                <div
                  className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5"
                  style={{ background: config.bg }}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-slate-700 m-0 leading-relaxed">{activity.action}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {activity.by} • {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
