import React, { useState, useMemo } from 'react';
import { Clock, CheckCircle, Truck, Plus, X, Search, AlertCircle } from 'lucide-react';
import BarangayLayout from '../../components/layout/BarangayLayout';
import { useReliefDispatches } from '../../hooks/useSystemHooks';
import { normalizeBarangay } from './BarangayDashboard';

export default function BarangayReliefRequests() {
  const { reliefDispatches, deliveredLogs, requestRelief } = useReliefDispatches();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const currentBarangay = user?.barangay || user?.location;
  
  const [activeTab, setActiveTab] = useState<'active' | 'delivered'>('active');
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestData, setRequestData] = useState<{ type: string; quantity: number | string }>({
    type: 'Food & Water',
    quantity: 100,
  });

  
  const myRequests = useMemo(() => {
    return reliefDispatches.filter(d => normalizeBarangay(d.barangay) === normalizeBarangay(currentBarangay)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [reliefDispatches, currentBarangay]);

  const myDeliveredLogs = useMemo(() => {
    return deliveredLogs.filter(log => normalizeBarangay(log.barangay) === normalizeBarangay(currentBarangay)).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [deliveredLogs, currentBarangay]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredRequests = myRequests.filter(req => 
    req.type.toLowerCase().includes(searchQuery.toLowerCase()) || 
    req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    req.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Add a small delay so the loading animation is visible before closing the modal
      await new Promise(resolve => setTimeout(resolve, 600));

      await requestRelief({
        barangay: currentBarangay,
        type: requestData.type,
        quantity: Number(requestData.quantity),
      });
      setShowRequestModal(false);
      setRequestData({ type: 'Food & Water', quantity: 100 });
      setToast({ show: true, message: 'Relief request submitted successfully!', type: 'success' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    } catch (error) {
      console.error(error);
      setToast({ show: true, message: 'Failed to submit request. Please try again.', type: 'error' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="flex items-center gap-6">
              <button 
                onClick={() => setActiveTab('active')}
                className={`text-sm font-bold pb-1 border-b-2 transition-colors cursor-pointer ${activeTab === 'active' ? 'border-blue-600 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Active Requests
                <span className="ml-2 bg-slate-200 text-slate-600 py-0.5 px-2 rounded-full text-[10px] font-black">
                  {myRequests.length}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('delivered')}
                className={`text-sm font-bold pb-1 border-b-2 transition-colors cursor-pointer ${activeTab === 'delivered' ? 'border-blue-600 text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Delivered Logs
                <span className="ml-2 bg-emerald-100 text-emerald-700 py-0.5 px-2 rounded-full text-[10px] font-black">
                  {myDeliveredLogs.length}
                </span>
              </button>
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
          {activeTab === 'active' ? (
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
                      {searchQuery ? 'No relief requests match your search.' : 'No active relief requests found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm text-slate-500 bg-slate-50/50">
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Item</th>
                  <th className="p-4 font-semibold text-center">Qty</th>
                  <th className="p-4 font-semibold">Delivered On</th>
                  <th className="p-4 font-semibold text-center">Handled By</th>
                  <th className="p-4 font-semibold text-center">Signatory</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myDeliveredLogs.map((log) => (
                  <tr key={log.delivered_logs_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{log.mission_id}</span>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{log.type}</td>
                    <td className="p-4 text-center font-bold text-slate-700">{log.quantity}</td>
                    <td className="p-4 text-sm text-slate-500">{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                    <td className="p-4 text-center text-sm font-medium text-slate-700">{log.taskforce_assigned}</td>
                    <td className="p-4 text-center text-sm font-bold text-emerald-700">{log.signatory_name}</td>
                  </tr>
                ))}
                {myDeliveredLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-400 text-sm">
                      No relief deliveries logged yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
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
                  <option value="Food & Water">Food & Water</option>
                  <option value="Clothes & Blankets">Clothes & Blankets</option>
                  <option value="Medical Supplies">Medical Supplies</option>
                  <option value="Hygiene Kits">Hygiene Kits</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Quantity Required</label>
                <input
                  type="number"
                  min="1"
                  max="1000000"
                  required
                  value={requestData.quantity}
                  onChange={(e) => {
                    let val: number | string = e.target.value === '' ? '' : parseInt(e.target.value) || 0;
                    if (typeof val === 'number' && val > 1000000) val = 1000000;
                    setRequestData(prev => ({ ...prev, quantity: val }));
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 bg-slate-50"
                  placeholder="e.g. 100"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-md shadow-blue-500/20 cursor-pointer disabled:opacity-70 flex justify-center items-center h-13"
                >
                  {isSubmitting ? (
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast.show && (
        <div className={`fixed top-6 right-6 border shadow-[0_10px_40px_rgba(0,0,0,0.1)] rounded-2xl p-4 flex items-center gap-4 z-9999 animate-fade-in ${toast.type === 'success' ? 'bg-emerald-500 border-emerald-400' : 'bg-red-500 border-red-400'}`}>
          <div className={`p-2 rounded-xl text-white ${toast.type === 'success' ? 'bg-emerald-400/50' : 'bg-red-400/50'}`}>
            {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">{toast.type === 'success' ? 'Request Successful' : 'Request Failed'}</h4>
            <p className="text-xs text-white/90">{toast.message}</p>
          </div>
          <button onClick={() => setToast(prev => ({ ...prev, show: false }))} className="ml-2 text-white/70 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      </div>
    </BarangayLayout>
  );
}

