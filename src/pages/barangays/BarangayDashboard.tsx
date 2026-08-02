import { Users, Package, AlertTriangle, FileText, Bell } from 'lucide-react';
import BarangayLayout from '../../components/layout/BarangayLayout';
import { useMockData } from '../../data/MockDataContext';

export const ASSIGNED_BARANGAY = "Brgy. Balingasa";

function OverviewPanel() {
  const { barangaySitReps, reliefClaims, incidents, activeAlerts } = useMockData();
  
  const sitRep = barangaySitReps.find(sr => sr.barangay === 'Balingasa');
  const evacueesCount = sitRep?.evacueeCount || 0;
  const householdCount = sitRep?.householdCount || 0;
  
  const pendingClaims = reliefClaims.filter(c => c.status === 'Pending').length;
  const claimedRelief = reliefClaims.filter(c => c.status === 'Claimed').length;
  
  const activeIncidents = incidents.filter(i => i.status !== 'Resolved').length;

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Barangay Operations Center</h2>
            <p className="text-slate-500">Manage local evacuation, relief goods, and situation reports for {ASSIGNED_BARANGAY}.</p>
          </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium">Active Evacuees</h3>
              <p className="text-2xl font-bold text-slate-800">{evacueesCount}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">From {householdCount} households</p>
        </div>

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
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium">Active Incidents</h3>
              <p className="text-2xl font-bold text-slate-800">{activeIncidents}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Requires attention</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 text-sm font-medium">Latest SitRep</h3>
              <p className="text-lg font-bold text-slate-800 truncate">{sitRep?.damageSeverity || 'None'}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Damage severity reported</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Recent Announcements
          </h3>
        </div>
        <div className="divide-y divide-slate-100">
          {activeAlerts.length > 0 ? (
            activeAlerts.map(alert => (
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
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-slate-700 font-medium">{alert.message}</p>
                <div className="mt-3 text-xs text-slate-500 flex items-center gap-2">
                  <span className="capitalize">{alert.channel}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                  <span className={`${
                    alert.deliveryStatus === 'Sent' ? 'text-emerald-600' : 
                    alert.deliveryStatus === 'Failed' ? 'text-red-600' : 'text-amber-600'
                  }`}>{alert.deliveryStatus}</span>
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
    </div>
  );
}

export default function BarangayPortal() {
  return (
    <BarangayLayout>
      <OverviewPanel />
    </BarangayLayout>
  );
}
