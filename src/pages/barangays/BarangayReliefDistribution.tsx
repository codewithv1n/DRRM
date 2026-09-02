import React, { useState, useEffect } from 'react';
import { Megaphone, Package, AlertCircle, AlertTriangle, Send, Search, X } from 'lucide-react';
import BarangayLayout from '../../components/layout/BarangayLayout';
import { useAlerts } from '../../hooks/useSystemHooks';

import { encryptedFetch } from '../../utils/encryptedFetch';
import { getAssignedBarangay } from './BarangayDashboard';

function ReliefDistributionPanel() {
  const ASSIGNED_BARANGAY = getAssignedBarangay();
  const { broadcastAlert } = useAlerts();
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedBarangay] = useState('All');
  const [citizenId, setCitizenId] = useState('');
  
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'pending' | 'claimed'>('pending');
  const [citizenToConfirm, setCitizenToConfirm] = useState<{id: string, name: string, barangay: string, status: string, time: string, item: string, quantity: number} | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  
  const [searchQuery, setSearchQuery] = useState('');
  const [claimSearchQuery, setClaimSearchQuery] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [claimItem, setClaimItem] = useState('Relief Pack');
  const [claimQuantity, setClaimQuantity] = useState(1);

  const [mockClaims, setMockClaims] = useState<any[]>([]);

  const fetchClaims = async () => {
    try {
      const res = await encryptedFetch(`${import.meta.env.VITE_API_URL}/api/8b5a3c9e-d14f-4592-8c67-bf14e7a83d95?barangay=${ASSIGNED_BARANGAY}`);
      if (res.ok) {
        const data = await res.json();
        const mapped = data.map((c: any) => ({
          id: c.citizen_relief_history_id,
          name: c.citizen_name,
          email: c.citizen_email,
          barangay: ASSIGNED_BARANGAY,
          status: c.status,
          time: new Date(c.claimed_at || c.created_at).toLocaleString(),
          item: c.item_name || 'Relief Pack',
          quantity: Number(c.quantity) || 1
        }));
        setMockClaims(mapped);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [localInventory, setLocalInventory] = useState<{type: string, quantity: number}[]>([]);

  const fetchInventory = async () => {
    try {
      const res = await encryptedFetch(`${import.meta.env.VITE_API_URL}/api/1e8d64f2-9c7a-4a5b-98df-ba24ef51379c/barangay?barangay=${ASSIGNED_BARANGAY}`);
      if (res.ok) {
        const data = await res.json();
        setLocalInventory(data.map((item: any) => ({
          type: item.type,
          quantity: Number(item.quantity) || 0
        })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClaims();
    fetchInventory();
  }, []);

  const pendingClaims = mockClaims.filter(c => c.status === 'Pending' && (
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.barangay.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  const claimedClaims = mockClaims.filter(c => c.status === 'Claimed' && (
    c.name.toLowerCase().includes(claimSearchQuery.toLowerCase()) || 
    c.id.toLowerCase().includes(claimSearchQuery.toLowerCase()) ||
    c.barangay.toLowerCase().includes(claimSearchQuery.toLowerCase())
  ));

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage) return;
    
    
    const messageWithDate = validUntil ? `${broadcastMessage} (Valid until: ${validUntil})` : broadcastMessage;
    broadcastAlert('General Alert', `RELIEF DISTRIBUTION (${selectedBarangay}): ${messageWithDate}`);
    
    // Call batch API to generate pending claims
    try {
      const res = await encryptedFetch(`${import.meta.env.VITE_API_URL}/api/8b5a3c9e-d14f-4592-8c67-bf14e7a83d95/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barangay: ASSIGNED_BARANGAY,
          item_name: 'Relief Pack',
          quantity: 1,
          valid_until: validUntil
        })
      });
      if (res.ok) {
        alert('Announcement sent and pending claims generated for citizens!');
        fetchClaims(); // Refresh list to show new pending claims
      } else {
        alert('Announcement sent, but failed to generate pending claims.');
      }
    } catch (err) {
      console.error(err);
      alert('Announcement sent, but an error occurred while generating claims.');
    }

    setBroadcastMessage('');
    setValidUntil('');
    setShowBroadcastModal(false);
  };

  const handleMarkClaimed = (idToClaim?: string) => {
    const targetId = idToClaim || citizenId;
    if (!targetId) return;

    const exists = mockClaims.find(c => c.id === targetId || c.name.toLowerCase().includes(targetId.toLowerCase()));
    
    if (exists) {
      if (exists.status === 'Claimed') {
        alert(`${exists.name} has already claimed their relief goods!`);
      } else {
        setCitizenToConfirm(exists);
        const preselect = localInventory.find(inv => inv.type === exists.item) ? exists.item : (localInventory[0]?.type || '');
        setClaimItem(preselect);
        setClaimQuantity(exists.quantity);
        setShowConfirmModal(true);
      }
    } else {
      alert('Citizen not found or not eligible for this distribution.');
    }
  };

  const confirmClaim = async () => {
    if (!citizenToConfirm) return;
    
    try {
      const res = await encryptedFetch(`${import.meta.env.VITE_API_URL}/api/8b5a3c9e-d14f-4592-8c67-bf14e7a83d95/${citizenToConfirm.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'Claimed',
          item_name: claimItem,
          quantity: claimQuantity,
          barangay: ASSIGNED_BARANGAY
        })
      });
      
      if (res.ok) {
        fetchClaims();
        fetchInventory();
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      } else {
        alert('Failed to update claim status in database.');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating claim status.');
    }
    
    setCitizenId('');
    setShowConfirmModal(false);
    setCitizenToConfirm(null);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relief Distribution & Claiming</h2>
          <p className="text-slate-500">Manage distribution announcements and mark citizen claims for {ASSIGNED_BARANGAY}.</p>
        </div>
        <button 
          onClick={() => setShowBroadcastModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm shadow-blue-600/20 flex items-center gap-2 cursor-pointer"
        >
          <Megaphone className="w-5 h-5" />
          Broadcast Alert
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('pending')}
              className={`text-sm font-bold pb-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'pending' ? 'border-blue-600 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Pending Claims
              <span className="ml-2 bg-slate-200 text-slate-600 py-0.5 px-2 rounded-full text-[10px] font-black">
                {pendingClaims.length}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('claimed')}
              className={`text-sm font-bold pb-1 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'claimed' ? 'border-blue-600 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Claim Logs
            </button>
          </div>

          <div className="w-full sm:w-64 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              placeholder={activeTab === 'pending' ? "Search pending..." : "Search logs..."}
              value={activeTab === 'pending' ? searchQuery : claimSearchQuery}
              onChange={(e) => activeTab === 'pending' ? setSearchQuery(e.target.value) : setClaimSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
          
        <div className="overflow-x-auto">
            {activeTab === 'pending' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500 bg-slate-50/50">
                    <th className="p-4 font-semibold">Citizen Info</th>
                    <th className="p-4 font-semibold">Barangay</th>
                    <th className="p-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{claim.name}</span>
                          <span className="text-xs text-slate-500">{claim.id}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {claim.barangay}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleMarkClaimed(claim.id)}
                          className="text-xs text-emerald-700 hover:text-emerald-800 font-bold px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors cursor-pointer bg-emerald-100/50"
                        >
                          Mark as Received
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {pendingClaims.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-slate-400 text-sm">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No pending citizens found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            
            {activeTab === 'claimed' && (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500 bg-slate-50/50">
                    <th className="p-4 font-semibold">Citizen Info</th>
                    <th className="p-4 font-semibold">Barangay</th>
                    <th className="p-4 font-semibold">Date Claimed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {claimedClaims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-800">{claim.name}</span>
                          <span className="text-xs text-slate-500">{claim.id}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600">
                        {claim.barangay}
                      </td>
                      <td className="p-4 text-sm font-medium text-emerald-600">
                        {claim.time}
                      </td>
                    </tr>
                  ))}
                  
                  {claimedClaims.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-12 text-center text-slate-400 text-sm">
                        <Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No claims recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-8 relative">
            <button 
              onClick={() => setShowBroadcastModal(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">Broadcast Alert</h3>
                <p className="text-sm text-slate-500">Send an alert regarding relief goods.</p>
              </div>
            </div>
            
            <form onSubmit={handleBroadcast} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Area</label>
                <select 
                  className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl p-3.5 outline-none cursor-not-allowed"
                  value={selectedBarangay}
                  disabled
                >
                  <option value="All">All of {ASSIGNED_BARANGAY}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Valid Until</label>
                <input 
                  type="date"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all p-3.5 outline-none"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all p-3.5 outline-none resize-none placeholder:text-slate-400"
                  placeholder="E.g., Relief goods are now available at the Barangay Hall for Purok 1 residents..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-sm shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Send className="w-5 h-5" />
                Send Announcement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showConfirmModal && citizenToConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden p-6 text-center animate-slide-up">
            <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Action</h3>
            <p className="text-slate-500 text-sm mb-4">
              Are you sure you want to mark <span className="font-bold text-slate-700">{citizenToConfirm.name}</span> as claimed? This action will record their claim for this distribution and deduct the items from the inventory.
            </p>
            
            <div className="mb-6 text-left space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Item Name</label>
                <select 
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all p-2.5 outline-none"
                  value={claimItem}
                  onChange={(e) => setClaimItem(e.target.value)}
                  required
                >
                  {localInventory.length === 0 && <option value="" disabled>No items available</option>}
                  {localInventory.map(inv => (
                    <option key={inv.type} value={inv.type}>
                      {inv.type} ({inv.quantity} available)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Quantity</label>
                <input 
                  type="number"
                  min="1"
                  className="w-full bg-white border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all p-2.5 outline-none"
                  value={claimQuantity}
                  onChange={(e) => setClaimQuantity(parseInt(e.target.value) || 1)}
                  required
                />
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  setShowConfirmModal(false);
                  setCitizenToConfirm(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmClaim}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm shadow-emerald-500/20 cursor-pointer"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-8 right-8 z-100 bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center gap-3 transition-all transform animate-fade-in pointer-events-none">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-bold tracking-wide">Successfully marked as received!</span>
        </div>
      )}
    </div>
  );
}

export default function BarangayReliefDistribution() {
  return (
    <BarangayLayout>
      <ReliefDistributionPanel />
    </BarangayLayout>
  );
}

