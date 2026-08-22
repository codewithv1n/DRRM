import React, { useState, useMemo } from 'react';
import { Clock, CheckCircle, Truck, Plus, X, List, Search } from 'lucide-react';
import BarangayLayout from '../../components/layout/BarangayLayout';
import { useAppData } from '../../data/AppDataContext';

export default function BarangayReliefRequests() {
  const { reliefDispatches, requestRelief } = useAppData();
  const currentBarangay = 'Balingasa';

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestData, setRequestData] = useState({
    type: 'Family Food Pack',
    quantity: 100,
  });

  // Relief Requests for this barangay
  const myRequests = useMemo(() => {
    return reliefDispatches.filter(d => d.barangay === currentBarangay).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [reliefDispatches, currentBarangay]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = myRequests.filter(req => 
    req.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    requestRelief({
      barangay: currentBarangay,
      type: requestData.type,
      quantity: requestData.quantity,
    });
    setShowRequestModal(false);
    setRequestData({ type: 'Family Food Pack', quantity: 100 });
  };

  return (
    <BarangayLayout>
      <div className="animate-fade-in pb-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Relief Requests</h1>
          <p className="text-slate-500 mt-1">Manage and track your relief goods requests from the EOC.</p>
        </div>
        <button 
          onClick={() => setShowRequestModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Request Relief
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <List className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">All Requests</h2>
          </div>
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search requests..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-sm text-slate-500 bg-slate-50/50">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Item</th>
                <th className="p-4 font-semibold text-center">Qty</th>
                <th className="p-4 font-semibold">Requested On</th>
                <th className="p-4 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{req.id}</span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">{req.type}</td>
                  <td className="p-4 text-center font-bold text-slate-700">{req.quantity}</td>
                  <td className="p-4 text-sm text-slate-500">{new Date(req.timestamp).toLocaleDateString()} {new Date(req.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      req.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                      req.status === 'En Route' ? 'bg-indigo-100 text-indigo-700 border-indigo-200' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {req.status === 'Delivered' && <CheckCircle className="w-3.5 h-3.5" />}
                      {req.status === 'En Route' && <Truck className="w-4 h-4" />}
                      {req.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 text-sm">
                    {searchQuery ? 'No relief requests match your search.' : 'No relief requests found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Relief Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Request Relief Goods</h3>
              <button onClick={() => setShowRequestModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleRequestSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Item Type</label>
                <select
                  value={requestData.type}
                  onChange={(e) => setRequestData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 bg-slate-50"
                  required
                >
                  <option value="Family Food Pack">Family Food Pack</option>
                  <option value="Hygiene Kit A">Hygiene Kit A</option>
                  <option value="Sleeping Kit">Sleeping Kit</option>
                  <option value="Bottled Water (Box)">Bottled Water (Box)</option>
                  <option value="Medical First Aid Kit">Medical First Aid Kit</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantity Required</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={requestData.quantity}
                  onChange={(e) => setRequestData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 bg-slate-50"
                  placeholder="e.g. 100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </BarangayLayout>
  );
}

