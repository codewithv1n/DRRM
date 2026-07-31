export type EmergencyType = 'Fire' | 'Flood' | 'Medical' | 'Road Obstruction';
export type IncidentStatus = 'Pending' | 'Responding' | 'Resolved';

export interface Incident {
  id: string;
  reporterName: string;
  contactNumber: string;
  location: string;
  type: EmergencyType;
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
    status: 'Resolved',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    assignedResponder: 'RES-03',
    isVerified: true,
    gpsLocation: '14.6812 N, 121.0801 E',
    spamScore: 0.02
  }
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