export type EmergencyType = 'Fire' | 'Flood' | 'Medical' | 'Road Obstruction' | 'Search and Rescue' | 'Other' | (string & {});
export type IncidentStatus = 'Pending' | 'Acknowledged' | 'Responding' | 'En Route' | 'On Scene' | 'Requesting Backup' | 'Resolved';
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
  debrief?: {
    rescued: number;
    casualties: number;
    medicalAssistance: string;
    remarks: string;
  };
}



export interface Resource {
  id: string;
  name: string;
  type: 'Ambulance' | 'Rescue Vehicle' | 'Rubber Boat' | 'Medical Equipment' | 'Personnel';
  status: 'Available' | 'Deployed' | 'Maintenance';
  location: string;
  assignedTo?: string; 
}



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

export interface Alert {
  id: string;
  level: string;
  message: string;
  timestamp: string;
  channel: string;
  deliveryStatus: 'Sent' | 'Pending' | 'Failed';
}

export interface AuditLog {
  id: string;
  action: string;
  userRole: string;
  details: string;
  timestamp: string;
}

export interface ReliefClaimResident {
  id: string;
  status: 'Claimed' | 'Pending';
  scannedBy: string;
  timestamp: string;
}

export interface ReliefDispatch {
  id: string;
  barangay: string;
  type: string;
  quantity: number;
  vehicle: string;
  status: 'Pending' | 'Preparing' | 'En Route' | 'Arrived' | 'Delivered';
  timestamp: string;
}

export interface QueuedAction {
  id: string;
  type: 'RELIEF_CLAIM' | 'INCIDENT_UPDATE' | 'HAZARD_UPDATE';
  payload: any;
  timestamp: string;
}

export interface ReliefInventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  lastUpdated: string;
}

export interface PendingDonation {
  id: string;
  donorName: string;
  items: { name: string; quantity: number; unit: string }[];
  status: 'Pending' | 'Received';
  eta: string;
}

export interface SystemUser {
  id: string;
  role: string;
  barangay?: string;
  name: string;
  email: string;
  password?: string;
  familyMembers?: { 
    firstName: string; 
    middleName?: string; 
    lastName: string; 
    relation: string; 
    age: string; 
    gender: string; 
    medicalInfo?: string; 
  }[];
}

export interface AppDataContextType {
  // Offline Simulation
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  actionQueue: QueuedAction[];
  syncQueue: () => void;

  // Language state
  language: 'en' | 'ph';
  setLanguage: (lang: 'en' | 'ph') => void;

  // Data
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp' | 'status' | 'assignedResponder'>) => void;
  updateIncidentStatus: (id: string, status: Incident['status'], gpsLocation?: string, debrief?: Incident['debrief']) => void;
  assignResponder: (incidentId: string, responderId: string) => void;

  resources: Resource[];
  updateResourceStatus: (id: string, status: Resource['status'], assignedTo?: string) => void;


  activeAlerts: Alert[];
  broadcastAlert: (level: string, message: string, useBackup?: boolean) => void;

  auditLogs: AuditLog[];
  addAuditLog: (action: string, userRole: string, details: string) => void;

  reliefClaims: ReliefClaimResident[];


  reliefInventory: ReliefInventoryItem[];
  updateInventoryQuantity: (id: string, newQuantity: number) => void;
  addInventoryItem: (item: Omit<ReliefInventoryItem, 'id' | 'lastUpdated'>) => void;

  pendingDonations: PendingDonation[];
  receiveDonation: (id: string) => void;
  addPendingDonation: (donation: Omit<PendingDonation, 'id' | 'status'>) => void;

  reliefDispatches: ReliefDispatch[];
  addReliefDispatch: (dispatch: Omit<ReliefDispatch, 'id' | 'status' | 'timestamp'>) => void;
  requestRelief: (request: { barangay: string; type: string; quantity: number }) => void;
  updateReliefDispatchStatus: (id: string, status: ReliefDispatch['status']) => void;
  updateReliefDispatchQuantity: (id: string, newQuantity: number) => void;

  systemUsers: SystemUser[];
  addSystemUser: (user: Omit<SystemUser, 'id'>) => void;
}
