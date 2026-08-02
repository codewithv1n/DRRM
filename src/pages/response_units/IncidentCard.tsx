import { useState } from 'react';
import { CheckCircle, MapPin, Phone, User, Siren } from 'lucide-react';
import type { Incident } from '../../data/mockData';

interface IncidentCardProps {
  incident: Incident;
  onUpdateStatus: (id: string, newStatus: 'Responding' | 'Resolved', remark?: string) => void;
}

export default function IncidentCard({ incident, onUpdateStatus }: IncidentCardProps) {
  const [remark, setRemark] = useState('');

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
      <div className={`p-4 flex justify-between items-center ${
        incident.type === 'Fire' ? 'bg-red-500 text-white' :
        incident.type === 'Flood' ? 'bg-blue-500 text-white' :
        incident.type === 'Medical' ? 'bg-green-500 text-white' :
        'bg-yellow-500 text-white'
      }`}>
        <div className="flex items-center gap-2 font-bold">
          <Siren className="w-5 h-5" />
          {incident.type} Emergency
        </div>
        <span className="text-xs bg-black/20 px-2 py-1 rounded-full">{incident.id}</span>
      </div>
      
      <div className="p-5 flex-1 space-y-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Location</p>
            <p className="text-slate-800 font-medium">{incident.location}</p>
            {incident.gpsLocation && <p className="text-[10px] text-slate-400 font-mono mt-1">GPS: {incident.gpsLocation}</p>}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Reporter</p>
            <p className="text-slate-800 font-medium">{incident.reporterName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase">Contact</p>
            <p className="text-slate-800 font-medium">{incident.contactNumber}</p>
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-slate-100 bg-slate-50 mt-auto">
        {incident.status === 'Pending' ? (
          <button 
            onClick={() => onUpdateStatus(incident.id, 'Responding')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors cursor-pointer"
          >
            Respond Now
          </button>
        ) : (
          <div className="space-y-3">
            <input 
                type="text" 
                placeholder="Post-operation remarks..." 
                className="w-full text-sm p-2 rounded border border-slate-300 focus:outline-none focus:border-emerald-500"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
            />
            <button 
              onClick={() => onUpdateStatus(incident.id, 'Resolved', remark)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Resolved
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
