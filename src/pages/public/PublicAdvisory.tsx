import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CloudRain, Wind, Flame, Info, AlertTriangle } from 'lucide-react';

// Mock Advisory Data
const mockAdvisories = [
  {
    id: 1,
    title: "Typhoon Warning Signal No. 3",
    date: "2026-07-31 10:00 AM",
    type: "severe",
    icon: Wind,
    description: "Typhoon approaching. Expect heavy rainfall and strong winds in the next 24 hours. Evacuation in low-lying areas is advised.",
    source: "PAGASA",
  },
  {
    id: 2,
    title: "Heavy Rainfall Alert",
    date: "2026-07-31 08:30 AM",
    type: "warning",
    icon: CloudRain,
    description: "Yellow warning level. Flooding is possible in low-lying areas and landslides in mountainous areas.",
    source: "NDRRMC",
  },
  {
    id: 3,
    title: "Fire Prevention Month Reminder",
    date: "2026-07-30 02:00 PM",
    type: "info",
    icon: Flame,
    description: "Ensure all electrical appliances are unplugged when not in use. Check your fire extinguishers regularly.",
    source: "BFP",
  },
  {
    id: 4,
    title: "Road Closure due to Accident",
    date: "2026-07-29 09:15 AM",
    type: "warning",
    icon: AlertTriangle,
    description: "Major road closed along the main highway due to a vehicular accident. Please take alternative routes.",
    source: "Local Traffic Bureau",
  }
];

export default function PublicAdvisory() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const getSeverityColors = (type: string) => {
    switch(type) {
      case 'severe': return 'bg-red-50 text-red-700 border-red-200';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getIconColors = (type: string) => {
    switch(type) {
      case 'severe': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      case 'info': return 'text-blue-600';
      default: return 'text-slate-600';
    }
  };

  const filteredAdvisories = filter === 'all' 
    ? mockAdvisories 
    : mockAdvisories.filter(a => a.type === filter);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col p-4 md:p-8">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-6 h-6 text-primary" />
              Public Advisories
            </h1>
            <p className="text-slate-500 text-sm">Stay updated with the latest emergency alerts and announcements.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['all', 'severe', 'warning', 'info'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors cursor-pointer capitalize
                ${filter === f 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              {f === 'all' ? 'All Advisories' : f}
            </button>
          ))}
        </div>

        {/* Advisory List */}
        <div className="space-y-4">
          {filteredAdvisories.map((advisory) => {
            const Icon = advisory.icon;
            return (
              <div 
                key={advisory.id} 
                className={`bg-white rounded-2xl p-5 md:p-6 shadow-sm border-l-4 ${
                  advisory.type === 'severe' ? 'border-l-red-500' :
                  advisory.type === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${getSeverityColors(advisory.type)}`}>
                    <Icon className={`w-6 h-6 ${getIconColors(advisory.type)}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold text-slate-800">{advisory.title}</h3>
                      <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full w-fit">
                        {advisory.date}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm mb-3 leading-relaxed">
                      {advisory.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Source: {advisory.source}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAdvisories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <Info className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No advisories found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
