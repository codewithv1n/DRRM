import { useState } from 'react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useMockData } from '../../data/MockDataContext';
import { UserPlus, Shield, Mail, Key, IdCard, X } from 'lucide-react';

export default function UserManagement() {
  const { incidents, systemUsers, addSystemUser } = useMockData();
  const pendingCount = incidents ? incidents.filter(i => i.status === 'Pending').length : 0;

  const [activeTab, setActiveTab] = useState<'account' | 'family'>('account');
  const [userListTab, setUserListTab] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    role: 'Citizen',
    barangay: '',
    firstName: '',
    middleName: '',
    lastName: '',
    contactNumber: '',
    purok: '',
    email: '',
    password: '',
    familyMembers: [] as { firstName: string, middleName: string, lastName: string, relation: string, age: string, gender: string, medicalInfo: string }[]
  });

  const handleAddFamilyMember = () => {
    setForm(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { firstName: '', middleName: '', lastName: '', relation: '', age: '', gender: '', medicalInfo: '' }]
    }));
  };

  const handleUpdateFamilyMember = (index: number, field: string, value: string) => {
    const updated = [...form.familyMembers];
    updated[index] = { ...updated[index], [field]: value } as any;
    setForm(prev => ({ ...prev, familyMembers: updated }));
  };

  const handleRemoveFamilyMember = (index: number) => {
    setForm(prev => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) return;
    const requiresBarangay = form.role === 'Citizen' || form.role === 'Barangay Admin';
    if (requiresBarangay && !form.barangay) return;

    const fullName = `${form.firstName} ${form.middleName ? form.middleName + ' ' : ''}${form.lastName}`.trim();

    addSystemUser({
      role: form.role,
      barangay: requiresBarangay ? form.barangay : undefined,
      name: fullName,
      email: form.email,
      password: form.password,
      familyMembers: form.role === 'Citizen' ? form.familyMembers : undefined
    });

    setForm({ role: 'Citizen', barangay: '', firstName: '', middleName: '', lastName: '', contactNumber: '', purok: '', email: '', password: '', familyMembers: [] });
    setActiveTab('account');
    setShowModal(false);
  };

  return (
    <DepartmentLayout pendingCount={pendingCount}>
      <div className="animate-fade-in space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">User Management</h2>
            <p className="text-slate-500 mt-1">Create and manage access for system users across all roles.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm shadow-primary/20 flex items-center gap-2 cursor-pointer"
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

              {form.role === 'Citizen' && (
                <div className="flex border-b border-slate-200 mb-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab('account')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors outline-none cursor-pointer ${
                      activeTab === 'account' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Account Info
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('family')}
                    className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors outline-none cursor-pointer ${
                      activeTab === 'family' ? 'border-primary text-primary' : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Family Members
                  </button>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {(activeTab === 'account' || form.role !== 'Citizen') && (
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
                          onChange={e => {
                            setForm({...form, role: e.target.value});
                            if (e.target.value !== 'Citizen') setActiveTab('account');
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none cursor-pointer"
                        >
                          <option value="Citizen">Citizen</option>
                          <option value="Barangay Admin">Barangay Admin</option>
                          <option value="Responder">Responder (Response Unit)</option>
                          <option value="Department Admin">Department Admin</option>
                        </select>
                      </div>
                    </div>

                    {(form.role === 'Citizen' || form.role === 'Barangay Admin') && (
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Barangay</label>
                        <select 
                          required
                          value={form.barangay}
                          onChange={e => setForm({...form, barangay: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                        >
                          <option value="" disabled>Select a barangay</option>
                          <option value="Payatas">Payatas</option>
                          <option value="Commonwealth">Commonwealth</option>
                          <option value="Batasan Hills">Batasan Hills</option>
                          <option value="Holy Spirit">Holy Spirit</option>
                          <option value="Fairview">Fairview</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Full Name</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                          placeholder="Middle Name (Optional)"
                          value={form.middleName}
                          onChange={e => setForm({...form, middleName: e.target.value})}
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

                    {form.role === 'Citizen' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Contact Number</label>
                          <input 
                            type="text"
                            placeholder="e.g. 09123456789"
                            value={form.contactNumber}
                            onChange={e => setForm({...form, contactNumber: e.target.value})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Complete Address</label>
                          <input 
                            type="text"
                            placeholder="e.g. Block 1 Lot 2, Purok 3"
                            value={form.purok}
                            onChange={e => setForm({...form, purok: e.target.value})}
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
                )}

                {activeTab === 'family' && form.role === 'Citizen' && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Household Members</label>
                      <button 
                        type="button" 
                        onClick={handleAddFamilyMember} 
                        className="text-xs font-bold text-primary hover:text-orange-600 transition-colors cursor-pointer"
                      >
                        + Add Member
                      </button>
                    </div>
                    {form.familyMembers.length === 0 ? (
                      <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
                        No family members added.
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-80 overflow-y-auto p-1">
                        {form.familyMembers.map((member, idx) => (
                          <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 relative shadow-sm">
                            <button 
                              type="button" 
                              onClick={() => handleRemoveFamilyMember(idx)} 
                              className="absolute top-3 right-3 text-slate-400 hover:text-red-500 cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <input 
                                type="text" 
                                placeholder="First Name" 
                                required
                                value={member.firstName}
                                onChange={(e) => handleUpdateFamilyMember(idx, 'firstName', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                              />
                              <input 
                                type="text" 
                                placeholder="Middle Name" 
                                value={member.middleName}
                                onChange={(e) => handleUpdateFamilyMember(idx, 'middleName', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                              />
                              <input 
                                type="text" 
                                placeholder="Last Name" 
                                required
                                value={member.lastName}
                                onChange={(e) => handleUpdateFamilyMember(idx, 'lastName', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              <input 
                                type="text" 
                                placeholder="Relation" 
                                required
                                value={member.relation}
                                onChange={(e) => handleUpdateFamilyMember(idx, 'relation', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                              />
                              <input 
                                type="number" 
                                placeholder="Age" 
                                required
                                value={member.age}
                                onChange={(e) => handleUpdateFamilyMember(idx, 'age', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                              />
                              <select 
                                required
                                value={member.gender}
                                onChange={(e) => handleUpdateFamilyMember(idx, 'gender', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none text-slate-500"
                              >
                                <option value="" disabled>Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </select>
                              <input 
                                type="text" 
                                placeholder="Medical Info (Optional)" 
                                value={member.medicalInfo}
                                onChange={(e) => handleUpdateFamilyMember(idx, 'medicalInfo', e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <button type="submit" className="w-full bg-orange-400 hover:bg-orange-500 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-sm hover:shadow-md cursor-pointer">
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </button>
              </form>
            </div>
          </div>
          )}

          {/* Accounts Table */}
          <div className="w-full">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-slate-400" />
                    Registered Users
                  </h3>
                  <span className="text-xs font-bold bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                    {systemUsers?.length || 0} Total
                  </span>
                </div>
                
                {/* Role Tabs */}
                <div className="flex bg-slate-200/50 p-1 rounded-xl overflow-x-auto max-w-full hide-scrollbar">
                  {['All', 'Citizen', 'Barangay Admin', 'Response Unit', 'Department Admin'].map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setUserListTab(role)}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                        userListTab === role ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wider font-semibold">
                      <th className="px-6 py-4">Role & Location</th>
                      <th className="px-6 py-4">User Details</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {systemUsers?.filter((user: any) => userListTab === 'All' || user.role === userListTab).map((user: any) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-bold text-slate-800 block">{user.role}</span>
                          {user.barangay && <span className="text-xs text-slate-500">Brgy. {user.barangay}</span>}
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-slate-400 hover:text-red-500 font-semibold text-xs transition-colors cursor-pointer">
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                    {!systemUsers || systemUsers.filter((user: any) => userListTab === 'All' || user.role === userListTab).length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
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
