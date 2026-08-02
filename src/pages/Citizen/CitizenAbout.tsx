import CitizenLayout from '../../components/layout/CitizenLayout';
import { ShieldAlert, Info, Smartphone, Users, Map } from 'lucide-react';

export default function CitizenAbout() {
  return (
    <CitizenLayout>
      <div className="animate-fade-in space-y-8 p-4 lg:p-0">
        
        {/* Header */}
        <div className="print:hidden">
          <h2 className="text-3xl font-bold text-slate-900 font-display">About</h2>
          <p className="text-slate-500 mt-1">Learn more about the Disaster Risk Reduction and Management system.</p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] space-y-8">
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-primary/10 text-primary p-6 rounded-3xl shrink-0">
              <ShieldAlert className="w-16 h-16" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 font-display mb-2">Quezon City DRRM</h3>
              <p className="text-slate-600 leading-relaxed">
                The Quezon City Disaster Risk Reduction and Management System is a comprehensive platform designed to streamline disaster response, relief distribution, and citizen communication. Our goal is to ensure the safety and well-being of all citizens before, during, and after a disaster.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-3">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl w-fit">
                <Smartphone className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg">Digital Citizen ID</h4>
              <p className="text-sm text-slate-500">
                A secure digital ID pass that allows quick scanning for relief operations, ensuring equitable and fast distribution of goods.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-2xl w-fit">
                <Info className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg">Real-time Alerts</h4>
              <p className="text-sm text-slate-500">
                Receive instant notifications about weather updates, evacuation notices, and emergency advisories directly to your device.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-amber-50 text-amber-600 p-3 rounded-2xl w-fit">
                <Map className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg">AI Shelter Recommendations</h4>
              <p className="text-sm text-slate-500">
                Find the nearest active evacuation centers using AI-powered location syncing and real-time capacity tracking.
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl w-fit">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg">Community First</h4>
              <p className="text-sm text-slate-500">
                Built to connect Barangays, Response Units, and Citizens together to create a more resilient and prepared community.
              </p>
            </div>
          </div>
          
        </div>

      </div>
    </CitizenLayout>
  );
}
