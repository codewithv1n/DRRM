export const currentResident = {
  name: 'Juan Dela Cruz',
  email: 'juandelacruz@gmail.com',
  status: 'received' as const,
  aidTypes: ['Pagkain', 'Tubig', 'Gamot'],
  distributionDate: 'Hulyo 5, 2026',
  pickupLocation: 'Barangay Hall',
  nextSchedule: 'Hulyo 14, 2026 — 8:00 AM',
};

export const statusConfig = {
  received: {
    label: 'Already Claimed',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: '#16a34a',
    bg: 'rgba(22,163,74,0.07)',
    border: 'rgba(22,163,74,0.18)',
    gradient: 'from-green-50 to-emerald-50',
  },
  not_received: {
    label: 'Not Claimed',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
    color: '#dc2626',
    bg: 'rgba(220,38,38,0.06)',
    border: 'rgba(220,38,38,0.16)',
    gradient: 'from-red-50 to-rose-50',
  },
  scheduled: {
    label: 'Scheduled',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    color: '#d97706',
    bg: 'rgba(217,119,6,0.07)',
    border: 'rgba(217,119,6,0.16)',
    gradient: 'from-amber-50 to-yellow-50',
  },
};

export const aidTagColors: Record<string, { color: string; bg: string }> = {
  Pagkain: { color: '#ea580c', bg: 'rgba(234,88,12,0.08)' },
  Tubig: { color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  Damit: { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  Gamot: { color: '#059669', bg: 'rgba(5,150,105,0.08)' },
};

export const timeline = [
  { date: 'Hulyo 5, 2026', aid: 'Pagkain, Tubig, Gamot', location: 'Barangay Hall', done: true },
  { date: 'Hunyo 20, 2026', aid: 'Pagkain, Tubig', location: 'Covered Court', done: true },
  { date: 'Hunyo 5, 2026', aid: 'Pagkain, Damit', location: 'Barangay Hall', done: true },
];
