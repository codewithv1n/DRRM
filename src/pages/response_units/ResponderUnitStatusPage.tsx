import { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import { Truck, Radio, ToggleLeft, ToggleRight, Users, Shield } from 'lucide-react';
import ResponseUnitLayout from '../../components/layout/ResponseUnitLayout';

// Fixed Team Leader identity
const UNIT_ID = 'RES-01';
const TEAM_LEADER_NAME = 'TL Juan Dela Cruz';

export default function ResponderUnitStatusPage() {
  const { incidents } = useMockData();
  
  const [isGpsShared, setIsGpsShared] = useState(true);
  const [teamMembers, setTeamMembers] = useState('');

  const activeIncidents = incidents.filter(i => 
    i.status !== 'Resolved' && i.assignedResponder === 'Task Force 1'
  );
  
  const activeIncidentsCount = activeIncidents.length;

  return (
    <ResponseUnitLayout activeIncidentsCount={activeIncidentsCount}>
      <div className="animate-fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">Unit Status & Assignment</h2>
          <p className="text-slate-500 mt-1">Manage your team deployment and GPS visibility</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unit Assignment Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Unit Assignment</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Current deployment</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Unit Code</div>
                  <div className="text-xl font-black text-indigo-600">{UNIT_ID}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Team Leader</div>
                  <div className="text-sm font-bold text-slate-800">{TEAM_LEADER_NAME.replace('TL ', '')}</div>
                </div>
              </div>
            </div>

            {/* Team Members Text Field */}
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-slate-400" />
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Team Members on Shift</label>
              </div>
              <textarea
                value={teamMembers}
                onChange={(e) => setTeamMembers(e.target.value)}
                placeholder="e.g. Medic Rivera J., Officer Reyes P., Volunteer Santos A."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                rows={2}
              />
              <p className="text-[10px] text-slate-400 mt-1">For record keeping only — list your current team members</p>
            </div>
          </div>

          {/* GPS / Location Sharing */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Truck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Unit Status</h3>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{UNIT_ID} operational status</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 flex-1">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Status</div>
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${activeIncidentsCount > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                <span className="font-bold text-slate-800 text-sm">
                  {activeIncidentsCount > 0 ? `${activeIncidentsCount} Active Mission(s)` : 'Standing By'}
                </span>
              </div>
            </div>
            
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className={`w-4 h-4 ${isGpsShared ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
                <div>
                  <div className="text-sm font-bold text-slate-700">{UNIT_ID} Live GPS</div>
                  <div className="text-[10px] text-slate-500">Visible to Admin Incident Dispatch</div>
                </div>
              </div>
              <button onClick={() => setIsGpsShared(!isGpsShared)} className="cursor-pointer">
                {isGpsShared ? <ToggleRight className="w-8 h-8 text-emerald-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ResponseUnitLayout>
  );
}
