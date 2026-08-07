import { Package, Calendar, Clock, Bell, Info, CreditCard, CheckCircle2 } from 'lucide-react';
import CitizenLayout from '../../components/layout/CitizenLayout';
import { useMockData } from '../../data/MockDataContext';

export default function CitizenAnnouncements() {
  const { activeAlerts } = useMockData();
  
  const reliefAnnouncements = activeAlerts.filter(alert => 
    alert.message.includes('RELIEF DISTRIBUTION') || alert.message.toLowerCase().includes('relief')
  );

  return (
    <CitizenLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 font-display flex items-center gap-3">
            Relief Announcements
          </h2>
          <p className="text-slate-500 mt-1">
            Stay updated on the latest relief goods distribution in your barangay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-4">
            {reliefAnnouncements.length > 0 ? (
              reliefAnnouncements.map(alert => {
                const date = new Date(alert.timestamp);
                return (
                  <div key={alert.id} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
                              Relief Goods
                            </span>
                            <span className="text-sm font-semibold text-slate-400">
                              {alert.channel}
                            </span>
                          </div>
                          <p className="text-slate-800 font-medium leading-relaxed mt-2 text-lg">
                            {alert.message}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row md:flex-col items-center md:items-end gap-2 md:gap-1 text-sm text-slate-500 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span>{date.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span>{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">No Announcements Yet</h3>
                <p className="text-slate-500 max-w-md">
                  There are currently no relief distribution announcements. We will notify you once a schedule is set.
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 sticky top-8">
              <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
                <Info className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-800 font-display">Claiming Guidelines</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-orange-50/50 border border-orange-100/60 rounded-2xl p-4 flex items-start gap-3.5">
                  <div className="bg-orange-100/70 p-2 rounded-xl text-orange-700 shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-900 text-sm mb-1">Bring Valid ID</h4>
                    <p className="text-xs text-orange-800 leading-relaxed">
                      Please bring your physical ID (or a photocopy) to present at the distribution center for verification.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-start gap-3.5">
                  <div className="bg-white p-2 border border-slate-100 rounded-xl text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-700 text-sm mb-1">One per Household</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Only one representative per household is allowed to claim the relief goods to maintain order.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CitizenLayout>
  );
}
