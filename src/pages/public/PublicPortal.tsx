import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, BookOpen, PhoneCall, Info, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function PublicPortal() {
  const navigate = useNavigate();

  type PortalOption = {
    title: string;
    description: string;
    icon: React.ReactNode;
    bgColor: string;
    borderColor: string;
    hoverColor: string;
    route?: string;
    action?: () => void;
  };

  const portalOptions: PortalOption[] = [
    {
      title: 'Report Incident',
      description: 'Quickly report emergencies, accidents, or hazards in your area.',
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
      hoverColor: 'hover:border-orange-300 hover:shadow-orange-500/20',
      route: '/report_incident'
    },
    {
      title: 'Survival Guides',
      description: 'Learn what to do before, during, and after various emergencies and disasters.',
      icon: <BookOpen className="w-8 h-8 text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      hoverColor: 'hover:border-blue-300 hover:shadow-blue-500/20',
      route: '/survival_guides'
    },
    {
      title: 'Emergency Hotlines',
      description: 'View a list of immediate contact numbers for police, fire, and medical assistance.',
      icon: <PhoneCall className="w-8 h-8 text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      hoverColor: 'hover:border-red-300 hover:shadow-red-500/20',
      route: '/emergency_hotlines'
    },
    {
      title: 'About Quezon City',
      description: 'Learn about our city, population, and our vision for a disaster-resilient community.',
      icon: <Info className="w-8 h-8 text-orange-400" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
      hoverColor: 'hover:border-orange-300 hover:shadow-orange-400/20',
      route: '/about_qc'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden font-sans text-slate-800 flex flex-col items-center py-12 px-4">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-blue-50/50 to-transparent -z-10"></div>
      
      {/* Header / Logo */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Home</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-orange-500" />
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-900">Quezon City</span>
        </div>
      </div>

      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Public <span className="text-orange-400">Services Portal</span>
        </h1>
        <p className="text-slate-500 text-lg">
          Select a service below to report an emergency, view survival guides, or access critical information.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {portalOptions.map((option, idx) => (
          <div 
            key={idx}
            onClick={() => option.route ? navigate(option.route) : option.action?.()}
            className={`group bg-white p-6 rounded-3xl border ${option.borderColor} shadow-sm hover:shadow-xl ${option.hoverColor} transition-all cursor-pointer flex flex-col h-full`}
          >
            <div className={`w-16 h-16 rounded-2xl ${option.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {option.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{option.title}</h3>
            <p className="text-slate-500 leading-relaxed grow">
              {option.description}
            </p>
          </div>
        ))}
      </div>
      
      <footer className="mt-20 text-center text-xs text-slate-400">
        © 2026 GOVSERVE. Secure Government Platform.
      </footer>
    </div>
  );
}
