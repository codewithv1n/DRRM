import { useState } from 'react';
import {
  drrmOfficers,
  drillSchedule,
  resources,
  statusConfig,
  evacuationCenters,
  emergencyHotlines
}from '../../data/DrrmCoordinationData'

export default function DrrmCoordinationPage() {
  const [showAllDrills, setShowAllDrills] = useState(false);
  const visibleDrills = showAllDrills ? drillSchedule : drillSchedule.filter(d => d.status === 'upcoming');

  return (
    <div className="w-full px-6 p-4 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 m-0 tracking-tight">
          Barangay DRRM Coordination Tools
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Tingnan ang mga aktibong DRRM programa at aktibidad sa inyong barangay
        </p>
      </div>

      {/* ── DRRM Summary */}
      <div className="relative overflow-hidden rounded-xl border border-blue-200 bg-linear-to-br from-blue-50 to-indigo-50 shadow-sm">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
        <div className="py-5 px-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="3" y="2" width="14" height="16" rx="2" stroke="#2563eb" strokeWidth="1.5" />
                <path d="M7 6H13M7 9H13M7 12H10" stroke="#2563eb" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-[15px] font-bold text-blue-800 m-0">Barangay DRRM Plan Summary</h2>
          </div>
          <p className="text-[13px] text-blue-700 leading-relaxed m-0 ml-10">
            Ang Barangay San Jose DRRM Council ay aktibong nagpapatupad ng mga programa para sa kahandaan at kaligtasan ng bawat residente.
            Kasama dito ang regular na earthquake at fire drills, pagsasanay sa first aid, at pagpapanatili ng mga rescue equipment.
            Sa panahon ng kalamidad, sundin ang opisyal na advisory mula sa BDRRMC.
          </p>
        </div>
      </div>

      {/* ── DRRM Officers Contact Persons ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="py-3.5 px-5 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-500/8 flex items-center justify-center text-violet-500 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="5.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="10.5" cy="5" r="2" stroke="currentColor" strokeWidth="1.3" />
              <path d="M1.5 14C1.5 11.5 3.5 10 5.5 10C6.3 10 7 10.2 7.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M14.5 14C14.5 11.5 12.5 10 10.5 10C9.7 10 9 10.2 8.5 10.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider m-0">
            DRRM Officers / Contact Persons
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider py-2.5 px-5">Pangalan</th>
                <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider py-2.5 px-5">Posisyon</th>
                <th className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider py-2.5 px-5">Contact Number</th>
              </tr>
            </thead>
            <tbody>
              {drrmOfficers.map((officer, idx) => (
                <tr key={idx} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-linear-to-br from-violet-400 to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                        {officer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-semibold text-slate-800">{officer.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-slate-600">{officer.position}</td>
                  <td className="py-3 px-5">
                    <a href={`tel:${officer.contact.replace(/[^0-9]/g, '')}`} className="text-blue-600 font-medium hover:underline no-underline">
                      {officer.contact}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Training ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="py-3.5 px-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/8 flex items-center justify-center text-emerald-500 shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5.5 1.5V4M10.5 1.5V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider m-0">
              Iskedyul ng Drills / Training
            </h2>
          </div>
          <button
            onClick={() => setShowAllDrills(!showAllDrills)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer bg-transparent border-none"
          >
            {showAllDrills ? 'Ipakita ang Upcoming' : 'Ipakita Lahat'}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
          {visibleDrills.map((drill, idx) => (
            <div key={idx} className="flex items-center gap-3.5 py-4 px-5 hover:bg-slate-50/50 transition-colors max-md:flex-col max-md:items-start max-md:gap-2">
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                drill.status === 'upcoming' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'
              }`}>
                {drill.status === 'upcoming' ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 6V10L13 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 10L9 13L14 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-800 m-0">{drill.type}</h3>
                  <span
                    className="text-[10px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wide"
                    style={{
                      color: drill.status === 'upcoming' ? '#059669' : '#94a3b8',
                      background: drill.status === 'upcoming' ? 'rgba(5,150,105,0.08)' : 'rgba(148,163,184,0.1)',
                    }}
                  >
                    {drill.status === 'upcoming' ? 'Upcoming' : 'Tapos na'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 m-0">
                  📅 {drill.date} &nbsp;•&nbsp; 📍 {drill.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Resources ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="py-3.5 px-5 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-500/8 flex items-center justify-center text-orange-500 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 5.5L8 2.5L13 5.5V10.5L8 13.5L3 10.5V5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              <path d="M3 5.5L8 8.5M8 8.5L13 5.5M8 8.5V13.5" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </div>
          <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider m-0">
            Kasalukuyang Resources — Availability Status
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-0 max-md:grid-cols-1">
          {resources.map((res, idx) => {
            const cfg = statusConfig[res.status];
            return (
              <div key={idx} className="flex items-start gap-3 py-4 px-5 border-b border-r border-slate-100 max-md:border-r-0">
                <div
                  className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                  style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}50` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800">{res.name}</span>
                    <span
                      className="text-[10px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wide"
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 m-0">{res.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Designated Evacuation Centers ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="py-3.5 px-5 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/8 flex items-center justify-center text-rose-500 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.51 10.49 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.3" />
              <circle cx="8" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </div>
          <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider m-0">
            Mga Designated Evacuation Center at Assembly Area
          </h2>
        </div>
        <div className="divide-y divide-slate-100">
          {evacuationCenters.map((center, idx) => (
            <div key={idx} className="flex items-start gap-3.5 py-4 px-5 hover:bg-slate-50/50 transition-colors">
              <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 ${
                center.type === 'Primary' ? 'bg-rose-50 text-rose-500' :
                center.type === 'Secondary' ? 'bg-amber-50 text-amber-500' :
                'bg-slate-100 text-slate-400'
              }`}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 17V9L10 3L17 9V17H12V12H8V17H3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-slate-800 m-0">{center.name}</h3>
                  <span className={`text-[10px] font-bold py-0.5 px-2 rounded-full uppercase tracking-wide ${
                    center.type === 'Primary' ? 'text-rose-600 bg-rose-500/8' :
                    center.type === 'Secondary' ? 'text-amber-600 bg-amber-500/8' :
                    'text-slate-500 bg-slate-100'
                  }`}>
                    {center.type}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 m-0">
                  📍 {center.address} &nbsp;•&nbsp; 👥 Kapasidad: {center.capacity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Emergency Hotlines ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="py-3.5 px-5 border-b border-slate-100 flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-500/8 flex items-center justify-center text-red-500 shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.5 3H6L7.5 6.5L5.5 7.5C6.3 9.3 7.7 10.7 9.5 11.5L10.5 9.5L14 11V13.5C14 14.3 13.3 15 12.5 15C8.5 14.8 5.2 13.2 3 11C.8 8.8 -.8 5.5 1 1.5C1 .7 1.7 0 2.5 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider m-0">
            Emergency Hotlines
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-0 max-md:grid-cols-2 max-sm:grid-cols-1">
          {emergencyHotlines.map((hotline, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 py-3.5 px-5 border-b border-r border-slate-100 max-md:last:border-r-0 group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-lg group-hover:bg-blue-50 transition-colors shrink-0">
                  {hotline.icon}
                </div>
                <div>
                  <p className="text-[12px] font-medium text-slate-400 m-0">{hotline.name}</p>
                  <p className="text-[14px] font-bold text-slate-800 m-0">{hotline.number}</p>
                </div>
              </div>
              <a
                href={`tel:${hotline.number.replace(/[^0-9]/g, '')}`}
                className="w-7 h-7 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors cursor-pointer shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 4H9L11 9L8.5 10.5C9.57 12.67 11.33 14.43 13.5 15.5L15 13L20 15V19C20 19.53 19.79 20.04 19.41 20.41C19.04 20.79 18.53 21 18 21C14.1 20.76 10.42 19.11 7.66 16.34C4.89 13.58 3.24 9.9 3 6C3 5.47 3.21 4.96 3.59 4.59C3.96 4.21 4.47 4 5 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* ── Disclaimer ── */}
      <div className="flex items-start gap-3.5 py-4 px-5 bg-linear-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl shadow-sm">
        <div className="w-[38px] h-[38px] rounded-full bg-amber-500/12 flex items-center justify-center text-amber-600 shrink-0 mt-0.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2L1.5 17H18.5L10 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="14.5" r="0.75" fill="currentColor" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-amber-900 m-0">Paalala</h3>
          <p className="text-[13px] text-amber-800 mt-1 leading-relaxed m-0">
            Sundin ang instruksyon ng inyong Barangay DRRM Council tuwing may emergency. Manatiling kalmado, alerto, at handa sa lahat ng oras.
            Para sa karagdagang impormasyon, pumunta sa inyong Barangay Hall.
          </p>
        </div>
      </div>
    </div>
  );
}