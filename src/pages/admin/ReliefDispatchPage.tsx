import { useState, useEffect } from 'react';
import { Package, MapPin, Send, Clock, Plus, X, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useReliefDispatches } from '../../hooks/useSystemHooks';
import BarangayOptions from '../../components/BarangayOptions';


import { encryptedFetch } from '../../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

interface InventoryItem {
  admin_relief_inventory_id: string;
  category: string;
  quantity: number;
}


export default function ReliefDispatchPanel() {
  const { reliefDispatches: mockDispatches, deliveredLogs, refresh } = useReliefDispatches();
  const pendingRequests = mockDispatches.filter(d => d.status === 'Pending');
  const activeMissions = mockDispatches.filter(d => d.status !== 'Pending');
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    id: '',
    location: '',
    type: '',
    quantity: '' as number | string,
    vehicle: ''
  });
  
  const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState<'dispatches' | 'requests' | 'active'>('requests');
  const [isDispatching, setIsDispatching] = useState(false);

  const fetchData = async () => {
    try {
      const invRes = await encryptedFetch(`${API_URL}/api/inventory?_t=${Date.now()}`);
      const invData = await invRes.json();
      setInventory(invData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 1000);
    return () => clearInterval(interval);
  }, []);


  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(form.quantity);
    if (!form.location || !form.type || qty <= 0) return;

    const selectedItem = inventory.find(i => i.category === form.type);
    if (!selectedItem || selectedItem.quantity < qty) {
      setToast({ show: true, message: 'Not enough stock available for this category.', type: 'error' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
      return;
    }

    setIsDispatching(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await encryptedFetch(`${API_URL}/api/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: form.type, quantity: -qty })
      });

      if (form.id) {
         await encryptedFetch(`${API_URL}/api/relief-requests/${form.id}/status`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ status: 'En Route', vehicle: form.vehicle })
         });
      } else {
         const reqRes = await encryptedFetch(`${API_URL}/api/relief-requests`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ barangay: form.location, type: form.type, quantity: qty })
         });
         const reqData = await reqRes.json();
         const newId = reqData.request.mission_id || reqData.request.id;

         await encryptedFetch(`${API_URL}/api/relief-requests/${newId}/status`, {
           method: 'PUT',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ status: 'En Route', vehicle: form.vehicle })
         });
      }

      setForm({ id: '', location: '', type: '', quantity: '', vehicle: '' });
      setShowModal(false);
      fetchData(); 
      refresh();

      setToast({ show: true, message: `${form.type} successfully dispatched to ${form.location}!`, type: 'success' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    } catch (error) {
      console.error("Error dispatching relief:", error);
      setToast({ show: true, message: 'Failed to dispatch. Please try again.', type: 'error' });
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <DepartmentLayout>
      <div className="animate-fade-in space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Relief Dispatch</h2>
            <p className="text-slate-500 mt-1">Allocate and send relief goods to affected areas based on real-time inventory.</p>
          </div>
          <button 
            onClick={() => { setForm({ id: '', location: '', type: '', quantity: '', vehicle: '' }); setShowModal(true); }}
            className="bg-primary hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            New Dispatch
          </button>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-6 border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('requests')}
                className={`text-sm font-bold pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === 'requests' ? 'border-primary text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Barangay Requests
                <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-[10px] font-black">
                  {pendingRequests.length}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('active')}
                className={`text-sm font-bold pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === 'active' ? 'border-primary text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Ongoing Dispatches
                <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-[10px] font-black">
                  {activeMissions.length}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('dispatches')}
                className={`text-sm font-bold pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === 'dispatches' ? 'border-primary text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Relief Logs
              </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-slate-50">
              {activeTab === 'dispatches' && (
                <>
                  {deliveredLogs.map(dispatch => (
                    <div key={dispatch.delivered_logs_id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 w-full">
                        <div className="p-4 rounded-2xl shrink-0 bg-emerald-50 text-emerald-600">
                          <Package className="w-8 h-8" />
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-slate-800 text-base">{dispatch.quantity}x {dispatch.type}</h4>
                            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-800">
                              Delivered
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mt-2">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              <MapPin className="w-4 h-4 text-primary" /> To: {dispatch.barangay}
                            </span>
                            {dispatch.taskforce_assigned && (
                              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                <Truck className="w-4 h-4 text-blue-500" /> {dispatch.taskforce_assigned}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                Signed by: {dispatch.signatory_name}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" /> {new Date(dispatch.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {deliveredLogs.length === 0 && (
                    <div className="p-12 text-center text-slate-400 text-sm">
                      No recent dispatches in this session.
                    </div>
                  )}
                </>
              )}

              {activeTab === 'active' && (
                <>
                  {activeMissions.map(dispatch => (
                    <div key={dispatch.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 w-full">
                        <div className="p-4 rounded-2xl shrink-0 bg-blue-50 text-blue-600">
                          <Truck className="w-8 h-8" />
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-slate-800 text-base">{dispatch.quantity}x {dispatch.type}</h4>
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              dispatch.status === 'Arrived' ? 'bg-indigo-100 text-indigo-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {dispatch.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mt-2">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              <MapPin className="w-4 h-4 text-primary" /> To: {dispatch.barangay}
                            </span>
                            {dispatch.vehicle && (
                              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                <Truck className="w-4 h-4 text-blue-500" /> {dispatch.vehicle}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" /> {new Date(dispatch.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {activeMissions.length === 0 && (
                    <div className="p-12 text-center text-slate-400 text-sm">
                      No ongoing dispatches right now.
                    </div>
                  )}
                </>
              )}

              {activeTab === 'requests' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-sm text-slate-500 bg-slate-50/50">
                        <th className="p-4 font-semibold">Request ID</th>
                        <th className="p-4 font-semibold">Barangay</th>
                        <th className="p-4 font-semibold">Item Required</th>
                        <th className="p-4 font-semibold text-center">Quantity</th>
                        <th className="p-4 font-semibold">Requested On</th>
                        <th className="p-4 font-semibold text-center">Status</th>
                        <th className="p-4 font-semibold text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4">
                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{req.id}</span>
                          </td>
                          <td className="p-4 font-bold text-slate-800">{req.barangay}</td>
                          <td className="p-4 font-medium text-slate-800">{req.type}</td>
                          <td className="p-4 text-center font-bold text-slate-700">{req.quantity}</td>
                          <td className="p-4 text-sm text-slate-500">{new Date(req.timestamp).toLocaleDateString()} {new Date(req.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                          <td className="p-4 text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                              <Clock className="w-3.5 h-3.5" />
                              {req.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => {
                                setForm({ id: req.id, location: req.barangay, type: req.type, quantity: req.quantity, vehicle: '' });
                                setShowModal(true);
                              }}
                              className="bg-primary hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              Dispatch
                            </button>
                          </td>
                        </tr>
                      ))}
                      {pendingRequests.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-12 text-center text-slate-400 text-sm">
                            No pending barangay requests at the moment.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden p-6 relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-xl">
              <Send className="w-5 h-5 text-primary" />
              New Dispatch
            </h3>
            
            <form onSubmit={handleDispatch} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Destination Area</label>
                <select 
                  required
                  value={form.location}
                  onChange={e => setForm({...form, location: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select destination</option>
                  <BarangayOptions />
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Relief Category</label>
                <select 
                  required
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select available category</option>
                  {inventory.filter(i => i.quantity > 0).map(item => (
                    <option key={item.admin_relief_inventory_id} value={item.category}>
                      {item.category} (Available: {item.quantity})
                    </option>
                  ))}
                </select>
                {inventory.filter(i => i.quantity > 0).length === 0 && (
                  <p className="text-xs text-rose-500 mt-1 font-semibold">No inventory available to dispatch.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Quantity</label>
                <input 
                  type="number"
                  min="1"
                  required
                  value={form.quantity}
                  onChange={e => setForm({...form, quantity: e.target.value === '' ? '' : parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Assigned Taskforce</label>
                <select 
                  required
                  value={form.vehicle}
                  onChange={e => setForm({...form, vehicle: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select Taskforce</option>
                  <option value="Task Force 1">Task Force 1</option>
                  <option value="Task Force 2">Task Force 2</option>
                  <option value="Task Force 3">Task Force 3</option>
                  <option value="Task Force 4">Task Force 4</option>
                  <option value="Task Force 5">Task Force 5</option>
                </select>
              </div>

              <div className="flex gap-3 mt-8">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-4 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isDispatching || inventory.filter(i => i.quantity > 0).length === 0}
                  className="flex-1 bg-primary hover:bg-blue-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-primary/20 cursor-pointer h-13"
                >
                  {isDispatching ? (
                    <div className="flex items-center justify-center gap-1.5 h-full">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    </div>
                  ) : (
                    'Dispatch'
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
            <h4 className="font-bold text-white text-sm">{toast.type === 'success' ? 'Dispatch Successful' : 'Dispatch Failed'}</h4>
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
