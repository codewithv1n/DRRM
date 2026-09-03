import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { LanguageProvider } from './data/LanguageContext';

function DarkModeManager() {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/login') {
      document.documentElement.classList.remove('dark');
    } else {
      if (localStorage.getItem('theme') === 'dark') {
        document.documentElement.classList.add('dark');
      }
    }
  }, [location.pathname]);

  return null;
}

import LandingPage from './LandingPage';
import IncidentReportForm from './pages/publicPortal/IncidentReportForm';
import PublicPortal from './pages/publicPortal/PublicPortal';
import About from './pages/publicPortal/About';
import DonationsPage from './pages/publicPortal/DonationsPage';
import SurvivalGuide from './pages/publicPortal/SurvivalGuide';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';
import BarangayDashboard from './pages/barangays/BarangayDashboard'; 
import SitRepUploaderPage from './pages/barangays/SitrepUploaderPage';  
import SitrepLogsPage from './pages/barangays/SitrepLogsPage';
import BarangayReliefInventory from './pages/barangays/BarangayReliefInventory';
import BarangayReliefRequests from './pages/barangays/BarangayReliefRequests';
import BarangayReliefDistribution from './pages/barangays/BarangayReliefDistribution';
import BarangayEvacuationMonitoringPage from './pages/barangays/BarangayEvacuationMonitoringPage';
import DepartmentDashboard from './pages/admin/AdminDashboard';
import IncidentDispatcherPanel from './pages/admin/IncidentDispatcherPage';
import EarlyWarningPanel from './pages/admin/CityWideAnnouncementPage';
import HazardMapPanel from './pages/admin/HazardMonitoringPage';
import UserManagement from './pages/admin/UserManagementPage';
import AuditLogsPage from './pages/admin/AuditLogsPage';
import ReliefDispatchPanel from './pages/admin/ReliefDispatchPage';
import ReliefInventoryPanel from './pages/admin/ReliefInventoryPage';
import ValidateDonationsPanel from './pages/admin/ValidateDonationsPanel';
import BarangaySitrepCoordinationPage from './pages/admin/BarangaySitrepCoordinationPage';
import EvacuationCenterMonitoringPage from './pages/admin/EvacuationCenterMonitoringPage';
import ResponderDashboard from './pages/response_units/ResponderDashboard';
import ReliefDeliveryMissions from './pages/response_units/ReliefDeliveryMissions';
import IncidentResponsePage from './pages/response_units/IncidentResponsePage';
import ResponderHazardMapPage from './pages/response_units/ResponderHazardMapPage';
import CitizenAnnouncements from './pages/citizen/CitizenReliefAnnouncements';
import CitizenClaimHistory from './pages/citizen/CitizenClaimHistory';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenReportLogs from './pages/citizen/CitizenReportLogs';
import CitizenDonationLogs from './pages/citizen/CitizenDonationLogs';

function App() {
  return (
    <LanguageProvider>
      <DarkModeManager />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/report_incident" element={<IncidentReportForm />} />
        <Route path="/public_portal" element={<PublicPortal />} />
        <Route path="/about" element={<About />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/survival_guides" element={<SurvivalGuide />} />
        <Route path="/responders" element={<ResponderDashboard />} />
        <Route path="/responders/incidents" element={<IncidentResponsePage />} />
        <Route path="/responders/deliveries" element={<ReliefDeliveryMissions />} />
        <Route path="/responders/hazards" element={<ResponderHazardMapPage />} />
        <Route path="/admin" element={<DepartmentDashboard />} />
        <Route path="/admin/incidents" element={<IncidentDispatcherPanel />} />
        <Route path="/admin/early_warning" element={<EarlyWarningPanel />} />
        <Route path="/admin/hazard_map" element={<HazardMapPanel />} />
        <Route path="/admin/user_management" element={<UserManagement />} />
        <Route path="/admin/audit_logs" element={<AuditLogsPage />} />
        <Route path="/admin/relief_dispatch" element={<ReliefDispatchPanel />} />
        <Route path="/admin/relief_inventory" element={<ReliefInventoryPanel />} />
        <Route path="/admin/validate_donations" element={<ValidateDonationsPanel />} />
        <Route path="/admin/sitrep_coordination" element={<BarangaySitrepCoordinationPage />} />
        <Route path="/admin/evacuation_centers" element={<EvacuationCenterMonitoringPage />} />
        <Route path="/barangays" element={<BarangayDashboard />} />
        <Route path="/barangays/relief_inventory" element={<BarangayReliefInventory />} />
        <Route path="/barangays/relief_requests" element={<BarangayReliefRequests />} />
        <Route path="/barangays/relief_distribution" element={<BarangayReliefDistribution />} />
        <Route path="/barangays/evacuation_centers" element={<BarangayEvacuationMonitoringPage />} />
        <Route path="/barangays/sitrep_upload" element={<SitRepUploaderPage />} />
        <Route path="/barangays/sitrep_logs" element={<SitrepLogsPage />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/announcements" element={<CitizenAnnouncements />} />
        <Route path="/citizen/claim_history" element={<CitizenClaimHistory />} />
        <Route path="/citizen/report_logs" element={<CitizenReportLogs />} />
        <Route path="/citizen/donation_logs" element={<CitizenDonationLogs />} />
        
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </LanguageProvider>
  );
}

export default App;


