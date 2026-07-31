import { Routes, Route, Navigate } from 'react-router-dom';
import { MockDataProvider } from './data/MockDataContext';

// Public Pages
import LandingPage from './LandingPage';
import PublicPortal from './pages/public/PublicPortal';
import IncidentReportForm from './pages/public/IncidentReportForm';

// Auth Pages
import LoginPage from './auth/LoginPage';

// Dashboards
import DepartmentAdminDashboard from './pages/department_head/DepartmentAdminDashboard';
import BarangayAdminDashboard from './pages/barangay_head/BarangayAdminDashboard';
import ResponseUnitDashboard from './pages/response-unit/ResponseUnitDashboard';
import QCitizenPortal from './pages/qcitizen/QCitizenPortal';

function App() {
  return (
    <MockDataProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* Public Routes */}
        <Route path="/public-portal" element={<PublicPortal />} />
        <Route path="/report-incident" element={<IncidentReportForm />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Private / Dashboard Routes */}
        <Route path="/department-admin" element={<DepartmentAdminDashboard />} />
        <Route path="/barangay-admin" element={<BarangayAdminDashboard />} />
        <Route path="/response-unit" element={<ResponseUnitDashboard />} />
        <Route path="/qcitizen" element={<QCitizenPortal />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </MockDataProvider>
  );
}

export default App;
