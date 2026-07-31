import { Routes, Route, Navigate } from 'react-router-dom';
import { MockDataProvider } from './data/MockDataContext';

// Public Pages
import LandingPage from './LandingPage';
import IncidentReportForm from './pages/public/IncidentReportForm';
import PublicPortal from './pages/public/PublicPortal'

// Auth Pages
import LoginPage from './auth/LoginPage';

// Dashboards
import DepartmentDashboard from './pages/departments/DepartmentDashboard';
import BrgyAdminDashboard from './pages/barangays/BarangayDashboard';
import ResponderDashboard from './pages/response_units/ResponderDashboard';
import ResidentPortal from './pages/residents/ResidentPortal';
import ResidentQRPage from './pages/residents/ResidentQRPage';
import ResidentClaimHistory from './pages/residents/ResidentClaimHistory';

function App() {
  return (
    <MockDataProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Routes */}
        <Route path="/report_incident" element={<IncidentReportForm />} />
        <Route path="/public_portal" element={<PublicPortal />} />
        <Route path="/login" element={<LoginPage />} />

      
        <Route path="/departments" element={<DepartmentDashboard />} />
        <Route path="/barangays" element={<BrgyAdminDashboard />} />

        <Route path="/responders" element={<ResponderDashboard />} />

        <Route path="/residents" element={<ResidentPortal />} />
        <Route path="/residents/qr_id" element={<ResidentQRPage />} />
        <Route path="/residents/claim-history" element={<ResidentClaimHistory />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </MockDataProvider>
  );
}

export default App;
