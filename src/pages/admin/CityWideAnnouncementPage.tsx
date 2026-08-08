import { useState, useEffect } from 'react';
import { Send, Radio, AlertTriangle, Route, BookOpen, Megaphone } from 'lucide-react';
import DepartmentLayout from '../../components/layout/AdminLayout';

interface DBAnnouncement {
  announcement_id: string;
  level: string;
  message: string;
  delivery_status: string;
  created_at: string;
}

export default function EarlyWarningPanel() {
  const [activeAlerts, setActiveAlerts] = useState<DBAnnouncement[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('General Alert');
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchData = async () => {
    try {
      const annRes = await fetch('http://localhost:3000/api/announcements');
      if (annRes.ok) setActiveAlerts(await annRes.json());
      
      const incRes = await fetch('http://localhost:3000/api/incidents');
      if (incRes.ok) {
        const incidents = await incRes.json();
        setPendingCount(incidents.filter((i: any) => i.status === 'Pending').length);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const alertLevels = [
    { label: 'Evacuation Order', level: 'Evacuation Order', color: 'bg-red-600 hover:bg-red-700', icon: <Megaphone className="w-5 h-5" /> },
    { label: 'Class Suspension', level: 'Class Suspension', color: 'bg-blue-500 hover:bg-blue-600', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Road Closure', level: 'Road Closure', color: 'bg-indigo-500 hover:bg-indigo-600', icon: <Route className="w-5 h-5" /> },
    { label: 'General Alert', level: 'General Alert', color: 'bg-amber-500 hover:bg-amber-600', icon: <AlertTriangle className="w-5 h-5" /> },
  ];

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return;
    try {
      await fetch('http://localhost:3000/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: selectedLevel,
          message: broadcastMessage,
          delivery_status: 'Sent'
        })
      });
      fetchData();
    } catch (error) {
      console.error('Error broadcasting:', error);
    }
    setBroadcastMessage('');
    setShowConfirm(false);
  };

  const statusDot = (status: string) => {
    const colors: Record<string, string> = { Sent: 'bg-emerald-500', Pending: 'bg-amber-500', Failed: 'bg-red-500' };
    return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-slate-300'} animate-pulse`} />;
  };

  return (
    <DepartmentLayout pendingCount={pendingCount}>
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">City-Wide Announcements</h2>
        <p className="text-slate-500 mt-1">Manually compose and broadcast critical announcements to Barangays and Citizens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Broadcast Panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Alert Levels */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Announcement Type</h3>
            <div className="grid grid-cols-2 gap-3">
              {alertLevels.map(al => (
                <button
                  key={al.level}
                  onClick={() => setSelectedLevel(al.level)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    selectedLevel === al.level
                      ? `${al.color} text-white shadow-lg scale-[1.02]`
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="flex items-center justify-center">{al.icon}</span>
                  <span>{al.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compose */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Compose Message</h3>
            <div className="mb-2">
              <span className="inline-block text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 rounded-full mb-3">
                {selectedLevel}
              </span>
            </div>
            <textarea
              rows={4}
              value={broadcastMessage}
              onChange={e => setBroadcastMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none transition-all text-sm placeholder-slate-400"
              placeholder="E.g. WALANG PASOK: All classes are suspended today..."
            />
            <button
              onClick={() => {
                if (broadcastMessage.trim()) setShowConfirm(true);
              }}
              disabled={!broadcastMessage.trim()}
              className="w-full mt-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
              Broadcast to Portals
            </button>
            <p className="text-[10px] text-slate-400 mt-2 text-center">Alerts instantly appear on Citizen & Barangay</p>
          </div>
        </div>

        {/* Delivery Log */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden h-125 flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-slate-400" />
              Broadcast History
            </h3>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2.5 py-1 rounded-full">
              {activeAlerts.length} Alerts
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
            {activeAlerts.length > 0 ? activeAlerts.map(alert => (
              <div key={alert.announcement_id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">{alert.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusDot(alert.delivery_status)}
                    <span className={`text-xs font-bold ${
                      alert.delivery_status === 'Failed' ? 'text-red-500' :
                      alert.delivery_status === 'Pending' ? 'text-amber-500' : 'text-emerald-600'
                    }`}>
                      {alert.delivery_status}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(alert.created_at).toLocaleTimeString()}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-2">{alert.message}</p>
              </div>
            )) : (
              <div className="px-6 py-16 text-center">
                <Radio className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No announcements broadcast yet.</p>
                <p className="text-slate-300 text-xs mt-1">Send your first announcement using the panel on the left.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200">
            <div className="p-6">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Send className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-center text-slate-900 mb-2">Confirm Broadcast</h3>
              <p className="text-center text-slate-500 text-sm mb-6">Are you sure you want to post this announcement? This action cannot be undone and will immediately notify citizens and barangays.</p>
              
              <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100">
                <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">{selectedLevel}</div>
                <div className="text-sm text-slate-700 italic wrap-break-word">"{broadcastMessage}"</div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBroadcast}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors text-sm"
                >
                  Confirm & Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </DepartmentLayout>
  );
}
