import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { initialIncidents } from './mockData';
import type { Incident } from './mockData';

// --- Broadcast Alert ---
export interface BroadcastAlert {
  id: string;
  message: string;
  level: string;
  timestamp: string;
  active: boolean;
}

// --- SitRep ---
export interface SitReport {
  id: string;
  barangay: string;
  evacuees: number;
  casualties: number;
  damagedHouses: number;
  situation: string;
  urgentNeeds: string;
  timestamp: string;
}

// --- Evacuation Center Count ---
export interface EvacuationCount {
  centerId: number;
  name: string;
  current: number;
  capacity: number;
}

interface MockDataContextType {
  incidents: Incident[];
  addIncident: (incident: Omit<Incident, 'id' | 'timestamp' | 'status' | 'assignedResponder'>) => void;
  updateIncidentStatus: (id: string, status: Incident['status']) => void;
  assignIncidentResponder: (id: string, responder: string) => void;

  // Broadcast alerts
  broadcastAlerts: BroadcastAlert[];
  addBroadcastAlert: (alert: Omit<BroadcastAlert, 'id' | 'timestamp'>) => void;

  // SitReps
  sitReports: SitReport[];
  addSitReport: (report: Omit<SitReport, 'id' | 'timestamp'>) => void;

  // Evacuation counts
  evacuationCounts: EvacuationCount[];
  updateEvacuationCount: (centerId: number, delta: number) => void;
}

const MockDataContext = createContext<MockDataContextType | undefined>(undefined);

const initialEvacCounts: EvacuationCount[] = [
  { centerId: 1, name: 'Barangay Hall Covered Court', current: 160, capacity: 200 },
  { centerId: 2, name: 'Elementary School Gymnasium', current: 350, capacity: 350 },
  { centerId: 3, name: 'Municipal Evacuation Center', current: 210, capacity: 500 },
  { centerId: 4, name: 'Chapel of San Jose', current: 0, capacity: 80 },
];

export const MockDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [broadcastAlerts, setBroadcastAlerts] = useState<BroadcastAlert[]>([]);
  const [sitReports, setSitReports] = useState<SitReport[]>([]);
  const [evacuationCounts, setEvacuationCounts] = useState<EvacuationCount[]>(initialEvacCounts);

  const addIncident = (newIncidentData: Omit<Incident, 'id' | 'timestamp' | 'status' | 'assignedResponder'>) => {
    const newIncident: Incident = {
      ...newIncidentData,
      id: `INC-${Math.floor(Math.random() * 10000)}`,
      timestamp: new Date().toISOString(),
      status: 'Pending'
    };
    setIncidents(prev => [newIncident, ...prev]);
  };

  const updateIncidentStatus = (id: string, status: Incident['status']) => {
    setIncidents(prev =>
      prev.map(inc => inc.id === id ? { ...inc, status } : inc)
    );
  };

  const assignIncidentResponder = (id: string, responder: string) => {
    setIncidents(prev =>
      prev.map(inc => inc.id === id ? { ...inc, assignedResponder: responder, status: 'Responding' as const } : inc)
    );
  };

  const addBroadcastAlert = (alertData: Omit<BroadcastAlert, 'id' | 'timestamp'>) => {
    const newAlert: BroadcastAlert = {
      ...alertData,
      id: `ALERT-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setBroadcastAlerts(prev => [newAlert, ...prev]);
  };

  const addSitReport = (reportData: Omit<SitReport, 'id' | 'timestamp'>) => {
    const newReport: SitReport = {
      ...reportData,
      id: `SR-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setSitReports(prev => [newReport, ...prev]);
  };

  const updateEvacuationCount = (centerId: number, delta: number) => {
    setEvacuationCounts(prev =>
      prev.map(ec =>
        ec.centerId === centerId
          ? { ...ec, current: Math.max(0, Math.min(ec.capacity, ec.current + delta)) }
          : ec
      )
    );
  };

  return (
    <MockDataContext.Provider value={{
      incidents, addIncident, updateIncidentStatus, assignIncidentResponder,
      broadcastAlerts, addBroadcastAlert,
      sitReports, addSitReport,
      evacuationCounts, updateEvacuationCount,
    }}>
      {children}
    </MockDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (context === undefined) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
