import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Package, MapPin, Mail, User, CheckCircle2, Info } from 'lucide-react';

export default function DonationsPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans text-slate-800 flex flex-col items-center py-12 px-4">
      {/* Background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-96 bg-linear-to-b from-emerald-50 to-transparent -z-10"></div>
      
      {/* Header */}
      <div className="w-full max-w-5xl flex items-center justify-between mb-10">
        <button 
          onClick={() => navigate('/public_portal')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Portal</span>
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <Heart className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="font-bold text-lg tracking-wider text-slate-900">QCDRRMO</span>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden h-full">
            {!submitted ? (
              <>
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                    Donate Relief Goods
                  </h2>
                  <p className="text-slate-500">
                    Your contribution can save lives. Please fill out the form below to coordinate your donation drop-off or pick-up.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <input 
                          type="text" 
                          required
                          placeholder="Concerned Citizen"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="w-5 h-5 text-slate-400" />
                        </div>
                        <input 
                          type="email" 
                          required
                          placeholder="citizen@example.com"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Type of Relief */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type of Donation <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                        <select 
                          required
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-700 appearance-none cursor-pointer"
                        >
                          <option value="">Select relief type...</option>
                          <option value="food">Food & Water</option>
                          <option value="clothes">Clothes & Blankets</option>
                          <option value="medical">Medical Supplies</option>
                          <option value="hygiene">Hygiene Kits</option>
                          <option value="other">Others</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Donation Description & Quantity <span className="text-red-500">*</span></label>
                      <textarea 
                        required
                        rows={3}
                        placeholder="E.g., 5 boxes of canned goods, 2 sacks of rice..."
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 resize-none"
                      />
                    </div>

                    {/* Address */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Pick-up Address or Drop-off Note</label>
                      <div className="relative">
                        <div className="absolute top-3.5 left-0 pl-3.5 flex items-start pointer-events-none">
                          <MapPin className="w-5 h-5 text-slate-400" />
                        </div>
                        <textarea 
                          rows={2}
                          placeholder="Where can we collect this? Or state if dropping off..."
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none text-slate-700 placeholder:text-slate-400 resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 mt-6 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Heart className="w-5 h-5" />
                        Submit Donation Request
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="h-full min-h-125 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Thank You for Your Kindness!</h3>
                <p className="text-slate-500 mb-8 max-w-sm text-lg">
                  Your donation request has been successfully recorded. Our logistics team will contact you shortly regarding the collection.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors cursor-pointer"
                >
                  Make Another Donation
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <div className="lg:col-span-5 h-full">
          <div className="bg-slate-900 rounded-4xl p-8 h-full flex flex-col relative overflow-hidden shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <div className="relative z-10 mb-8 mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6 border border-emerald-500/20">
                <Info className="w-4 h-4" />
                Donation Guidelines
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">How your help reaches those in need</h3>
              <p className="text-slate-400 leading-relaxed text-sm">
                The Quezon City Disaster Risk Reduction and Management Office ensures that all donations are properly sorted, accounted for, and distributed to the most affected families efficiently.
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-5 relative z-10">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm">
                <div className="bg-emerald-500/20 p-3 rounded-xl shrink-0">
                  <Package className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1.5">Accepted Items</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">Non-perishable food, bottled water, clean clothes, blankets, medicine, and hygiene kits are highly prioritized.</p>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm">
                <div className="bg-blue-500/20 p-3 rounded-xl shrink-0">
                  <MapPin className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm mb-1.5">Drop-off Centers</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">QC Hall Main Drop-off Center is open 24/7. Various barangay halls also serve as collection points for nearby residents.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
              <p className="text-slate-400 text-sm text-center">
                For bulk donations or cash assistance, please contact the <span className="text-emerald-400 font-semibold cursor-pointer hover:underline">Mayor's Office</span> directly.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

