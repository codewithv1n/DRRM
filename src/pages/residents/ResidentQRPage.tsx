import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  User, 
  Download, 
  Printer, 
  ShieldCheck, 
  ChevronDown, 
  MapPin, 
  Users, 
  Package, 
  Copy, 
  Check, 
  Lock, 
  HelpCircle, 
  Info,
  Calendar
} from 'lucide-react';
import ResidentLayout from '../../components/layout/ResidentLayout';

type ActiveTheme = 'sunset' | 'emerald' | 'midnight';

export default function ResidentQrId() {
  const [theme, setTheme] = useState<ActiveTheme>('sunset');
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
  const qrString = 'QC-CITIZEN-0012345';

  const handleCopyToken = () => {
    navigator.clipboard.writeText(qrString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const svgEl = document.getElementById('qr-code-svg');
    if (!svgEl) return;

    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1100;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw Background Gradient
    if (theme === 'sunset') {
      const grad = ctx.createLinearGradient(0, 0, 0, 1100);
      grad.addColorStop(0, '#f97316'); 
      grad.addColorStop(0.5, '#ea580c'); 
      grad.addColorStop(1, '#b45309'); 
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 1100);
    } else if (theme === 'emerald') {
      const grad = ctx.createLinearGradient(0, 0, 0, 1100);
      grad.addColorStop(0, '#10b981'); 
      grad.addColorStop(0.5, '#059669'); 
      grad.addColorStop(1, '#0f766e'); 
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 1100);
    } else {
      
      ctx.fillStyle = '#0f172a'; 
      ctx.fillRect(0, 0, 800, 1100);
      
      
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 40; x < 800; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 1100);
        ctx.stroke();
      }
      for (let y = 40; y < 1100; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
      }

     
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, 740, 1040);
    }

    // 2. Draw Header Pass Details
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GOVSERVE DIGITAL RESIDENT PASS', 400, 100);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.font = '20px sans-serif';
    ctx.fillText('Quezon City Emergency Relief Access', 400, 140);

    // 3. User Avatar Frame/Circle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(400, 250, 60, 0, Math.PI * 2);
    ctx.fill();

    // Simulating user icon path inside avatar circle
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(400, 230, 24, 0, Math.PI * 2); // Head
    ctx.fill();
    ctx.beginPath();
    ctx.arc(400, 300, 45, Math.PI, Math.PI * 2); // Shoulders
    ctx.fill();

    // 4. Resident Name & Info
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 46px sans-serif';
    ctx.fillText('Taro Sakamoto', 400, 360);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '22px sans-serif';
    ctx.fillText('Brgy. Balingasa • ID: QC-RES-88390', 400, 400);

    // 5. Verified ID Badge
    ctx.fillStyle = '#ffffff';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    const bx = 280, by = 430, bw = 240, bh = 48, br = 12;
    ctx.beginPath();
    ctx.moveTo(bx + br, by);
    ctx.lineTo(bx + bw - br, by);
    ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + br);
    ctx.lineTo(bx + bw, by + bh - br);
    ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - br, by + bh);
    ctx.lineTo(bx + br, by + bh);
    ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - br);
    ctx.lineTo(bx, by + br);
    ctx.quadraticCurveTo(bx, by, bx + br, by);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('✓ VERIFIED ID', 400, 462);

    // 6. Draw White Base Card for QR Code
    ctx.fillStyle = '#ffffff';
    const rx = 180, ry = 510, rw = 440, rh = 440, radius = 24;
    ctx.beginPath();
    ctx.moveTo(rx + radius, ry);
    ctx.lineTo(rx + rw - radius, ry);
    ctx.quadraticCurveTo(rx + rw, ry, rx + rw, ry + radius);
    ctx.lineTo(rx + rw, ry + rh - radius);
    ctx.quadraticCurveTo(rx + rw, ry + rh, rx + rw - radius, ry + rh);
    ctx.lineTo(rx + radius, ry + rh);
    ctx.quadraticCurveTo(rx, ry + rh, rx, ry + rh - radius);
    ctx.lineTo(rx, ry + radius);
    ctx.quadraticCurveTo(rx, ry, rx + radius, ry);
    ctx.closePath();
    ctx.fill();

    // 7. Draw QR Code
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = window.URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 230, 560, 340, 340);

      // 8. Footer token string & warnings
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`CITIZEN ID TOKEN:`, 400, 990);
      
      ctx.font = '22px monospace';
      ctx.fillStyle = '#fef08a'; // yellow-200
      ctx.fillText(qrString, 400, 1025);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.fillText('Save this image. QR Codes can be scanned offline at relief hubs.', 400, 1065);

      // 9. Initiate Download
      const link = document.createElement('a');
      link.download = `GOVSERVE_ResidentPass_Taro.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      window.URL.revokeObjectURL(blobURL);
    };
    img.src = blobURL;
  };

  const handlePrint = () => {
    window.print();
  };

  const faqs = [
    {
      question: "How does this QR code protect my claim?",
      answer: "The QR code contains a secure, unique identifier matched with your Quezon City resident credentials. When scanned at active distribution hubs, the system cross-checks this ID in real time (or via offline ledger sync) to prevent double-claiming and verify household eligibility."
    },
    {
      question: "Can I claim relief goods if my phone is offline?",
      answer: "Yes! You can present this screen even without active internet. Additionally, you can pre-download the Digital Pass as an image, and it will still be valid for scanning at centers."
    },
    {
      question: "What should I do if the scanner fails to read my QR code?",
      answer: "Ensure your screen brightness is set to high. If scanning still fails, you can tap to copy the numerical Security Code text underneath the QR code and present it to the Barangay Official for manual ledger encoding."
    },
    {
      question: "Can other family members use my QR ID to claim?",
      answer: "No, this QR ID is matched with your specific profile photo and Quezon City verification status. Only the Head of Household or officially registered secondary claimants listed on the pass can use it at the hub."
    }
  ];

  const getThemeClasses = () => {
    switch (theme) {
      case 'sunset':
        return {
          card: 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-700 text-white shadow-[0_15px_40px_rgba(234,88,12,0.22)]',
          badge: 'bg-white/20 text-orange-100 border border-orange-400/40',
          avatar: 'bg-orange-400/50 border-orange-300/40',
          tokenBg: 'bg-orange-950/30 border border-orange-400/20 text-yellow-200'
        };
      case 'emerald':
        return {
          card: 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white shadow-[0_15px_40px_rgba(16,185,129,0.22)]',
          badge: 'bg-white/20 text-emerald-100 border border-emerald-400/40',
          avatar: 'bg-emerald-400/50 border-emerald-300/40',
          tokenBg: 'bg-emerald-950/30 border border-emerald-400/20 text-teal-100'
        };
      case 'midnight':
        return {
          card: 'bg-slate-900 border border-slate-800 text-slate-100 shadow-[0_15px_40px_rgba(15,23,42,0.6)] relative overflow-hidden',
          badge: 'bg-slate-800 text-orange-400 border border-slate-700',
          avatar: 'bg-slate-800 border-slate-700 shadow-inner',
          tokenBg: 'bg-slate-950 border border-slate-800 text-orange-400 font-bold'
        };
    }
  };

  const themeClasses = getThemeClasses();

  return (
    <ResidentLayout>
      <div className="animate-fade-in print:p-0">
        
        {/* Page Title - Hidden during print */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-display">My Digital QR Pass</h2>
            <p className="text-slate-500 mt-1">Present this QR code at active distribution points to claim relief kits.</p>
          </div>
          
        </div>

        {/* Print Layout Header (Only visible on paper) */}
        <div className="hidden print:block text-center mb-8 border-b-2 border-slate-300 pb-4">
          <h1 className="text-3xl font-bold text-slate-950">GOVSERVE DRRM CITIZEN PORTAL</h1>
          <p className="text-slate-600 text-sm mt-1">Quezon City Relief Distribution Digital ID Pass</p>
        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: QR Code Card & Themes & Actions */}
          <div className="lg:col-span-5 flex flex-col items-center">
            
            {/* The Digital QR ID Card Box */}
            <div className={`w-full max-w-sm rounded-4xl p-6 text-center transition-all duration-500 relative ${themeClasses.card}`}>
              
              {/* Optional Neon / Grid Accent for Midnight Style */}
              {theme === 'midnight' && (
                <div className="absolute inset-0 bg-[radial-gradient(rgba(249,115,22,0.15)_1.5px,transparent_1.5px)] bg-size-[16px_16px] pointer-events-none opacity-40 rounded-4xl" />
              )}

              {/* Verified Badge */}
              <div className="flex justify-center mb-5">
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${themeClasses.badge}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Resident
                </span>
              </div>

              {/* Avatar Image Frame */}
              <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 shadow-md overflow-hidden transition-all duration-300 ${themeClasses.avatar}`}>
                <User className="w-12 h-12 opacity-80" />
              </div>

              <h3 className="text-2xl font-bold font-display tracking-tight leading-none mb-1 text-white">Taro Sakamoto</h3>
              <p className="text-xs opacity-85 uppercase tracking-widest font-semibold mb-6">Brgy. Balingasa • Head of Family</p>

              {/* QR Code Container */}
              <div className="bg-white p-5 rounded-3xl inline-flex flex-col items-center shadow-lg border border-white/10 mx-auto relative group">
                <QRCodeSVG 
                  value={qrString} 
                  size={200} 
                  level="H" 
                  includeMargin={true} 
                  id="qr-code-svg" 
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Token Copyable Text Field */}
              <div className={`flex items-center justify-between rounded-2xl px-4 py-3 mt-6 cursor-pointer hover:opacity-95 transition-opacity ${themeClasses.tokenBg}`} onClick={handleCopyToken}>
                <span className="text-xs font-mono tracking-wider font-semibold truncate select-all">{qrString}</span>
                <button className="p-1 hover:bg-white/10 rounded-lg shrink-0" title="Copy Security Token">
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

            </div>

            {/* Theme Customizer Switcher - Hidden during print */}
            <div className="w-full max-w-sm mt-6 bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 print:hidden">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-3 text-center">Customize Card Style</span>
              <div className="grid grid-cols-3 gap-2">
                <button 
                  onClick={() => setTheme('sunset')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 cursor-pointer transition-all ${theme === 'sunset' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-sm' : 'border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                >
                  <div className="w-5 h-5 rounded-full bg-linear-to-r from-orange-500 to-amber-500 shadow-inner" />
                  Sunset Orange
                </button>
                <button 
                  onClick={() => setTheme('emerald')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 cursor-pointer transition-all ${theme === 'emerald' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                >
                  <div className="w-5 h-5 rounded-full bg-linear-to-r from-emerald-500 to-teal-500 shadow-inner" />
                  Emerald Safe
                </button>
                <button 
                  onClick={() => setTheme('midnight')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold gap-1.5 cursor-pointer transition-all ${theme === 'midnight' ? 'border-slate-800 bg-slate-900 text-slate-100 shadow-sm' : 'border-slate-100 hover:bg-slate-50 text-slate-600'}`}
                >
                  <div className="w-5 h-5 rounded-full bg-slate-950 border border-slate-700" />
                  Midnight Tech
                </button>
              </div>
            </div>

            {/* Action Bar - Hidden during print */}
            <div className="w-full max-w-sm mt-4 grid grid-cols-2 gap-3 print:hidden">
              <button 
                onClick={handleDownload}
                className="flex flex-col items-center gap-1 p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 hover:text-slate-900 transition-colors shadow-sm cursor-pointer w-full"
              >
                <Download className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Save Pass</span>
              </button>
              <button 
                onClick={handlePrint}
                className="flex flex-col items-center gap-1 p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 hover:text-slate-900 transition-colors shadow-sm cursor-pointer w-full"
              >
                <Printer className="w-5 h-5 text-indigo-600" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Print PDF</span>
              </button>
            </div>

          </div>

          {/* Right Column: Resident Info, Relief Status, FAQs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Resident Pass Metadata Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-slate-800 font-display">Resident ID Credentials</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="bg-white p-2 rounded-xl border border-slate-100 text-primary">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Assigned Relief Hub</span>
                    <span className="text-sm font-bold text-slate-800">Balingasa Covered Court</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="bg-white p-2 rounded-xl border border-slate-100 text-emerald-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Registered Dependents</span>
                    <span className="text-sm font-bold text-slate-800">4 Family Members</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="bg-white p-2 rounded-xl border border-slate-100 text-indigo-600">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Assigned Package</span>
                    <span className="text-sm font-bold text-slate-800">Family Emergency Kit</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                  <div className="bg-white p-2 rounded-xl border border-slate-100 text-amber-600">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Last Sync Status</span>
                    <span className="text-sm font-bold text-slate-800">Today, 01:09 PM</span>
                  </div>
                </div>
              </div>

              {/* Package Eligibility Checklist */}
              <div className="mt-6">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-3">Relief Package Eligibility</span>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3.5 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500 text-white rounded-full p-0.5"><Check className="w-4.5 h-4.5" /></div>
                      <div>
                        <span className="text-sm font-bold text-slate-800 block">Family Food Pack</span>
                        <span className="text-xs text-slate-500">Includes 5kg rice, canned foods, coffee</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full uppercase tracking-wider">Eligible</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/60 rounded-2xl opacity-75">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-300 text-white rounded-full p-0.5"><Check className="w-4.5 h-4.5" /></div>
                      <div>
                        <span className="text-sm font-bold text-slate-600 block">Family Hygiene Kit A</span>
                        <span className="text-xs text-slate-500">Soaps, toothbrush, hygiene essentials</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold px-2.5 py-1 bg-slate-200 text-slate-600 rounded-full uppercase tracking-wider">Already Claimed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Collapsible FAQ Accordion - Hidden during print */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 print:hidden">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-800 font-display">FAQ & claiming guidelines</h3>
              </div>

              <div className="divide-y divide-slate-100">
                {faqs.map((faq, index) => {
                  const isExpanded = expandedFaq === index;
                  return (
                    <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                      <button 
                        onClick={() => setExpandedFaq(isExpanded ? null : index)}
                        className="w-full flex items-center justify-between text-left font-bold text-slate-700 hover:text-slate-900 transition-colors gap-3 py-1 cursor-pointer"
                      >
                        <span className="text-sm">{faq.question}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-40 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-xs text-slate-500 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security note details */}
            <div className="bg-amber-50/50 border border-amber-100/60 rounded-3xl p-5 flex items-start gap-3.5">
              <div className="bg-amber-100/70 p-2 rounded-xl text-amber-700 mt-0.5 shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-amber-900 text-sm mb-0.5">Secure QR Token Protocol</h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Our system coordinates with barangay databases using end-to-end local time tokenization. If you're offline, scanners verify the cryptographic payload against pre-synced local hub datasets to complete relief distribution safely.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </ResidentLayout>
  );
}