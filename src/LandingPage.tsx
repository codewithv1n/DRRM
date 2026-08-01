import { useNavigate } from 'react-router-dom';
import { Shield, ShieldAlert, ArrowRight, AlertTriangle, Users, Package, Radio, Activity, User, Building, Map, CheckSquare, BarChart } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AlertTriangle className="w-6 h-6 text-orange-500" />,
      title: "Incident Reporting",
      description: "Fast and reliable emergency reporting for immediate response and action.",
      bgColor: "bg-orange-50"
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Evacuation Management",
      description: "Real-time tracking of evacuation centers, capacity, and displaced families.",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Package className="w-6 h-6 text-emerald-500" />,
      title: "Relief Operations",
      description: "Streamlined distribution and tracking of relief goods to affected residents.",
      bgColor: "bg-emerald-50"
    },
    {
      icon: <Radio className="w-6 h-6 text-red-500" />,
      title: "Early Warning System",
      description: "City-wide automated SMS alerts and advisory broadcasting.",
      bgColor: "bg-red-50"
    },
    {
      icon: <Activity className="w-6 h-6 text-indigo-500" />,
      title: "Response Tracking",
      description: "Monitor deployed units and field operations from a central command.",
      bgColor: "bg-indigo-50"
    },
    {
      icon: <User className="w-6 h-6 text-purple-500" />,
      title: "Citizen Portal",
      description: "Digital IDs and personal dashboard for every constituent.",
      bgColor: "bg-purple-50"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden font-sans text-foreground flex flex-col">
      {/* Abstract Background Floating Icons */}
      <div className="absolute top-20 left-10 text-primary/10 animate-pulse"><Building className="w-12 h-12" /></div>
      <div className="absolute top-80 left-20 text-primary/10 animate-pulse"><CheckSquare className="w-10 h-10" /></div>
      <div className="absolute top-40 right-20 text-primary/10 animate-pulse"><Map className="w-16 h-16" /></div>
      <div className="absolute bottom-40 right-32 text-primary/10 animate-pulse"><BarChart className="w-12 h-12" /></div>
      
      {/* Header */}
      <header className="w-full px-8 py-6 flex justify-between items-center z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="bg-white/10 p-2 rounded-full ">
              <Shield className="w-5 h-5 text-orange-400" />
          </div>
          <span className="font-bold text-lg tracking-wider text-foreground">GOVSERVE</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <button onClick={() => navigate('/login')} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            Sign In
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 z-10 w-full max-w-7xl mx-auto mt-12 mb-20">
        
        {/* Badge */}
        <div className="bg-card border border-border shadow-sm rounded-full px-4 py-1.5 flex items-center gap-2 mb-8 cursor-pointer hover:shadow-md transition-shadow">
          <ShieldAlert className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-muted-foreground tracking-wide">Disaster Management System</span>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-6">
          <h1 className="text-5xl md:text-6xl font-black text-foreground leading-tight tracking-tight">
            Disaster Risk Reduction &<br />
            <span className="text-primary">Management Response</span><br />
            Made Simple
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-muted-foreground max-w-2xl text-lg mb-10">
          A comprehensive digital platform for incident reporting, evacuation center management, relief goods tracking, and city-wide coordination.
        </p>

        {/* CTA Button */}
        <button 
          onClick={() => navigate('/public_portal')}
          className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all hover:-translate-y-1 flex items-center gap-3 cursor-pointer group mb-20"
        >
          Public Portal 
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {features.map((feature, index) => (
            <div key={index} className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col items-start cursor-default">
              <div className={`${feature.bgColor} p-4 rounded-xl mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center py-6 text-xs text-muted-foreground border-t border-border mt-auto bg-card/50 backdrop-blur-sm z-10 relative">
        © 2026 GOVSERVE. Secure Government Platform.
        <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-primary/50 to-primary"></div>
      </footer>
    </div>
  );
}
