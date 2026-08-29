import { useState, useEffect } from 'react';
import { Box, Search } from 'lucide-react';
import BarangayLayout from '../../components/layout/BarangayLayout';

import { encryptedFetch } from '../../utils/encryptedFetch';
import { getAssignedBarangay } from './BarangayDashboard';

export default function BarangayReliefInventory() {
  const currentBarangay = getAssignedBarangay();

  const [localInventory, setLocalInventory] = useState<{type: string, quantity: number}[]>([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await encryptedFetch(`${import.meta.env.VITE_API_URL}/api/inventory/barangay?barangay=${currentBarangay}`);
        if (res.ok) {
          const data = await res.json();
          setLocalInventory(data.map((item: any) => ({
            type: item.type,
            quantity: Number(item.quantity) || 0
          })));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchInventory();
    
    const interval = setInterval(fetchInventory, 5000);
    return () => clearInterval(interval);
  }, [currentBarangay]);

  const [searchQuery, setSearchQuery] = useState('');

  const filteredInventory = localInventory.filter(item => 
    item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BarangayLayout>
      <div className="animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Relief Inventory</h1>
        <p className="text-slate-500 mt-1">Monitor local inventory of relief goods delivered from the EOC.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Local Inventory Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Box className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Local Inventory</h2>
            </div>
            <div className="w-full sm:w-64 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm text-slate-500 bg-slate-50/50">
                  <th className="p-4 font-semibold">Item Type</th>
                  <th className="p-4 font-semibold text-right">Available Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-medium text-slate-800">{item.type}</td>
                    <td className="p-4 text-right">
                      <span className="font-bold text-slate-800">{item.quantity}</span>
                    </td>
                  </tr>
                ))}
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-12 text-center text-slate-400 text-sm">
                      {searchQuery ? 'No relief goods match your search.' : 'No relief goods in local inventory yet.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      </div>
    </BarangayLayout>
  );
}

