import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, Users, Target, Shield, Info } from 'lucide-react';

export default function AboutQC() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAFAFA] relative overflow-hidden font-sans text-slate-800 flex flex-col items-center py-12 px-4">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-orange-50/50 to-transparent -z-10"></div>
      
      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-12">
        <button 
          onClick={() => navigate('/public_portal')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Portal</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Info className="w-6 h-6 text-orange-400" />
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-900">Quezon City</span>
        </div>
      </div>

      <div className="text-center max-w-3xl mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
          Discover <span className="text-orange-400">Quezon City</span>
        </h1>
        <p className="text-slate-500 text-lg">
          The largest, most populous, and highly urbanized city in Metro Manila, leading the way in disaster risk reduction and community resilience.
        </p>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Info */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 transition-transform hover:scale-110 duration-500"></div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">A City of Stars & Resilience</h3>
            <p className="text-slate-600 leading-relaxed mb-6 relative z-10">
              Quezon City, known as the "City of Stars," is not only a hub for culture and commerce but also a pioneer in proactive governance. With the implementation of the modernized Disaster Risk Reduction and Management (DRRM) System, the city aims to secure the safety and well-being of all its citizens against natural and man-made hazards.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl shrink-0">
                  <Map className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Vast Land Area</h4>
                  <p className="text-xs text-slate-500 mt-1">161.12 km², making up almost one-fourth of Metro Manila.</p>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-start gap-3">
                <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Growing Population</h4>
                  <p className="text-xs text-slate-500 mt-1">Over 2.9 million residents across 142 vibrant barangays.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.02)]">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-orange-500" />
              <h3 className="text-2xl font-bold text-slate-900">DRRM Vision</h3>
            </div>
            <p className="text-slate-600 leading-relaxed">
              To build a safe, adaptive, and disaster-resilient Quezon City. By integrating modern technology, AI-driven analytics, and community-first approaches, we ensure that no citizen is left behind during emergencies.
            </p>
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-4 h-full">
          <div className="bg-orange-500 rounded-3xl p-6 md:p-8 h-full flex flex-col relative overflow-hidden shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/50 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/30 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="bg-white/10 text-white p-3 rounded-2xl">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Core Values</h3>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                <h4 className="text-white font-bold mb-1">Preparedness</h4>
                <p className="text-orange-50 text-xs">Continuous training and equipping of local units.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                <h4 className="text-white font-bold mb-1">Responsiveness</h4>
                <p className="text-orange-50 text-xs">Real-time alerts and swift emergency deployment.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
                <h4 className="text-white font-bold mb-1">Inclusivity</h4>
                <p className="text-orange-50 text-xs">Equitable relief distribution for all vulnerable sectors.</p>
              </div>
            </div>

            <p className="text-orange-100 text-[10px] text-center mt-8 relative z-10 font-medium">
              Quezon City DRRM 2026
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
