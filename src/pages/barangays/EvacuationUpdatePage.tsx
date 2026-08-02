import { useState, useEffect, } from 'react';
import type { FormEvent } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Users, Package, HeartPulse, AlertTriangle, Layers, Scan, CheckCircle } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import BarangayLayout from '../../components/layout/BarangayLayout';
import { ASSIGNED_BARANGAY } from './BarangayDashboard';

export default function EvacuationPanel() {
  const { evacuationCenters, updateEvacuationOccupancy, addAuditLog } = useMockData();
  const ec = evacuationCenters.find(e => e.name === 'Balingasa High School') || evacuationCenters[0];
  
  
  const [activeNeeds, setActiveNeeds] = useState<string[]>([]);
  
  const [scanInput, setScanInput] = useState('');
  const [cameraResult, setCameraResult] = useState('');
  const [recentScans, setRecentScans] = useState<{id: string, time: Date, householdSize: number}[]>([]);
  const [scanError, setScanError] = useState<string | null>(null);

  const toggleNeed = (need: string) => {
    setActiveNeeds(prev => prev.includes(need) ? prev.filter(n => n !== need) : [...prev, need]);
    addAuditLog('Evacuation Needs', `Barangay Admin (${ASSIGNED_BARANGAY})`, `Updated evacuation center urgent needs.`);
  };

  useEffect(() => {
    let isMounted = true;
    const html5QrCode = new Html5Qrcode("evacuation-reader");

    const startPromise = html5QrCode.start(
      { facingMode: "environment" },
      { fps: 5, qrbox: { width: 380, height: 240 } }, 
      (decodedText) => {
        if (isMounted) {
           if (typeof decodedText === 'string' && decodedText.startsWith('QC-')) {
             setCameraResult(decodedText);
           }
        }
      },
      () => {}
    );

    startPromise.catch(err => {
      if (isMounted) setScanError(err?.message || "Failed to start camera");
    });

    return () => {
      isMounted = false;
      startPromise.then(() => {
        html5QrCode.stop().then(() => html5QrCode.clear()).catch(() => {});
      }).catch(() => {});
    };
  }, []);

  
  useEffect(() => {
    if (cameraResult && cameraResult.startsWith('QC-')) {
       processScan(cameraResult);
       setCameraResult(''); 
    }
  }, [cameraResult]);

  const processScan = (idString: string) => {
    const householdSize = Math.floor(Math.random() * 5) + 1;
    
    updateEvacuationOccupancy(ec.id, householdSize);
    
    setRecentScans(prev => [{id: idString, time: new Date(), householdSize}, ...prev].slice(0, 5));
    addAuditLog('Evacuation Scan', `Barangay Admin (${ASSIGNED_BARANGAY})`, `Scanned ${householdSize} pax (ID: ${idString}).`);
  };

  const handleScan = (e: FormEvent) => {
    e.preventDefault();
    if (!scanInput) return;
    
    const isValid = scanInput.startsWith('QC-'); 
    if (isValid) {
      processScan(scanInput);
    }
    setScanInput('');
  };

  const occupancyPercentage = Math.min(100, Math.round((ec.currentOccupancy / ec.capacity) * 100));

  return (
    <BarangayLayout>
    <div className="animate-fade-in space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Evacuation Scanner</h2>
          <p className="text-slate-500">Scan QCitizen IDs to enter {ASSIGNED_BARANGAY} centers.</p>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Scanner Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 bg-blue-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-blue-700" />
                <h3 className="font-bold text-blue-900">ID Scanner</h3>
              </div>
            </div>
            
            <div className="p-6">

              {/* Camera Scanner Container */}
              <div className="w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 mb-4 h-87.5 relative flex items-center justify-center">
                {scanError && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center text-red-600 bg-red-50 font-medium">
                    <AlertTriangle className="w-8 h-8 mb-2 text-red-500" />
                    <p>Camera Error: {scanError}</p>
                    <p className="text-sm mt-2 text-red-400 font-normal">Please allow camera permissions or use a device with a camera.</p>
                  </div>
                )}
                <div id="evacuation-reader" className="w-full"></div>
              </div>

              <div className="relative flex items-center mb-4">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">or manual entry</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleScan} className="flex gap-2">
                  <div className="relative flex-1">
                      <Scan className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                          type="text" 
                          value={scanInput}
                          onChange={e => setScanInput(e.target.value)}
                          placeholder="Scan or enter QCitizen ID (e.g. QC-12345)" 
                          className="w-full border border-slate-300 rounded-lg py-3.5 pl-10 pr-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                  </div>
                  <button type="submit" className="px-6 font-bold rounded-lg transition-colors cursor-pointer text-white bg-blue-600 hover:bg-blue-700">
                      Scan
                  </button>
              </form>
            </div>
          </div>

          {/* Urgent Needs Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <p className="text-sm font-bold text-slate-800 mb-4 text-left">Urgent Needs & Status Signal</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => toggleNeed('food')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors shadow-sm cursor-pointer ${activeNeeds.includes('food') ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Package className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold text-left leading-tight">Food & Water</span>
              </button>
              <button 
                onClick={() => toggleNeed('medical')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors shadow-sm cursor-pointer ${activeNeeds.includes('medical') ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <HeartPulse className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold text-left leading-tight">Medical Attention</span>
              </button>
              <button 
                onClick={() => toggleNeed('full')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors shadow-sm cursor-pointer ${activeNeeds.includes('full') ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold text-left leading-tight">Full Capacity</span>
              </button>
              <button 
                onClick={() => toggleNeed('blankets')}
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors shadow-sm cursor-pointer ${activeNeeds.includes('blankets') ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <Layers className="w-5 h-5 shrink-0" />
                <span className="text-sm font-bold text-left leading-tight">Beddings & Tents</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Capacity Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Live Capacity Overview
            </h3>
            <p className="text-slate-500 font-medium mb-2">{ec.name}</p>
            
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black text-slate-800 tabular-nums">{ec.currentOccupancy}</span>
              <span className="text-slate-500 mb-1 font-medium">/ {ec.capacity} pax</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 mb-2 overflow-hidden">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  occupancyPercentage > 90 ? 'bg-red-500' : 
                  occupancyPercentage > 75 ? 'bg-orange-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${occupancyPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-right text-slate-500 font-bold">{occupancyPercentage}% Full</p>
          </div>

          {/* Recent Scans */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Recent Scans</h3>
            </div>
            <div className="p-2">
              {recentScans.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentScans.map((scan, i) => (
                    <div key={i} className="p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                          </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{scan.id}</p>
                          <p className="text-xs text-slate-500">
                            {scan.time.toLocaleTimeString()} • {scan.householdSize} pax
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700">
                        SCANNED
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-sm">
                  No recent scans.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </BarangayLayout>
  );
}
