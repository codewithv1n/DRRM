import { Package, Clock, CheckCircle, Search } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import ResidentLayout from '../../components/layout/ResidentLayout';

export default function ResidentClaimHistory() {
  const { reliefClaims } = useMockData();

  return (
    <ResidentLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 font-display">Claim History</h2>
          <p className="text-slate-500 mt-1">Track your past and pending relief goods claims.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">Recent Claims</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search history..." 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48"
              />
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {reliefClaims.length > 0 ? (
              reliefClaims.map(claim => (
                <div key={claim.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex items-center gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${claim.status === 'Claimed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {claim.status === 'Claimed' ? <CheckCircle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold text-slate-900 truncate">Food Pack & Medical Kit</h4>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${claim.status === 'Claimed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {claim.status}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mb-1">Scanned by: {claim.scannedBy}</p>
                    <p className="text-xs text-slate-400">{new Date(claim.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <h4 className="text-slate-500 font-medium">No claims history found</h4>
                <p className="text-sm text-slate-400 mt-1">Your relief goods claims will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResidentLayout>
  );
}