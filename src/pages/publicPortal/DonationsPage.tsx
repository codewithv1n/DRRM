import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Package, MapPin, Mail, User, CheckCircle2, Info, Upload, X } from 'lucide-react';


import { encryptedFetch } from '../../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

export default function DonationsPage() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    type: '',
    quantity: '' as number | string
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPhoto(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const data = new FormData();
      data.append('full_name', formData.fullName);
      data.append('email', formData.email);
      data.append('donation_type', formData.type);
      data.append('quantity', formData.quantity.toString());
      if (photo) {
        data.append('photo', photo);
      }

      const response = await encryptedFetch(`${API_URL}/api/donations/pending`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Error submitting donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-x-hidden font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-6 flex justify-between items-center z-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img src="/logo-system.png" alt="GovServe Logo" className="h-10 object-contain shrink-0" />
          <span className="font-bold text-lg tracking-wider text-slate-900">GovServe</span>
        </div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => navigate('/public_portal')} 
            className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-5 py-2 rounded-full shadow-sm hover:bg-slate-100 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Portal
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-4 z-10 w-full max-w-6xl mx-auto mt-6 pb-20">
        
        {/* Top Badge */}
        <div className="bg-blue-50 text-blue-600 rounded-full px-4 py-1.5 flex items-center gap-2 mb-8 border border-blue-100">
          <Heart className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[10px] font-extrabold tracking-widest uppercase">Relief & Donations</span>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Donate Relief <span className="text-blue-600">Goods</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-center text-slate-500 max-w-2xl text-[15px] md:text-base mb-12 leading-relaxed">
          Your contribution saves lives. Coordinate your donation drop-off or pick-up with our disaster response team.
        </p>

        {/* Form and Info Section Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Card */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-[20px] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden h-full">
              {!submitted ? (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                      Donation Form
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Please fill out the details below to log your relief goods contribution.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <input 
                          type="text" 
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Concerned Citizen"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-slate-800 text-sm placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Mail className="w-4 h-4 text-slate-400" />
                        </div>
                        <input 
                          type="email" 
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="citizen@example.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-slate-800 text-sm placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    {/* Type of Relief */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Type of Donation <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <Package className="w-4 h-4 text-slate-400" />
                        </div>
                        <select 
                          required
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-slate-800 text-sm appearance-none cursor-pointer"
                        >
                          <option value="">Select relief type...</option>
                          <option value="Food & Water">Food & Water</option>
                          <option value="Clothes & Blankets">Clothes & Blankets</option>
                          <option value="Medical Supplies">Medical Supplies</option>
                          <option value="Hygiene Kits">Hygiene Kits</option>
                          <option value="Others">Others</option>
                        </select>
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Quantity <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="number"
                        min="1"
                        max="1000000"
                        required
                        onChange={(e) => {
                          let val = parseInt(e.target.value);
                          if (val > 1000000) val = 1000000;
                          setFormData({ ...formData, quantity: isNaN(val) ? '' : val });
                        }}
                        value={formData.quantity}
                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all outline-none text-slate-800 text-sm"
                      />
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Upload Photo of Relief Items
                      </label>

                      {imagePreview ? (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group max-h-44 flex items-center justify-center">
                          <img src={imagePreview} alt="Donation item preview" className="w-full h-44 object-cover" />
                          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={handleRemoveImage}
                              className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <X className="w-4 h-4" /> Remove Photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer group bg-slate-50">
                          <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors mb-2">
                            <Upload className="w-4 h-4" />
                          </div>
                          <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                            Click to upload photo of items
                          </span>
                          <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, or WEBP (Max 5MB)</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            className="hidden" 
                          />
                        </label>
                      )}
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 mt-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-[0_8px_20px_rgb(37,99,235,0.25)] transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Heart className="w-4 h-4 fill-white" />
                          Submit Donation Request
                        </>
                      )}
                    </button>
                  </form>
                </>
              ) : (
                <div className="h-full min-h-95 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6 border border-blue-100">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Thank You for Your Kindness!</h3>
                  <p className="text-slate-500 mb-8 max-w-sm text-sm leading-relaxed">
                    Your donation request has been successfully recorded. Our logistics team will contact you shortly regarding the collection.
                  </p>
                  <button 
                    onClick={() => {
                      setSubmitted(false);
                      setImagePreview(null);
                      setPhoto(null);
                      setFormData({ fullName: '', email: '', type: '', quantity: '' });
                    }}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    Make Another Donation
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel (Guidelines) */}
          <div className="lg:col-span-5 h-full">
            <div className="bg-slate-900 rounded-[20px] p-8 h-full flex flex-col relative overflow-hidden shadow-xl text-white">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              
              <div className="relative z-10 mb-8 mt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mb-6 border border-blue-500/30">
                  <Info className="w-3.5 h-3.5" />
                  Donation Guidelines
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">How your help reaches those in need</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  Our Disaster Risk Reduction & Management Office ensures that all donations are properly sorted, accounted for, and distributed to affected families efficiently.
                </p>
              </div>

              <div className="flex-1 flex flex-col gap-4 relative z-10">
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm">
                  <div className="bg-blue-500/20 p-3 rounded-xl shrink-0 text-blue-400">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Accepted Items</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">Non-perishable food, bottled water, clean clothes, blankets, medicine, and hygiene kits are highly prioritized.</p>
                  </div>
                </div>
                
                <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-4 backdrop-blur-sm">
                  <div className="bg-blue-500/20 p-3 rounded-xl shrink-0 text-blue-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm mb-1">Drop-off Centers</h4>
                    <p className="text-slate-400 text-xs leading-relaxed">City Hall Main Drop-off Center is open 24/7. Barangay halls also serve as collection points for nearby residents.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                <p className="text-slate-400 text-xs text-center leading-relaxed">
                  For bulk donations or cash assistance, please contact the <span className="text-blue-400 font-semibold cursor-pointer hover:underline">Disaster Response Office</span> directly.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-[11px] font-bold tracking-wider uppercase text-slate-300 border-t border-slate-100 mt-auto bg-white z-10 relative">
        © 2026 GOVSERVE. Secure Government Platform.
      </footer>
    </div>
  );
}
