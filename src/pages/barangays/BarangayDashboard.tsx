import React, { useState } from 'react';
import { Home, Users, FileText, Send, LogOut, LayoutDashboard, Plus, Minus, QrCode, CheckCircle, AlertCircle, WifiOff, Scan, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../data/MockDataContext';

export default function BrgyAdminDashboard() {
  const navigate = useNavigate();
  const { isOffline, setIsOffline, updateEvacuationOccupancy, evacuationCenters, actionQueue, syncQueue, addAuditLog } = useMockData();
  
  // RLS Simulation - Locked to specific barangay
  const ASSIGNED_BARANGAY = "Brgy. Commonwealth";
  const ec = evacuationCenters.find(e => e.name === 'Commonwealth Elem. School') || evacuationCenters[0];

  const [showToast, setShowToast] = useState(false);
  
  // Relief Scanner State
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{status: 'success' | 'error' | 'pending', msg: string} | null>(null);

  const handleSitRepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    addAuditLog('Submit SitRep', `Barangay Admin (${ASSIGNED_BARANGAY})`, 'Submitted daily situation report.');
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput) return;

    // Simulate Citizen Registry API (returning minimal data per RA 10173)
    const isValid = scanInput.startsWith('QC-'); // Mock logic
    const householdSize = isValid ? Math.floor(Math.random() * 5) + 1 : 0;

    if (!isValid) {
        setScanResult({ status: 'error', msg: 'Invalid QCitizen ID' });
    } else {
        if (isOffline) {
            setScanResult({ status: 'pending', msg: `Saved to Offline Queue (Household size: ${householdSize})` });
        } else {
            setScanResult({ status: 'success', msg: `Verified & Claimed (Household size: ${householdSize})` });
        }
        addAuditLog('Relief Distribution', `Barangay Admin (${ASSIGNED_BARANGAY})`, `Processed relief for ID ${scanInput} ${isOffline ? '(Queued)' : '(Synced)'}`);
    }
    setScanInput('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <Home className="w-8 h-8 text-blue-500" />
          <div>
            <h1 className="font-bold text-xl leading-tight">Brgy Admin</h1>
            <span className="text-[10px] text-slate-400 font-medium bg-slate-800 px-2 py-0.5 rounded-full mt-1 inline-block">RLS Active</span>
          </div>
        </div>
        <div className="p-4 flex-1">
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg text-blue-400 mb-2">
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="px-3 py-2 text-xs text-slate-500 font-medium">
            LOCKED TO:<br/>
            <span className="text-white text-sm">{ASSIGNED_BARANGAY}</span>
          </div>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button onClick={() => navigate('/login')} className="flex items-center gap-3 p-3 w-full text-left text-slate-400 hover:text-white transition-colors cursor-pointer">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Barangay Operations Center</h2>
              <p className="text-slate-500">Manage local evacuation, relief goods, and situation reports.</p>
            </div>
            
            {/* Global Offline Toggle (For testing) */}
            <div className="flex items-center gap-4">
                {actionQueue.length > 0 && (
                    <button onClick={syncQueue} className="text-xs bg-amber-100 text-amber-700 font-bold px-3 py-1.5 rounded-full border border-amber-200">
                        Sync {actionQueue.length} Pending Actions
                    </button>
                )}
                <button 
                    onClick={() => setIsOffline(!isOffline)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors ${isOffline ? 'bg-red-500 text-white shadow-inner' : 'bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50'}`}
                >
                    <WifiOff className="w-4 h-4" />
                    {isOffline ? 'Offline Mode (Local Queueing)' : 'Online Mode'}
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Relief Goods Scanner */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden lg:col-span-2">
            <div className="p-5 border-b border-slate-200 bg-emerald-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-700" />
                    <h3 className="font-bold text-emerald-900">Relief Goods Distribution (QR Scanner)</h3>
                </div>
                {isOffline && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold flex items-center gap-1"><WifiOff className="w-3 h-3"/> Offline Mode Active</span>}
            </div>
            <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                    <form onSubmit={handleScan} className="flex gap-2">
                        <div className="relative flex-1">
                            <Scan className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                value={scanInput}
                                onChange={e => setScanInput(e.target.value)}
                                placeholder="Scan or enter QCitizen ID (e.g. QC-12345)" 
                                className="w-full border border-slate-300 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                        <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-bold rounded-lg transition-colors">
                            Verify
                        </button>
                    </form>
                    <p className="text-xs text-slate-500 mt-2">
                        *API enforces Data Privacy (RA 10173). Only binary validation and household size are returned. Full profiles remain secured in Citizen Registry.
                    </p>
                </div>

                {/* Scan Result */}
                <div className="w-full md:w-72 shrink-0">
                    {scanResult ? (
                        <div className={`p-4 rounded-xl border flex gap-3 ${
                            scanResult.status === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 
                            scanResult.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
                            'bg-red-50 border-red-200 text-red-800'
                        }`}>
                            {scanResult.status === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : 
                             scanResult.status === 'pending' ? <Clock className="w-5 h-5 shrink-0" /> : 
                             <AlertCircle className="w-5 h-5 shrink-0" />}
                            <div>
                                <p className="font-bold text-sm mb-1">
                                    {scanResult.status === 'success' ? 'Verification Passed' : 
                                     scanResult.status === 'pending' ? 'Queued Locally' : 
                                     'Verification Failed'}
                                </p>
                                <p className="text-xs opacity-90">{scanResult.msg}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 p-4 text-sm text-center">
                            Awaiting QR Scan...
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Evacuation Capacity Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-fit">
            <div className="p-5 border-b border-slate-200 bg-blue-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-900">Evacuation Center Capacity</h3>
              </div>
            </div>
            <div className="p-8 text-center flex flex-col items-center justify-center relative">
              <p className="text-slate-500 font-medium mb-4">Current Occupants</p>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => updateEvacuationOccupancy(ec.id, -1)}
                  className="w-14 h-14 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                >
                  <Minus className="w-6 h-6" />
                </button>
                
                <div className="text-6xl font-black text-slate-800 w-32 text-center tabular-nums">
                  {ec.currentOccupancy}
                </div>
                
                <button 
                  onClick={() => updateEvacuationOccupancy(ec.id, 1)}
                  className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 w-full text-sm text-slate-500 flex justify-between">
                <span className="font-medium text-slate-700">{ec.name}</span>
                <span>Max: {ec.capacity}</span>
              </div>
            </div>
          </div>

          {/* SitRep Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-700" />
              <h3 className="font-bold text-slate-800">Situation Report (SitRep)</h3>
            </div>
            <form onSubmit={handleSitRepSubmit} className="p-6 space-y-5">
              {showToast && (
                <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in-down">
                   <Send className="w-4 h-4" /> SitRep Submitted Successfully!
                </div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">General Situation</label>
                <textarea 
                  rows={3}
                  required
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  placeholder="Describe the current situation in the barangay..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Affected Families</label>
                  <input type="number" className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue={0} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Casualties</label>
                  <input type="number" className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue={0} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Urgent Needs</label>
                <input 
                  type="text" 
                  className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g. Relief Goods, Medical Supplies"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-5 h-5" />
                Submit to QC EOC
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
