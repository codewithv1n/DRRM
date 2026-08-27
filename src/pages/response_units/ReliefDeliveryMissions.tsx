import { useState, useEffect } from 'react';
import { encryptedFetch } from '../../utils/encryptedFetch';
import { useAuditLogs, useReliefDispatches } from '../../hooks/useSystemHooks';
import type { ReliefDispatch } from '../../data/types';
import { Package, Shield, MapPin, Clock, CheckCircle, Truck, Navigation, FileCheck, Camera, ClipboardList } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';

const API_URL = import.meta.env.VITE_API_URL;

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
    photoFileName: '',
    photoFile: undefined as File | undefined
  });

  const handleDeliver = () => {
    if (!proof.signatoryName) {
      alert("Please provide the name of the receiving official.");
      return;
    }
    onMarkDelivered(delivery.id, delivery.barangay, delivery.type, delivery.quantity, teamLeaderLabel, proof);
    setShowProofForm(false);
  };

  const bgColor = delivery.status === 'Delivered' ? 'bg-emerald-500' :
                  delivery.status === 'Arrived' ? 'bg-indigo-500' :
                  delivery.status === 'En Route' ? 'bg-blue-500' :
                  'bg-amber-500';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
      <div className="flex flex-col lg:flex-row">
        
        {/* Left Status Indicator */}
        <div className={`lg:w-56 p-5 flex flex-col justify-center shrink-0 ${bgColor}`}>
          <div className="flex items-center gap-2 font-bold text-white text-lg mb-1">
            <Package className="w-5 h-5" />
            Relief Mission
          </div>
          <span className="text-xs text-white/90 font-mono bg-black/20 px-2 py-0.5 rounded-md inline-block w-fit mb-3">
            {delivery.id}
          </span>
          <div className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded shadow-sm w-fit bg-slate-900/30 text-white">
            {delivery.status}
          </div>
        </div>

        {/* Middle Content */}
        <div className="flex-1 p-5 flex flex-col md:flex-row gap-6 lg:gap-8 justify-between items-center">
          
          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Destination</p>
                <p className="text-sm md:text-base text-slate-800 font-bold">Brgy. {delivery.barangay}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-slate-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cargo</p>
                <p className="text-sm text-slate-800 font-medium">{delivery.quantity} x {delivery.type}</p>
              </div>
            </div>
          </div>

          <div className="md:w-64 w-full bg-slate-50 p-3 rounded-lg border border-slate-100 shrink-0">
            <div className="flex items-center gap-2 mb-2 text-slate-700 font-bold text-[10px] uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" /> Dispatch Time
            </div>
            <div className="text-sm font-semibold text-slate-700">
               {new Date(delivery.timestamp).toLocaleString()}
            </div>
          </div>
          
        </div>

        {/* Right Action Buttons */}
        <div className="lg:w-64 p-5 bg-slate-50 border-l border-slate-100 flex flex-col justify-center shrink-0 space-y-2">
          {!showProofForm ? (
            <>
              {(delivery.status === 'Pending' || delivery.status === 'Preparing') && (
                <button onClick={() => onUpdateStatus(delivery.id, 'En Route')} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm cursor-pointer">
                   <Truck className="w-4 h-4" /> Start En Route
                </button>
              )}
              
              {delivery.status === 'En Route' && (
                <button onClick={() => onUpdateStatus(delivery.id, 'Arrived')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm cursor-pointer">
                   <Navigation className="w-4 h-4" /> Arrived at Location
                </button>
              )}

              {delivery.status === 'Arrived' && (
                <button onClick={() => setShowProofForm(true)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm shadow-sm cursor-pointer">
                    <FileCheck className="w-4 h-4" /> Proof of Delivery
                </button>
              )}
              
              {delivery.status === 'Delivered' && (
                <div className="w-full bg-slate-200 text-slate-500 font-bold py-3 rounded-lg flex items-center justify-center gap-2 text-sm cursor-not-allowed">
                    <CheckCircle className="w-4 h-4" /> Delivered
                </div>
              )}
            </>
          ) : (
             <button onClick={() => setShowProofForm(false)} className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm cursor-pointer">
                Cancel Handover
             </button>
          )}
        </div>
      </div>

      {/* Centered Modal Proof of Delivery Form */}
      {showProofForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-5 p-6 rounded-2xl border border-slate-200 shadow-2xl relative">
            <button onClick={() => setShowProofForm(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="flex items-center gap-2 font-bold text-slate-800 text-xl border-b border-slate-100 pb-4">
              <FileCheck className="w-6 h-6 text-emerald-600" /> Delivery Handover Details
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Receiving Official Name</label>
                <input 
                   type="text" 
                   value={proof.signatoryName} 
                   onChange={(e) => setProof({...proof, signatoryName: e.target.value})} 
                   placeholder="e.g. Brgy. Capt. Santos"
                   className="w-full border border-slate-200 rounded-lg p-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-shadow"
                />
              </div>
              
              <div className="flex flex-col gap-3">
                 <input 
                   type="file" 
                   accept="image/*" 
                   className="hidden" 
                   id={`file-upload-${delivery.id}`}
                   onChange={(e) => {
                     if (e.target.files && e.target.files.length > 0) {
                       setProof({...proof, photoUploaded: true, photoFileName: e.target.files[0].name, photoFile: e.target.files[0]})
                     }
                   }}
                 />
                 <label 
                   htmlFor={`file-upload-${delivery.id}`}
                   className={`w-full flex items-center justify-center gap-2 py-3 px-2 rounded-lg border text-sm font-bold transition-all cursor-pointer ${proof.photoUploaded ? 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-inner' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300 shadow-sm'}`}
                 >
                    <Camera className="w-5 h-5 shrink-0" /> 
                    <span className="truncate">{proof.photoUploaded ? proof.photoFileName : 'Attach Photo'}</span>
                 </label>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
              <button onClick={() => setShowProofForm(false)} className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold py-3 rounded-lg transition-colors shadow-sm cursor-pointer">Cancel</button>
              <button onClick={handleDeliver} className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-3 rounded-lg transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Confirm Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



export default function ReliefDeliveryMissions() {
  const { reliefDispatches, deliveredLogs, updateReliefDispatchStatus, markReliefDelivered } = useReliefDispatches();
  const { addAuditLog } = useAuditLogs();
  const [incidents, setIncidents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'delivered'>('active');

  useEffect(() => {
    encryptedFetch(`${API_URL}/api/incidents`)
      .then(res => res.json())
      .then(data => setIncidents(data))
      .catch(err => console.error(err));
  }, []);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const responderName = user?.taskforce_name || user?.name || 'Task Force 1';
  const TEAM_LEADER_LABEL = responderName;

  const activeIncidentsCount = incidents.filter(i => 
    i.status !== 'Resolved' && i.assignedResponder === responderName
  ).length;

  // Show all non-delivered dispatches as active deliveries for this unit
  const activeDeliveries = reliefDispatches.filter(d => d.status !== 'Delivered' && d.vehicle?.includes(responderName));
  const completedDeliveries = deliveredLogs.filter(log => log.taskforce_assigned?.includes(responderName));

  const handleMarkDelivered = (id: string, _barangay: string, _type: string, _quantity: number, _personnel: string, proofDetails: any) => {
    markReliefDelivered(id, proofDetails.signatoryName, proofDetails.photoFile);
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
              Relief Delivery Missions
            </h2>
            <p className="text-sm text-slate-500 mt-1">Manage and track relief goods delivery to affected barangays.</p>
          </div>
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800">{responderName}</div>
              <div className="text-xs font-medium text-slate-500">Active Unit</div>
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

        {/* View Toggle Tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-200">
           <button 
             onClick={() => setActiveTab('active')} 
             className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'active' ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
           >
              <Truck className="w-4 h-4" /> Active Missions
           </button>
           <button 
             onClick={() => setActiveTab('delivered')} 
             className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'delivered' ? 'bg-white text-emerald-700 shadow-sm border border-slate-200/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
           >
              <ClipboardList className="w-4 h-4" /> Delivered Logs
           </button>
        </div>

        {/* Dynamic Content Based on Tab */}
        <div className="flex flex-col space-y-4">
          {activeTab === 'active' ? (
            <>
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
                    There are no active relief dispatch missions assigned to {responderName} right now.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" /> Relief Delivered Logs
                </h3>
                <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                  {completedDeliveries.length} Total
                </span>
              </div>
              
              {completedDeliveries.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {completedDeliveries.map((log) => (
                    <div key={log.delivered_logs_id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-base">Brgy. {log.barangay}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono border border-slate-200">{log.mission_id}</span>
                          </div>
                          <p className="text-sm text-slate-600 mt-0.5">
                            Delivered <span className="font-semibold text-slate-800">{log.quantity} x {log.type}</span>
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1">Signed by: <span className="font-semibold text-slate-700">{log.signatory_name}</span></p>
                        </div>
                      </div>
                      
                      <div className="flex flex-col md:items-end gap-1">
                         <div className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> 
                            {new Date(log.timestamp).toLocaleString()}
                         </div>
                         <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                            Handled by {log.taskforce_assigned}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <ClipboardList className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-700">No Delivery Logs Yet</h3>
                  <p className="text-sm text-slate-500 mt-1">Completed relief missions will appear here.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ResponseUnitLayout>
  );
}

