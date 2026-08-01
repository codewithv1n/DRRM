import { useState } from 'react';
import type { FormEvent } from 'react';
import { QrCode, WifiOff, Scan, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import { ASSIGNED_BARANGAY } from './BarangayPortal'; // IDE cache invalidation

export default function QrScannerPanel() {
  const { isOffline, addAuditLog } = useMockData();
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{status: 'success' | 'error' | 'pending', msg: string} | null>(null);
  const [inventory, setInventory] = useState(500); // Inventory Counter

  const handleScan = (e: FormEvent) => {
    e.preventDefault();
    if (!scanInput) return;

    const isValid = scanInput.startsWith('QC-'); 
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
        addAuditLog('Relief Distribution', `Barangay Admin (${ASSIGNED_BARANGAY})`, `Processed relief for ID ${scanInput} ${isOffline ? '(Queued)' : '(Synced)'}`);
    }
    setScanInput('');
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">QR Scanner</h2>
          <p className="text-slate-500">Verify relief stubs and citizen IDs</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 px-5 py-2 rounded-xl text-center shadow-sm">
          <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-0.5">Available Inventory</p>
          <p className="text-2xl font-black text-blue-700 font-display">{inventory}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl">
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
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 font-bold rounded-lg transition-colors cursor-pointer">
                        Verify
                    </button>
                </form>
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
                        Awaiting QR Scan...
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
