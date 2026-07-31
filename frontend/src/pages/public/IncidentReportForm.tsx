import React, { useState } from 'react';
import { useMockData } from '../../data/MockDataContext';
import type { EmergencyType } from '../../data/mockData';
import { AlertCircle, Camera, CheckCircle2, MapPin, Phone, User } from 'lucide-react';

export default function IncidentReportForm() {
  const { addIncident } = useMockData();
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    reporterName: '',
    contactNumber: '',
    location: '',
    type: 'Fire' as EmergencyType,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIncident(formData);
    setShowSuccess(true);
    setFormData({ reporterName: '', contactNumber: '', location: '', type: 'Fire' });
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans text-foreground">
      {/* Toast Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50 transition-all duration-300 animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-semibold">Report Submitted to QC EOC</span>
        </div>
      )}

      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
        <div className="bg-red-600 p-6 text-center text-white">
          <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-90" />
          <h1 className="text-2xl font-bold font-display">QC Helpline 122</h1>
          <p className="text-red-100 text-sm mt-1">Emergency Incident Report</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <input
                type="text"
                name="reporterName"
                required
                value={formData.reporterName}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                placeholder="Juan Dela Cruz"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Contact Number</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <input
                type="tel"
                name="contactNumber"
                required
                value={formData.contactNumber}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                placeholder="0912 345 6789"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Exact Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-3 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
                placeholder="Brgy, Street, Landmark"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Emergency Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="block w-full px-3 py-3 bg-background border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all focus:outline-none"
            >
              <option value="Fire">Fire</option>
              <option value="Flood">Flood</option>
              <option value="Medical">Medical</option>
              <option value="Road Obstruction">Road Obstruction</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Upload Photo (Optional)</label>
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span className="text-sm font-medium">Tap to take a photo</span>
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg"
          >
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
}
