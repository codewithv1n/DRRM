import { useState, useEffect } from 'react';
import DepartmentLayout from '../../components/layout/AdminLayout';
import { useMockData } from '../../data/MockDataContext';
import { UserPlus, Shield, Mail, Key, IdCard, X } from 'lucide-react';

export default function UserManagement() {
  const { incidents } = useMockData();
  const pendingCount = incidents ? incidents.filter(i => i.status === 'Pending').length : 0;

  const [activeTab, setActiveTab] = useState<'account' | 'family'>('account');
  const [userListTab, setUserListTab] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/auth/users');
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
    role: 'Citizen',
    barangay: '',
    firstName: '',
    lastName: '',
    contactNumber: '',
    purok: '',
    email: '',
    password: '',
    familyMembers: [] as { firstName: string, lastName: string, relation: string, age: string, gender: string, medicalInfo: string }[]
  });

  const handleAddFamilyMember = () => {
    setForm(prev => ({
      ...prev,
      familyMembers: [...prev.familyMembers, { firstName: '', lastName: '', relation: '', age: '', gender: '', medicalInfo: '' }]
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.password) return;
    const requiresBarangay = form.role === 'Citizen' || form.role === 'Barangay Admin';
    if (requiresBarangay && !form.barangay) return;

    const fullName = `${form.firstName} ${form.lastName}`.trim();

    try {
      const response = await fetch('http://localhost:3000/api/auth/admin/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: form.role,
          barangay: requiresBarangay ? form.barangay : undefined,
          name: fullName,
          email: form.email,
          password: form.password,
          contactNumber: form.contactNumber,
          purok: form.purok,
          familyMembers: form.role === 'Citizen' ? form.familyMembers : undefined
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

      setForm({ role: 'Citizen', barangay: '', firstName: '', lastName: '', contactNumber: '', purok: '', email: '', password: '', familyMembers: [] });
      setActiveTab('account');
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
                          <optgroup label="District 1">
                            <option value="Alicia">Alicia</option>
                            <option value="Amihan">Amihan</option>
                            <option value="Apolonio Samson">Apolonio Samson</option>
                            <option value="Bahay Toro">Bahay Toro</option>
                            <option value="Balingasa">Balingasa</option>
                            <option value="Bungad">Bungad</option>
                            <option value="Damar">Damar</option>
                            <option value="Damayan">Damayan</option>
                            <option value="Del Monte">Del Monte</option>
                            <option value="Katipunan">Katipunan</option>
                            <option value="Lourdes">Lourdes</option>
                            <option value="Maharlika">Maharlika</option>
                            <option value="Manresa">Manresa</option>
                            <option value="Mariblo">Mariblo</option>
                            <option value="Masambong">Masambong</option>
                            <option value="N.S. Amoranto">N.S. Amoranto</option>
                            <option value="Nayong Kanluran">Nayong Kanluran</option>
                            <option value="Paang Bundok">Paang Bundok</option>
                            <option value="Pag-ibig sa Nayon">Pag-ibig sa Nayon</option>
                            <option value="Paltok">Paltok</option>
                            <option value="Paraiso">Paraiso</option>
                            <option value="Phil-Am">Phil-Am</option>
                            <option value="Project 6">Project 6</option>
                            <option value="Ramon Magsaysay">Ramon Magsaysay</option>
                            <option value="Saint Peter">Saint Peter</option>
                            <option value="Salvacion">Salvacion</option>
                            <option value="San Antonio">San Antonio</option>
                            <option value="San Isidro Labrador">San Isidro Labrador</option>
                            <option value="San Jose">San Jose</option>
                            <option value="Santa Cruz">Santa Cruz</option>
                            <option value="Santa Teresita">Santa Teresita</option>
                            <option value="Santo Cristo">Santo Cristo</option>
                            <option value="Santo Domingo">Santo Domingo</option>
                            <option value="Siena">Siena</option>
                            <option value="Talayan">Talayan</option>
                            <option value="Vasra">Vasra</option>
                            <option value="Veterans Village">Veterans Village</option>
                            <option value="West Triangle">West Triangle</option>
                          </optgroup>
                          <optgroup label="District 2">
                            <option value="Bagong Silangan">Bagong Silangan</option>
                            <option value="Batasan Hills">Batasan Hills</option>
                            <option value="Commonwealth">Commonwealth</option>
                            <option value="Holy Spirit">Holy Spirit</option>
                            <option value="Payatas">Payatas</option>
                          </optgroup>
                          <optgroup label="District 3">
                            <option value="Bagumbayan">Bagumbayan</option>
                            <option value="Bagumbuhay">Bagumbuhay</option>
                            <option value="Bayanihan">Bayanihan</option>
                            <option value="Blue Ridge A">Blue Ridge A</option>
                            <option value="Blue Ridge B">Blue Ridge B</option>
                            <option value="Camp Aguinaldo">Camp Aguinaldo</option>
                            <option value="Claro">Claro</option>
                            <option value="Dioquino Zobel">Dioquino Zobel</option>
                            <option value="Duyan-Duyan">Duyan-Duyan</option>
                            <option value="E. Rodriguez">E. Rodriguez</option>
                            <option value="East Kamias">East Kamias</option>
                            <option value="Escopa I">Escopa I</option>
                            <option value="Escopa II">Escopa II</option>
                            <option value="Escopa III">Escopa III</option>
                            <option value="Escopa IV">Escopa IV</option>
                            <option value="Libis">Libis</option>
                            <option value="Loyola Heights">Loyola Heights</option>
                            <option value="Mangga">Mangga</option>
                            <option value="Marilag">Marilag</option>
                            <option value="Masagana">Masagana</option>
                            <option value="Matandang Balara">Matandang Balara</option>
                            <option value="Milagrosa">Milagrosa</option>
                            <option value="Pansol">Pansol</option>
                            <option value="Quirino 2-A">Quirino 2-A</option>
                            <option value="Quirino 2-B">Quirino 2-B</option>
                            <option value="San Roque">San Roque</option>
                            <option value="Silangan">Silangan</option>
                            <option value="Socorro">Socorro</option>
                            <option value="Tagumpay">Tagumpay</option>
                            <option value="Ugong Norte">Ugong Norte</option>
                            <option value="Villa Maria Clara">Villa Maria Clara</option>
                            <option value="West Kamias">West Kamias</option>
                            <option value="White Plains">White Plains</option>
                          </optgroup>
                          <optgroup label="District 4">
                            <option value="Bagong Lipunan ng Crame">Bagong Lipunan ng Crame</option>
                            <option value="Botocan">Botocan</option>
                            <option value="Central">Central</option>
                            <option value="Damayang Lagi">Damayang Lagi</option>
                            <option value="Don Manuel">Don Manuel</option>
                            <option value="Doña Aurora">Doña Aurora</option>
                            <option value="Doña Imelda">Doña Imelda</option>
                            <option value="Doña Josefa">Doña Josefa</option>
                            <option value="Horseshoe">Horseshoe</option>
                            <option value="Immaculate Conception">Immaculate Conception</option>
                            <option value="Kalusugan">Kalusugan</option>
                            <option value="Kamuning">Kamuning</option>
                            <option value="Kaunlaran">Kaunlaran</option>
                            <option value="Kristong Hari">Kristong Hari</option>
                            <option value="Krus na Ligas">Krus na Ligas</option>
                            <option value="Laging Handa">Laging Handa</option>
                            <option value="Malaya">Malaya</option>
                            <option value="Mariana">Mariana</option>
                            <option value="Obrero">Obrero</option>
                            <option value="Old Capitol Site">Old Capitol Site</option>
                            <option value="Paligsahan">Paligsahan</option>
                            <option value="Pinagkaisahan">Pinagkaisahan</option>
                            <option value="Piñahan">Piñahan</option>
                            <option value="Roxas">Roxas</option>
                            <option value="Sacred Heart">Sacred Heart</option>
                            <option value="San Isidro Galas">San Isidro Galas</option>
                            <option value="San Martin de Porres">San Martin de Porres</option>
                            <option value="San Vicente">San Vicente</option>
                            <option value="Santo Niño">Santo Niño</option>
                            <option value="Santol">Santol</option>
                            <option value="Sikatuna Village">Sikatuna Village</option>
                            <option value="South Triangle">South Triangle</option>
                            <option value="Tatalon">Tatalon</option>
                            <option value="Teachers Village East">Teachers Village East</option>
                            <option value="Teachers Village West">Teachers Village West</option>
                            <option value="U.P. Campus">U.P. Campus</option>
                            <option value="U.P. Village">U.P. Village</option>
                            <option value="Valencia">Valencia</option>
                          </optgroup>
                          <optgroup label="District 5">
                            <option value="Bagbag">Bagbag</option>
                            <option value="Capri">Capri</option>
                            <option value="Fairview">Fairview</option>
                            <option value="Greater Lagro">Greater Lagro</option>
                            <option value="Gulod">Gulod</option>
                            <option value="Kaligayahan">Kaligayahan</option>
                            <option value="Nagkaisang Nayon">Nagkaisang Nayon</option>
                            <option value="North Fairview">North Fairview</option>
                            <option value="Novaliches Proper">Novaliches Proper</option>
                            <option value="Pasong Putik Proper">Pasong Putik Proper</option>
                            <option value="San Agustin">San Agustin</option>
                            <option value="San Bartolome">San Bartolome</option>
                            <option value="Santa Lucia">Santa Lucia</option>
                            <option value="Santa Monica">Santa Monica</option>
                          </optgroup>
                          <optgroup label="District 6">
                            <option value="Apolonio Samson">Apolonio Samson</option>
                            <option value="Baesa">Baesa</option>
                            <option value="Balon-Bato">Balon-Bato</option>
                            <option value="Culiat">Culiat</option>
                            <option value="New Era">New Era</option>
                            <option value="Pasong Tamo">Pasong Tamo</option>
                            <option value="Sangandaan">Sangandaan</option>
                            <option value="Sauyo">Sauyo</option>
                            <option value="Talipapa">Talipapa</option>
                            <option value="Tandang Sora">Tandang Sora</option>
                            <option value="Unang Sigaw">Unang Sigaw</option>
                          </optgroup>
                        </select>
                      </div>
                    )}

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
                        className="text-xs font-bold text-primary hover:text-blue-600 transition-colors cursor-pointer"
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
