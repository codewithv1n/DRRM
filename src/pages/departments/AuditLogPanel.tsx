import { useMockData } from '../../data/MockDataContext';
import { Shield, Search, FileText } from 'lucide-react';
import DepartmentLayout from '../../components/layout/DepartmentLayout';

export default function AuditLogPanel() {
  const { auditLogs, incidents } = useMockData();
  const pendingCount = incidents ? incidents.filter(i => i.status === 'Pending').length : 0;

  return (
    <DepartmentLayout pendingCount={pendingCount}>
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">System Audit Logs</h2>
        <p className="text-slate-500 mt-1">Immutable record of all critical system actions and events.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-400" />
            Centralized Audit Trail
          </h3>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search logs..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary w-64"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto max-h-150">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100">
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Role / Trigger</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {auditLogs.length > 0 ? auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400 whitespace-nowrap font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{log.action}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wide">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-sm">{log.details}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <h3 className="text-slate-500 font-semibold">No Audit Logs Yet</h3>
                    <p className="text-slate-400 text-xs mt-1">Actions performed in the system will be securely logged here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </DepartmentLayout>
  );
}
