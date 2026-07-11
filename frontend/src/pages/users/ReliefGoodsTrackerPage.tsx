import { useState } from 'react';
import {
  currentResident,
  statusConfig,
  aidTagColors,
  timeline,
} from '../../data/ReliefGoodsData';


export default function ReliefGoodsTrackerPage() {
  const [showHistory, setShowHistory] = useState(false);
  const cfg = statusConfig[currentResident.status];

  return (
    <div className="w-full px-6 p-4 flex flex-col gap-6">
      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 m-0 tracking-tight">
          Relief Goods Distribution Tracker
        </h1>
        <p className="text-[13px] text-slate-400 mt-1">
          Tingnan ang status ng inyong relief goods
        </p>
      </div>

      {/* ── Status Banner ── */}
      <div
        className={`relative overflow-hidden rounded-xl border shadow-sm bg-linear-to-br ${cfg.gradient}`}
        style={{ borderColor: cfg.border }}
      >
        <div className="flex items-center gap-4 py-5 px-6 max-md:flex-col max-md:items-start max-md:gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/80 shadow-xs" style={{ color: cfg.color }}>
            {cfg.icon}
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider m-0">
              Status ng Pamamahagi
            </p>
            <p className="text-xl font-bold mt-0.5 m-0" style={{ color: cfg.color }}>
              {cfg.label}
            </p>
          </div>
          <span
            className="text-[12px] font-bold py-1.5 px-4 rounded-full"
            style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}
          >
            {cfg.label}
          </span>
        </div>
      </div>

      {/* ── Personal Info Card ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="py-3.5 px-5 border-b border-slate-100">
          <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider m-0">
            Inyong Impormasyon
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-0 max-md:grid-cols-1">
          {/* Pangalan */}
          <div className="flex items-start gap-3 py-4 px-5 border-b border-r border-slate-100 max-md:border-r-0">
            <div className="w-8 h-8 rounded-lg bg-blue-500/8 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M3 14C3 11.8 5.24 10 8 10C10.76 10 13 11.8 13 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider m-0">
                Pangalan ng Residente
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 m-0">
                {currentResident.name}
              </p>
            </div>
          </div>

          {/* Household */}
          <div className="flex items-start gap-3 py-4 px-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-violet-500/8 flex items-center justify-center text-violet-500 shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2.5 7L8 2.5L13.5 7V13.5H9.5V10H6.5V13.5H2.5V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider m-0">
                Email
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 m-0">
                {currentResident.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Relief Details ── */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="py-3.5 px-5 border-b border-slate-100">
          <h2 className="text-[13px] font-bold text-slate-500 uppercase tracking-wider m-0">
            Detalye ng Relief
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-0 max-md:grid-cols-1">
          {/* Uri ng Tulong */}
          <div className="flex items-start gap-3 py-4 px-5 border-b border-r border-slate-100 max-md:border-r-0">
            <div className="w-8 h-8 rounded-lg bg-orange-500/8 flex items-center justify-center text-orange-500 shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 5.5L8 2.5L13 5.5V10.5L8 13.5L3 10.5V5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                <path d="M3 5.5L8 8.5M8 8.5L13 5.5M8 8.5V13.5" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider m-0">
                Uri ng Tulong na Matatanggap
              </p>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {currentResident.aidTypes.map((aid) => {
                  const aidCfg = aidTagColors[aid] || { color: '#475569', bg: 'rgba(71,85,105,0.06)' };
                  return (
                    <span
                      key={aid}
                      className="text-[11px] font-semibold py-1 px-2.5 rounded-full"
                      style={{ color: aidCfg.color, background: aidCfg.bg }}
                    >
                      {aid}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Petsa ng Pamamahagi */}
          <div className="flex items-start gap-3 py-4 px-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/8 flex items-center justify-center text-emerald-500 shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.3" />
                <path d="M5.5 1.5V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M10.5 1.5V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider m-0">
                Petsa ng Pamamahagi
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 m-0">
                {currentResident.distributionDate}
              </p>
            </div>
          </div>

          {/* Lokasyon ng Pick-up */}
          <div className="flex items-start gap-3 py-4 px-5 border-b border-r border-slate-100 max-md:border-r-0">
            <div className="w-8 h-8 rounded-lg bg-rose-500/8 flex items-center justify-center text-rose-500 shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5C5.51 1.5 3.5 3.51 3.5 6C3.5 9.5 8 14.5 8 14.5C8 14.5 12.5 9.5 12.5 6C12.5 3.51 10.49 1.5 8 1.5Z" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="8" cy="6" r="1.8" stroke="currentColor" strokeWidth="1.2" fill="none" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider m-0">
                Lokasyon ng Pick-up
              </p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 m-0">
                {currentResident.pickupLocation}
              </p>
            </div>
          </div>

          {/* Susunod na Schedule */}
          <div className="flex items-start gap-3 py-4 px-5 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-amber-500/8 flex items-center justify-center text-amber-500 shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 4.5V8L10.5 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider m-0">
                Susunod na Schedule ng Pamamahagi
              </p>
              <p className="text-sm font-bold text-blue-600 mt-0.5 m-0">
                {currentResident.nextSchedule}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Distribution History ── */}
      <section className="flex flex-col gap-1 ">
        <button
          className="flex items-center justify-between w-full text-left bg-transparent border-none cursor-pointer p-0"
          onClick={() => setShowHistory(!showHistory)}
        >
          <h2 className="text-base font-bold text-slate-800 m-0">Distribution History</h2>
          <svg
            className={`text-slate-400 transition-transform duration-250 ${showHistory ? 'rotate-180' : ''}`}
            width="18" height="18" viewBox="0 0 18 18" fill="none"
          >
            <path d="M5 7L9 11L13 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: showHistory ? '600px' : '0', opacity: showHistory ? 1 : 0 }}
        >
          <div className="flex flex-col gap-3">
            {timeline.map((entry, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 py-3.5 px-5 bg-white border border-slate-200 rounded-xl shadow-sm max-md:flex-col max-md:items-start max-md:gap-2"
              >
                <div className="shrink-0 w-8 h-8 rounded-full bg-green-500/8 flex items-center justify-center text-green-500">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M4 8.5L7 11.5L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 m-0">{entry.date}</p>
                  <p className="text-xs text-slate-400 mt-[2px] m-0">{entry.aid} — {entry.location}</p>
                </div>
                <span className="text-[11px] font-bold py-1 px-3 rounded-full text-green-600 bg-green-500/8">
                   Natanggap
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Warning Card ── */}
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
            Dalhin ang Valid ID at Barangay Certificate sa araw ng pamamahagi ng relief goods.
          </p>
        </div>
      </div>

      {/* ── Footer Disclaimer ── */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-5 text-center">
        <p className="text-[13px] font-medium text-slate-500 leading-normal m-0">
          Ang impormasyong ito ay para sa personal na paggamit lamang. Kung may tanong, kontakin ang inyong barangay.
        </p>
      </div>
    </div>
  );
}