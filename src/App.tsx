import { Routes, Route, Navigate } from 'react-router-dom';
import { MockDataProvider } from './data/MockDataContext';

// Public Pages
import LandingPage from './LandingPage';
import IncidentReportForm from './pages/public/IncidentReportForm';
import PublicPortal from './pages/public/PublicPortal';
import EmergencyHotlines from './pages/public/EmergencyHotlines';
import AboutQC from './pages/public/AboutQC';
import SurvivalGuide from './pages/public/SurvivalGuide';
 

// Auth Pages
import LoginPage from './auth/LoginPage';

// Dashboards


// Barangay Section
import BarangayDashboard from './pages/barangays/BarangayDashboard'; 
import BarangayCitizenRegistry from './pages/barangays/CitizenRegistrationPage'; 
import BarangayEvacuationUpdater from './pages/barangays/EvacuationUpdatePage'; 
import BarangayReliefGoodsClaim from './pages/barangays/ReliefClaimScannerPage';
import SitRepUploaderPage from './pages/barangays/SitrepUploaderPage';  

// Department Section
import DepartmentDashboard from './pages/departments/DepartmentDashboard';
import IncidentDispatcherPanel from './pages/departments/IncidentDispatcherPanel';
import EarlyWarningPanel from './pages/departments/CityWideAnnouncementPage';
import HazardMapPanel from './pages/departments/HazardMapPanel';
import BarangayCoordinationPanel from './pages/departments/BarangayCoordinationPanel';
import ResourceManagementPanel from './pages/departments/ResourceManagementPanel';
import AuditLogPanel from './pages/departments/AuditLogPanel';

import ResponderDashboard from './pages/response_units/ResponderDashboard';

// Citizen Section
import CitizenIDPage from './pages/citizen/CitizenIDPage';
import CitizenClaimHistory from './pages/citizen/CitizenClaimHistory';
import CitizenAlerts from './pages/citizen/CitizenAlerts';
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import CitizenAbout from './pages/citizen/CitizenAbout';
import CitizenResources from './pages/citizen/CitizenResources';

function App() {
  return (
    <MockDataProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        {/* Public Routes */}
        <Route path="/report_incident" element={<IncidentReportForm />} />
        <Route path="/public_portal" element={<PublicPortal />} />
        <Route path="/emergency_hotlines" element={<EmergencyHotlines />} />
        <Route path="/about_qc" element={<AboutQC />} />
        <Route path="/survival_guides" element={<SurvivalGuide />} />
      
        <Route path="/responders" element={<ResponderDashboard />} />
        <Route path="/departments" element={<DepartmentDashboard />} />
        <Route path="/departments/incidents" element={<IncidentDispatcherPanel />} />
        <Route path="/departments/early_warning" element={<EarlyWarningPanel />} />
        <Route path="/departments/hazard_map" element={<HazardMapPanel />} />
        <Route path="/departments/barangay_coordination" element={<BarangayCoordinationPanel />} />
        <Route path="/departments/resource_management" element={<ResourceManagementPanel />} />
        <Route path="/departments/audit_logs" element={<AuditLogPanel />} />
        
        <Route path="/barangays" element={<BarangayDashboard />} />
        <Route path="/barangays/relief_claim" element={<BarangayReliefGoodsClaim />} />
        <Route path="/barangays/evac_updater" element={<BarangayEvacuationUpdater />} />
        <Route path="/barangays/citizen_registry" element={<BarangayCitizenRegistry />} />
        <Route path="/barangays/sitrep_upload" element={<SitRepUploaderPage />} />


        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/citizen/id" element={<CitizenIDPage />} />
        <Route path="/citizen/claim_history" element={<CitizenClaimHistory />} />
        <Route path="/citizen/alerts" element={<CitizenAlerts />} />
        <Route path="/citizen/about" element={<CitizenAbout />} />
        <Route path="/citizen/resources" element={<CitizenResources />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </MockDataProvider>
  );
}

export default App;
