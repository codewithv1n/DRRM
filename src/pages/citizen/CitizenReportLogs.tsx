import { FileText, MapPin, Clock, ShieldAlert, CheckCircle, Clock3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import CitizenLayout from '../../components/layout/CitizenLayout';

const API_URL = import.meta.env.VITE_API_URL;

const LocationDisplay = ({ locationStr }: { locationStr: string }) => {
  const [address, setAddress] = useState(locationStr);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const parseAndFetch = async () => {
      let lat = null;
      let lon = null;

      // Check for Decimal Degrees format like "14.6497 N, 121.0022 E"
      const decimalRegex = /([0-9.]+)\s*N\s*,\s*([0-9.]+)\s*E/i;
      const decMatch = locationStr.match(decimalRegex);
      
      if (decMatch) {
        lat = Number(decMatch[1]);
        lon = Number(decMatch[2]);
      } else {
        // Check for DMS format like "14°37'52.92"N 120°59'30.78"E"
        const dmsRegex = /([0-9]+)°([0-9]+)'([0-9.]+)"([NS])\s*([0-9]+)°([0-9]+)'([0-9.]+)"([EW])/i;
        const dmsMatch = locationStr.match(dmsRegex);
        if (dmsMatch) {
          const rawLat = Number(dmsMatch[1]) + Number(dmsMatch[2])/60 + Number(dmsMatch[3])/3600;
          const rawLon = Number(dmsMatch[5]) + Number(dmsMatch[6])/60 + Number(dmsMatch[7])/3600;
          lat = dmsMatch[4].toUpperCase() === 'S' ? -rawLat : rawLat;
          lon = dmsMatch[8].toUpperCase() === 'W' ? -rawLon : rawLon;
        }
      }

      if (lat !== null && lon !== null) {
        try {
          setIsLoading(true);
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await res.json();
          if (data && data.display_name) {
            // Simplify address to roughly 3-4 components (e.g. Barangay, City, Province)
            const parts = data.display_name.split(', ');
            setAddress(parts.slice(0, 3).join(', '));
          }
        } catch (e) {
          console.error('Reverse geocoding error:', e);
        } finally {
          setIsLoading(false);
        }
      }
    };
    parseAndFetch();
  }, [locationStr]);

  return <span className={isLoading ? "animate-pulse" : ""}>{isLoading ? 'Translating...' : address}</span>;
}

export default function CitizenReportLogs() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const stored = localStorage.getItem('user');
        if (!stored) {
          setIsLoading(false);
          return;
        }
        
        const user = JSON.parse(stored);
        if (!user.email) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${API_URL}/api/citizen-report-logs?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          setIncidents(data);
        }
      } catch (err) {
        console.error('Failed to fetch citizen report logs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <CitizenLayout>
      <div className="animate-fade-in space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 font-display">My Incident Reports</h2>
          <p className="text-slate-500 text-sm mt-1">Track the status of emergencies and hazards you've reported.</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.01)] overflow-hidden overflow-x-auto">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h3 className="font-bold text-slate-800">Report History</h3>
          </div>
          
          {isLoading ? (
             <div className="p-12 text-center text-slate-500">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
               <p>Loading reports...</p>
             </div>
          ) : incidents.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold whitespace-nowrap">Report Logs ID</th>
                  <th className="p-4 font-semibold">Incident Type</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Date Reported</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {incidents.map(incident => (
                  <tr key={incident.citizen_report_logs_id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 font-mono text-xs text-slate-400">
                      {incident.citizen_report_logs_id}
                    </td>
                    <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                      {incident.type}
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" /> 
                        <LocationDisplay locationStr={incident.location} />
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {new Date(incident.created_at).toLocaleDateString()}</span>
                    </td>
                    <td className="p-4">
                      {incident.status === 'Pending' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100 whitespace-nowrap">
                          <Clock3 className="w-3 h-3" /> Pending Review
                        </span>
                      )}
                      {incident.status === 'Responding' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
                          <Clock3 className="w-3 h-3" /> Responding
                        </span>
                      )}
                      {incident.status === 'Resolved' && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 whitespace-nowrap">
                          <CheckCircle className="w-3 h-3" /> Resolved
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-slate-500">
              <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
              <p>You haven't reported any incidents yet.</p>
            </div>
          )}
        </div>
      </div>
    </CitizenLayout>
  );
}
