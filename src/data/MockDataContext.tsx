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

export interface EvacuationCenter {
  id: string;
  name: string;
  capacity: number;
  currentOccupancy: number;
  lastUpdatedAt?: string;
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

export interface SitRep {
  id: string;
  barangay: string;
  householdCount: number;
  damageSeverity: 'Minor' | 'Moderate' | 'Severe' | 'Critical';
  evacueeCount: number;
  timestamp: string;
  lastUpdatedBy: string;
}

export interface QueuedAction {
  id: string;
  type: 'RELIEF_CLAIM' | 'INCIDENT_UPDATE' | 'HAZARD_UPDATE';
  payload: any;
  timestamp: string;
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
  updateIncidentStatus: (id: string, status: Incident['status'], gpsLocation?: string) => void;
  assignResponder: (incidentId: string, responderId: string) => void;

  resources: Resource[];
  updateResourceStatus: (id: string, status: Resource['status'], assignedTo?: string) => void;

  evacuationCenters: EvacuationCenter[];
  updateEvacuationOccupancy: (id: string, delta: number) => void;

  activeAlerts: Alert[];
  broadcastAlert: (level: string, message: string, useBackup?: boolean) => void;

  auditLogs: AuditLog[];
  addAuditLog: (action: string, userRole: string, details: string) => void;

  reliefClaims: ReliefClaimResident[];

  barangaySitReps: SitRep[];
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
  
  const [evacuationCenters, setEvacuationCenters] = useState<EvacuationCenter[]>([
    { id: 'EC-01', name: 'Commonwealth Elem. School', capacity: 500, currentOccupancy: 120, lastUpdatedAt: new Date().toISOString() },
    { id: 'EC-02', name: 'Batasan Hills Nat. High School', capacity: 1000, currentOccupancy: 850, lastUpdatedAt: new Date(Date.now() - 15 * 60000).toISOString() },
    { id: 'EC-03', name: 'Payatas Covered Court', capacity: 300, currentOccupancy: 275, lastUpdatedAt: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: 'EC-04', name: 'Fairview Terraces Gym', capacity: 800, currentOccupancy: 210, lastUpdatedAt: new Date(Date.now() - 45 * 60000).toISOString() },
    { id: 'EC-05', name: 'Holy Spirit Elem. School', capacity: 400, currentOccupancy: 0, lastUpdatedAt: new Date(Date.now() - 120 * 60000).toISOString() },
    { id: 'EC-06', name: 'Bagong Silangan Multi-Purpose Hall', capacity: 600, currentOccupancy: 580, lastUpdatedAt: new Date(Date.now() - 2 * 60000).toISOString() }
  ]);

  const [barangaySitReps] = useState<SitRep[]>([
    { id: 'SR-01', barangay: 'Commonwealth', householdCount: 245, damageSeverity: 'Severe', evacueeCount: 890, timestamp: new Date(Date.now() - 30 * 60000).toISOString(), lastUpdatedBy: 'Brgy. Captain Santos' },
    { id: 'SR-02', barangay: 'Batasan Hills', householdCount: 180, damageSeverity: 'Critical', evacueeCount: 1200, timestamp: new Date(Date.now() - 10 * 60000).toISOString(), lastUpdatedBy: 'Brgy. Secretary Reyes' },
    { id: 'SR-03', barangay: 'Payatas', householdCount: 310, damageSeverity: 'Moderate', evacueeCount: 450, timestamp: new Date(Date.now() - 60 * 60000).toISOString(), lastUpdatedBy: 'Brgy. Captain Cruz' },
    { id: 'SR-04', barangay: 'Fairview', householdCount: 95, damageSeverity: 'Minor', evacueeCount: 120, timestamp: new Date(Date.now() - 5 * 60000).toISOString(), lastUpdatedBy: 'Brgy. Admin Garcia' },
    { id: 'SR-05', barangay: 'Holy Spirit', householdCount: 420, damageSeverity: 'Severe', evacueeCount: 1560, timestamp: new Date(Date.now() - 90 * 60000).toISOString(), lastUpdatedBy: 'Brgy. Captain Villanueva' },
    { id: 'SR-06', barangay: 'Bagumbayan', householdCount: 67, damageSeverity: 'Minor', evacueeCount: 85, timestamp: new Date(Date.now() - 15 * 60000).toISOString(), lastUpdatedBy: 'Brgy. Secretary Lim' },
    { id: 'SR-07', barangay: 'Culiat', householdCount: 155, damageSeverity: 'Moderate', evacueeCount: 340, timestamp: new Date(Date.now() - 25 * 60000).toISOString(), lastUpdatedBy: 'Brgy. Captain Navarro' },
    { id: 'SR-08', barangay: 'Damayan', householdCount: 200, damageSeverity: 'Critical', evacueeCount: 780, timestamp: new Date(Date.now() - 8 * 60000).toISOString(), lastUpdatedBy: 'Brgy. Admin Torres' },
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
        updateIncidentStatus(action.payload.id, action.payload.status, action.payload.gpsLocation, true);
      } else if (action.type === 'HAZARD_UPDATE') {
        updateEvacuationOccupancy(action.payload.id, action.payload.delta, true);
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

  const updateIncidentStatus = (id: string, status: Incident['status'], gpsLocation?: string, bypassQueue = false) => {
    if (isOffline && !bypassQueue) {
      setActionQueue(prev => [...prev, {
        id: `QA-${Date.now()}`,
        type: 'INCIDENT_UPDATE',
        payload: { id, status, gpsLocation },
        timestamp: new Date().toISOString()
      }]);
      return; // Stop here, it's queued
    }

    setIncidents(prev => 
      prev.map(inc => inc.id === id ? { ...inc, status, gpsLocation: gpsLocation || inc.gpsLocation } : inc)
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

  const updateEvacuationOccupancy = (id: string, delta: number, bypassQueue = false) => {
    if (isOffline && !bypassQueue) {
      setActionQueue(prev => [...prev, {
        id: `QA-${Date.now()}`,
        type: 'HAZARD_UPDATE',
        payload: { id, delta },
        timestamp: new Date().toISOString()
      }]);
      return;
    }

    setEvacuationCenters(prev => prev.map(ec => {
      if (ec.id === id) {
        return {
          ...ec,
          currentOccupancy: Math.max(0, ec.currentOccupancy + delta),
          lastUpdatedAt: new Date().toISOString()
        };
      }
      return ec;
    }));
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

  return (
    <MockDataContext.Provider value={{ 
      isOffline, setIsOffline, actionQueue, syncQueue,
      incidents, addIncident, updateIncidentStatus, assignResponder,
      resources, updateResourceStatus,
      evacuationCenters, updateEvacuationOccupancy,
      activeAlerts, broadcastAlert,
      auditLogs, addAuditLog,
      reliefClaims,
      barangaySitReps
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
