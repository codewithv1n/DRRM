import { useState, useEffect } from 'react';
import { Package, MapPin, Send, Clock, Plus, X, Truck } from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useMockData } from '../../data/MockDataContext';
import BarangayOptions from '../../components/BarangayOptions';

interface InventoryItem {
  relief_inventory_id: string;
  category: string;
  quantity: number;
}

interface DispatchLog {
  id: string;
  location: string;
  type: string;
  quantity: number;
  vehicle: string;
  status: string;
  timestamp: string;
}


export default function ReliefDispatchPanel() {
  const { reliefDispatches: mockDispatches, updateReliefDispatchStatus } = useMockData();
  const pendingRequests = mockDispatches.filter(d => d.status === 'Pending');
  
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [reliefDispatches, setReliefDispatches] = useState<DispatchLog[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    location: '',
    type: '',
    quantity: 1,
    vehicle: ''
  });
  const [activeTab, setActiveTab] = useState<'dispatches' | 'requests'>('requests');

  const fetchData = async () => {
    try {
      const invRes = await fetch('http://localhost:3000/api/inventory');
      const invData = await invRes.json();
      setInventory(invData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.location || !form.type || form.quantity <= 0) return;

    const selectedItem = inventory.find(i => i.category === form.type);
    if (!selectedItem || selectedItem.quantity < form.quantity) {
      alert("Not enough stock available for this category.");
      return;
    }

    try {
      
      await fetch('http://localhost:3000/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: form.type, quantity: -form.quantity })
      });

      const newDispatch: DispatchLog = {
        id: Math.random().toString(36).substring(7),
        location: form.location,
        type: form.type,
        quantity: form.quantity,
        vehicle: form.vehicle || "QC Logistics",
        status: 'Dispatched',
        timestamp: new Date().toISOString()
      };
      setReliefDispatches([newDispatch, ...reliefDispatches]);

      setForm({ location: '', type: '', quantity: 1, vehicle: '' });
      setShowModal(false);
      fetchData(); 
    } catch (error) {
      console.error("Error dispatching relief:", error);
      alert("Failed to dispatch. Please try again.");
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
            onClick={() => setShowModal(true)}
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
                onClick={() => setActiveTab('dispatches')}
                className={`text-sm font-bold pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === 'dispatches' ? 'border-primary text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Relief Logs
              </button>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden divide-y divide-slate-50">
              {activeTab === 'dispatches' && (
                <>
                  {reliefDispatches.map(dispatch => (
                    <div key={dispatch.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-4 w-full">
                        <div className={`p-4 rounded-2xl shrink-0 ${dispatch.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Package className="w-8 h-8" />
                        </div>
                        <div className="flex-1 w-full">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-slate-800 text-base">{dispatch.quantity}x {dispatch.type}</h4>
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                dispatch.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                              {dispatch.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mt-2">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              <MapPin className="w-4 h-4 text-primary" /> To: {dispatch.location}
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
                  
                  {reliefDispatches.length === 0 && (
                    <div className="p-12 text-center text-slate-400 text-sm">
                      No recent dispatches in this session.
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
                                setForm({ location: req.barangay, type: req.type, quantity: req.quantity, vehicle: '' });
                                setShowModal(true);
                                updateReliefDispatchStatus(req.id, 'En Route');
                              }}
                              className="bg-primary hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
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
                    <option key={item.relief_inventory_id} value={item.category}>
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
                  onChange={e => setForm({...form, quantity: parseInt(e.target.value) || 0})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Assigned Vehicle / Unit</label>
                <select 
                  required
                  value={form.vehicle}
                  onChange={e => setForm({...form, vehicle: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select Response Unit</option>
                  <option value="QC Logistics Truck 1">QC Logistics Truck 1</option>
                  <option value="QC Logistics Truck 2">QC Logistics Truck 2</option>
                  <option value="Brgy. Rescue Van A">Brgy. Rescue Van A</option>
                  <option value="Military Truck 01">Military Truck 01</option>
                  <option value="Private Partner Fleet">Private Partner Fleet</option>
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
                  disabled={inventory.filter(i => i.quantity > 0).length === 0}
                  className="flex-1 bg-primary hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-primary/20 cursor-pointer"
                >
                  Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DepartmentLayout>
  );
}
