// ==================== DASHBOARD ====================

export const dashboardStats = {
  pending: 7,
  ongoing: 3,
  resolved: 42,
  totalToday: 52,
};

export const evacuationCenterStatus = [
  { id: 1, name: 'Barangay Hall Covered Court', capacity: 200, current: 160, status: 'open' as const },
  { id: 2, name: 'Elementary School Gymnasium', capacity: 350, current: 350, status: 'full' as const },
  { id: 3, name: 'Municipal Evacuation Center', capacity: 500, current: 210, status: 'open' as const },
  { id: 4, name: 'Chapel of San Jose', capacity: 80, current: 0, status: 'closed' as const },
];

export const weatherData = {
  temperature: 27,
  condition: 'Maulap at Maulan',
  humidity: 92,
  windSpeed: 65,
  rainfallSignal: 'Orange',
  typhoonName: "Bagyong 'Juan'",
  typhoonSignal: 3,
  advisory: 'Signal No. 3 raised over Metro Manila. Inaasahan ang malakas na pag-ulan at hanging aabot sa 120 km/h.',
};

export const recentActivity = [
  { id: 1, action: 'Incident #1042 marked as Resolved', by: 'Elena Cruz', time: '5 min ago', type: 'resolve' as const },
  { id: 2, action: 'Fire Truck 1 dispatched to Sitio Bukal', by: 'Roberto Reyes', time: '12 min ago', type: 'dispatch' as const },
  { id: 3, action: 'New incident report received: Baha sa Street A', by: 'System', time: '18 min ago', type: 'new' as const },
  { id: 4, action: '50 sacks of rice added to inventory', by: 'Pedro Lim', time: '25 min ago', type: 'inventory' as const },
  { id: 5, action: 'Evacuation Center "Elementary School" marked FULL', by: 'Ana Villanueva', time: '30 min ago', type: 'evacuation' as const },
  { id: 6, action: 'Custom alert broadcast: Preemptive evacuation', by: 'Kap. Mario Santos', time: '45 min ago', type: 'alert' as const },
  { id: 7, action: 'Resident Juan Dela Cruz verified', by: 'Elena Cruz', time: '1 hr ago', type: 'verify' as const },
  { id: 8, action: 'Rescue Team Alpha assigned to Incident #1040', by: 'Roberto Reyes', time: '1.5 hr ago', type: 'dispatch' as const },
];

export const activityTypeConfig = {
  resolve: { color: '#16a34a', bg: 'rgba(22,163,74,0.08)' },
  dispatch: { color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  new: { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  inventory: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  evacuation: { color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
  alert: { color: '#ea580c', bg: 'rgba(234,88,12,0.08)' },
  verify: { color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
};

// ==================== INCIDENTS ====================

export type IncidentStatus = 'Pending' | 'Acknowledged' | 'Ongoing Rescue' | 'Resolved';

export interface Incident {
  id: number;
  ticketId: string;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  location: string;
  reporter: string;
  reporterContact: string;
  time: string;
  status: IncidentStatus;
  photo?: string;
  assignedTeam?: string;
  assignedVehicle?: string;
}

export const incidentStatusFlow: IncidentStatus[] = ['Pending', 'Acknowledged', 'Ongoing Rescue', 'Resolved'];

export const incidentStatusStyles: Record<IncidentStatus, { color: string; bg: string }> = {
  Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Acknowledged: { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  'Ongoing Rescue': { color: '#ea580c', bg: 'rgba(234,88,12,0.1)' },
  Resolved: { color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
};

export const severityStyles: Record<string, { color: string; bg: string }> = {
  low: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
  moderate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  high: { color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  critical: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export const initialIncidents: Incident[] = [
  {
    id: 1, ticketId: 'INC-1042', type: 'flood', title: 'Baha sa Street A',
    description: 'Tumaas ang tubig sa kalsada, halos tuhod na ang baha. Hindi makatawid ang mga sasakyan.',
    severity: 'high', location: 'Street A, Purok 3', reporter: 'Maria Santos', reporterContact: '0917-111-2222',
    time: '18 min ago', status: 'Pending',
  },
  {
    id: 2, ticketId: 'INC-1041', type: 'fire', title: 'Sunog malapit sa palengke',
    description: 'May nakitang usok mula sa isang gusali sa tabi ng palengke. Lumalaki na ang apoy.',
    severity: 'critical', location: 'Palengke Area, Purok 1', reporter: 'Jose Garcia', reporterContact: '0928-333-4444',
    time: '42 min ago', status: 'Ongoing Rescue', assignedTeam: 'Rescue Team Alpha', assignedVehicle: 'Fire Truck 1',
  },
  {
    id: 3, ticketId: 'INC-1040', type: 'landslide', title: 'Pagguho ng lupa sa Sitio Bukal',
    description: 'Bahagyang gumuho ang gilid ng burol pagkatapos ng malakas na ulan.',
    severity: 'moderate', location: 'Sitio Bukal, Purok 5', reporter: 'Ana Reyes', reporterContact: '0935-555-6666',
    time: '1 hr ago', status: 'Acknowledged', assignedTeam: 'Rescue Team Bravo',
  },
  {
    id: 4, ticketId: 'INC-1039', type: 'flood', title: 'Baha sa underpass',
    description: 'Lubog na ang underpass, hindi makatawid ang mga pedestrian at sasakyan.',
    severity: 'high', location: 'Main Road Underpass', reporter: 'Pedro Lim', reporterContact: '0920-777-8888',
    time: '2 hr ago', status: 'Resolved', assignedTeam: 'Rescue Team Alpha', assignedVehicle: 'Rescue Boat 1',
  },
  {
    id: 5, ticketId: 'INC-1038', type: 'other', title: 'Nabuwal na puno sa Street B',
    description: 'Malaking puno ang nabuwal at harang sa daan. May nasirang linya ng kuryente.',
    severity: 'high', location: 'Street B, Purok 2', reporter: 'Elena Villanueva', reporterContact: '0912-999-0000',
    time: '3 hr ago', status: 'Resolved', assignedTeam: 'Rescue Team Bravo', assignedVehicle: 'Utility Truck 1',
  },
  {
    id: 6, ticketId: 'INC-1037', type: 'earthquake', title: 'Bitak sa gusali pagkatapos ng lindol',
    description: 'May malaking bitak sa dingding ng isang lumang gusali. Posibleng gumuho.',
    severity: 'moderate', location: 'Old Town Area, Purok 4', reporter: 'Roberto Cruz', reporterContact: '0917-123-4567',
    time: '5 hr ago', status: 'Pending',
  },
];

export const availableTeams = ['Rescue Team Alpha', 'Rescue Team Bravo', 'Rescue Team Charlie', 'Medical Team 1'];
export const availableVehicles = ['Fire Truck 1', 'Rescue Boat 1', 'Rescue Boat 2', 'Ambulansya', 'Utility Truck 1'];

// ==================== RELIEF GOODS ====================

export interface ReliefItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  dateReceived: string;
  warehouse: string;
}

export const initialInventory: ReliefItem[] = [
  { id: 1, name: 'Bigas', category: 'Pagkain', quantity: 100, dateReceived: 'Hulyo 15, 2026', warehouse: 'Barangay Hall' },
  { id: 2, name: 'Sardinas', category: 'Pagkain', quantity: 500, dateReceived: 'Hulyo 15, 2026', warehouse: 'Barangay Hall' },
  { id: 3, name: 'Noodles', category: 'Pagkain', quantity: 300, dateReceived: 'Hulyo 14, 2026', warehouse: 'Covered Court' },
  { id: 4, name: 'Bottled Water', category: 'Tubig', quantity: 1000, dateReceived: 'Hulyo 14, 2026', warehouse: 'Covered Court' },
  { id: 5, name: 'Paracetamol', category: 'Gamot', quantity: 200, dateReceived: 'Hulyo 13, 2026', warehouse: 'Health Center' },
  { id: 6, name: 'Blanket', category: 'Damit', quantity: 50, dateReceived: 'Hulyo 13, 2026', warehouse: 'Barangay Hall' },
  { id: 7, name: 'Hygiene Kit', category: 'Hygiene', quantity: 150, dateReceived: 'Hulyo 12, 2026', warehouse: 'Barangay Hall' },
  { id: 8, name: 'Coffee 3-in-1', category: 'Pagkain', quantity: 400, dateReceived: 'Hulyo 12, 2026', warehouse: 'Covered Court' },
];

export const categoryColors: Record<string, { color: string; bg: string }> = {
  Pagkain: { color: '#ea580c', bg: 'rgba(234,88,12,0.08)' },
  Tubig: { color: '#2563eb', bg: 'rgba(37,99,235,0.08)' },
  Gamot: { color: '#059669', bg: 'rgba(5,150,105,0.08)' },
  Damit: { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  Hygiene: { color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
};

export interface DistributionRecord {
  id: number;
  residentName: string;
  items: string;
  dateClaimed: string;
  claimedBy: string;
  status: 'Claimed' | 'Scheduled';
}

export const initialDistributions: DistributionRecord[] = [
  { id: 1, residentName: 'Juan Dela Cruz', items: 'Bigas (1 Sako), Sardinas (5 Lata), Tubig (6 Bote)', dateClaimed: 'Hulyo 15, 2026', claimedBy: 'Elena Cruz', status: 'Claimed' },
  { id: 2, residentName: 'Maria Santos', items: 'Bigas (1 Sako), Noodles (3 Pack), Tubig (6 Bote)', dateClaimed: 'Hulyo 15, 2026', claimedBy: 'Pedro Lim', status: 'Claimed' },
  { id: 3, residentName: 'Jose Garcia', items: 'Bigas (1 Sako), Hygiene Kit (1 Kit)', dateClaimed: 'Hulyo 14, 2026', claimedBy: 'Elena Cruz', status: 'Claimed' },
  { id: 4, residentName: 'Ana Reyes', items: 'Pagkain Package, Gamot Package', dateClaimed: '—', claimedBy: '—', status: 'Scheduled' },
  { id: 5, residentName: 'Roberto Cruz', items: 'Bigas (1 Sako), Blanket (1 Piraso)', dateClaimed: '—', claimedBy: '—', status: 'Scheduled' },
];

// ==================== MAP & EVACUATION ====================

export interface HazardPin {
  id: number;
  type: string;
  description: string;
  lat: number;
  lng: number;
  addedBy: string;
  dateAdded: string;
}

export const initialHazardPins: HazardPin[] = [
  { id: 1, type: 'Baha', description: 'Baha sa Street A — tuhod ang lalim', lat: 14.5995, lng: 120.9842, addedBy: 'Admin', dateAdded: 'Hulyo 17, 2026' },
  { id: 2, type: 'Nabuwal na Puno', description: 'Nabuwal na puno sa Street B — harang sa daan', lat: 14.6010, lng: 120.9865, addedBy: 'Admin', dateAdded: 'Hulyo 17, 2026' },
  { id: 3, type: 'Landslide', description: 'Pagguho ng lupa sa Sitio Bukal', lat: 14.5980, lng: 120.9820, addedBy: 'Admin', dateAdded: 'Hulyo 16, 2026' },
  { id: 4, type: 'Baha', description: 'Lubog na underpass — hindi madaanan', lat: 14.6025, lng: 120.9890, addedBy: 'Admin', dateAdded: 'Hulyo 16, 2026' },
];

export interface EvacCenter {
  id: number;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  currentOccupancy: number;
  status: 'Open' | 'Closed';
  contactPerson: string;
  contact: string;
}

export const initialEvacCenters: EvacCenter[] = [
  { id: 1, name: 'Barangay Hall Covered Court', lat: 14.5995, lng: 120.9842, capacity: 200, currentOccupancy: 160, status: 'Open', contactPerson: 'Elena Cruz', contact: '0928-456-7890' },
  { id: 2, name: 'Elementary School Gymnasium', lat: 14.6015, lng: 120.9870, capacity: 350, currentOccupancy: 350, status: 'Open', contactPerson: 'Ana Villanueva', contact: '0912-234-5678' },
  { id: 3, name: 'Municipal Evacuation Center', lat: 14.5970, lng: 120.9810, capacity: 500, currentOccupancy: 210, status: 'Open', contactPerson: 'Pedro Lim', contact: '0920-345-6789' },
  { id: 4, name: 'Chapel of San Jose', lat: 14.6035, lng: 120.9900, capacity: 80, currentOccupancy: 0, status: 'Closed', contactPerson: 'Roberto Reyes', contact: '0935-789-0123' },
];

// ==================== ALERTS & CONTENT ====================

export interface Announcement {
  id: number;
  title: string;
  body: string;
  category: 'Event' | 'Directory' | 'Update';
  datePosted: string;
  postedBy: string;
}

export const initialAnnouncements: Announcement[] = [
  { id: 1, title: 'Preemptive Evacuation Notice', body: 'Pinapayuhan ang lahat ng nakatira malapit sa ilog na lumikas sa pinakamalapit na evacuation center bago mag-6PM ngayong araw.', category: 'Update', datePosted: 'Hulyo 17, 2026', postedBy: 'Kap. Mario Santos' },
  { id: 2, title: 'Relief Goods Distribution Schedule', body: 'Ang pamimigay ng relief goods ay sa Hulyo 18, 2026 sa Barangay Hall mula 8AM hanggang 5PM. Magdala ng valid ID.', category: 'Event', datePosted: 'Hulyo 16, 2026', postedBy: 'Pedro Lim' },
  { id: 3, title: 'Updated Emergency Hotlines', body: 'Barangay Hall: (02) 8123-4567 | BFP: (02) 8426-0219 | PRC: 143 | Emergency: 911', category: 'Directory', datePosted: 'Hulyo 15, 2026', postedBy: 'Elena Cruz' },
  { id: 4, title: 'Earthquake Drill — Hulyo 20', body: 'Magkakaroon ng earthquake drill sa Hulyo 20, 2026 sa Barangay Hall at Covered Court. Lahat ng residente ay hinihikayat na sumali.', category: 'Event', datePosted: 'Hulyo 14, 2026', postedBy: 'Roberto Reyes' },
];

export const announcementCategoryStyles: Record<string, { color: string; bg: string }> = {
  Event: { color: '#7c3aed', bg: 'rgba(124,58,237,0.08)' },
  Directory: { color: '#0891b2', bg: 'rgba(8,145,178,0.08)' },
  Update: { color: '#ea580c', bg: 'rgba(234,88,12,0.08)' },
};

export interface CustomAlert {
  id: number;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  datePosted: string;
  postedBy: string;
  active: boolean;
}

export const initialCustomAlerts: CustomAlert[] = [
  { id: 1, message: 'Preemptive evacuation para sa mga nakatira malapit sa ilog. Lumikas na bago mag-6PM.', severity: 'critical', datePosted: 'Hulyo 17, 2026 — 2:30 PM', postedBy: 'Kap. Mario Santos', active: true },
  { id: 2, message: 'Iwasan ang pagdaan sa Main Road Underpass — lubog sa baha.', severity: 'warning', datePosted: 'Hulyo 17, 2026 — 1:00 PM', postedBy: 'Elena Cruz', active: true },
  { id: 3, message: 'Pamimigay ng relief goods bukas, Hulyo 18 sa Barangay Hall.', severity: 'info', datePosted: 'Hulyo 16, 2026 — 4:00 PM', postedBy: 'Pedro Lim', active: false },
];

export const alertSeverityStyles: Record<string, { color: string; bg: string; border: string; label: string }> = {
  info: { color: '#2563eb', bg: 'rgba(37,99,235,0.06)', border: 'rgba(37,99,235,0.2)', label: 'Impormasyon' },
  warning: { color: '#d97706', bg: 'rgba(217,119,6,0.06)', border: 'rgba(217,119,6,0.2)', label: 'Babala' },
  critical: { color: '#dc2626', bg: 'rgba(220,38,38,0.06)', border: 'rgba(220,38,38,0.2)', label: 'Kritikal' },
};

// ==================== RESIDENTS & PERSONNEL ====================

export type VerificationStatus = 'Pending' | 'Verified' | 'Rejected';

export interface Resident {
  id: number;
  name: string;
  address: string;
  contact: string;
  registrationDate: string;
  verificationStatus: VerificationStatus;
}

export const initialResidents: Resident[] = [
  { id: 1, name: 'Juan Dela Cruz', address: 'Purok 1, Street A', contact: '0917-111-2222', registrationDate: 'Hulyo 10, 2026', verificationStatus: 'Verified' },
  { id: 2, name: 'Maria Santos', address: 'Purok 3, Street C', contact: '0928-333-4444', registrationDate: 'Hulyo 12, 2026', verificationStatus: 'Verified' },
  { id: 3, name: 'Jose Garcia', address: 'Purok 1, Street B', contact: '0935-555-6666', registrationDate: 'Hulyo 14, 2026', verificationStatus: 'Pending' },
  { id: 4, name: 'Ana Reyes', address: 'Purok 5, Sitio Bukal', contact: '0912-234-5678', registrationDate: 'Hulyo 15, 2026', verificationStatus: 'Pending' },
  { id: 5, name: 'Roberto Cruz', address: 'Purok 4, Old Town', contact: '0917-123-4567', registrationDate: 'Hulyo 15, 2026', verificationStatus: 'Pending' },
  { id: 6, name: 'Elena Villanueva', address: 'Purok 2, Street B', contact: '0920-999-0000', registrationDate: 'Hulyo 16, 2026', verificationStatus: 'Rejected' },
  { id: 7, name: 'Pedro Bautista', address: 'Purok 3, Street D', contact: '0918-777-8888', registrationDate: 'Hulyo 16, 2026', verificationStatus: 'Pending' },
  { id: 8, name: 'Lucia Fernandez', address: 'Purok 1, Street A', contact: '0929-444-5555', registrationDate: 'Hulyo 17, 2026', verificationStatus: 'Pending' },
];

export const verificationStatusStyles: Record<VerificationStatus, { color: string; bg: string }> = {
  Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Verified: { color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  Rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export interface StaffMember {
  id: number;
  name: string;
  position: string;
  contact: string;
  shift: string;
  status: 'On Duty' | 'Off Duty' | 'On Leave';
}

export const initialStaff: StaffMember[] = [
  { id: 1, name: 'Kap. Mario Santos', position: 'BDRRMC Chairperson', contact: '0917-123-4567', shift: '24/7 On-Call', status: 'On Duty' },
  { id: 2, name: 'Elena Cruz', position: 'Action Officer', contact: '0928-456-7890', shift: '6AM - 6PM', status: 'On Duty' },
  { id: 3, name: 'Roberto Reyes', position: 'Rescue Team Lead', contact: '0935-789-0123', shift: '6AM - 6PM', status: 'On Duty' },
  { id: 4, name: 'Ana Villanueva', position: 'Health & First Aid', contact: '0912-234-5678', shift: '6PM - 6AM', status: 'Off Duty' },
  { id: 5, name: 'Pedro Lim', position: 'Logistics Officer', contact: '0920-345-6789', shift: '6AM - 6PM', status: 'On Duty' },
  { id: 6, name: 'Carlos Ramos', position: 'Volunteer Rescuer', contact: '0917-567-8901', shift: '6PM - 6AM', status: 'Off Duty' },
];

export const staffStatusStyles: Record<string, { color: string; bg: string }> = {
  'On Duty': { color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  'Off Duty': { color: '#64748b', bg: 'rgba(100,116,139,0.1)' },
  'On Leave': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
};

export interface Equipment {
  id: number;
  name: string;
  type: string;
  status: 'Available' | 'Deployed' | 'Under Maintenance';
  details: string;
}

export const initialEquipment: Equipment[] = [
  { id: 1, name: 'Fire Truck 1', type: 'Vehicle', status: 'Deployed', details: 'Dispatched to Palengke Area' },
  { id: 2, name: 'Rescue Boat 1', type: 'Vehicle', status: 'Available', details: 'Standby sa Covered Court' },
  { id: 3, name: 'Rescue Boat 2', type: 'Vehicle', status: 'Available', details: 'Standby sa Covered Court' },
  { id: 4, name: 'Ambulansya', type: 'Vehicle', status: 'Available', details: 'Standby sa Brgy. Hall' },
  { id: 5, name: 'Utility Truck 1', type: 'Vehicle', status: 'Available', details: 'Standby sa Brgy. Hall' },
  { id: 6, name: 'Emergency Generator', type: 'Equipment', status: 'Under Maintenance', details: 'Under repair — ETA: Hulyo 20' },
  { id: 7, name: 'Chainsaw', type: 'Equipment', status: 'Available', details: '2 units — bodega' },
  { id: 8, name: 'Medical Kit', type: 'Equipment', status: 'Available', details: '10 kits — Health Center' },
];

export const equipmentStatusStyles: Record<string, { color: string; bg: string }> = {
  Available: { color: '#16a34a', bg: 'rgba(22,163,74,0.1)' },
  Deployed: { color: '#2563eb', bg: 'rgba(37,99,235,0.1)' },
  'Under Maintenance': { color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
};
