import { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import { CheckCircle, Truck, MapPin, Package, Clock } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';

export default function ReliefDeliveryMissions() {
  const { incidents, reliefDispatches, updateReliefDispatchStatus, addAuditLog } = useMockData();
  
  // We share the same unit list and active incident count for the layout
  const [selectedUnit, setSelectedUnit] = useState('RES-01 (Truck)');
  const responderUnits = ['RES-01 (Truck)', 'RES-02 (Ambulance)', 'RES-03 (Van)', 'RES-04 (Fire)'];
  
  const activeIncidentsCount = incidents.filter(i => 
    i.status !== 'Resolved' && i.assignedResponder?.includes(selectedUnit.split(' ')[0])
  ).length;

  const activeDeliveries = reliefDispatches.filter(d => 
    d.status !== 'Delivered' && d.vehicle === selectedUnit
  );

  const handleMarkDelivered = (id: string, barangay: string, type: string, quantity: number) => {
    updateReliefDispatchStatus(id, 'Delivered');
    addAuditLog('Relief Delivered', selectedUnit, `Successfully delivered ${quantity} ${type} to ${barangay}`);
  };

  return (
    <ResponseUnitLayout activeIncidentsCount={activeIncidentsCount}>
      <div className="animate-fade-in space-y-6">
        
        {/* Unit Selector */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Truck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Delivery Logistics</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Select your assigned vehicle</p>
            </div>
          </div>
          <select 
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none cursor-pointer w-full sm:w-auto"
          >
            {responderUnits.map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDeliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500 mb-1">{delivery.id}</div>
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    Brgy. {delivery.barangay}
                  </h3>
                </div>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {delivery.status}
                </span>
              </div>
              
              <div className="p-5 flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Cargo</div>
                    <div className="font-bold text-slate-800">{delivery.quantity} x {delivery.type}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Dispatched At</div>
                    <div className="text-sm font-semibold text-slate-700">{new Date(delivery.timestamp).toLocaleString()}</div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={() => handleMarkDelivered(delivery.id, delivery.barangay, delivery.type, delivery.quantity)}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm shadow-emerald-500/20 cursor-pointer"
                >
                  <CheckCircle className="w-5 h-5" />
                  Mark as Delivered
                </button>
              </div>
            </div>
          ))}

          {activeDeliveries.length === 0 && (
            <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Pending Deliveries</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                There are no active relief dispatch missions assigned to {selectedUnit} right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </ResponseUnitLayout>
  );
}
