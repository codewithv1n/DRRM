import { useState } from 'react';
import {
  initialAnnouncements,
  initialCustomAlerts,
  announcementCategoryStyles,
  alertSeverityStyles,
  type Announcement,
  type CustomAlert,
} from '../../data/AdminData';

export default function AlertsContentPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [customAlerts, setCustomAlerts] = useState<CustomAlert[]>(initialCustomAlerts);
  const [activeTab, setActiveTab] = useState<'announcements' | 'alerts'>('announcements');
  const [showAddAnnouncement, setShowAddAnnouncement] = useState(false);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showConfirmBroadcast, setShowConfirmBroadcast] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState<{ title: string; body: string; category: 'Event' | 'Directory' | 'Update' }>({ title: '', body: '', category: 'Update' });
  const [newAlert, setNewAlert] = useState({ message: '', severity: 'info' as 'info' | 'warning' | 'critical' });

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.body) return;
    const announcement: Announcement = {
      id: Date.now(),
      title: newAnnouncement.title,
      body: newAnnouncement.body,
      category: newAnnouncement.category,
      datePosted: 'Hulyo 17, 2026',
      postedBy: 'Admin',
    };
    setAnnouncements((prev) => [announcement, ...prev]);
    setNewAnnouncement({ title: '', body: '', category: 'Update' });
    setShowAddAnnouncement(false);
  };

  const handleDeleteAnnouncement = (id: number) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleBroadcast = () => {
    if (!newAlert.message) return;
    const alert: CustomAlert = {
      id: Date.now(),
      message: newAlert.message,
      severity: newAlert.severity,
      datePosted: 'Hulyo 17, 2026 — Now',
      postedBy: 'Admin',
      active: true,
    };
    setCustomAlerts((prev) => [alert, ...prev]);
    setNewAlert({ message: '', severity: 'info' });
    setShowConfirmBroadcast(false);
    setShowBroadcastModal(false);
  };

  const toggleAlertActive = (id: number) => {
    setCustomAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap max-md:flex-col">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 m-0 tracking-tight">Alerts & Content Management</h1>
          <p className="text-[13px] text-slate-400 mt-1">I-manage ang mga announcements at mag-broadcast ng custom alerts</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === 'announcements' && (
            <button onClick={() => setShowAddAnnouncement(true)} className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-[12px] font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              New Announcement
            </button>
          )}
          {activeTab === 'alerts' && (
            <button onClick={() => setShowBroadcastModal(true)} className="flex items-center gap-1.5 py-2 px-4 rounded-xl text-[12px] font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2C8 2 5.5 5 5.5 8C5.5 9.5 6.5 11 8 12C9.5 11 10.5 9.5 10.5 8C10.5 5 8 2 8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.5 4C2.5 5.5 2 7 2 8.5C2 12 4.7 14.5 8 14.5C11.3 14.5 14 12 14 8.5C14 7 13.5 5.5 12.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Broadcast Alert
            </button>
          )}
        </div>
      </div>

      {/* Tab Toggle */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`py-2 px-5 rounded-lg text-[12px] font-semibold transition-all duration-200 ${
            activeTab === 'announcements' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          📢 Announcements
        </button>
        <button
          onClick={() => setActiveTab('alerts')}
          className={`py-2 px-5 rounded-lg text-[12px] font-semibold transition-all duration-200 ${
            activeTab === 'alerts' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          🚨 Custom Alerts
        </button>
      </div>

      {/* Announcements List */}
      {activeTab === 'announcements' && (
        <div className="flex flex-col gap-3">
          {announcements.map((ann) => {
            const catStyle = announcementCategoryStyles[ann.category] || { color: '#64748b', bg: 'rgba(100,116,139,0.08)' };
            return (
              <div key={ann.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm transition-all hover:shadow hover:-translate-y-px">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-[14px] font-bold text-slate-800 m-0">{ann.title}</h3>
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                        style={{ color: catStyle.color, background: catStyle.bg }}
                      >
                        {ann.category}
                      </span>
                    </div>
                    <p className="text-[13px] text-slate-600 mt-2 leading-relaxed">{ann.body}</p>
                    <p className="text-[11px] text-slate-400 mt-2">
                      {ann.postedBy} • {ann.datePosted}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-2 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M4 6H16M7 6V4C7 3.45 7.45 3 8 3H12C12.55 3 13 3.45 13 4V6M9 9V15M11 9V15M5 6L6 17C6 17.55 6.45 18 7 18H13C13.55 18 14 17.55 14 17L15 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {announcements.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400 bg-white border border-slate-200 rounded-xl">
              Walang announcements.
            </div>
          )}
        </div>
      )}

      {/* Custom Alerts List */}
      {activeTab === 'alerts' && (
        <div className="flex flex-col gap-3">
          {/* Preview Banner */}
          {customAlerts.filter((a) => a.active).length > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Preview: Resident Interface Banner</p>
              {customAlerts
                .filter((a) => a.active)
                .slice(0, 1)
                .map((a) => {
                  const style = alertSeverityStyles[a.severity];
                  return (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 py-3 px-4 rounded-xl border"
                      style={{ background: style.bg, borderColor: style.border }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <p className="text-[13px] font-medium m-0" style={{ color: style.color }}>{a.message}</p>
                    </div>
                  );
                })}
            </div>
          )}

          {customAlerts.map((alert) => {
            const style = alertSeverityStyles[alert.severity];
            return (
              <div
                key={alert.id}
                className={`flex items-start gap-4 py-4 px-5 bg-white border rounded-xl shadow-sm transition-all hover:shadow hover:-translate-y-px ${
                  alert.active ? 'border-slate-200' : 'border-slate-100 opacity-60'
                }`}
              >
                <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: style.bg }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ color: style.color, background: style.bg }}
                    >
                      {style.label}
                    </span>
                    {alert.active && (
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full uppercase tracking-wider">Active</span>
                    )}
                  </div>
                  <p className="text-[13px] text-slate-700 mt-2 leading-relaxed">{alert.message}</p>
                  <p className="text-[11px] text-slate-400 mt-1.5">{alert.postedBy} • {alert.datePosted}</p>
                </div>
                <button
                  onClick={() => toggleAlertActive(alert.id)}
                  className="shrink-0 relative cursor-pointer mt-1"
                >
                  <div className={`w-10 h-[22px] rounded-full transition-colors duration-300 ${alert.active ? 'bg-green-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${alert.active ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Announcement Modal */}
      {showAddAnnouncement && (
        <>
          <div className="fixed inset-0 bg-black/40 z-300 animate-[fadeIn_0.2s_ease]" onClick={() => setShowAddAnnouncement(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] max-w-[90vw] bg-white rounded-2xl shadow-2xl z-301 animate-[fadeIn_0.3s_ease]">
            <div className="py-4 px-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 m-0">New Announcement</h2>
              <button onClick={() => setShowAddAnnouncement(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Title</label>
                <input value={newAnnouncement.title} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} placeholder="Announcement title..." className="w-full py-2.5 px-3.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Category</label>
                <select value={newAnnouncement.category} onChange={(e) => setNewAnnouncement({ ...newAnnouncement, category: e.target.value as 'Event' | 'Directory' | 'Update' })} className="w-full py-2.5 px-3.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer">
                  <option value="Event">Event</option><option value="Directory">Directory</option><option value="Update">Update</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Body</label>
                <textarea
                  value={newAnnouncement.body}
                  onChange={(e) => setNewAnnouncement({ ...newAnnouncement, body: e.target.value })}
                  placeholder="Write the announcement content..."
                  rows={4}
                  className="w-full py-2.5 px-3.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                />
              </div>
              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowAddAnnouncement(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                <button onClick={handleAddAnnouncement} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm">Post Announcement</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Broadcast Alert Modal */}
      {showBroadcastModal && !showConfirmBroadcast && (
        <>
          <div className="fixed inset-0 bg-black/40 z-300 animate-[fadeIn_0.2s_ease]" onClick={() => setShowBroadcastModal(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] max-w-[90vw] bg-white rounded-2xl shadow-2xl z-301 animate-[fadeIn_0.3s_ease]">
            <div className="py-4 px-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-800 m-0">Broadcast Custom Alert</h2>
              <button onClick={() => setShowBroadcastModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Severity</label>
                <div className="flex gap-2">
                  {(['info', 'warning', 'critical'] as const).map((sev) => {
                    const style = alertSeverityStyles[sev];
                    return (
                      <button
                        key={sev}
                        onClick={() => setNewAlert({ ...newAlert, severity: sev })}
                        className={`flex-1 py-2.5 rounded-xl text-[12px] font-bold uppercase tracking-wider border transition-all ${
                          newAlert.severity === sev
                            ? 'scale-105 shadow-sm'
                            : 'opacity-50 hover:opacity-80'
                        }`}
                        style={{
                          color: style.color,
                          background: style.bg,
                          borderColor: newAlert.severity === sev ? style.border : 'transparent',
                        }}
                      >
                        {style.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Alert Message</label>
                <textarea
                  value={newAlert.message}
                  onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
                  placeholder="I-type ang custom alert message..."
                  rows={3}
                  className="w-full py-2.5 px-3.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
                />
              </div>

              {/* Live Preview */}
              {newAlert.message && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Preview</label>
                  <div
                    className="flex items-center gap-3 py-3 px-4 rounded-xl border"
                    style={{
                      background: alertSeverityStyles[newAlert.severity].bg,
                      borderColor: alertSeverityStyles[newAlert.severity].border,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={alertSeverityStyles[newAlert.severity].color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <p className="text-[12px] font-medium m-0" style={{ color: alertSeverityStyles[newAlert.severity].color }}>
                      {newAlert.message}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-2">
                <button onClick={() => setShowBroadcastModal(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Cancel</button>
                <button
                  onClick={() => setShowConfirmBroadcast(true)}
                  disabled={!newAlert.message}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-sm ${newAlert.message ? 'text-white bg-red-600 hover:bg-red-700' : 'text-slate-400 bg-slate-200 cursor-not-allowed shadow-none'}`}
                >
                  Broadcast
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Confirm Broadcast */}
      {showConfirmBroadcast && (
        <>
          <div className="fixed inset-0 bg-black/50 z-400 animate-[fadeIn_0.2s_ease]" onClick={() => setShowConfirmBroadcast(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] max-w-[90vw] bg-white rounded-2xl shadow-2xl z-401 animate-[fadeIn_0.2s_ease]">
            <div className="p-6 flex flex-col items-center gap-4 text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-slate-800 m-0">Confirm Broadcast?</h3>
              <p className="text-[13px] text-slate-500 leading-relaxed">
                Ang alert na ito ay makikita ng lahat ng residente sa kanilang interface. Sigurado ka ba?
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button onClick={() => setShowConfirmBroadcast(false)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">Hindi</button>
                <button onClick={handleBroadcast} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm">Oo, Broadcast</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
