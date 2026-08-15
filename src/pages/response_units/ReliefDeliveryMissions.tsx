import { useState } from 'react';
import { useMockData, type ReliefDispatch } from '../../data/MockDataContext';
import { Package, Shield, MapPin, Clock, CheckCircle, Truck, Navigation, FileCheck, Camera, PenTool } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';

interface DeliveryCardProps {
  delivery: ReliefDispatch;
  teamLeaderLabel: string;
  onUpdateStatus: (id: string, newStatus: ReliefDispatch['status']) => void;
  onMarkDelivered: (id: string, barangay: string, type: string, quantity: number, personnel: string, proofDetails: any) => void;
}

function DeliveryCard({ delivery, teamLeaderLabel, onUpdateStatus, onMarkDelivered }: DeliveryCardProps) {
  const [showProofForm, setShowProofForm] = useState(false);
  const [proof, setProof] = useState({
    signatoryName: '',
    photoUploaded: false,
    signatureAdded: false
  });

  const handleDeliver = () => {
    if (!proof.signatoryName) {
      alert("Please provide the name of the receiving official.");
      return;
    }
    onMarkDelivered(delivery.id, delivery.barangay, delivery.type, delivery.quantity, teamLeaderLabel, proof);
    setShowProofForm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
        <div>
          <div className="text-xs font-bold text-slate-500 mb-1">{delivery.id}</div>
          <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-500" />
            Brgy. {delivery.barangay}
          </h3>
        </div>
        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
          delivery.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' :
          delivery.status === 'Arrived' ? 'bg-blue-100 text-blue-800' :
          delivery.status === 'En Route' ? 'bg-indigo-100 text-indigo-800' :
          'bg-amber-100 text-amber-800'
        }`}>
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
      
      <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
        {!showProofForm ? (
          <div className="space-y-2">
            {(delivery.status === 'Pending' || delivery.status === 'Preparing') && (
              <button 
                onClick={() => onUpdateStatus(delivery.id, 'En Route')}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
              >
                <Truck className="w-5 h-5" />
                Start En Route
              </button>
            )}
            
            {delivery.status === 'En Route' && (
              <button 
                onClick={() => onUpdateStatus(delivery.id, 'Arrived')}
                className="w-full flex items-center justify-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm shadow-indigo-500/20 cursor-pointer"
              >
                <Navigation className="w-5 h-5" />
                Arrived at Location
              </button>
            )}

            {delivery.status === 'Arrived' && (
              <button 
                onClick={() => setShowProofForm(true)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-sm shadow-emerald-500/20 cursor-pointer"
              >
                <FileCheck className="w-5 h-5" />
                Proof of Delivery
              </button>
            )}
            
            {delivery.status === 'Delivered' && (
              <div className="w-full flex items-center justify-center gap-2 bg-slate-200 text-slate-500 font-bold py-3 px-4 rounded-xl cursor-not-allowed">
                <CheckCircle className="w-5 h-5" />
                Delivered
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-inner">
             <div className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2 border-b pb-2">
               <FileCheck className="w-4 h-4 text-emerald-600" /> Delivery Handover
             </div>
             
             <div>
               <label className="text-[10px] font-bold text-slate-500 uppercase">Receiving Official Name</label>
               <input 
                  type="text" 
                  value={proof.signatoryName} 
                  onChange={(e) => setProof({...proof, signatoryName: e.target.value})} 
                  placeholder="e.g. Brgy. Capt. Santos"
                  className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-emerald-500"
               />
             </div>
             
             <div className="flex gap-2">
                <button 
                  onClick={() => setProof({...proof, photoUploaded: !proof.photoUploaded})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-bold transition-colors ${proof.photoUploaded ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                   <Camera className="w-4 h-4" /> {proof.photoUploaded ? 'Photo Uploaded' : 'Upload Photo'}
                </button>
                <button 
                  onClick={() => setProof({...proof, signatureAdded: !proof.signatureAdded})}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg border text-xs font-bold transition-colors ${proof.signatureAdded ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                   <PenTool className="w-4 h-4" /> {proof.signatureAdded ? 'Signed' : 'E-Signature'}
                </button>
             </div>
             
             <div className="flex gap-2 pt-2">
               <button onClick={() => setShowProofForm(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer">Cancel</button>
               <button onClick={handleDeliver} className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1">
                 <CheckCircle className="w-4 h-4" /> Confirm
               </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Fixed Team Leader identity
const UNIT_ID = 'RES-01';
const TEAM_LEADER_LABEL = `${UNIT_ID} — Team Leader Juan Dela Cruz`;

export default function ReliefDeliveryMissions() {
  const { incidents, reliefDispatches, updateReliefDispatchStatus, addAuditLog } = useMockData();
  
  const activeIncidentsCount = incidents.filter(i => 
    i.status !== 'Resolved' && i.assignedResponder === 'Task Force 1'
  ).length;

  // Show all non-delivered dispatches as active deliveries for this unit
  const activeDeliveries = reliefDispatches.filter(d => d.status !== 'Delivered');
  const completedDeliveries = reliefDispatches.filter(d => d.status === 'Delivered');

  const handleMarkDelivered = (id: string, barangay: string, type: string, quantity: number, _personnel: string, proofDetails: any) => {
    updateReliefDispatchStatus(id, 'Delivered');
    addAuditLog('Relief Delivered', TEAM_LEADER_LABEL, `Successfully delivered ${quantity} ${type} to ${barangay}. Received by: ${proofDetails.signatoryName}`);
  };

  const handleUpdateStatus = (id: string, newStatus: any) => {
    updateReliefDispatchStatus(id, newStatus);
    addAuditLog(`Delivery ${newStatus}`, TEAM_LEADER_LABEL, `Status updated for Delivery ${id}`);
  };

  return (
    <ResponseUnitLayout activeIncidentsCount={activeIncidentsCount}>
      <div className="animate-fade-in space-y-6">
        
        {/* Unit Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Package className="w-6 h-6 text-emerald-600" />
              Relief Delivery Missions
            </h2>
            <p className="text-sm text-slate-500 mt-1">Manage and track relief goods delivery to affected barangays.</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-600">{UNIT_ID}</div>
              <div className="text-xs font-medium text-slate-500">TL Juan Dela Cruz</div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Pending</div>
              <div className="text-xl font-black text-slate-800">{activeDeliveries.length}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Package className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Delivered</div>
              <div className="text-xl font-black text-slate-800">{completedDeliveries.length}</div>
            </div>
          </div>
        </div>

        {/* Delivery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeDeliveries.map((delivery) => (
            <DeliveryCard 
              key={delivery.id} 
              delivery={delivery}
              teamLeaderLabel={TEAM_LEADER_LABEL}
              onUpdateStatus={handleUpdateStatus}
              onMarkDelivered={handleMarkDelivered}
            />
          ))}

          {activeDeliveries.length === 0 && (
            <div className="col-span-full bg-white p-12 text-center rounded-xl border border-slate-200 shadow-sm flex flex-col items-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Pending Deliveries</h3>
              <p className="text-slate-500 mt-2 max-w-sm">
                There are no active relief dispatch missions assigned to {UNIT_ID} right now.
              </p>
            </div>
          )}
        </div>
      </div>
    </ResponseUnitLayout>
  );
}
