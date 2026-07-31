import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { User } from 'lucide-react';
import ResidentLayout from '../../components/layout/ResidentLayout';

export default function ResidentQrId() {
  const [qrString, setQrString] = useState('QC-CITIZEN-0012345-' + Date.now());
  const [qrProgress, setQrProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setQrProgress(prev => {
        if (prev <= 0) {
          setQrString('QC-CITIZEN-0012345-' + Date.now());
          return 100;
        }
        return prev - (100 / 15); // Rotate every 15 seconds for demo
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ResidentLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 font-display">My Digital QR Code</h2>
          <p className="text-slate-500 mt-1">Present this QR code at distribution centers to claim relief goods.</p>
        </div>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden flex flex-col items-center p-8">
            <div className="w-24 h-24 bg-slate-50 rounded-full mb-4 flex items-center justify-center border border-slate-100 shadow-inner">
              <User className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Juan Dela Cruz</h3>
            <p className="text-slate-500 text-sm mb-8">Brgy. Commonwealth</p>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
              <QRCodeSVG value={qrString} size={200} level="H" includeMargin={true} />
            </div>
            
            <div className="w-full mt-4">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase mb-1">
                    <span>Security code rotating in</span>
                    <span>{Math.ceil((qrProgress / 100) * 15)}s</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-1000 ease-linear" style={{ width: `${qrProgress}%` }}></div>
                </div>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 mt-4">
              <p className="text-xs text-slate-500 font-mono font-medium tracking-wider">{qrString}</p>
            </div>
            <p className="text-sm text-center text-slate-400 mt-6 leading-relaxed">
              Show this code to the Barangay Admin when claiming your relief goods.
            </p>
          </div>
        </div>
      </div>
    </ResidentLayout>
  );
}