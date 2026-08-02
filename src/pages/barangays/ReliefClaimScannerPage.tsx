import { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, WifiOff, Scan, CheckCircle, Clock, AlertCircle, AlertTriangle, Package } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import BarangayLayout from '../../components/layout/BarangayLayout';
import { ASSIGNED_BARANGAY } from './BarangayDashboard'; 

export default function QrScannerPanel() {
  const { isOffline, addAuditLog } = useMockData();
  const [scanInput, setScanInput] = useState('');
  const [cameraResult, setCameraResult] = useState('');
  const [scanResult, setScanResult] = useState<{status: 'success' | 'error' | 'pending', msg: string} | null>(null);
  const [inventory, setInventory] = useState(500); // Inventory Counter
  const [scanError, setScanError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const html5QrCode = new Html5Qrcode("relief-reader");

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

  const processScan = (idString: string) => {
    const isValid = idString.startsWith('QC-'); 
    const householdSize = isValid ? Math.floor(Math.random() * 5) + 1 : 0;

    if (!isValid) {
        setScanResult({ status: 'error', msg: 'Invalid QCitizen ID' });
    } else {
        if (isOffline) {
            setScanResult({ status: 'pending', msg: `Saved to Offline Queue (Household size: ${householdSize})` });
        } else {
            setScanResult({ status: 'success', msg: `Verified & Claimed (Household size: ${householdSize})` });
        }
        setInventory(prev => prev - 1);
        addAuditLog('Relief Distribution', `Barangay Admin (${ASSIGNED_BARANGAY})`, `Processed relief for ID ${idString} ${isOffline ? '(Queued)' : '(Synced)'}`);
    }
    setScanInput('');
  };

  useEffect(() => {
    if (cameraResult && cameraResult.startsWith('QC-')) {
       processScan(cameraResult);
       setCameraResult('');
    }
  }, [cameraResult]);

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (scanInput && scanInput.startsWith('QC-')) {
        processScan(scanInput);
      }
    }
  };


  const [isRequesting, setIsRequesting] = useState(false);
  const handleRequestResupply = () => {
    setIsRequesting(true);
    addAuditLog('Relief Resupply', `Barangay Admin (${ASSIGNED_BARANGAY})`, 'Requested additional relief goods from main department.');
    setTimeout(() => {
      setIsRequesting(false);
      alert('Resupply request sent to the main department successfully!');
    }, 1500);
  };

  return (
    <BarangayLayout>
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relief Claim Scanner</h2>
          <p className="text-slate-500">Verify relief stubs in citizen IDs</p>
        </div>
        <div className="flex items-center gap-4">
          <button
             onClick={handleRequestResupply}
             disabled={isRequesting}
             className="bg-orange-100 hover:bg-orange-200 text-orange-700 px-4 py-2.5 rounded-xl font-bold transition-colors text-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
             <Package className="w-4 h-4" />
             {isRequesting ? 'Sending Request...' : 'Request Resupply'}
          </button>
          <div className="bg-blue-50 border border-blue-200 px-5 py-2 rounded-xl text-center shadow-sm">
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-0.5">Available Inventory</p>
            <p className="text-2xl font-black text-blue-700 font-display">{inventory}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl">
        <div className="p-5 border-b border-slate-200 bg-orange-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-orange-900">Relief Goods Distribution (QR Scanner)</h3>
            </div>
            {isOffline && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold flex items-center gap-1"><WifiOff className="w-3 h-3"/> Offline Mode Active</span>}
        </div>
        <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 w-full">
                {/* Camera Scanner Container */}
                <div className="w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-200 mb-4 h-87.5 relative flex items-center justify-center">
                  {scanError && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 text-center text-red-600 bg-red-50 font-medium">
                      <AlertTriangle className="w-8 h-8 mb-2 text-red-500" />
                      <p>Camera Error: {scanError}</p>
                      <p className="text-sm mt-2 text-red-400 font-normal">Please allow camera permissions or use a device with a camera.</p>
                    </div>
                  )}
                  <div id="relief-reader" className="w-full"></div>
                </div>

                <div className="relative flex items-center mb-4">
                  <div className="grow border-t border-slate-200"></div>
                  <span className="shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-widest">or manual entry</span>
                  <div className="grow border-t border-slate-200"></div>
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Scan className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                        <input 
                            type="text" 
                            value={scanInput}
                            onChange={e => setScanInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Scan or enter QCitizen ID (e.g. QC-12345) and press Enter" 
                            className="w-full border border-slate-300 rounded-lg py-3 pl-10 pr-3 focus:ring-2 focus:ring-orange-400 outline-none"
                        />
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                    *API enforces Data Privacy (RA 10173). Only binary validation and household size are returned.
                </p>
            </div>

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
                    <div className="h-full border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 p-4 text-sm text-center min-h-20">
                        Awaiting ID Scan...
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
    </BarangayLayout>
  );
}
