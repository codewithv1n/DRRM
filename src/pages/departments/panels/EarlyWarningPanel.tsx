import { useState } from 'react';
import { Send, Radio } from 'lucide-react';
import { useMockData } from '../../../data/MockDataContext';

export default function EarlyWarningPanel() {
  const { activeAlerts, broadcastAlert, addAuditLog } = useMockData();
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('Red Alert');

  const alertLevels = [
    { label: 'Red Rainfall', level: 'Red Rainfall', color: 'bg-red-500 hover:bg-red-600', icon: '🌧️' },
    { label: 'River Critical', level: 'Tullahan River Critical', color: 'bg-rose-600 hover:bg-rose-700', icon: '🌊' },
    { label: 'Signal No. 3', level: 'Signal No. 3', color: 'bg-orange-500 hover:bg-orange-600', icon: '🌀' },
    { label: 'General Alert', level: 'General Alert', color: 'bg-amber-500 hover:bg-amber-600', icon: '⚠️' },
  ];

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    broadcastAlert(selectedLevel, broadcastMessage, false);
    addAuditLog('Broadcast', 'Department Admin', `Sent primary broadcast [${selectedLevel}]: ${broadcastMessage}`);
    setBroadcastMessage('');
  };

  const handleFallbackBroadcast = (alertMsg: string) => {
    broadcastAlert('Red Alert', alertMsg, true);
    addAuditLog('Broadcast Fallback', 'Department Admin', `Triggered SMS Backup for: ${alertMsg}`);
  };

  const statusDot = (status: string) => {
    const colors: Record<string, string> = { Sent: 'bg-emerald-500', Pending: 'bg-amber-500', Failed: 'bg-red-500' };
    return <span className={`inline-block w-2 h-2 rounded-full ${colors[status] || 'bg-slate-300'} animate-pulse`} />;
  };

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-display">Early Warning System</h2>
        <p className="text-slate-500 mt-1">Broadcast life-critical alerts with automatic failover redundancy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Broadcast Panel */}
        <div className="lg:col-span-2 space-y-5">
          {/* Quick Alert Levels */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Quick Alert Levels</h3>
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
                  <span className="text-lg">{al.icon}</span>
                  <span>{al.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Compose */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Compose Broadcast</h3>
            <div className="mb-2">
              <span className="inline-block text-[10px] font-bold bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-full mb-3">
                {selectedLevel}
              </span>
            </div>
            <textarea
              rows={4}
              value={broadcastMessage}
              onChange={e => setBroadcastMessage(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none resize-none transition-all text-sm placeholder-slate-400"
              placeholder="Type your alert message here..."
            />
            <button
              onClick={handleBroadcast}
              disabled={!broadcastMessage.trim()}
              className="w-full mt-3 bg-linear-to-r from-primary to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-300 disabled:to-slate-400 text-white font-bold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:shadow-none"
            >
              <Send className="w-4 h-4" />
              Send via WebSocket (Primary)
            </button>
            <p className="text-[10px] text-slate-400 mt-2 text-center">Primary channel auto-retries via SMS backup on failure</p>
          </div>
        </div>

        {/* Delivery Log */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-slate-400" />
              Delivery Log
            </h3>
            <span className="text-[10px] font-bold bg-slate-200 text-slate-500 px-2.5 py-1 rounded-full">
              {activeAlerts.length} Alerts
            </span>
          </div>

          <div className="divide-y divide-slate-50 max-h-130 overflow-y-auto">
            {activeAlerts.length > 0 ? activeAlerts.map(alert => (
              <div key={alert.id} className="px-6 py-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-red-500 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full">{alert.level}</span>
                    {alert.channel === 'SMS Backup' && (
                      <span className="text-[9px] font-black bg-slate-700 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">SMS Backup</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {statusDot(alert.deliveryStatus)}
                    <span className={`text-xs font-bold ${
                      alert.deliveryStatus === 'Failed' ? 'text-red-500' :
                      alert.deliveryStatus === 'Pending' ? 'text-amber-500' : 'text-emerald-600'
                    }`}>
                      {alert.deliveryStatus}
                    </span>
                    <span className="text-[10px] text-slate-400">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
                <p className="text-sm text-slate-700 mb-2">{alert.message}</p>

                {alert.deliveryStatus === 'Failed' && (
                  <button
                    onClick={() => handleFallbackBroadcast(alert.message)}
                    className="mt-1 w-full text-xs bg-linear-to-r from-slate-800 to-slate-900 text-white px-3 py-2 rounded-lg font-semibold hover:from-slate-900 hover:to-black transition-all flex items-center justify-center gap-2"
                  >
                    <Radio className="w-3 h-3" /> Retry via SMS Backup Gateway
                  </button>
                )}
              </div>
            )) : (
              <div className="px-6 py-16 text-center">
                <Radio className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No alerts broadcast yet.</p>
                <p className="text-slate-300 text-xs mt-1">Send your first alert using the panel on the left.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
