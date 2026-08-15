import { useState, useEffect } from 'react';
import { Package, Clock, Plus, X, Search, Filter } from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useMockData } from '../../data/MockDataContext';


const API_URL = import.meta.env.VITE_API_URL;

export default function ReliefInventoryPanel() {
  const { incidents } = useMockData();
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;

  const [inventory, setInventory] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({ category: 'Food & Water', quantity: '' as any });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/inventory`);
      const data = await res.json();
      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.quantity <= 0) return;
    
    try {
      await fetch(`${API_URL}/api/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...newItem, name: newItem.category })
      });
      fetchInventory();
      setShowAddModal(false);
      setNewItem({ category: 'Food & Water', quantity: 0 });
    } catch (error) {
      console.error("Error adding inventory item:", error);
    }
  };

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">Relief Inventory</h2>
            <p className="text-slate-500 mt-1">Manage relief goods inventory and incoming donations.</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Quantity
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Food & Water">Food & Water</option>
                <option value="Clothes & Blankets">Clothes & Blankets</option>
                <option value="Medical Supplies">Medical Supplies</option>
                <option value="Hygiene Kits">Hygiene Kits</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Quantity</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredInventory.map(item => (
                  <tr key={item.relief_inventory_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg shrink-0 bg-blue-50 text-blue-600">
                          <Package className="w-4 h-4" />
                        </div>
                        <span className="font-bold text-slate-800">{item.category}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="font-black text-slate-800">{item.quantity.toLocaleString()}</span>
                    </td>
                    <td className="p-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {new Date(item.last_updated).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInventory.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-slate-400 text-sm">
                      No inventory available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Add Quantity to Category</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddItem} className="p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="col-span-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option>Food & Water</option>
                    <option>Clothes & Blankets</option>
                    <option>Medical Supplies</option>
                    <option>Hygiene Kits</option>
                    <option>Others</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Quantity to Add</label>
                <input 
                  type="number"
                  min="1"
                  max="1000000"
                  required
                  value={newItem.quantity}
                  onChange={e => {
                    let val = parseInt(e.target.value);
                    if (val > 1000000) val = 1000000;
                    setNewItem({...newItem, quantity: isNaN(val) ? ('' as any) : val});
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                />
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md">
                  Add Quantity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DepartmentLayout>
  );
}
