import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  {
    to: '/hazard-evac',
    label: 'Hazard & Evacuation Map',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 17L7 3L11 13L14 7L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="2" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      </svg>
    ),
  },
  {
    to: '/relief-goods',
    label: 'Relief Goods Distribution Tracker',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 7L10 3L16 7V13L10 17L4 13V7Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M4 7L10 11M10 11L16 7M10 11V17" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    to: '/incident-report',
    label: 'Incident Reporting & Response Log',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="2" width="12" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 6H13M7 9H13M7 12H10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/early-warning',
    label: 'Disaster Early Warning System',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3V4M10 3C10 3 7 6 7 10C7 12 8 14 10 15C12 14 13 12 13 10C13 6 10 3 10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 5.5C3.5 7 3 9 3 10.5C3 14 6 17 10 17C14 17 17 14 17 10.5C17 9 16.5 7 15 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/coordination',
    label: 'Barangay DRRM Coordination Tools',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="13" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 16C3 13.8 4.8 12 7 12H13C15.2 12 17 13.8 17 16V17H3V16Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
];

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between h-17 px-5 bg-white border-b border-slate-200 sticky top-0 z-100">
        <div className="flex items-center gap-3">
          <button
            className="hidden max-md:flex p-1.5 rounded-md text-slate-800 transition-colors duration-200 hover:bg-slate-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M3 5H17M3 10H17M3 15H17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                <path d="M12 7V13L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">DRRM</span>
          </div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center gap-2 py-1.5 px-3 rounded-full border border-slate-200 cursor-pointer transition-all duration-200 bg-white hover:border-blue-600 hover:shadow-sm">
            <div className="w-7 h-7 rounded-full bg-linear-to-br from-violet-400 to-violet-600 text-white flex items-center justify-center text-xs font-bold">R</div>
            <span className="text-[13px] font-medium text-slate-800">Admin</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M4 6L7 9L10 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {sidebarOpen && (
          <div
            className="max-md:block hidden fixed inset-0 top-14 bg-black/30 z-80 animate-[fadeIn_0.2s_ease]"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            w-[220px] min-w-[220px] bg-white border-r border-slate-200
            py-4 px-2.5 overflow-y-auto h-[calc(100vh-56px)] fixed top-14 left-0 z-40
            max-md:z-90
            max-md:transition-transform max-md:duration-300 
            ${sidebarOpen
              ? 'max-md:translate-x-0 max-md:shadow-lg'
              : 'max-md:-translate-x-full max-md:shadow-none'
            }
          `}
        >
          <nav className="flex flex-col gap-12 mt-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-start gap-2.5 py-2.5 px-3 rounded-lg text-[13px] font-medium leading-[1.4] transition-all duration-200 no-underline ${isActive
                    ? 'bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <span className="flex items-center justify-center shrink-0 mt-px">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-[220px] py-7 px-8 overflow-y-auto min-h-[calc(100vh-56px)] bg-slate-50 max-md:py-5 max-md:px-4 max-md:ml-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
