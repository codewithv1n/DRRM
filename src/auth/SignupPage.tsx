import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Key, X, ArrowLeft } from 'lucide-react';
import BarangayOptions from '../components/BarangayOptions';

export default function SignupPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'account' | 'family'>('account');
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);

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

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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
    if (!form.barangay) return;

    const fullName = `${form.firstName} ${form.lastName}`.trim();

    try {
      const response = await fetch('http://localhost:3000/api/auth/admin/create-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: 'Citizen',
          barangay: form.barangay,
          name: fullName,
          email: form.email,
          password: form.password,
          contactNumber: form.contactNumber,
          purok: form.purok,
          familyMembers: form.familyMembers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(`Error: ${errorData.error || 'Unknown error'}`, 'error');
        return;
      }

      showToast("Account created successfully! Redirecting to login...", 'success');

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error("Failed to create account:", error);
      showToast("Failed to connect to the server.", 'error');
    }
  };

  return (
    <div className="min-h-screen flex w-full font-sans">
      
      {/* Left Panel - Branding & Information */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between py-10 px-12 bg-[#0B1526] text-white relative overflow-hidden">
        
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,52,89,0.4)_0%,transparent_70%)] pointer-events-none z-0"></div>

        {/* Government Seal Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
          <img 
            src="/logo-system.png" 
            alt="System Logo" 
            className="object-contain opacity-[0.12]"
            style={{ width: '520px', height: '520px' }}
          />
        </div>
        
        {/* Top Header */}
        <div className="relative z-10">
          <h2 className="text-[20px] font-extrabold text-white mb-1 tracking-tight">Disaster Risk Reduction & Emergency Response</h2>
          <p className="text-[12px] text-white/60 font-medium">Republic of the Philippines • Local Government Unit</p>
        </div>

        {/* Center Content - overlaid on seal */}
        <div className="w-full relative z-10 flex flex-col items-center text-center mx-auto mt-auto mb-auto" style={{ maxWidth: '500px' }}>
          <h1 className="text-[44px] font-extrabold mb-6 leading-[1.1] tracking-tight text-white">
            Disaster Risk <br/>
            Reduction & <br/>
            Emergency Response
          </h1>
          <p className="text-white/70 text-[14px] leading-relaxed mx-auto font-normal" style={{ maxWidth: '420px' }}>
            A centralized digital platform for securely managing local government disaster response, incident reports, and evacuation records.
          </p>
        </div>


      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#FAFAFA] relative py-20 px-4 h-full overflow-y-auto">
        
        {/* Toast Notification */}
        <div 
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-md shadow-lg font-medium text-sm transition-all duration-300 transform ${
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

        <div className="w-full max-w-2xl px-4 lg:px-8">

          <div className="bg-white rounded-3xl w-full shadow-[0_12px_40px_rgb(0,0,0,0.06)] border border-slate-100 overflow-hidden p-8 relative flex flex-col">
            <button 
          onClick={() => navigate('/login')}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 cursor-pointer z-10 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </button>
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 text-xl">
          <UserPlus className="w-6 h-6 text-[#2563EB]" />
          Create Citizen Account
        </h3>

        <div className="flex border-b border-slate-200 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('account')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors outline-none cursor-pointer ${
              activeTab === 'account' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Account Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('family')}
            className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors outline-none cursor-pointer ${
              activeTab === 'family' ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Family Members
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'account' && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Barangay</label>
                <select 
                  required
                  value={form.barangay}
                  onChange={e => setForm({...form, barangay: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Select your barangay</option>
                  <BarangayOptions />
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Full Name</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input 
                    type="text"
                    required
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={e => setForm({...form, firstName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                  <input 
                    type="text"
                    required
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={e => setForm({...form, lastName: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Contact Number</label>
                  <input 
                    type="text"
                    placeholder="e.g. 09123456789"
                    value={form.contactNumber}
                    onChange={e => setForm({...form, contactNumber: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Complete Address</label>
                  <input 
                    type="text"
                    placeholder="e.g. Block 1 Lot 2, Purok 3"
                    value={form.purok}
                    onChange={e => setForm({...form, purok: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
              </div>

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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Password</label>
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
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'family' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Household Members</label>
                <button 
                  type="button" 
                  onClick={handleAddFamilyMember} 
                  className="text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer"
                >
                  + Add Member
                </button>
              </div>
              {form.familyMembers.length === 0 ? (
                <div className="text-center p-8 bg-slate-50 border border-slate-200 rounded-xl text-slate-400 text-sm">
                  No family members added.
                </div>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto p-1 pr-2">
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
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
                        />
                        <input 
                          type="text" 
                          placeholder="Last Name" 
                          required
                          value={member.lastName}
                          onChange={(e) => handleUpdateFamilyMember(idx, 'lastName', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <input 
                          type="text" 
                          placeholder="Relation" 
                          required
                          value={member.relation}
                          onChange={(e) => handleUpdateFamilyMember(idx, 'relation', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
                        />
                        <input 
                          type="number" 
                          placeholder="Age" 
                          required
                          value={member.age}
                          onChange={(e) => handleUpdateFamilyMember(idx, 'age', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
                        />
                        <select 
                          required
                          value={member.gender}
                          onChange={(e) => handleUpdateFamilyMember(idx, 'gender', e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563EB]/20 outline-none text-slate-500"
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
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#2563EB]/20 outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

              <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-6 shadow-sm hover:shadow-md cursor-pointer">
                <UserPlus className="w-4 h-4" />
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
