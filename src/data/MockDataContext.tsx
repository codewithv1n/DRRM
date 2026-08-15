import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { initialIncidents, initialResources } from './mockData';
import type { Incident, Resource } from './mockData';


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

interface MockDataContextType {
  // Offline Simulation
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  actionQueue: QueuedAction[];
  syncQueue: () => void;

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

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(false);
  const [actionQueue, setActionQueue] = useState<QueuedAction[]>([]);

  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [activeAlerts, setActiveAlerts] = useState<Alert[]>([
    {
      id: `ALT-${Date.now() - 3600000}`,
      level: 'General Alert',
      message: 'WALANG PASOK: Classes in ALL LEVELS (public and private) in Quezon City are suspended today due to severe weather conditions.',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      channel: 'City Information Office',
      deliveryStatus: 'Sent'
    },
    {
      id: `ALT-${Date.now() - 7200000}`,
      level: 'Red Alert',
      message: 'Pre-emptive evacuation is now in effect for all low-lying areas near Tullahan River.',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      channel: 'QC DRRMO',
      deliveryStatus: 'Sent'
    }
  ]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [reliefClaims] = useState<ReliefClaimResident[]>([
    { id: 'RC-001', status: 'Claimed', scannedBy: 'System Admin', timestamp: new Date(Date.now() - 86400000).toISOString() },
    { id: 'RC-002', status: 'Pending', scannedBy: 'QR Scanner', timestamp: new Date().toISOString() }
  ]);
  const [reliefDispatches, setReliefDispatches] = useState<ReliefDispatch[]>([
    {
      id: 'DSP-001',
      barangay: 'Commonwealth',
      type: 'Family Food Pack',
      quantity: 500,
      vehicle: 'Task Force 1',
      status: 'Delivered',
      timestamp: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'DSP-002',
      barangay: 'Commonwealth',
      type: 'Hygiene Kit A',
      quantity: 300,
      vehicle: 'Task Force 3',
      status: 'En Route',
      timestamp: new Date().toISOString()
    }
  ]);
  
 


  const [reliefInventory, setReliefInventory] = useState<ReliefInventoryItem[]>([
    { id: 'INV-01', name: 'Family Food Pack', category: 'Food', quantity: 1500, unit: 'packs', lastUpdated: new Date().toISOString() },
    { id: 'INV-02', name: 'Hygiene Kit A', category: 'Hygiene', quantity: 800, unit: 'kits', lastUpdated: new Date().toISOString() },
    { id: 'INV-03', name: 'Sleeping Kit', category: 'Non-Food', quantity: 500, unit: 'kits', lastUpdated: new Date().toISOString() },
    { id: 'INV-04', name: 'Bottled Water (Box)', category: 'Food', quantity: 2000, unit: 'boxes', lastUpdated: new Date().toISOString() },
    { id: 'INV-05', name: 'NFA Rice (50kg)', category: 'Food', quantity: 300, unit: 'sacks', lastUpdated: new Date().toISOString() },
    { id: 'INV-06', name: 'Canned Sardines (100/box)', category: 'Food', quantity: 450, unit: 'boxes', lastUpdated: new Date().toISOString() },
    { id: 'INV-07', name: 'Instant Noodles (72/box)', category: 'Food', quantity: 600, unit: 'boxes', lastUpdated: new Date().toISOString() },
    { id: 'INV-08', name: 'First Aid Kit (Standard)', category: 'Medical', quantity: 250, unit: 'kits', lastUpdated: new Date().toISOString() },
    { id: 'INV-09', name: 'Modular Tents (Family)', category: 'Equipment', quantity: 150, unit: 'units', lastUpdated: new Date().toISOString() },
    { id: 'INV-10', name: 'Thermal Blankets', category: 'Non-Food', quantity: 1200, unit: 'pcs', lastUpdated: new Date().toISOString() },
    { id: 'INV-11', name: 'Face Masks (50/box)', category: 'Medical', quantity: 1000, unit: 'boxes', lastUpdated: new Date().toISOString() },
    { id: 'INV-12', name: 'Rubbing Alcohol (Gallon)', category: 'Hygiene', quantity: 400, unit: 'gallons', lastUpdated: new Date().toISOString() },
    { id: 'INV-13', name: 'Heavy Duty Flashlights', category: 'Equipment', quantity: 350, unit: 'pcs', lastUpdated: new Date().toISOString() },
    { id: 'INV-14', name: 'Portable Generators (5kW)', category: 'Equipment', quantity: 12, unit: 'units', lastUpdated: new Date().toISOString() },
  ]);

  const [pendingDonations, setPendingDonations] = useState<PendingDonation[]>([
    { id: 'DON-01', donorName: 'Red Cross PH', items: [{ name: 'Family Food Pack', quantity: 500, unit: 'packs' }], status: 'Pending', eta: new Date(Date.now() + 86400000).toISOString() },
    { id: 'DON-02', donorName: 'Private Citizen', items: [{ name: 'Bottled Water (Box)', quantity: 50, unit: 'boxes' }], status: 'Pending', eta: new Date(Date.now() + 43200000).toISOString() },
    { id: 'DON-03', donorName: 'Local NGO', items: [{ name: 'Sleeping Kit', quantity: 100, unit: 'kits' }], status: 'Received', eta: new Date(Date.now() - 86400000).toISOString() },
  ]);

  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([
    {
      id: 'ADM-001',
      role: 'Barangay Admin',
      barangay: 'Balingasa',
      name: 'John Doe',
      email: 'jdoe@balingasa.qc.gov.ph'
    }
  ]);

  const addAuditLog = (action: string, userRole: string, details: string) => {
    setAuditLogs(prev => [{
      id: `LOG-${Date.now()}`,
      action,
      userRole,
      details,
      timestamp: new Date().toISOString()
    }, ...prev]);
  };

  const syncQueue = () => {
    if (actionQueue.length === 0) return;
    alert(`Syncing ${actionQueue.length} offline actions to the server...`);
    // Process queue based on type
    actionQueue.forEach(action => {
      if (action.type === 'INCIDENT_UPDATE') {
        updateIncidentStatus(action.payload.id, action.payload.status, action.payload.gpsLocation, action.payload.debrief, true);
      }
    });
    setActionQueue([]);
    addAuditLog('Offline Sync', 'System', `Synced ${actionQueue.length} queued actions.`);
  };

  const addIncident = (newIncidentData: Omit<Incident, 'id' | 'timestamp' | 'status' | 'assignedResponder'>) => {
    const newIncident: Incident = {
      ...newIncidentData,
      id: `INC-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    setIncidents(prev => [newIncident, ...prev]);
    addAuditLog('Report Incident', 'Public', `Incident reported at ${newIncident.location}`);
  };

  const updateIncidentStatus = (id: string, status: Incident['status'], gpsLocation?: string, debrief?: Incident['debrief'], bypassQueue = false) => {
    if (isOffline && !bypassQueue) {
      setActionQueue(prev => [...prev, {
        id: `QA-${Date.now()}`,
        type: 'INCIDENT_UPDATE',
        payload: { id, status, gpsLocation, debrief },
        timestamp: new Date().toISOString()
      }]);
      return; // Stop here, it's queued
    }

    setIncidents(prev => 
      prev.map(inc => inc.id === id ? { ...inc, status, gpsLocation: gpsLocation || inc.gpsLocation, debrief: debrief || inc.debrief } : inc)
    );
    addAuditLog('Update Status', 'Response Unit', `Incident ${id} marked as ${status} ${gpsLocation ? `at [${gpsLocation}]` : ''}`);
  };

  const assignResponder = (incidentId: string, responderId: string) => {
    setIncidents(prev =>
      prev.map(inc => inc.id === incidentId ? { ...inc, assignedResponder: responderId, status: 'Responding' as const } : inc)
    );
    // Optionally update resource status automatically here if responderId matches a resource
    setResources(prev => 
      prev.map(res => res.id === responderId ? { ...res, status: 'Deployed', assignedTo: incidentId } : res)
    );
    addAuditLog('Dispatch Unit', 'Department Admin', `Assigned ${responderId} to incident ${incidentId}`);
  };

  const updateResourceStatus = (id: string, status: Resource['status'], assignedTo?: string) => {
    setResources(prev => prev.map(res => res.id === id ? { ...res, status, assignedTo } : res));
    addAuditLog('Update Resource', 'Department Admin', `Resource ${id} status changed to ${status}`);
  };


  const addReliefDispatch = (dispatchData: Omit<ReliefDispatch, 'id' | 'status' | 'timestamp'>) => {
    const newDispatch: ReliefDispatch = {
      ...dispatchData,
      id: `DSP-${Math.floor(Math.random() * 10000)}`,
      status: 'Delivered', // Instantly delivered
      timestamp: new Date().toISOString()
    };
    setReliefDispatches(prev => [newDispatch, ...prev]);
    addAuditLog('Relief Dispatch', 'Department Admin', `Dispatched ${newDispatch.quantity} ${newDispatch.type} to ${newDispatch.barangay}`);
  };

  const requestRelief = (requestData: { barangay: string; type: string; quantity: number }) => {
    const newRequest: ReliefDispatch = {
      id: `REQ-${Math.floor(Math.random() * 10000)}`,
      barangay: requestData.barangay,
      type: requestData.type,
      quantity: requestData.quantity,
      vehicle: 'Pending Assignment',
      status: 'Pending',
      timestamp: new Date().toISOString()
    };
    setReliefDispatches(prev => [newRequest, ...prev]);
    addAuditLog('Relief Request', 'Barangay Admin', `Requested ${requestData.quantity} ${requestData.type} for ${requestData.barangay}`);
  };

  const updateReliefDispatchStatus = (id: string, status: ReliefDispatch['status']) => {
    setReliefDispatches(prev => prev.map(d => d.id === id ? { ...d, status } : d));
    addAuditLog('Update Dispatch', 'System', `Dispatch ${id} status updated to ${status}`);
  };

  const updateReliefDispatchQuantity = (id: string, newQuantity: number) => {
    setReliefDispatches(prev => prev.map(d => d.id === id ? { ...d, quantity: Math.max(0, newQuantity) } : d));
  };

  const updateInventoryQuantity = (id: string, newQuantity: number) => {
    setReliefInventory(prev => prev.map(item => item.id === id ? { ...item, quantity: Math.max(0, newQuantity), lastUpdated: new Date().toISOString() } : item));
  };

  const addInventoryItem = (itemData: Omit<ReliefInventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: ReliefInventoryItem = {
      ...itemData,
      id: `INV-${Date.now()}`,
      lastUpdated: new Date().toISOString()
    };
    setReliefInventory(prev => [...prev, newItem]);
    addAuditLog('Add Inventory Item', 'Department Admin', `Added ${newItem.quantity} ${newItem.unit} of ${newItem.name}`);
  };

  const receiveDonation = (id: string) => {
    setPendingDonations(prev => prev.map(don => {
      if (don.id === id) {
        // Automatically add items to inventory
        don.items.forEach(donatedItem => {
          setReliefInventory(currentInv => {
            const existing = currentInv.find(i => i.name === donatedItem.name);
            if (existing) {
              return currentInv.map(i => i.id === existing.id ? { ...i, quantity: i.quantity + donatedItem.quantity, lastUpdated: new Date().toISOString() } : i);
            } else {
              return [...currentInv, {
                id: `INV-${Date.now()}-${Math.random()}`,
                name: donatedItem.name,
                category: 'Donation',
                quantity: donatedItem.quantity,
                unit: donatedItem.unit,
                lastUpdated: new Date().toISOString()
              }];
            }
          });
        });
        addAuditLog('Receive Donation', 'System', `Received donation from ${don.donorName}`);
        return { ...don, status: 'Received' };
      }
      return don;
    }));
  };

  const addPendingDonation = (donationData: Omit<PendingDonation, 'id' | 'status'>) => {
    const newDonation: PendingDonation = {
      ...donationData,
      id: `DON-${Date.now()}`,
      status: 'Pending'
    };
    setPendingDonations(prev => [...prev, newDonation]);
    addAuditLog('Add Expected Donation', 'Department Admin', `Logged expected donation from ${donationData.donorName}`);
  };

  const broadcastAlert = (level: string, message: string, useBackup = false) => {
    const newAlert: Alert = {
      id: `ALT-${Date.now()}`,
      level,
      message,
      timestamp: new Date().toISOString(),
      channel: useBackup ? 'SMS Backup' : 'WebSocket',
      deliveryStatus: 'Sent'
    };
    setActiveAlerts(prev => [newAlert, ...prev]);
  };

  const addSystemUser = (user: Omit<SystemUser, 'id'>) => {
    const newUser: SystemUser = {
      ...user,
      id: `USR-${Date.now()}`
    };
    setSystemUsers(prev => [...prev, newUser]);
  };

  return (
    <MockDataContext.Provider value={{ 
      isOffline, setIsOffline, actionQueue, syncQueue,
      incidents, addIncident, updateIncidentStatus, assignResponder,
      resources, updateResourceStatus,

      activeAlerts, broadcastAlert,
      auditLogs, addAuditLog,
      reliefClaims,

      reliefDispatches, addReliefDispatch, requestRelief, updateReliefDispatchStatus, updateReliefDispatchQuantity,
      reliefInventory, updateInventoryQuantity, addInventoryItem,
      pendingDonations, receiveDonation, addPendingDonation,
      systemUsers, addSystemUser
    }}>
      {children}
    </MockDataContext.Provider>
  );
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
