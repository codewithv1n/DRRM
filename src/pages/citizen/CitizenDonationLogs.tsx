import { useState, useEffect } from 'react';
import { Heart, Package, Clock, CheckCircle } from 'lucide-react';
import CitizenLayout from '../../components/layout/CitizenLayout';

import { encryptedFetch } from '../../utils/encryptedFetch';
const API_URL = import.meta.env.VITE_API_URL;

interface DonationLog {
  id: string;
  type: string;
  quantity: number;
  status: 'Pending' | 'Received';
  date: string;
}

export default function CitizenDonationLogs() {
  const [donations, setDonations] = useState<DonationLog[]>([]);
  const [loading, setLoading] = useState(true);

  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const userEmail = user?.email || '';

  useEffect(() => {
    const fetchDonations = async () => {
      if (!userEmail) {
        setLoading(false);
        return;
      }

      try {
        // Fetch Pending Donations
        const pendingRes = await encryptedFetch(`${API_URL}/api/donations/pending`);
        const pendingData = await pendingRes.json();
        const userPending = pendingData
          .filter((d: any) => d.email === userEmail)
          .map((d: any) => ({
            id: `pending-${d.donation_pending_id}`,
            type: d.donation_type,
            quantity: d.quantity,
            status: 'Pending' as const,
            date: d.created_at,
          }));

        // Fetch Received Donations (Logs)
        const logsRes = await encryptedFetch(`${API_URL}/api/donations/logs`);
        const logsData = await logsRes.json();
        const userLogs = logsData
          .filter((d: any) => d.email === userEmail)
          .map((d: any) => ({
            id: `log-${d.donation_log_id}`,
            type: d.donation_type,
            quantity: d.quantity,
            status: 'Received' as const,
            date: d.received_at,
          }));

        // Combine and sort by date descending
        const combined = [...userPending, ...userLogs].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setDonations(combined);
      } catch (err) {
        console.error('Error fetching donations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, [userEmail]);

  return (
    <CitizenLayout>
      <div className="animate-fade-in pb-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500" /> My Donations
          </h1>
          <p className="text-slate-500 mt-1">Track the status of your relief good contributions.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
                <Package className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Donation History</h2>
            </div>
            <div className="text-sm font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
              {donations.length} {donations.length === 1 ? 'Record' : 'Records'}
            </div>
          </div>
          
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="p-12 text-center text-slate-400 font-medium">Loading donations...</div>
            ) : donations.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-700">No Donations Yet</h3>
                <p className="text-slate-500 max-w-sm mt-1">
                  You haven't made any donations using this account. You can donate via the public portal.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-sm text-slate-500 bg-slate-50/50">
                    <th className="p-4 font-semibold">Donation Type</th>
                    <th className="p-4 font-semibold">Quantity</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Date Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {donations.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                             <Package className="w-4 h-4 text-slate-500" />
                           </div>
                           <span className="font-bold text-slate-800">{item.type}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-700 font-medium">
                         {item.quantity}
                      </td>
                      <td className="p-4">
                        {item.status === 'Received' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Received
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" /> Pending
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right text-sm text-slate-500 font-medium">
                        {new Date(item.date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
