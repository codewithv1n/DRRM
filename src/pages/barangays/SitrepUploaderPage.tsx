import { useState } from 'react';
import type { FormEvent } from 'react';
import { FileText, Send, AlertCircle, Info, History } from 'lucide-react';
import { useMockData } from '../../data/MockDataContext';
import { ASSIGNED_BARANGAY } from './BarangayDashboard';
import BarangayLayout from '../../components/layout/BarangayLayout';

export default function SitrepPanel() {
  const { addAuditLog } = useMockData();
  const [showToast, setShowToast] = useState(false);

  const handleSitRepSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowToast(true);
    addAuditLog('Submit SitRep', `Barangay Admin (${ASSIGNED_BARANGAY})`, 'Submitted daily situation report.');
    setTimeout(() => setShowToast(false), 3000);
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
              className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              placeholder="Describe the current situation in the barangay..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Evacuees</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue={0} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Casualties</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue={0} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Damaged Houses</label>
              <input type="number" className="w-full border border-slate-300 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" defaultValue={0} />
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
            Submit to QC EOC
          </button>
        </form>
      </div>

      {/* Right Column: Guidelines & History */}
      <div className="md:col-span-5 space-y-6">
        
        {/* Guidelines */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 shadow-sm">
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

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-500" />
            Recent Submissions
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
              <div>
                <span className="block font-semibold text-slate-700">SitRep #45</span>
                <span className="text-xs text-slate-500">Today, 8:00 AM</span>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">SUBMITTED</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-slate-100 pb-3">
              <div>
                <span className="block font-semibold text-slate-700">SitRep #44</span>
                <span className="text-xs text-slate-500">Yesterday, 8:00 AM</span>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">SUBMITTED</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div>
                <span className="block font-semibold text-slate-700">SitRep #43</span>
                <span className="text-xs text-slate-500">Aug 1, 8:00 AM</span>
              </div>
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full">SUBMITTED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
    </div>
    </BarangayLayout>
  );
}
