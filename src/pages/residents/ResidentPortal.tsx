import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  QrCode, 
  Package, 
  Smartphone, 
  Home, 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  CloudSun,
  Users,
  MapPin,
  Clock,
  BookOpen
} from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import ResidentLayout from '../../components/layout/ResidentLayout';

interface DonutChartProps {
  percentage: number;
  colorClass: string;
  bgColorClass: string;
  title: string;
  subtitle: string;
  centerText?: string;
  icon: React.ReactNode;
}

function DonutChart({ percentage, colorClass, bgColorClass, title, subtitle, centerText, icon }: DonutChartProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-center text-center group">
      <div className="relative w-36 h-36 flex items-center justify-center mb-4">
        {/* SVG Donut Chart */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 110 110">
          <circle
            cx="55"
            cy="55"
            r={radius}
            className="text-slate-100"
            strokeWidth="9"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="55"
            cy="55"
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth="9"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        
        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-black text-slate-800 font-display leading-none">
            {centerText || `${percentage}%`}
          </span>
          <div className={`p-1.5 rounded-full ${bgColorClass} mt-1.5 shadow-sm`}>
            {icon}
          </div>
        </div>
      </div>
      
      <h4 className="font-bold text-slate-800 text-sm mb-1">{title}</h4>
      <p className="text-[11px] text-slate-400 leading-normal max-w-45">{subtitle}</p>
    </div>
  );
}

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const { activeAlerts, reliefClaims } = useMockData();
  const currentAlerts = activeAlerts.filter(a => a.deliveryStatus !== 'Failed');

  // Compute claimed percentage (based on standard allotment of 2)
  const claimedCount = reliefClaims.filter(c => c.status === 'Claimed').length;
  const totalAllotted = 2; 
  const reliefClaimPercentage = Math.round((claimedCount / totalAllotted) * 100);

  return (
    <ResidentLayout>
      <div className="animate-fade-in space-y-8">
        
        {/* Welcome Section with Weather Info */}
        <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <span className="text-xs font-extrabold text-primary uppercase tracking-widest block mb-1">Citizen Portal</span>
            <h2 className="text-3xl font-bold text-slate-900 font-display mb-1">Welcome back, Taro Sakamoto!</h2>
            <p className="text-slate-500 text-sm">Access your digital resident card, track distributions, and check local shelter status.</p>
          </div>
          
          {/* Quick Weather Badge */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3 shrink-0">
            <div className="bg-amber-100 text-amber-600 p-2.5 rounded-xl">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Brgy. Balingasa Weather</span>
              <span className="text-xs font-bold text-slate-700">Light Showers • 28°C</span>
            </div>
          </div>
        </div>

        {/* Severe Alerts Section */}
        {currentAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex items-start gap-4 shadow-sm relative overflow-hidden animate-pulse">
            <div className="absolute top-0 right-0 p-4">
              {currentAlerts[0].channel === 'SMS Backup' && (
                <span className="flex items-center gap-1 text-[10px] bg-red-600 text-white font-bold px-2.5 py-1 rounded-full shadow">
                  <Smartphone className="w-3 h-3" /> SMS BACKUP
                </span>
              )}
            </div>
            <div className="bg-red-100 p-3 rounded-2xl text-red-600 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-red-900 mb-1">Active Barangay Emergency Announcement</h3>
              <p className="text-sm text-red-700 font-medium">{currentAlerts[0].message}</p>
              <p className="text-[11px] text-red-500 mt-2.5 font-bold uppercase tracking-wider">
                {currentAlerts[0].level} • Issued {new Date(currentAlerts[0].timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {/* Circular Donut Charts Grid */}
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-display mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            My Family Risk & Relief Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <DonutChart
              percentage={reliefClaimPercentage}
              centerText={`${claimedCount}/${totalAllotted}`}
              colorClass="text-emerald-500"
              bgColorClass="bg-emerald-50 text-emerald-600"
              title="Allotted Relief Goods Claimed"
              subtitle="Claimed Family Food Pack. Hygiene Kit is pending claim."
              icon={<Package className="w-4.5 h-4.5" />}
            />
            
            <DonutChart
              percentage={85}
              centerText="85%"
              colorClass="text-amber-500"
              bgColorClass="bg-amber-50 text-amber-600"
              title="Assigned Evac Hub Capacity"
              subtitle="Commonwealth Elem. School is currently at 85% occupancy."
              icon={<Home className="w-4.5 h-4.5" />}
            />
            
            <DonutChart
              percentage={75}
              centerText="75%"
              colorClass="text-indigo-500"
              bgColorClass="bg-indigo-50 text-indigo-600"
              title="Readiness Checklist Score"
              subtitle="ID verified (Yes) • Kit prepared (Yes) • Address synced (Yes)."
              icon={<ShieldCheck className="w-4.5 h-4.5" />}
            />
          </div>
        </div>

        {/* Metrics Overview Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center gap-3">
            <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl"><Package className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">My Claims Status</span>
              <span className="text-sm font-bold text-slate-800">1 Item Pending</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center gap-3">
            <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl"><MapPin className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Assigned Shelter</span>
              <span className="text-sm font-bold text-slate-800 truncate block max-w-45">Commonwealth Elem.</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center gap-3">
            <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl"><Users className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Family Members</span>
              <span className="text-sm font-bold text-slate-800">4 Dependents</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] flex items-center gap-3">
            <div className="bg-red-50 text-red-600 p-2.5 rounded-xl"><AlertTriangle className="w-5 h-5" /></div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Active Alert Level</span>
              <span className="text-sm font-bold text-slate-800">None / Normal</span>
            </div>
          </div>
        </div>

        {/* Dashboard Sections: Operations vs Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Quick Actions Grid */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 font-display">Resident Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <button 
                onClick={() => navigate('/residents/qr_id')}
                className="bg-white text-left p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between h-36 cursor-pointer"
              >
                <div className="bg-primary/10 text-primary p-2.5 rounded-xl w-fit group-hover:bg-primary/20 transition-colors">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-primary transition-colors flex items-center gap-1">
                    My QR ID Pass <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-slate-400">Present code for relief scans.</p>
                </div>
              </button>

              <button 
                onClick={() => navigate('/survival_guides')}
                className="bg-white text-left p-5 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col justify-between h-36 cursor-pointer"
              >
                <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl w-fit group-hover:bg-indigo-100 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm mb-0.5 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                    Survival Guides <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[11px] text-slate-400">View disaster guides.</p>
                </div>
              </button>

            </div>
          </div>

          {/* Recent Claims Section */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 font-display">Recent Relief Activities</h3>
              <button 
                onClick={() => navigate('/residents/claim_history')}
                className="text-xs font-bold text-primary hover:text-orange-600 flex items-center gap-1"
              >
                View History <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-slate-50">
              {reliefClaims.map(claim => (
                <div key={claim.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl shrink-0 ${claim.status === 'Claimed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h4 className="font-bold text-slate-800 text-sm truncate">
                        {claim.status === 'Claimed' ? 'Family Food Pack' : 'Family Hygiene Kit A'}
                      </h4>
                      <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${claim.status === 'Claimed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Hub Scanner</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(claim.timestamp).toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </ResidentLayout>
  );
}
