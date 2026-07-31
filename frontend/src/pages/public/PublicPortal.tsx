import { useNavigate } from 'react-router-dom';
import { AlertTriangle, User, PhoneCall, Megaphone, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function PublicPortal() {
  const navigate = useNavigate();

  const portalOptions = [
    {
      title: 'Report Incident',
      description: 'Quickly report emergencies, accidents, or hazards in your area.',
      icon: <AlertTriangle className="w-8 h-8 text-orange-500" />,
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-100',
      hoverColor: 'hover:border-orange-300 hover:shadow-orange-500/20 hover:-translate-y-1',
      route: '/report-incident'
    },
    {
      title: 'Resident Portal',
      description: 'Access your citizen ID, evacuation status, and relief stubs.',
      icon: <User className="w-8 h-8 text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100',
      hoverColor: 'hover:border-blue-300 hover:shadow-blue-500/20 hover:-translate-y-1',
      route: '/qcitizen'
    },
    {
      title: 'Emergency Hotlines',
      description: 'View a list of immediate contact numbers for police, fire, and medical assistance.',
      icon: <PhoneCall className="w-8 h-8 text-red-500" />,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-100',
      hoverColor: 'hover:border-red-300 hover:shadow-red-500/20 hover:-translate-y-1',
      action: () => alert('Emergency Hotlines Modal Coming Soon!')
    },
    {
      title: 'Public Advisories',
      description: 'Stay updated with the latest city-wide announcements, weather alerts, and news.',
      icon: <Megaphone className="w-8 h-8 text-emerald-500" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100',
      hoverColor: 'hover:border-emerald-300 hover:shadow-emerald-500/20 hover:-translate-y-1',
      action: () => alert('Public Advisories Coming Soon!')
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans text-foreground flex flex-col items-center py-12 px-4">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-primary/5 to-transparent -z-10"></div>
      
      {/* Header / Logo */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold text-sm">Back to Home</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <ShieldAlert className="w-6 h-6 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-wider text-foreground">QC DRRM</span>
        </div>
      </div>

      <div className="text-center max-w-2xl mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
          Public <span className="text-primary">Services Portal</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Select a service below to report an emergency, access your citizen dashboard, or view critical information.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {portalOptions.map((option, idx) => (
          <div 
            key={idx}
            onClick={() => option.route ? navigate(option.route) : option.action?.()}
            className={`group bg-card p-6 rounded-2xl border ${option.borderColor} shadow-sm hover:shadow-md ${option.hoverColor} transition-all cursor-pointer flex flex-col h-full`}
          >
            <div className={`w-16 h-16 rounded-xl ${option.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {option.icon}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{option.title}</h3>
            <p className="text-muted-foreground leading-relaxed grow">
              {option.description}
            </p>
          </div>
        ))}
      </div>
      
      <footer className="mt-20 text-center text-xs text-muted-foreground">
        © 2026 QC DRRM. Secure Government Platform.
      </footer>
    </div>
  );
}
