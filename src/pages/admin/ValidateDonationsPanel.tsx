import { useState } from 'react';
import { Truck, CheckCircle, Clock, AlertTriangle, Plus, X } from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useMockData } from '../../data/MockDataContext';

export default function ValidateDonationsPanel() {
  const { incidents, pendingDonations, receiveDonation, addPendingDonation } = useMockData();
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDonation, setNewDonation] = useState({ donorName: '', itemName: '', quantity: 1, unit: 'packs', eta: '' });

  const handleAddDonation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonation.donorName || !newDonation.itemName || !newDonation.eta) return;
    
    addPendingDonation({
      donorName: newDonation.donorName,
      items: [{ name: newDonation.itemName, quantity: Number(newDonation.quantity), unit: newDonation.unit }],
      eta: new Date(newDonation.eta).toISOString()
    });
    setShowAddModal(false);
    setNewDonation({ donorName: '', itemName: '', quantity: 1, unit: 'packs', eta: '' });
  };

  // Filter out pending donations that are older than 7 days
  const activeDonations = pendingDonations.filter(donation => {
    if (donation.status === 'Received') return true;
    
    const etaDate = new Date(donation.eta);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return etaDate > sevenDaysAgo;
  });

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Validate Donations</h2>
            <p className="text-slate-500 mt-1">Review and receive incoming donations from citizens.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-sm shadow-emerald-500/20 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            Add Expected Donation
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Donor / Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Items</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ETA</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {activeDonations.map(donation => (
                  <tr key={donation.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg shrink-0 ${donation.status === 'Received' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'}`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-slate-800">{donation.donorName}</div>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider inline-block mt-1 ${
                            donation.status === 'Received' ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {donation.items.map(item => (
                        <div key={item.name} className="whitespace-nowrap">
                          <span className="font-semibold text-slate-800">{item.quantity}</span> {item.unit} {item.name}
                        </div>
                      ))}
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {new Date(donation.eta).toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      {donation.status === 'Pending' ? (
                        <button 
                          onClick={() => setConfirmId(donation.id)}
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
                {activeDonations.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400 text-sm">
                      No pending donations.
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

      {/* Add Expected Donation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800">Add Expected Donation</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddDonation} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sender / Donor Name (Nagpadala)</label>
                <input 
                  type="text" 
                  required
                  value={newDonation.donorName}
                  onChange={e => setNewDonation({...newDonation, donorName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                  placeholder="e.g. Red Cross, Juan Dela Cruz"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Item Name</label>
                  <input 
                    type="text" 
                    required
                    value={newDonation.itemName}
                    onChange={e => setNewDonation({...newDonation, itemName: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                    placeholder="e.g. Bottled Water, Rice"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={newDonation.quantity}
                    onChange={e => setNewDonation({...newDonation, quantity: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Unit</label>
                  <input 
                    type="text" 
                    required
                    value={newDonation.unit}
                    onChange={e => setNewDonation({...newDonation, unit: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                    placeholder="e.g. boxes, sacks"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Expected Time of Arrival (ETA)</label>
                <input 
                  type="datetime-local" 
                  required
                  value={newDonation.eta}
                  onChange={e => setNewDonation({...newDonation, eta: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500" 
                />
              </div>
              <div className="pt-4 border-t border-slate-100">
                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm shadow-emerald-500/20 cursor-pointer">
                  Save Expected Donation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DepartmentLayout>
  );
}
