import { AlertTriangle, QrCode, Package, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../data/MockDataContext';
import ResidentLayout from '../../components/layout/ResidentLayout';

export default function ResidentDashboard() {
  const navigate = useNavigate();
  const { activeAlerts } = useMockData();
  const currentAlerts = activeAlerts.filter(a => a.deliveryStatus !== 'Failed');

  return (
    <ResidentLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 font-display mb-1">Welcome, Juan!</h2>
          <p className="text-slate-500">Access your digital ID and track your relief claims.</p>
        </div>

        {/* Alert status banner */}
        {currentAlerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 flex items-start gap-4 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                {currentAlerts[0].channel === 'SMS Backup' && (
                    <span className="flex items-center gap-1 text-[10px] bg-red-600 text-white font-bold px-2 py-1 rounded-full shadow">
                        <Smartphone className="w-3 h-3" /> SMS BACKUP
                    </span>
                )}
            </div>
            <div className="bg-red-100 p-3 rounded-xl shrink-0"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <div>
              <h3 className="font-bold text-red-900 mb-1">Active Emergency Alert</h3>
              <p className="text-sm text-red-700 font-medium">{currentAlerts[0].message}</p>
              <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-2">
                  {currentAlerts[0].level} • {new Date(currentAlerts[0].timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        )}

        {/* Quick cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => navigate('/residents/qr_id')} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
            <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4 group-hover:bg-primary/20 transition-colors"><QrCode className="w-6 h-6 text-primary" /></div>
            <h3 className="font-bold text-slate-900 mb-1">My Digital QR Code</h3>
            <p className="text-sm text-slate-500">View and present your personal QR code for relief distribution.</p>
          </button>
          <button onClick={() => navigate('/residents/claim-history')} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group">
            <div className="bg-emerald-50 p-3 rounded-xl w-fit mb-4 group-hover:bg-emerald-100 transition-colors"><Package className="w-6 h-6 text-emerald-600" /></div>
            <h3 className="font-bold text-slate-900 mb-1">Relief Claim History</h3>
            <p className="text-sm text-slate-500">Check the status of your past and pending relief goods claims.</p>
          </button>
        </div>
      </div>
    </ResidentLayout>
  );
}
