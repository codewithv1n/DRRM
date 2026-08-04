import { useState } from 'react';
import { Package, MapPin, Send, Clock, AlertTriangle, Plus, X, Truck } from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useMockData } from '../../data/MockDataContext';

export default function ReliefDispatchPanel() {
  const { barangaySitReps, incidents, reliefDispatches, addReliefDispatch, } = useMockData();
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    barangay: '',
    type: 'Family Food Pack',
    quantity: 100,
    vehicle: ''
  });
  const [activeTab, setActiveTab] = useState<'dispatches' | 'requests'>('requests');


  const getTotalBarangayInventory = (barangayName: string) => {
    return reliefDispatches
      .filter(d => d.barangay === barangayName && d.status === 'Delivered')
      .reduce((total, d) => total + d.quantity, 0);
  };


  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.barangay) return;

    addReliefDispatch({
      barangay: form.barangay,
      type: form.type,
      quantity: form.quantity,
      vehicle: form.vehicle || "QC Logistics"
    });

    setForm({ ...form, barangay: '', quantity: 100, vehicle: '' });
    setShowModal(false);
  };


  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Relief Dispatch</h2>
            <p className="text-slate-500 mt-1">Allocate and send relief goods to affected barangays.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-orange-600 text-white font-bold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            New Dispatch
          </button>
        </div>

        <div className="space-y-4">
            <div className="flex items-center gap-6 border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('requests')}
                className={`text-base font-bold pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === 'requests' ? 'border-primary text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Barangay Status & Stocks
                <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-[10px] font-black">
                  {barangaySitReps.length}
                </span>
              </button>
              <button 
                onClick={() => setActiveTab('dispatches')}
                className={`text-base font-bold pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === 'dispatches' ? 'border-primary text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
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
                            <h4 className="font-bold text-slate-800 text-lg">{dispatch.quantity}x {dispatch.type}</h4>
                            <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                dispatch.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                              {dispatch.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-5 text-sm text-slate-500 mt-2">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              <MapPin className="w-4 h-4 text-primary" /> To: {dispatch.barangay}
                            </span>
                            {/* @ts-ignore - vehicle exists since we added it */}
                            {dispatch.vehicle && (
                              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                                {/* @ts-ignore */}
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
                      No recent dispatches.
                    </div>
                  )}
                </>
              )}

              {activeTab === 'requests' && (
                <>
                  {barangaySitReps.map(request => {
                    const isUrgent = request.damageSeverity === 'Severe' || request.damageSeverity === 'Critical';
                    return (
                      <div key={request.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-4 w-full">
                          <div className={`p-4 rounded-2xl shrink-0 ${isUrgent ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>
                            {isUrgent ? <AlertTriangle className="w-8 h-8" /> : <Package className="w-8 h-8" />}
                          </div>
                          <div className="flex-1 w-full">
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-slate-800 text-lg">Brgy. {request.barangay}</h4>
                              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                isUrgent ? 'bg-rose-100 text-rose-800' : 
                                request.damageSeverity === 'Moderate' ? 'bg-amber-100 text-amber-800' : 
                                'bg-emerald-100 text-emerald-800'
                              }`}>
                                {request.damageSeverity} Impact
                              </span>
                            </div>
                            <div className="text-sm text-slate-500 mt-1 mb-4">
                              {request.householdCount} affected households reported.
                            </div>
                            
                            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 w-full">
                              <div className="text-xs uppercase font-bold text-slate-500 mb-3 flex items-center gap-1.5">
                                <Package className="w-4 h-4" /> Overall Stock (Local Inventory)
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {getTotalBarangayInventory(request.barangay) > 0 ? (
                                  <span className="text-sm bg-white border border-slate-200 px-4 py-2 rounded-lg font-medium text-slate-700 shadow-sm flex items-center gap-2">
                                    <span className="text-primary font-black text-lg">{getTotalBarangayInventory(request.barangay)}</span>
                                    <span className="text-slate-500">Total Items</span>
                                  </span>
                                ) : (
                                  <span className="text-sm text-rose-500 font-semibold italic bg-rose-50 px-3 py-1.5 rounded-lg">Empty / No Stock Available</span>
                                )}
                              </div>
                            </div>
  
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mt-4">
                              <Clock className="w-4 h-4" /> Updated {new Date(request.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {barangaySitReps.length === 0 && (
                    <div className="p-12 text-center text-slate-400 text-sm">
                      No barangay data available.
                    </div>
                  )}
                </>
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
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Destination Barangay</label>
                <select 
                  required
                  value={form.barangay}
                  onChange={e => setForm({...form, barangay: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select a barangay</option>
                  {barangaySitReps.map(sr => (
                    <option key={sr.id} value={sr.barangay}>{sr.barangay}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Relief Type</label>
                <select 
                  value={form.type}
                  onChange={e => setForm({...form, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                >
                  <option>Family Food Pack</option>
                  <option>Hygiene Kit A</option>
                  <option>Hygiene Kit B</option>
                  <option>Sleeping Kit</option>
                  <option>Bottled Water (Box)</option>
                </select>
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
                <button type="submit" className="flex-1 bg-primary hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-sm shadow-primary/20 cursor-pointer">
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
