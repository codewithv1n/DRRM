import { useState, useEffect } from 'react';
import { Truck, CheckCircle, Clock, AlertTriangle, Image as ImageIcon, X, Search, Filter, AlertCircle } from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useIncidentsCount } from '../../hooks/useSystemHooks';


import { encryptedFetch } from '../../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

export default function ValidateDonationsPanel() {
  const { pendingCount } = useIncidentsCount();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [donationLogs, setDonationLogs] = useState<any[]>([]);
  const [viewPhotoUrl, setViewPhotoUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'logs'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  useEffect(() => {
    fetchDonations();
    fetchLogs();

    const interval = setInterval(() => {
      fetchDonations();
      fetchLogs();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await encryptedFetch(`${API_URL}/api/7e8a93b4-f02a-4f51-b8f9-dc4813c01f68/4f9e1d8c-7b2a-4561-9c3f-8a0b5d4e1f7a?_t=${Date.now()}`);
      const data = await res.json();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await encryptedFetch(`${API_URL}/api/7e8a93b4-f02a-4f51-b8f9-dc4813c01f68/logs?_t=${Date.now()}`);
      const data = await res.json();
      setDonationLogs(data);
    } catch (error) {
      console.error("Error fetching donation logs:", error);
    }
  };

  const receiveDonation = async (id: string) => {
    try {
      setProcessingIds(prev => [...prev, id]);
      
      const itemToMove = donations.find(d => d.donation_pending_id === id);
      setDonations(prev => prev.filter(d => d.donation_pending_id !== id));
      
      if (itemToMove) {
        setDonationLogs(prev => [{ ...itemToMove, status: 'Received', received_at: new Date().toISOString() }, ...prev]);
      }

      setToast({ show: true, message: 'Donation successfully received!', type: 'success' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);

      encryptedFetch(`${API_URL}/api/7e8a93b4-f02a-4f51-b8f9-dc4813c01f68/4f9e1d8c-7b2a-4561-9c3f-8a0b5d4e1f7a/${id}/receive`, {
        method: 'PUT'
      }).then(() => {
        fetchDonations();
        fetchLogs();
      }).catch(error => {
        console.error("Error receiving donation:", error);
        setProcessingIds(prev => prev.filter(pId => pId !== id));
        fetchDonations(); 
        fetchLogs();
        setToast({ show: true, message: 'Failed to receive donation.', type: 'error' });
        setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
      });
    } catch (error) {
      console.error("Error processing donation:", error);
    }
  };

  const sourceData = activeTab === 'pending' ? donations : donationLogs;

  const filteredDonations = sourceData.filter(donation => {
    const matchesSearch = donation.full_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || donation.donation_type === filterCategory;
    if (!matchesSearch || !matchesCategory) return false;

    if (activeTab === 'pending') {
      if (processingIds.includes(donation.donation_pending_id)) return false;
      
      const etaDate = new Date(donation.created_at);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return etaDate > sevenDaysAgo && donation.status !== 'Received';
    } else {
      return true;
    }
  });

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Validate Donations</h2>
            <p className="text-slate-500 mt-1">Review and receive incoming donations from citizens.</p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'pending' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Pending Validation
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'logs' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Donation Logs
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search donor..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Food & Water">Food & Water</option>
                <option value="Clothes & Blankets">Clothes & Blankets</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Hygiene Kits">Hygiene Kits</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Donor</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ETA</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Picture</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDonations.map(donation => (
                  <tr key={donation.donation_pending_id || donation.donation_log_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${donation.status === 'Received' || activeTab === 'logs' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{donation.full_name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <div className="whitespace-nowrap">
                        <span className="font-semibold text-slate-800">{donation.donation_type}</span>
                        {donation.quantity !== undefined && (
                          <div className="text-xs text-slate-500 mt-0.5 font-bold flex items-center gap-2">
                            Qty: {donation.quantity}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {new Date(donation.created_at || donation.received_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider inline-block ${
                          donation.status === 'Received' || activeTab === 'logs' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {donation.status || (activeTab === 'logs' ? 'Received' : 'Pending')}
                        </span>
                    </td>
                    <td className="p-4 text-sm">
                        {donation.photo_path ? (
                          <button 
                            onClick={() => setViewPhotoUrl(`${API_URL}${donation.photo_path}`)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold"
                          >
                            <ImageIcon className="w-4 h-4" /> View Pic
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">N/A</span>
                        )}
                    </td>
                    <td className="p-4 text-right">
                      {activeTab !== 'logs' && donation.status !== 'Received' ? (
                        <button 
                          onClick={() => setConfirmId(donation.donation_pending_id)}
                          className="text-xs bg-white border border-emerald-500 text-emerald-600 hover:bg-emerald-50 font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Mark Received
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-emerald-500 flex items-center justify-end gap-1.5">
                          <CheckCircle className="w-4 h-4" />
                          Done
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredDonations.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                      {activeTab === 'pending' ? 'No pending donations.' : 'No received donations logs yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Action</h3>
            <p className="text-slate-500 text-sm mb-6">Are you sure you want to mark this donation as received? This action cannot be undone and will add the items to the inventory.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setConfirmId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  receiveDonation(confirmId);
                  setConfirmId(null);
                }}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm shadow-emerald-500/20 cursor-pointer"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo View Modal */}
      {viewPhotoUrl && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden relative">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Donation Photo</h3>
              <button 
                onClick={() => setViewPhotoUrl(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex justify-center bg-slate-50">
              <img src={viewPhotoUrl} alt="Donation" className="max-h-[60vh] object-contain rounded-lg shadow-sm" />
            </div>
          </div>
        </div>
      )}

      {toast.show && (
        <div className={`fixed top-6 right-6 border shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-4 flex items-center gap-4 z-9999 animate-fade-in ${toast.type === 'success' ? 'bg-emerald-500 border-emerald-400' : 'bg-red-500 border-red-400'}`}>
          <div className={`p-2 rounded-xl text-white ${toast.type === 'success' ? 'bg-emerald-400/50' : 'bg-red-400/50'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">{toast.type === 'success' ? 'Success' : 'Error'}</h4>
            <p className="text-xs text-white/90">{toast.message}</p>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-2 text-white/70 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </DepartmentLayout>
  );
}
