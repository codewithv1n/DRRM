import { useState, useEffect } from 'react';
import { encryptedFetch } from '../../utils/encryptedFetch';
import { 
  Building2, Users, Search, Filter, 
  AlertCircle, CheckCircle2, Clock, ShieldAlert, Home
} from 'lucide-react';
import { useIncidentsCount } from '../../hooks/useSystemHooks';
import DepartmentLayout from '../../components/layout/AdminLayout';


const API_URL = import.meta.env.VITE_API_URL;

function timeAgo(ts?: string) {
  if (!ts) return 'Just now';
  const mins = Math.max(0, Math.floor((Date.now() - new Date(ts).getTime()) / 60000));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
}

export default function EvacuationCenterMonitoringPage() {
  const { pendingCount } = useIncidentsCount();
  const [evacuationCenters, setEvacuationCenters] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  useEffect(() => {
    encryptedFetch(`${API_URL}/api/d4a8b7f1-59c3-421e-8fd9-bc37ea495201`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data) {
          const mapped = data.data.map((c: any) => ({
            id: c.evacuation_center_id,
            name: c.name,
            currentOccupancy: c.current_occupants || 0,
            capacity: c.capacity || 0,
            lastUpdatedAt: c.created_at,
            barangay: c.barangay,
            location: c.location,
            status: c.status || 'Open'
          }));
          setEvacuationCenters(mapped);
        }
      })
      .catch(err => console.error("Failed to fetch evacuation centers:", err));
  }, []);



  // Calculate Metrics
  const totalCenters = evacuationCenters.length;
  const totalOccupancy = evacuationCenters.reduce((sum, c) => sum + c.currentOccupancy, 0);
  const totalCapacity = evacuationCenters.reduce((sum, c) => sum + c.capacity, 0);

  const filteredCenters = evacuationCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase());
    const pct = Math.round((center.currentOccupancy / center.capacity) * 100);
    
    let matchesStatus = true;
    if (statusFilter === 'Critical') matchesStatus = pct >= 90 && center.status.toLowerCase() !== 'closed';
    else if (statusFilter === 'Warning') matchesStatus = pct >= 70 && pct < 90 && center.status.toLowerCase() !== 'closed';
    else if (statusFilter === 'Available') matchesStatus = pct < 70 && center.status.toLowerCase() !== 'closed';
    else if (statusFilter === 'Closed') matchesStatus = center.status.toLowerCase() === 'closed';

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (occupancy: number, capacity: number, status: string) => {
    if (status && status.toLowerCase() === 'closed') {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> Closed
        </span>
      );
    }
    const pct = Math.round((occupancy / capacity) * 100);
    if (pct >= 90) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5" /> Full / Critical ({pct}%)
        </span>
      );
    }
    if (pct >= 70) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5" /> High Occupancy ({pct}%)
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" /> Available ({pct}%)
      </span>
    );
  };

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-3">
              Evacuation Center Monitoring
            </h2>
            <p className="text-slate-500 mt-1">
              Real-time occupancy tracking and capacity status across Quezon City evacuation centers
            </p>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Active Evacuation Centers</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalCenters}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Designated shelters</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Home className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Total Sheltered Evacuees</p>
              <h3 className="text-3xl font-extrabold text-blue-600 mt-1">{totalOccupancy.toLocaleString()}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Currently checked in</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Total System Capacity</p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-1">{totalCapacity.toLocaleString()}</h3>
              <p className="text-[11px] text-slate-500 mt-1">Maximum evacuee slots</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search evacuation centers..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-bold text-slate-500 shrink-0 mr-1">Status:</span>
            {['All', 'Available', 'Warning', 'Critical', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Evacuation Center Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCenters.length > 0 ? (
            filteredCenters.map((center) => {
              const pct = Math.round((center.currentOccupancy / center.capacity) * 100);
              const isFull = pct >= 90;
              const isWarning = pct >= 70 && pct < 90;

              return (
                <div key={center.id} className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-md transition-all p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                          {center.id}
                        </span>
                        <h3 className="font-bold text-slate-900 text-lg mt-1 leading-snug">{center.name}</h3>
                      </div>
                      {getStatusBadge(center.currentOccupancy, center.capacity, center.status)}
                    </div>

                    {/* Occupancy Progress Bar */}
                    <div className="space-y-2 my-4">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Occupancy Status</span>
                        <span>{center.currentOccupancy.toLocaleString()} / {center.capacity.toLocaleString()}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isFull ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(100, pct)}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700 mt-4 pt-3 border-t border-slate-100">
                        <span>Operating Status</span>
                        <span className={`px-2.5 py-1 rounded-md uppercase tracking-wide text-[10px] ${center.status.toLowerCase() === 'closed' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                          {center.status || 'Open'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Info */}
                  <div className="pt-4 border-t border-slate-100 mt-2 flex items-center justify-between">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Updated {timeAgo(center.lastUpdatedAt)}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-12 bg-white rounded-2xl border border-slate-100 text-center text-slate-400">
              No evacuation centers match your search filter.
            </div>
          )}
        </div>
      </div>
    </DepartmentLayout>
  );
}

