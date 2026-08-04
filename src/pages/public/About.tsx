import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info, Shield, Users, Globe } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Our Mission',
      description: 'To provide a swift, efficient, and coordinated response during emergencies, ensuring the safety and well-being of every citizen.',
      icon: <Shield className="w-6 h-6 text-blue-500" />,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Community First',
      description: 'Built for the community, by the community. We prioritize the needs of the public above all else.',
      icon: <Users className="w-6 h-6 text-emerald-500" />,
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200'
    },
    {
      title: 'Global Standards',
      description: 'We adhere to international standards of disaster risk reduction and management.',
      icon: <Globe className="w-6 h-6 text-purple-500" />,
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
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
          
          <Info className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h1 className="text-2xl font-bold text-white">About QCDRRMO</h1>
          <p className="text-blue-100 text-sm mt-1">Learn more about our system and mission</p>
        </div>

        <div className="p-6">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-slate-800 mb-2">QCDRRMO System</h2>
            <p className="text-slate-500 leading-relaxed text-sm">
              The Disaster Risk Reduction and Management system is a comprehensive platform designed to streamline emergency responses, manage resources effectively, and foster resilient communities. 
            </p>
          </div>

          {/* Features Grid */}
          <div className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${feature.borderColor} bg-white transition-all flex items-start gap-4`}>
                <div className={`p-3 rounded-lg ${feature.bgColor} shrink-0`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
