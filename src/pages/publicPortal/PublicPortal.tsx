import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, BookOpen, Info, Heart, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function PublicPortal() {
  const navigate = useNavigate();

  type PortalOption = {
    title: string;
    description: string;
    icon: React.ElementType;
    route?: string;
    action?: () => void;
  };

  const portalOptions: PortalOption[] = [
    {
      title: 'Report Incident',
      description: 'Quickly report emergencies, accidents, or hazards in your area.',
      icon: AlertTriangle,
      route: '/report_incident'
    },
    {
      title: 'Survival Guides',
      description: 'Learn what to do before, during, and after various emergencies and disasters.',
      icon: BookOpen,
      route: '/survival_guides'
    },
    {
      title: 'About',
      description: 'Learn more about the DRRM system and our mission to build resilient communities.',
      icon: Info,
      route: '/about'
    },
    {
      title: 'Relief Donations',
      description: 'Send relief goods and donations as a concerned citizen to help those in need.',
      icon: Heart,
      route: '/donations'
    }
  ];

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-6 flex justify-between items-center z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/logo-system.png" alt="GovServe Logo" className="h-10 object-contain shrink-0" />
          <span className="font-bold text-lg tracking-wider text-slate-900">GOVSERVE</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-5 py-2 rounded-full shadow-sm hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 z-10 w-full max-w-5xl mx-auto mt-12 pb-20">
        
        {/* Top Badge */}
        <div className="bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 flex items-center gap-2 mb-10 border border-blue-100">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span className="text-[10px] font-extrabold tracking-widest uppercase">Citizen Access Portal</span>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Public Services<br />
            <span className="text-blue-600">Portal</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-slate-500 max-w-2xl text-[15px] md:text-base mb-16 leading-relaxed">
          Select a service below to report an emergency, view survival guides, or access critical information regarding disaster risk reduction.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          {portalOptions.map((option, idx) => {
            const Icon = option.icon;
            return (
              <div 
                key={idx}
                onClick={() => option.route ? navigate(option.route) : option.action?.()}
                className="group bg-white p-8 rounded-[20px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:border-blue-100 hover:shadow-[0_8px_30px_rgb(37,99,235,0.08)] transition-all cursor-pointer flex flex-col h-full"
              >
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                  <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{option.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed grow">
                  {option.description}
                </p>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="text-center py-8 text-[11px] font-bold tracking-wider uppercase text-slate-300 border-t border-slate-100 mt-auto bg-white z-10 relative">
        © 2026 GOVSERVE. Secure Government Platform.
      </footer>
    </div>
  );
}
