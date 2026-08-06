import { Routes, Route, Navigate } from 'react-router-dom';
import { MockDataProvider } from './data/MockDataContext';

// Public Pages
import LandingPage from './LandingPage';
import IncidentReportForm from './pages/publicPortal/IncidentReportForm';
import PublicPortal from './pages/publicPortal/PublicPortal';
import About from './pages/publicPortal/About';
import DonationsPage from './pages/publicPortal/DonationsPage';
import SurvivalGuide from './pages/publicPortal/SurvivalGuide';
 

// Auth Pages
import LoginPage from './auth/LoginPage';



// Barangay Section
import BarangayDashboard from './pages/barangays/BarangayDashboard'; 
import SitRepUploaderPage from './pages/barangays/SitrepUploaderPage';  
import SitrepLogsPage from './pages/barangays/SitrepLogsPage';
import BarangayReliefInventory from './pages/barangays/BarangayReliefInventory';
import BarangayReliefRequests from './pages/barangays/BarangayReliefRequests';
import BarangayReliefDistribution from './pages/barangays/BarangayReliefDistribution';

// Department Section
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

// Responder Section 
import ResponderDashboard from './pages/response_units/ResponderDashboard';
import ReliefDeliveryMissions from './pages/response_units/ReliefDeliveryMissions';

// Citizen Section
import CitizenAnnouncements from './pages/citizen/CitizenAnnouncements';
import CitizenClaimHistory from './pages/citizen/CitizenClaimHistory';
import CitizenAlerts from './pages/citizen/CitizenAlerts';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenReportLogs from './pages/citizen/CitizenReportLogs';

function App() {
  return (
    <MockDataProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        {/* Public Routes */}
        <Route path="/report_incident" element={<IncidentReportForm />} />
        <Route path="/public_portal" element={<PublicPortal />} />
        <Route path="/about" element={<About />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/survival_guides" element={<SurvivalGuide />} />
      
        <Route path="/responders" element={<ResponderDashboard />} />
        <Route path="/responders/deliveries" element={<ReliefDeliveryMissions />} />

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
        <Route path="/barangays/sitrep_upload" element={<SitRepUploaderPage />} />
        <Route path="/barangays/sitrep_logs" element={<SitrepLogsPage />} />


        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/announcements" element={<CitizenAnnouncements />} />
        <Route path="/citizen/claim_history" element={<CitizenClaimHistory />} />
        <Route path="/citizen/alerts" element={<CitizenAlerts />} />
        <Route path="/citizen/report_logs" element={<CitizenReportLogs />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </MockDataProvider>
  );
}

export default App;
