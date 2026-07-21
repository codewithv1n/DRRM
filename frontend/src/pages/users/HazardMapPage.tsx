import { useState } from 'react';
import HazardMap from '../../components/HazardMap';
import {
  evacuationCenters,
  faqItems,
  statusConfig
} from '../../data/HazardMapData'


export default function HazardMapPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="w-full px-6 p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap max-md:flex-col max-md:gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 m-0 tracking-tight">Hazard & Evacuation Map</h1>
          <p className="text-[13px] text-slate-400 mt-1">Last Update: July 4, 2024 | 3:00 PM</p>    {/* D PWEDENG STATIC TO */}
        </div>
      </div>

      {/* Selections */}
      <select className="px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer">
        <option value="">All Hazards</option>
        <option value="flood">Flood</option>
        <option value="fire">Fire</option>
        <option value="others">Others</option>
      </select>


      {/* Map */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="border-b border-slate-100">
          <HazardMap />
        </div>
        <div className="flex items-center gap-8 py-3.5 px-5 flex-wrap max-md:gap-3.5 max-md:justify-center">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-red-500" />
            Fire
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-blue-500" />
            Flood
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 bg-gray-500" />
            Others
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="w-2.5 h-2.5 rounded-full shrink-0 border-[2.5px] border-green-500 bg-white" />
            Your Current Location
          </div>
        </div>
      </div>

      {/* Evacuation Center */}
      <section className="flex flex-col gap-3">
        <h2 className="text-base font-bold text-slate-800 m-0">Nearest Evacuation Center</h2>
        <div className="flex flex-col gap-2">
          {evacuationCenters.map((center) => {
            const config = statusConfig[center.status];
            const isAvailable = center.status === 'OPEN';
            return (
              <div
                key={center.id}
                className="flex items-center gap-3.5 py-4 px-5 bg-white border border-slate-200 rounded-xl transition-all duration-200 shadow-sm hover:border-slate-300 hover:shadow hover:-translate-y-px max-md:flex-col max-md:items-start max-md:gap-3"
              >
                <div className="shrink-0 w-[42px] h-[42px] rounded-full bg-green-500/8 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
                      stroke="#22c55e"
                      strokeWidth="1.8"
                      fill="rgba(34,197,94,0.1)"
                    />
                    <circle cx="12" cy="9" r="2.5" stroke="#22c55e" strokeWidth="1.5" fill="white" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 m-0">{center.name}</h3>
                  <p className="text-xs text-slate-400 mt-[3px]">
                    {center.distance} —— {center.walkTime}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 shrink-0 max-md:w-full max-md:justify-end">
                  <span
                    className="text-[11px] font-bold py-1 px-3 rounded-full tracking-wide uppercase"
                    style={{
                      color: config.color,
                      background: config.bg,
                    }}
                  >
                    {config.label}
                  </span>
                  <button
                    className={`py-2 px-[18px] rounded-lg text-xs font-semibold border-none cursor-pointer transition-all duration-200 whitespace-nowrap ${isAvailable
                      ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-[0_2px_8px_rgba(37,99,235,0.3)]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none hover:bg-slate-200 hover:shadow-none'
                      }`}
                    disabled={!isAvailable}
                  >
                    Directions
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <div className="grid gap-6 items-start max-md:grid-cols-1">
        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-slate-800 m-0">Ano ang gagawin?</h2>
          <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {faqItems.map((item) => (
              <div
                key={item.id}
                className="border-b border-slate-100 last:border-b-0"
              >
                <button
                  className="flex items-center justify-between w-full py-3.5 px-[18px] text-sm font-medium text-slate-800 bg-transparent border-none cursor-pointer transition-colors duration-200 text-left hover:bg-slate-100"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={openFaq === item.id}
                >
                  <span>{item.title}</span>
                  <svg
                    className={`transition-transform ease-in-out text-slate-400 shrink-0 ${openFaq === item.id ? 'rotate-180' : ''
                      }`}
                    width="18"
                    height="12"
                    viewBox="0 0 18 18"
                    fill="none"
                  >
                    <path
                      d="M5 7L9 11L13 7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: openFaq === item.id ? '180px' : '0',
                    padding: openFaq === item.id ? '0 18px 14px' : '0 18px 0',
                  }}
                >
                  <p className="text-[13px] text-slate-500 leading-relaxed">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl py-3.5 px-5 text-center">
        <p className="text-[13px] font-medium text-amber-800 leading-normal">
          Ang impormasyong ito ay batay sa datos mula sa inyong barangay. Sundin ang opisyal na advisory.
        </p>
      </div>
    </div>
  );
}
