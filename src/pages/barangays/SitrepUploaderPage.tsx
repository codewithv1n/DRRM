import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { FileText, Send, AlertCircle, Info, History, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuditLogs } from '../../hooks/useSystemHooks';
import { getAssignedBarangay, normalizeBarangay } from './BarangayDashboard';
import BarangayLayout from '../../components/layout/BarangayLayout';


import { encryptedFetch } from '../../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

export default function SitrepPanel() {
  const ASSIGNED_BARANGAY = getAssignedBarangay();
  const navigate = useNavigate();
  const { addAuditLog } = useAuditLogs();
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [generalSituation, setGeneralSituation] = useState('');
  const [evacuees, setEvacuees] = useState<number | string>('');
  const [damageSeverity, setDamageSeverity] = useState('Minor');
  const [evacuationCenters, setEvacuationCenters] = useState<any[]>([]);
  const [selectedEvacuationCenter, setSelectedEvacuationCenter] = useState('');

  useEffect(() => {
    encryptedFetch(`${API_URL}/api/d4a8b7f1-59c3-421e-8fd9-bc37ea495201`)
      .then(res => res.json())
      .then(data => {
        if (data.data) {
          const barangayCenters = data.data.filter((c: any) => normalizeBarangay(c.barangay) === normalizeBarangay(ASSIGNED_BARANGAY));
          setEvacuationCenters(barangayCenters);
        }
      })
      .catch(err => console.error("Failed to fetch evacuation centers:", err));
  }, []);
  const handleSitRepSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await encryptedFetch(`${API_URL}/api/e5b9d3c8-61f2-498b-9a74-cd185e492b67`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          barangay: ASSIGNED_BARANGAY,
          general_situation: generalSituation,
          evacuee_count: Number(evacuees) || 0,
          damage_severity: damageSeverity,
          evacuation_center: selectedEvacuationCenter,
          last_updated_by: `Brgy. Admin (${ASSIGNED_BARANGAY})`
        })
      });

      // Artificial delay for animation
      await new Promise(resolve => setTimeout(resolve, 600));

      if (res.ok) {
        setShowToast(true);
        addAuditLog('Submit SitRep', `Barangay Admin (${ASSIGNED_BARANGAY})`, 'Submitted daily situation report.');
        setGeneralSituation('');
        setEvacuees('');
        setDamageSeverity('Minor');
        setSelectedEvacuationCenter('');
        setTimeout(() => setShowToast(false), 4000);
      }
    } catch (error) {
      console.error('Error submitting sitrep:', error);
    } finally {
      setIsSubmitting(false);
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Evacuation Center</label>
              <select value={selectedEvacuationCenter} onChange={(e) => setSelectedEvacuationCenter(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                <option value="">Select Evacuation Center</option>
                {evacuationCenters.map(center => (
                  <option key={center.evacuation_center_id || center.id} value={center.name}>{center.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Evacuees</label>
              <input type="number" min="0" value={evacuees} onChange={(e) => setEvacuees(e.target.value === '' ? '' : parseInt(e.target.value))} className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
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
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-600 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 disabled:cursor-not-allowed text-white font-bold py-3.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center justify-center min-h-13 mt-4"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              </div>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Submit SitRep
              </>
            )}
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
            <li>Ensure all evacuee numbers are officially verified by BDRRMC.</li>
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

      {/* Success Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 bg-emerald-500 border border-emerald-400 shadow-[0_10px_40px_rgba(16,185,129,0.3)] rounded-2xl p-4 flex items-center gap-4 z-50 animate-fade-in">
          <div className="bg-emerald-400/50 text-white p-2 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Successfully Submitted</h4>
            <p className="text-xs text-emerald-50">Situation Report has been sent to QC EOC.</p>
          </div>
          <button onClick={() => setShowToast(false)} className="ml-2 text-emerald-200 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </BarangayLayout>
  );
}

