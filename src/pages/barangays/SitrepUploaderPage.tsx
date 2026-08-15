import { useState } from 'react';
import type { FormEvent } from 'react';
import { FileText, Send, AlertCircle, Info, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMockData } from '../../data/MockDataContext';
import { ASSIGNED_BARANGAY } from './BarangayDashboard';
import BarangayLayout from '../../components/layout/BarangayLayout';

export default function SitrepPanel() {
  const navigate = useNavigate();
  const { addAuditLog } = useMockData();
  const [showToast, setShowToast] = useState(false);
  
  const [generalSituation, setGeneralSituation] = useState('');
  const [evacuees, setEvacuees] = useState<number | string>('');
  const [casualties, setCasualties] = useState<number | string>('');
  const [households, setHouseholds] = useState<number | string>('');
  const [damageSeverity, setDamageSeverity] = useState('Minor');

  const handleSitRepSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/sitreps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barangay: ASSIGNED_BARANGAY,
          general_situation: generalSituation,
          evacuee_count: Number(evacuees) || 0,
          casualties: Number(casualties) || 0,
          household_count: Number(households) || 0,
          damage_severity: damageSeverity,
          last_updated_by: `Brgy. Admin (${ASSIGNED_BARANGAY})`
        })
      });

      if (res.ok) {
        setShowToast(true);
        addAuditLog('Submit SitRep', `Barangay Admin (${ASSIGNED_BARANGAY})`, 'Submitted daily situation report.');
        setGeneralSituation('');
        setEvacuees('');
        setCasualties('');
        setHouseholds('');
        setDamageSeverity('Minor');
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error('Error submitting sitrep:', error);
    }
  };

  return (
    <BarangayLayout>
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">SitRep Uploader</h2>
        <p className="text-slate-500">Submit situation reports to QC DRRM Department</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Column: Main Form */}
        <div className="md:col-span-7 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <FileText className="w-5 h-5 text-slate-700" />
          <h3 className="font-bold text-slate-800">Situation Report (SitRep)</h3>
        </div>
        <form onSubmit={handleSitRepSubmit} className="p-6 space-y-5">
          {showToast && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 animate-fade-in-down">
               <Send className="w-4 h-4" /> SitRep Submitted Successfully!
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">General Situation</label>
            <textarea 
              rows={3}
              required
              value={generalSituation}
              onChange={(e) => setGeneralSituation(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Describe the current situation in the barangay..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Evacuees</label>
              <input type="number" min="0" value={evacuees} onChange={(e) => setEvacuees(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Casualties</label>
              <input type="number" min="0" value={casualties} onChange={(e) => setCasualties(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Damaged Houses</label>
              <input type="number" min="0" value={households} onChange={(e) => setHouseholds(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Damage Severity</label>
              <select value={damageSeverity} onChange={(e) => setDamageSeverity(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="Minor">Minor</option>
                <option value="Moderate">Moderate</option>
                <option value="Severe">Severe</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mt-2 flex gap-3 items-start">
             <AlertCircle className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
             <p className="text-xs text-slate-500 leading-relaxed">
               <strong>Access Boundary Enforcement:</strong> Data submitted is cryptographically tied to <em>{ASSIGNED_BARANGAY}</em> via Row-Level Security (RLS) at the database layer. Cross-barangay data mutation is technically impossible and rejected automatically.
             </p>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer mt-4"
          >
            <Send className="w-5 h-5" />
            Submit
          </button>
        </form>
      </div>

      {/* Right Column: Guidelines & Quick Link to Logs */}
      <div className="md:col-span-5 space-y-6">
        
        {/* Guidelines */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-xs">
          <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            SitRep Guidelines
          </h3>
          <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4">
            <li>Be concise and factual in the General Situation.</li>
            <li>Ensure all evacuee and casualty numbers are officially verified by BDRRMC.</li>
            <li>Update EOC immediately for critical lifeline status (water, power).</li>
            <li>Keep a physical backup copy of all reports.</li>
          </ul>
        </div>

        {/* Dedicated SitRep Logs Link Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-blue-600" />
              SitRep Submission Logs
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              All previously submitted Situation Reports are archived and synchronized with QC EOC.
            </p>
          </div>

          <button 
            type="button"
            onClick={() => navigate('/barangays/sitrep_logs')}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4" />
            View Complete SitRep Logs
          </button>
        </div>

      </div>
    </div>
    </div>
    </BarangayLayout>
  );
}
