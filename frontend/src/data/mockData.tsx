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
}

export const initialIncidents: Incident[] = [
  {
    id: 'INC-101',
    reporterName: 'Juan Dela Cruz',
    contactNumber: '09123456789',
    location: 'Brgy. Commonwealth',
    type: 'Fire',
    status: 'Pending',
    timestamp: new Date().toISOString()
  },
  {
    id: 'INC-102',
    reporterName: 'Maria Santos',
    contactNumber: '09987654321',
    location: 'Brgy. Batasan Hills',
    type: 'Flood',
    status: 'Responding',
    timestamp: new Date().toISOString(),
    assignedResponder: 'RES-01'
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
