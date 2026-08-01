import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Flame, Shield, Activity, PhoneCall, Search } from 'lucide-react';

export default function EmergencyHotlines() {
  const navigate = useNavigate();

  const hotlines = [
    {
      category: 'General Emergency',
      numbers: [
        { name: 'National Emergency Hotline', number: '911', primary: true },
        { name: 'GOVSERVE Local Command Center', number: '122', primary: true }
      ],
      icon: <PhoneCall className="w-6 h-6 text-orange-500" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      category: 'Fire Department',
      numbers: [
        { name: 'Bureau of Fire Protection (BFP)', number: '(02) 8426-0219', primary: false },
        { name: 'Local Fire Station', number: '(02) 8928-8363', primary: false }
      ],
      icon: <Flame className="w-6 h-6 text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      category: 'Police Assistance',
      numbers: [
        { name: 'Philippine National Police (PNP)', number: '117', primary: false },
        { name: 'Local Police Station', number: '(02) 8925-8326', primary: false }
      ],
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      category: 'Medical & Rescue',
      numbers: [
        { name: 'Philippine Red Cross', number: '143', primary: false },
        { name: 'City Health Department', number: '(02) 8929-8086', primary: false },
        { name: 'Ambulance Dispatch', number: '(02) 8925-8025', primary: false }
      ],
      icon: <Activity className="w-6 h-6 text-emerald-500" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative">
        
        {/* Header inside the box */}
        <div className="bg-primary p-6 text-center text-white relative">
          <button 
            onClick={() => navigate('/public_portal')}
            className="absolute left-4 top-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors cursor-pointer flex items-center justify-center"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          
          <Phone className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h1 className="text-2xl font-bold text-white">Emergency Hotlines</h1>
          <p className="text-orange-100 text-sm mt-1">Direct contact numbers for immediate assistance</p>
        </div>

        <div className="p-6">
          {/* Search Bar */}
          <div className="mb-6">
             <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-3">
               <Search className="w-5 h-5 text-slate-400 ml-2" />
               <input 
                 type="text" 
                 placeholder="Search for a specific hotline..." 
                 className="flex-1 outline-none text-sm p-1 text-slate-700 bg-transparent" 
               />
             </div>
          </div>

          {/* Hotlines Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotlines.map((category, idx) => (
              <div key={idx} className={`p-4 rounded-xl border-2 ${category.borderColor} bg-white transition-all`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2.5 rounded-lg ${category.bgColor}`}>
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{category.category}</h3>
                </div>
                <div className="space-y-3">
                  {category.numbers.map((contact, cIdx) => (
                    <div key={cIdx} className="flex flex-col border-t border-slate-100 pt-3 first:border-0 first:pt-0">
                      <span className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">{contact.name}</span>
                      <a 
                        href={`tel:${contact.number.replace(/\D/g, '')}`}
                        className={`font-black text-lg flex items-center justify-between hover:opacity-80 transition-opacity ${contact.primary ? 'text-red-600' : 'text-slate-800'}`}
                      >
                        {contact.number}
                        <PhoneCall className={`w-4 h-4 ${contact.primary ? 'text-red-500' : 'text-slate-400'}`} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
