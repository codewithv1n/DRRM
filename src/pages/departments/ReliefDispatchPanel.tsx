import { useState } from 'react';
import { Package, MapPin, Send, Clock, AlertTriangle } from 'lucide-react';
import DepartmentLayout from '../../components/layout/DepartmentLayout';
import { useMockData } from '../../data/MockDataContext';

export default function ReliefDispatchPanel() {
  const { barangaySitReps, incidents, reliefDispatches, addReliefDispatch,  } = useMockData();
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;

  const [form, setForm] = useState({
    barangay: '',
    type: 'Family Food Pack',
    quantity: 100
  });
  const [activeTab, setActiveTab] = useState<'dispatches' | 'requests'>('requests');


  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.barangay) return;

    addReliefDispatch({
      barangay: form.barangay,
      type: form.type,
      quantity: form.quantity,
      vehicle: "QC Logistics" // Default vehicle
    });

    setForm({ ...form, barangay: '', quantity: 100 });
  };


  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Relief Dispatch</h2>
          <p className="text-slate-500 mt-1">Allocate and send relief goods to affected barangays.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Dispatch Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)]">
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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

                {/* Vehicle selection removed per request */}

                <button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-sm hover:shadow-md cursor-pointer">
                  <Send className="w-4 h-4" />
                  Dispatch Relief
                </button>
              </form>
            </div>
          </div>

          {/* Dispatch Logs & Requests */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-6 border-b border-slate-200">
              <button 
                onClick={() => setActiveTab('requests')}
                className={`text-base font-bold pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === 'requests' ? 'border-primary text-slate-800' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                Barangay Requests
                <span className="ml-2 bg-rose-100 text-rose-600 py-0.5 px-2 rounded-full text-[10px] font-black">
                  {barangaySitReps.filter(sr => sr.damageSeverity === 'Severe' || sr.damageSeverity === 'Critical').length}
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
                    <div key={dispatch.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl shrink-0 ${dispatch.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-800">{dispatch.quantity}x {dispatch.type}</h4>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1.5">
                            <span className="flex items-center gap-1.5 font-medium text-slate-700">
                              <MapPin className="w-3.5 h-3.5 text-primary" /> To: {dispatch.barangay}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" /> {new Date(dispatch.timestamp).toLocaleTimeString()}
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
                  {barangaySitReps.filter(sr => sr.damageSeverity === 'Severe' || sr.damageSeverity === 'Critical').map(request => (
                    <div key={request.id} className="p-6 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-2xl shrink-0 bg-rose-50 text-rose-600">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-slate-800">Brgy. {request.barangay}</h4>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider bg-rose-100 text-rose-800">
                              {request.damageSeverity} Needs
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            Urgent relief requested based on latest SitRep ({request.householdCount} affected households).
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                            <Clock className="w-3.5 h-3.5" /> Updated {new Date(request.timestamp).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setForm({...form, barangay: request.barangay, quantity: request.householdCount})}
                        className="text-xs bg-white border border-primary text-primary hover:bg-primary/5 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0"
                      >
                        Prepare Dispatch
                      </button>
                    </div>
                  ))}
                  {barangaySitReps.filter(sr => sr.damageSeverity === 'Severe' || sr.damageSeverity === 'Critical').length === 0 && (
                    <div className="p-12 text-center text-slate-400 text-sm">
                      No urgent relief requests at the moment.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}
