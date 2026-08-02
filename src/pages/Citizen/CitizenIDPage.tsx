import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  User, 
  Download, 
  ShieldCheck, 
  Shield,
  ChevronDown, 
  MapPin,  
  Package, 
  Copy, 
  Check, 
  Lock, 
  HelpCircle, 
  Info,
  Calendar
} from 'lucide-react';
import ResidentLayout from '../../components/layout/CitizenLayout';


export default function ResidentQrId() {
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
    canvas.width = 1012; 
    canvas.height = 638;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Draw White Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1012, 638);
    
    // Watermark
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)';
    ctx.font = 'bold 200px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QUEZON CITY', 506, 400);

    // 2. Draw Header Banner
    ctx.fillStyle = '#f97316'; // orange-500
    ctx.fillRect(0, 0, 1012, 120);

    // Header Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('QUEZON CITY', 120, 60);
    
    ctx.fillStyle = '#fde047'; // yellow-300
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('REPUBLIKA NG PILIPINAS', 120, 90);

    ctx.textAlign = 'right';
    ctx.font = 'italic bold 48px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('QCitizen', 840, 75);
    ctx.fillStyle = '#facc15'; // yellow-400
    ctx.fillText('ID', 900, 75);

    // 3. User Photo Area
    ctx.fillStyle = '#e2e8f0'; // slate-200
    ctx.fillRect(50, 160, 225, 300);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4;
    ctx.strokeRect(50, 160, 225, 300);


    // 4. Resident Info
    ctx.textAlign = 'left';
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('QCitizen ID No.', 320, 190);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px monospace';
    ctx.fillText(qrString, 320, 225);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('NAME', 320, 280);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('SAKAMOTO, TARO', 320, 315);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('ADDRESS', 320, 370);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('123 BONIFACIO ST., BRGY. BALINGASA, QUEZON CITY', 320, 400);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('DATE OF BIRTH', 320, 460);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('10/24/1985', 320, 490);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText('BLOOD TYPE', 550, 460);
    ctx.fillStyle = '#dc2626';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('O+', 550, 490);

    ctx.beginPath();
    ctx.moveTo(320, 540);
    ctx.lineTo(960, 540);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('EMERGENCY CONTACT', 320, 575);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('AOI SAKAMOTO (WIFE) - 09123456789', 320, 605);

    // 5. Draw QR Code
    const svgString = new XMLSerializer().serializeToString(svgEl);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const blobURL = window.URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 760, 160, 200, 200);

      // 6. Initiate Download
      const link = document.createElement('a');
      link.download = `QCitizen_ID_Taro.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      window.URL.revokeObjectURL(blobURL);
    };
    img.src = blobURL;
  };

  const faqs = [
    {
      question: "How does this ID protect my claim?",
      answer: "This ID contains a secure, unique identifier matched with your Quezon City resident credentials. When scanned at active distribution hubs, the system cross-checks this ID in real time (or via offline ledger sync) to prevent double-claiming and verify household eligibility."
    },
    {
      question: "Can I claim relief goods if my phone is offline?",
      answer: "Yes! You can present this screen even without active internet. Additionally, you can pre-download the Digital Pass as an image, and it will still be valid for scanning at centers."
    },
    {
      question: "What should I do if the scanner fails to read my ID?",
      answer: "Ensure your screen brightness is set to high. If scanning still fails, you can tap to copy the numerical Security Code text underneath the ID and present it to the Barangay Official for manual ledger encoding."
    },
    {
      question: "Can other family members use my ID to claim?",
      answer: "No, this ID is matched with your specific profile photo and Quezon City verification status. Only the Head of Household or officially registered secondary claimants listed on the pass can use it at the hub."
    }
  ];

  // Removed theme logic for authentic QC ID look

  return (
    <ResidentLayout>
      <div className="animate-fade-in print:p-0">
        
        {/* Page Title - Hidden during print */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 font-display">My Citizen ID</h2>
            <p className="text-slate-500 mt-1">Present this ID at active distribution points to claim relief kits.</p>
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
            
            {/* QCitizen ID Card Design */}
            <div className="w-full max-w-lg mx-auto aspect-[1.586/1] bg-white rounded-2xl shadow-xl overflow-hidden relative border border-slate-300 mb-6 group hover:shadow-2xl transition-all duration-300">
              
              {/* Header Banner */}
              <div className="h-[18%] bg-orange-500 flex items-center px-5 justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center p-1 shadow-sm">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-orange-500 fill-orange-500" />
                  </div>
                  <div>
                    <h1 className="text-white font-bold text-xs md:text-sm leading-tight tracking-wide">QUEZON CITY</h1>
                    <p className="text-yellow-300 text-[7px] md:text-[9px] font-bold tracking-widest uppercase">Republika ng Pilipinas</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-white font-black italic text-lg md:text-xl leading-tight tracking-wider">QCitizen<span className="text-yellow-400">ID</span></h2>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex gap-4 h-[82%] relative">
                {/* Background Watermark */}
                <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center pointer-events-none">
                   <ShieldCheck className="w-64 h-64 text-orange-900" />
                </div>

                {/* Left Column (Photo & Signature) */}
                <div className="flex flex-col w-24 md:w-28 shrink-0 z-10">
                  <div className="w-full aspect-3/4 bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center relative">
                    <User className="w-12 h-12 text-slate-400" />
                    {/* Fake Photo Placeholder */}
                    <img src="https://ui-avatars.com/api/?name=Taro+Sakamoto&background=0D8ABC&color=fff&size=200" alt="Avatar" className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                </div>

                {/* Middle/Right Column (Info & QR) */}
                <div className="flex-1 flex flex-col justify-between z-10">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[7px] md:text-[8px] uppercase text-slate-500 font-bold tracking-wider mb-0.5">QCitizen ID No.</p>
                        <p className="font-mono font-bold text-xs md:text-sm text-slate-900">{qrString}</p>
                      </div>
                      <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm shrink-0">
                        <QRCodeSVG 
                          value={qrString} 
                          size={64} 
                          level="H" 
                          includeMargin={false}
                          id="qr-code-svg"
                        />
                      </div>
                    </div>

                    <div className="mt-2 space-y-2">
                      <div>
                        <p className="text-[7px] md:text-[8px] uppercase text-slate-500 font-bold tracking-wider leading-none mb-0.5">Name</p>
                        <p className="font-bold text-slate-900 text-sm md:text-base leading-tight uppercase">Sakamoto, Taro</p>
                      </div>
                      
                      <div>
                        <p className="text-[7px] md:text-[8px] uppercase text-slate-500 font-bold tracking-wider leading-none mb-0.5">Address</p>
                        <p className="font-semibold text-slate-800 text-[10px] md:text-xs leading-tight uppercase">123 Bonifacio St., Brgy. Balingasa, Quezon City</p>
                      </div>
                      
                      <div className="flex gap-6 pt-1">
                        <div>
                          <p className="text-[7px] md:text-[8px] uppercase text-slate-500 font-bold tracking-wider leading-none mb-0.5">Date of Birth</p>
                          <p className="font-semibold text-slate-800 text-[10px] md:text-xs leading-tight">10/24/1985</p>
                        </div>
                        <div>
                          <p className="text-[7px] md:text-[8px] uppercase text-slate-500 font-bold tracking-wider leading-none mb-0.5">Blood Type</p>
                          <p className="font-bold text-red-600 text-[10px] md:text-xs leading-tight">O+</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-2 mt-2">
                    <p className="text-[7px] md:text-[8px] uppercase text-slate-500 font-bold tracking-wider leading-none mb-0.5">Emergency Contact</p>
                    <p className="font-semibold text-slate-800 text-[9px] md:text-[10px] leading-tight uppercase">Aoi Sakamoto (Wife) - 09123456789</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Token Copyable Text Field */}
            <div className={`flex items-center justify-between rounded-xl px-4 py-3 cursor-pointer hover:opacity-95 transition-opacity bg-slate-100 border border-slate-200 text-slate-800 w-full max-w-sm mx-auto shadow-sm`} onClick={handleCopyToken}>
              <span className="text-xs font-mono tracking-wider font-bold truncate select-all">{qrString}</span>
              <button className="p-1 hover:bg-slate-200 rounded-lg shrink-0" title="Copy Security Token">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              </button>
            </div>

            {/* Security note details */}
            <div className="bg-amber-50/50 border border-amber-100/60 rounded-3xl p-5 flex items-start gap-3.5 w-full max-w-sm mx-auto mt-4 print:hidden">
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

          {/* Right Column: Resident Info, Relief Status, FAQs */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Resident Pass Metadata Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-slate-800 font-display">Relief Information </h3>
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
                    <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">Date</span>
                    <span className="text-sm font-bold text-slate-800">Today, 01:09 PM</span>
                  </div>
                </div>

              <button 
                onClick={handleDownload}
                className="flex flex-col justify-center items-center gap-1 p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 hover:text-slate-900 transition-colors shadow-sm cursor-pointer w-full print:hidden"
              >
                <Download className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Save Pass</span>
              </button>
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



          </div>

        </div>

      </div>
    </ResidentLayout>
  );
}