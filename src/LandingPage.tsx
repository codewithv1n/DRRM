import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, AlertTriangle, Users, Package, 
  Radio, Activity, User
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Incident Reporting",
      description: "Fast and reliable emergency reporting for immediate response and action."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Evacuation Management",
      description: "Real-time tracking of evacuation centers, capacity, and displaced families."
    },
    {
      icon: <Package className="w-5 h-5" />,
      title: "Relief Operations",
      description: "Streamlined distribution and tracking of relief goods to affected residents."
    },
    {
      icon: <Radio className="w-5 h-5" />,
      title: "Early Warning System",
      description: "City-wide automated SMS alerts and advisory broadcasting."
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Response Tracking",
      description: "Monitor deployed units and field operations from a central command."
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Citizen Portal",
      description: "Digital IDs and personal dashboard for every constituent."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="w-full px-6 py-6 flex justify-between items-center z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 cursor-pointer">
          <img src="/logo-system.png" alt="GovServe Logo" className="h-8 object-contain shrink-0" />
          <span className="font-bold text-lg tracking-tight text-slate-900">GOVSERVE</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer px-5 py-2 rounded-xl flex items-center gap-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 z-10 w-full max-w-7xl mx-auto mt-12 mb-24">
        
        {/* Badge */}
        <div className="bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 flex items-center gap-2 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-xs font-semibold text-blue-600 tracking-wide">Government Services Management</span>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-6 w-full max-w-4xl">
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-bold text-slate-900 leading-[1.1] tracking-tight">
            Disaster Management<br />
            <span className="text-blue-600">Made Simple</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-slate-500 max-w-2xl text-lg mb-10 leading-relaxed">
          Streamline incident reporting, evacuation center management, relief goods tracking, and city-wide coordination — all in one unified platform.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <button 
            onClick={() => navigate('/public_portal')}
            className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            Access the Portal <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Stats Row */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-24 max-w-6xl">
          {[
            { label: 'Digital Process', value: '100%' },
            { label: 'System Access', value: '24/7' },
            { label: 'Departments', value: '3' },
            { label: 'Updates', value: 'Real-time' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm font-medium text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">Complete Disaster Management Suite</h2>
          <p className="text-slate-500 text-sm md:text-base">Everything you need to manage emergencies and response operations efficiently</p>
        </div>

        {/* Feature Grid */}
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6 w-full max-w-5xl">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-start w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] text-left cursor-default">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl mb-4">
                {feature.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 border-t border-slate-200 mt-auto">
        <div>© 2026 GOVSERVE. Disaster Risk Reduction & Emergency Response</div>
      </footer>
    </div>
  );
}
