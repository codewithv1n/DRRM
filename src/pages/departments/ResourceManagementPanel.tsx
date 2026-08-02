import { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import DepartmentLayout from '../../components/layout/DepartmentLayout';
import { Truck, Activity,  Users, Package, AlertCircle, CheckCircle, Filter, PlusCircle } from 'lucide-react';

export default function ResourceManagementPanel() {
  const { resources, updateResourceStatus, incidents } = useMockData();
  const pendingCount = incidents ? incidents.filter(i => i.status === 'Pending').length : 0;
  const [filterType, setFilterType] = useState<string>('All');

  const filteredResources = filterType === 'All' 
    ? resources 
    : resources.filter(r => r.type === filterType);

  const availableCount = resources.filter(r => r.status === 'Available').length;
  const deployedCount = resources.filter(r => r.status === 'Deployed').length;
  const maintenanceCount = resources.filter(r => r.status === 'Maintenance').length;

  const handleStatusChange = (id: string, newStatus: any) => {
    updateResourceStatus(id, newStatus, newStatus === 'Available' ? undefined : 'Assigned externally');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Ambulance': return <Activity className="w-5 h-5 text-rose-500" />;
      case 'Rescue Vehicle': return <Truck className="w-5 h-5 text-amber-500" />;
      case 'Rubber Boat': return <Package className="w-5 h-5 text-blue-500" />;
      case 'Medical Equipment': return <PlusCircle className="w-5 h-5 text-emerald-500" />;
      case 'Personnel': return <Users className="w-5 h-5 text-indigo-500" />;
      default: return <Package className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Available':
        return <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase"><CheckCircle className="w-3 h-3" /> Available</span>;
      case 'Deployed':
        return <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase"><Activity className="w-3 h-3" /> Deployed</span>;
      case 'Maintenance':
        return <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase"><AlertCircle className="w-3 h-3" /> Maintenance</span>;
    }
  };

  return (
    <DepartmentLayout pendingCount={pendingCount}>
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Resource & Asset Management</h2>
        <p className="text-slate-500 mt-1">Track and manage emergency vehicles, equipment, and personnel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-slate-800">{resources.length}</div>
          <div className="text-xs font-semibold text-slate-500 uppercase mt-1">Total Assets</div>
        </div>
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-emerald-600">{availableCount}</div>
          <div className="text-xs font-semibold text-emerald-600 uppercase mt-1">Available</div>
        </div>
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-blue-600">{deployedCount}</div>
          <div className="text-xs font-semibold text-blue-600 uppercase mt-1">Deployed</div>
        </div>
        <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 flex flex-col items-center justify-center">
          <div className="text-3xl font-black text-rose-600">{maintenanceCount}</div>
          <div className="text-xs font-semibold text-rose-600 uppercase mt-1">Maintenance</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="w-4 h-4 text-slate-400" /> Filter by Type:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {['All', 'Ambulance', 'Rescue Vehicle', 'Rubber Boat', 'Medical Equipment', 'Personnel'].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${filterType === type ? 'bg-primary text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Resource ID</th>
                <th className="px-6 py-4">Name & Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location / Assignment</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredResources.map(resource => (
                <tr key={resource.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500 font-mono text-xs">{resource.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg">{getIcon(resource.type)}</div>
                      <div>
                        <div className="font-bold text-slate-800">{resource.name}</div>
                        <div className="text-xs text-slate-500">{resource.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(resource.status)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700">{resource.location}</div>
                    {resource.assignedTo && (
                      <div className="text-xs text-blue-600 font-semibold mt-0.5">Assigned: {resource.assignedTo}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select 
                      className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-600 font-medium focus:outline-none focus:border-primary"
                      value={resource.status}
                      onChange={(e) => handleStatusChange(resource.id, e.target.value)}
                    >
                      <option value="Available">Set Available</option>
                      <option value="Deployed">Set Deployed</option>
                      <option value="Maintenance">Set Maintenance</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredResources.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No resources found for this category.
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
