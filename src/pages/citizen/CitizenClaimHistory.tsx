import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Search, XCircle } from 'lucide-react';
import ResidentLayout from '../../components/layout/CitizenLayout';
import { useAppData } from '../../data/AppDataContext';

const API_URL = import.meta.env.VITE_API_URL;

interface ClaimRecord {
  id: string;
  citizen_email: string;
  citizen_name: string;
  item_name: string;
  quantity: number;
  status: 'Claimed' | 'Pending' | 'Cancelled';
  distribution_site: string | null;
  remarks: string | null;
  claimed_at: string;
  created_at: string;
}

export default function ResidentClaimHistory() {
  const { language } = useAppData();
  const [claims, setClaims] = useState<ClaimRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email?.trim().toLowerCase() || '';

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const res = await fetch(`${API_URL}/api/claim-history?email=${encodeURIComponent(userEmail)}`);
        if (res.ok) {
          const data = await res.json();
          setClaims(data);
        }
      } catch (error) {
        console.error('Error fetching claim history:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userEmail) {
      fetchClaims();
    } else {
      setLoading(false);
    }
  }, [userEmail]);

  const filteredClaims = claims.filter(claim =>
    claim.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (claim.distribution_site || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Claimed': return <CheckCircle className="w-6 h-6" />;
      case 'Cancelled': return <XCircle className="w-6 h-6" />;
      default: return <Clock className="w-6 h-6" />;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Claimed': return { icon: 'bg-emerald-50 text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' };
      case 'Cancelled': return { icon: 'bg-red-50 text-red-600', badge: 'bg-red-100 text-red-700' };
      default: return { icon: 'bg-amber-50 text-amber-600', badge: 'bg-amber-100 text-amber-700' };
    }
  };

  return (
    <ResidentLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 font-display">{language === 'en' ? 'Claim History' : 'Kasaysayan ng Pag-claim'}</h2>
          <p className="text-slate-500 mt-1">{language === 'en' ? 'Track your past and pending relief goods claims.' : 'Subaybayan ang iyong mga nakaraan at kasalukuyang na-claim na relief goods.'}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">{language === 'en' ? 'Recent Claims' : 'Mga Kamakailang Claim'}</h3>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder={language === 'en' ? "Search history..." : "Maghanap sa kasaysayan..."} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-48"
              />
            </div>
          </div>
          
          <div className="divide-y divide-slate-100">
            {loading ? (
              <div className="p-12 text-center">
                <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-sm text-slate-400">{language === 'en' ? 'Loading claim history...' : 'Naglo-load ng kasaysayan...'}</p>
              </div>
            ) : filteredClaims.length > 0 ? (
              filteredClaims.map(claim => {
                const style = getStatusStyle(claim.status);
                return (
                  <div key={claim.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex items-center gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${style.icon}`}>
                      {getStatusIcon(claim.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 truncate">
                          {claim.item_name} {claim.quantity > 1 ? `(x${claim.quantity})` : ''}
                        </h4>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${style.badge}`}>
                          {claim.status === 'Claimed' ? (language === 'en' ? 'Claimed' : 'Na-claim') : claim.status === 'Cancelled' ? (language === 'en' ? 'Cancelled' : 'Kinansela') : (language === 'en' ? 'Pending' : 'Pending')}
                        </span>
                      </div>
                      {claim.distribution_site && (
                        <p className="text-sm text-slate-500 mb-1">{language === 'en' ? 'Site' : 'Lugar'}: {claim.distribution_site}</p>
                      )}
                      {claim.remarks && (
                        <p className="text-sm text-slate-500 mb-1">{claim.remarks}</p>
                      )}
                      <p className="text-xs text-slate-400">{new Date(claim.claimed_at).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                <h4 className="text-slate-500 font-medium">{language === 'en' ? 'No claims history found' : 'Walang nahanap na kasaysayan'}</h4>
                <p className="text-sm text-slate-400 mt-1">{language === 'en' ? 'Your relief goods claims will appear here.' : 'Dito lalabas ang iyong mga na-claim na relief goods.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ResidentLayout>
  );
}