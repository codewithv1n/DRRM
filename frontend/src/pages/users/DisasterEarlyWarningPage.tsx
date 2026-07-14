import { useState } from "react";
import {
 activeAlerts,
 preparednessTips
}from '../../data/DisasterWarningData'


export default function DisasterEarlyWarningPage() {
  const [activeTab, setActiveTab] = useState <'alerts' | 'tips' | 'hotlines'> ('alerts');

  return (

    <div className="w-full px-6 p-4 flex flex-col gap-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 m-0 tracking-tight">
          Disaster Early Warning System
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Makatanggap ng napapanahong abiso at impormasyon para sa inyong kaligtasan
        </p>
      </div>

      {/* ── Status ── */}
      {activeAlerts.length > 0 && activeAlerts[0].severity === 'critical' && (
        <div className="relative overflow-hidden rounded-xl border border-red-200 bg-linear-to-br from-red-50 to-rose-50 shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
          <div className="flex items-center gap-4 py-5 px-6 max-md:flex-col max-md:items-start max-md:gap-3">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 9V13M12 17.5V18M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold py-0.5 px-2 rounded-full bg-red-100 text-red-600 uppercase tracking-wider">
                  Critical Alert
                </span>
                <span className="text-xs text-red-400 font-medium">{activeAlerts[0].time}</span>
              </div>
              <p className="text-lg font-bold text-red-700 m-0 leading-tight">
                {activeAlerts[0].title}
              </p>
              <p className="text-sm text-red-600 mt-1 mb-0 leading-relaxed max-w-3xl">
                {activeAlerts[0].description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'alerts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Mga Abiso (Alerts)
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${activeTab === 'tips' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Paghahanda
        </button>
      </div>

      {/* ── Tab Content ── */}
      <div className="min-h-[300px]">
        {activeTab === 'alerts' && (
          <div className="flex flex-col gap-4 animate-[fadeIn_0.3s_ease]">
            {activeAlerts.map((alert) => (
              <div key={alert.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4 max-md:flex-col">
                  <div className="flex items-start gap-3.5">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                      alert.severity === 'critical' ? 'bg-red-50 text-red-500' :
                      alert.severity === 'warning' ? 'bg-orange-50 text-orange-500' :
                      'bg-blue-50 text-blue-500'
                    }`}>
                      {alert.type === 'Typhoon' && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M12 12C15.3137 7.02944 18.6274 7.02944 18.6274 10.3431C18.6274 13.6569 15.3137 17.5 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                          <path d="M12 12C8.68629 17.5 5.37258 17.5 5.37258 14.1863C5.37258 10.8726 8.68629 7.02944 12 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      )}
                      {alert.type === 'Flood' && (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M4 17C6 15 8 15 10 17C12 19 14 19 16 17C18 15 20 15 22 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M4 21C6 19 8 19 10 21C12 23 14 23 16 21C18 19 20 19 22 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                          <path d="M12 4V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <path d="M9 7L12 4L15 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-800 m-0">{alert.title}</h3>
                      <div className="flex items-center gap-2 mt-1 mb-2">
                        <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          {alert.time}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500">•</span>
                        <span className="text-[11px] font-medium text-slate-500">Source: {alert.source}</span>
                      </div>
                      <p className="text-sm text-slate-600 m-0 leading-relaxed">{alert.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        {activeTab === 'tips' && (
          <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1 animate-[fadeIn_0.3s_ease]">
            {preparednessTips.map((tip, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-800 m-0 mb-1">{tip.title}</h3>
                  <p className="text-[13px] text-slate-500 m-0 leading-relaxed">{tip.desc}</p>
                </div>
              </div>
            ))}
            
            {/* Video */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col items-center justify-center text-center col-span-full mt-2">
              <div className="w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <path d="M15 12L10 16V8L15 12Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                 </svg>
              </div>
              <h3 className="text-[15px] font-bold text-slate-800 m-0 mb-1">Panoorin: Paano maghanda ng Go-Bag</h3>
              <p className="text-[13px] text-slate-500 m-0 max-w-md">Isang maikling video guide kung ano ang mga dapat ilagay sa inyong emergency bag.</p>
              <button className="mt-4 px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors cursor-pointer">
                I-play ang Video
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}