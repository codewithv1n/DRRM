import { useState, useEffect } from 'react';
import type { AuditLog, ReliefDispatch, Resource } from '../data/types';

const API_URL = import.meta.env.VITE_API_URL;

export function useAuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const addAuditLog = (action: string, userRole: string, details: string) => {
    console.log(`[AuditLog - Mocked] ${userRole} performed ${action}: ${details}`);
    const newLog: AuditLog = {
      id: `AUD-${Date.now()}`,
      action,
      userRole,
      details,
      timestamp: new Date().toISOString()
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  return { auditLogs, addAuditLog };
}

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  return { resources, setResources };
}

export function useReliefDispatches() {
  const [reliefDispatches, setReliefDispatches] = useState<ReliefDispatch[]>([]);
  const [deliveredLogs, setDeliveredLogs] = useState<any[]>([]);

  const fetchReliefRequests = () => {
    fetch(`${API_URL}/api/relief-requests`)
      .then(res => res.json())
      .then(data => {
         // Map DB rows to ReliefDispatch format if needed
         const mapped = data.map((d: any) => ({
            id: d.mission_id,
            barangay: d.barangay,
            type: d.type,
            quantity: d.quantity,
            vehicle: d.taskforce_assigned === 'Unassigned' ? 'Pending Allocation' : d.taskforce_assigned,
            status: d.status,
            timestamp: d.timestamp
         }));
         setReliefDispatches(mapped);
      })
      .catch(err => console.error("Error fetching relief requests", err));
  };

  const fetchDeliveredLogs = () => {
    fetch(`${API_URL}/api/relief-requests/delivered`)
      .then(res => res.json())
      .then(data => setDeliveredLogs(data))
      .catch(err => console.error("Error fetching delivered logs", err));
  };

  useEffect(() => {
    fetchReliefRequests();
    fetchDeliveredLogs();
  }, []);

  const updateReliefDispatchStatus = async (id: string, status: ReliefDispatch['status']) => {
    try {
      const response = await fetch(`${API_URL}/api/relief-requests/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (response.ok) {
        fetchReliefRequests();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const requestRelief = async (request: { barangay: string; type: string; quantity: number }) => {
    try {
      const response = await fetch(`${API_URL}/api/relief-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (response.ok) {
        fetchReliefRequests();
      }
    } catch (err) {
      console.error("Failed to request relief", err);
    }
  };

  const markReliefDelivered = async (id: string, signatoryName: string, photo?: File) => {
    try {
      const formData = new FormData();
      formData.append('signatoryName', signatoryName);
      if (photo) {
        formData.append('photo', photo);
      }

      const response = await fetch(`${API_URL}/api/relief-requests/${id}/deliver`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        fetchReliefRequests();
        fetchDeliveredLogs();
      }
    } catch (err) {
      console.error("Failed to mark relief delivered", err);
    }
  };

  return { reliefDispatches, deliveredLogs, updateReliefDispatchStatus, requestRelief, markReliefDelivered, refresh: () => { fetchReliefRequests(); fetchDeliveredLogs(); } };
}

export function useIncidentsCount() {
  const [incidents, setIncidents] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${API_URL}/api/incidents`)
      .then(res => res.json())
      .then(data => setIncidents(data))
      .catch(err => console.error(err));
  }, []);
  const pendingCount = incidents.filter(i => i.status === 'Pending').length;
  return { incidents, pendingCount };
}

export function useAlerts() {
  const [alerts] = useState<any[]>([]);
  const broadcastAlert = (level: string, message: string, useBackup?: boolean) => {
    console.log(`[Alert - Mocked] ${level}: ${message} (Backup: ${useBackup})`);
  };
  return { alerts, broadcastAlert };
}
