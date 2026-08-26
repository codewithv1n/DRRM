import { useState, useEffect } from 'react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useIncidentsCount } from '../../hooks/useSystemHooks';
import { UserPlus, Shield, Mail, Key, IdCard, X } from 'lucide-react';
import BarangayOptions from '../../components/BarangayOptions';


const API_URL = import.meta.env.VITE_API_URL;

export default function UserManagement() {
  const { pendingCount } = useIncidentsCount();


  const [userListTab, setUserListTab] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (e) {
      console.error("Failed to fetch users", e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const [form, setForm] = useState({
    role: 'Barangay Admin',
    barangay: '',
    taskForce: '',
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.role !== 'Responder' && (!form.firstName || !form.lastName)) return;
    if (form.role === 'Responder' && !form.taskForce) return;
    if (!form.email || !form.password || !form.contactNumber) return;

    const requiresBarangay = form.role === 'Barangay Admin';
    if (requiresBarangay && !form.barangay) return;

    const fullName = form.role === 'Responder' ? form.taskForce : `${form.firstName} ${form.lastName}`.trim();

    try {
      const response = await fetch(`${API_URL}/api/auth/admin/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: form.role,
          barangay: requiresBarangay ? form.barangay : undefined,
          name: fullName,
          email: form.email,
          contactNumber: form.contactNumber,
          password: form.password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error || 'Unknown error'}`, 'error');
        return;
      }

      const result = await response.json();
      console.log("Account created successfully:", result);
      showToast("Account created successfully!", 'success');

      fetchUsers();

      setForm({ role: 'Barangay Admin', barangay: '', taskForce: '', firstName: '', lastName: '', email: '', contactNumber: '', password: '' });
      setShowModal(false);
    } catch (error) {
      console.error("Failed to create account:", error);
      showToast("Failed to connect to the server.", 'error');
    }
  };

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      {/* Toast Notification */}
      <div 
        className={`fixed top-6 right-6 z-100 flex items-center gap-3 px-5 py-3.5 rounded-md shadow-lg font-medium text-sm transition-all duration-300 transform ${
          toast 
            ? 'translate-x-0 opacity-100' 
            : 'translate-x-full opacity-0 pointer-events-none'
        } ${
          toast?.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}
      >
        <div className="flex items-center justify-center shrink-0">
          {toast?.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <X className="w-5 h-5" />
          )}
        </div>
        <p>{toast?.message}</p>
      </div>

      <div className="animate-fade-in space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">User Management</h2>
            <p className="text-slate-500 mt-1">Create and manage access for system users across all roles.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm shadow-primary/20 flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            Create Account
          </button>
        </div>

        <div className="w-full">
          
          {/* Create Account Modal */}
          {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden p-8 relative flex flex-col max-h-[90vh]">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-xl">
                <UserPlus className="w-6 h-6 text-primary" />
                Create Account
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-4 animate-fade-in">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">User Role</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <IdCard className="w-4 h-4 text-slate-400" />
                        </div>
                        <select 
                          required
                          value={form.role}
                          onChange={e => setForm({...form, role: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="Barangay Admin">Barangay Admin</option>
                          <option value="Responder">Responder (Response Unit)</option>
                        </select>
                      </div>
                    </div>

                    {form.role === 'Barangay Admin' && (
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Barangay</label>
                        <select 
                          required
                          value={form.barangay}
                          onChange={e => setForm({...form, barangay: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                        >
                          <option value="" disabled>Select a barangay</option>
                          <BarangayOptions />
                        </select>
                      </div>
                    )}

                    {form.role === 'Responder' && (
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Response Unit (Task Force)</label>
                        <select 
                          required
                          value={form.taskForce}
                          onChange={e => setForm({...form, taskForce: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                        >
                          <option value="" disabled>Select a Task Force</option>
                          {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={`Task Force ${num}`}>Task Force {num}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {form.role !== 'Responder' && (
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Full Name</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input 
                            type="text"
                            required
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={e => setForm({...form, firstName: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                          <input 
                            type="text"
                            required
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={e => setForm({...form, lastName: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        </div>
                      </div>
                    )}


                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </div>
                        <input 
                          type="email"
                          required
                          placeholder="user@example.com"
                          value={form.email}
                          onChange={e => setForm({...form, email: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Contact Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <span className="text-slate-400 font-bold text-xs">+63</span>
                        </div>
                        <input 
                          type="tel"
                          required
                          placeholder="912 345 6789"
                          value={form.contactNumber}
                          onChange={e => setForm({...form, contactNumber: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Temporary Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Key className="w-4 h-4 text-slate-400" />
                        </div>
                        <input 
                          type="password"
                          required
                          placeholder="••••••••"
                          value={form.password}
                          onChange={e => setForm({...form, password: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                <button type="submit" className="w-full bg-blue-400 hover:bg-blue-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-sm hover:shadow-md cursor-pointer">
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </button>
              </form>
            </div>
          </div>
          )}

          {/* Accounts Table */}
          <div className="w-full">
            <div className="bg-white rounded-md border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-slate-400" />
                    Registered Users
                  </h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                    {users.length} Total
                  </span>
                </div>
                
                {/* Role Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full overflow-x-auto max-w-full hide-scrollbar">
                  {['All', 'Citizen', 'Barangay Admin', 'Response Unit'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUserListTab(role)}
                      className={`px-5 py-2 text-[13px] font-bold rounded-full transition-all whitespace-nowrap cursor-pointer ${
                        userListTab === role ? 'bg-white text-blue-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="overflow-x-auto p-4">
                <table className="w-full text-left border-collapse border border-slate-200">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border border-slate-200 px-4 py-2 font-bold text-slate-700">Role & Location</th>
                      <th className="border border-slate-200 px-4 py-2 font-bold text-slate-700">User Details</th>
                      <th className="border border-slate-200 px-4 py-2 font-bold text-slate-700">Status</th>
                      <th className="border border-slate-200 px-4 py-2 font-bold text-slate-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter((user: any) => userListTab === 'All' || user.role === userListTab || (userListTab === 'Response Unit' && user.role === 'Responder')).map((user: any, index: number) => (
                      <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-colors`}>
                        <td className="border border-slate-200 px-4 py-2">
                          <span className="font-bold text-slate-800 block">{user.role}</span>
                          {user.barangay && <span className="text-xs text-slate-500">Brgy. {user.barangay}</span>}
                        </td>
                        <td className="border border-slate-200 px-4 py-2">
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </td>
                        <td className="border border-slate-200 px-4 py-2">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
                            Active
                          </span>
                        </td>
                        <td className="border border-slate-200 px-4 py-2 text-right">
                          <button className="text-slate-400 hover:text-red-500 font-semibold text-xs transition-colors cursor-pointer">
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.filter((user: any) => userListTab === 'All' || user.role === userListTab || (userListTab === 'Response Unit' && user.role === 'Responder')).length === 0 && (
                      <tr>
                        <td colSpan={4} className="border border-slate-200 px-4 py-8 text-center text-slate-400">
                          No users found for this role.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DepartmentLayout>
  );
}

