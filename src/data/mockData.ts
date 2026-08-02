export type EmergencyType = 'Fire' | 'Flood' | 'Medical' | 'Road Obstruction';
export type IncidentStatus = 'Pending' | 'Responding' | 'Resolved';
export type IncidentPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Incident {
  id: string;
  reporterName: string;
  contactNumber: string;
  location: string;
  type: EmergencyType;
  priority?: IncidentPriority;
  status: IncidentStatus;
  timestamp: string;
  assignedResponder?: string;
  gpsLocation?: string;
  deviceIp?: string;
  isVerified?: boolean;
  spamScore?: number;
}

export const initialIncidents: Incident[] = [
  {
    id: 'INC-101',
    reporterName: 'Juan Dela Cruz',
    contactNumber: '09123456789',
    location: 'Brgy. Commonwealth',
    type: 'Fire',
    priority: 'Critical',
    status: 'Pending',
    timestamp: new Date().toISOString(),
    isVerified: true,
    gpsLocation: '14.6983 N, 121.0877 E',
    spamScore: 0.1
  },
  {
    id: 'INC-102',
    reporterName: 'Maria Santos',
    contactNumber: '09987654321',
    location: 'Brgy. Batasan Hills',
    type: 'Flood',
    priority: 'High',
    status: 'Responding',
    timestamp: new Date().toISOString(),
    assignedResponder: 'RES-01',
    isVerified: false,
    gpsLocation: '14.6961 N, 121.0963 E',
    spamScore: 0.8
  },
  {
    id: 'INC-103',
    reporterName: 'Pedro Reyes',
    contactNumber: '09171234567',
    location: 'Brgy. Payatas',
    type: 'Medical',
    priority: 'Medium',
    status: 'Pending',
    timestamp: new Date(Date.now() - 600000).toISOString(),
    isVerified: true,
    gpsLocation: '14.7094 N, 121.1026 E',
    spamScore: 0.05
  },
  {
    id: 'INC-104',
    reporterName: 'Ana Gonzales',
    contactNumber: '09281112233',
    location: 'Brgy. Fairview',
    type: 'Road Obstruction',
    priority: 'Low',
    status: 'Pending',
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    isVerified: false,
    gpsLocation: '14.7201 N, 121.0734 E',
    spamScore: 0.45
  },
  {
    id: 'INC-105',
    reporterName: 'Carlos Mendoza',
    contactNumber: '09339876543',
    location: 'Brgy. Holy Spirit',
    type: 'Flood',
    priority: 'High',
    status: 'Resolved',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    assignedResponder: 'RES-03',
    isVerified: true,
    gpsLocation: '14.6812 N, 121.0801 E',
    spamScore: 0.02
  }
];

export interface Resource {
  id: string;
  name: string;
  type: 'Ambulance' | 'Rescue Vehicle' | 'Rubber Boat' | 'Medical Equipment' | 'Personnel';
  status: 'Available' | 'Deployed' | 'Maintenance';
  location: string;
  assignedTo?: string; // Incident ID if deployed
}

export const initialResources: Resource[] = [
  { id: 'AMB-01', name: 'Alpha 1', type: 'Ambulance', status: 'Available', location: 'EOC Main Base' },
  { id: 'AMB-02', name: 'Alpha 2', type: 'Ambulance', status: 'Deployed', location: 'Brgy. Batasan Hills', assignedTo: 'INC-102' },
  { id: 'RV-01', name: 'Rescue Truck 1', type: 'Rescue Vehicle', status: 'Available', location: 'EOC Main Base' },
  { id: 'RV-02', name: 'Rescue Truck 2', type: 'Rescue Vehicle', status: 'Maintenance', location: 'Motorpool' },
  { id: 'RB-01', name: 'Zodiac 1', type: 'Rubber Boat', status: 'Deployed', location: 'Brgy. Holy Spirit', assignedTo: 'INC-105' },
  { id: 'MED-01', name: 'Defibrillator Unit A', type: 'Medical Equipment', status: 'Available', location: 'EOC Main Base' },
  { id: 'PER-01', name: 'SGT. Cruz, M.', type: 'Personnel', status: 'Deployed', location: 'Brgy. Batasan Hills', assignedTo: 'INC-102' },
  { id: 'PER-02', name: 'Medic Rivera, J.', type: 'Personnel', status: 'Available', location: 'EOC Main Base' }
];

export const barangays = [
  'Alicia', 'Amihan', 'Apolonio Samson', 'Baesa', 'Bagbag', 'Bagumbayan',
  'Bahay Toro', 'Balingasa', 'Balong Bato', 'Batasan Hills', 'Bayanihan',
  'Bungad', 'Camp Aguinaldo', 'Commonwealth', 'Culiat', 'Damar', 'Damayan',
  'Fairview', 'Holy Spirit', 'Payatas'
];

export interface ReliefClaim {
  id: string;
  date: string;
  items: string;
  status: 'Claimed' | 'Pending';
}

export const initialReliefHistory: ReliefClaim[] = [
  { id: 'RC-001', date: '2023-11-01', items: 'Food Pack, Water', status: 'Claimed' },
  { id: 'RC-002', date: '2023-11-05', items: 'Hygiene Kit', status: 'Pending' }
];