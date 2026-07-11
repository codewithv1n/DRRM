export const drrmOfficers = [
  { name: 'Kap. Mario Santos', position: 'BDRRMC Chairperson', contact: '0917-123-4567' },
  { name: 'Elena Cruz', position: 'Action Officer', contact: '0928-456-7890' },
  { name: 'Roberto Reyes', position: 'Rescue Team Lead', contact: '0935-789-0123' },
  { name: 'Ana Villanueva', position: 'Health & First Aid', contact: '0912-234-5678' },
  { name: 'Pedro Lim', position: 'Logistics Officer', contact: '0920-345-6789' },
];

export const drillSchedule = [
  { date: 'Hulyo 20, 2026', type: 'Earthquake Drill', location: 'Barangay Hall & Covered Court', status: 'upcoming' as const },
  { date: 'Agosto 5, 2026', type: 'Fire Drill', location: 'Barangay Elementary School', status: 'upcoming' as const },
  { date: 'Hunyo 15, 2026', type: 'Flood Evacuation Drill', location: 'Riverside Area → Evacuation Center', status: 'done' as const },
  { date: 'Mayo 10, 2026', type: 'First Aid Training', location: 'Barangay Health Center', status: 'done' as const },
];

export const resources = [
  { name: 'Ambulansya', status: 'available' as const, details: '1 unit — standby sa Brgy. Hall' },
  { name: 'Fire Truck', status: 'deployed' as const, details: 'Koordinasyon sa BFP Sta. Mesa' },
  { name: 'Rescue Boat', status: 'available' as const, details: '2 units — bodega sa Covered Court' },
  { name: 'Rescue Team', status: 'available' as const, details: '8 volunteers — on-call 24/7' },
  { name: 'Emergency Generator', status: 'maintenance' as const, details: '1 unit — under repair' },
  { name: 'Medical Kit', status: 'available' as const, details: '10 kits — Brgy. Health Center' },
];

export const statusConfig = {
  available: { label: 'Available', color: '#16a34a', bg: 'rgba(22,163,74,0.08)', dot: '#22c55e' },
  deployed: { label: 'Deployed', color: '#2563eb', bg: 'rgba(37,99,235,0.08)', dot: '#3b82f6' },
  maintenance: { label: 'Maintenance', color: '#d97706', bg: 'rgba(217,119,6,0.08)', dot: '#f59e0b' },
};

export const evacuationCenters = [
  { name: 'Barangay Covered Court', capacity: '500 tao', address: 'Brgy. San Jose, Main Road', type: 'Primary' },
  { name: 'San Jose Elementary School', capacity: '300 tao', address: 'Rizal St., Brgy. San Jose', type: 'Secondary' },
  { name: 'Parish Church Hall', capacity: '150 tao', address: 'National Highway, Brgy. San Jose', type: 'Assembly Area' },
];

export const emergencyHotlines = [
  { name: 'Barangay Hall', number: '(02) 8123-4567', icon: '🏛️' },
  { name: 'Bureau of Fire Protection', number: '(02) 8426-0219', icon: '🚒' },
  { name: 'Philippine Red Cross', number: '143', icon: '🚑' },
  { name: 'Ospital ng Maynila', number: '(02) 8524-6061', icon: '🏥' },
  { name: 'National Emergency', number: '911', icon: '🚨' },
  { name: 'NDRRMC', number: '(02) 8911-5061', icon: '📡' },
];
