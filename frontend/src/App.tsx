import { Routes, Route, Navigate } from 'react-router-dom'
import UserLayout from './components/UserLayout'
import StaffLayout from './components/StaffLayout'
import AdminLayout from './components/AdminLayout'
import HazardMapPage from './pages/resident/HazardMapPage'
import ReliefGoodsTrackerPage from './pages/resident/ReliefGoodsTrackerPage'
import IncidentReportPage from './pages/resident/IncidentReportPage'
import DisasterEarlyWarningPage from './pages/resident/DisasterEarlyWarningPage'
import DrrmCoordinationPage from './pages/resident/DrrmCoordinationPage'
import LoginPage from './auth/LoginPage'
import SignupPage from './auth/SignupPage'

// Staff Pages
import DashboardPage from './pages/staff/DashboardPage'
import IncidentManagementPage from './pages/staff/IncidentManagementPage'
import ReliefInventoryPage from './pages/staff/ReliefInventoryPage'
import MapControlPage from './pages/staff/EvacuationControlPage'
import AlertsContentPage from './pages/staff/AlertsContentPage'
import DrrmManagementPage from './pages/staff/DrrmManagementPage'

// Admin Page
import AccountManagementPage from './pages/admin/AccountManagementPage'

// Responder Pages
import ResponderLayout from './components/ResponderLayout'
import ResponderDashboardPage from './pages/responder/ResponderDashboardPage'

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Navigate to="/hazard-evac" replace />} />
        <Route path="/hazard-evac" element={<HazardMapPage />} />
        <Route path="/relief-goods" element={<ReliefGoodsTrackerPage />} />
        <Route path="/incident-report" element={<IncidentReportPage />} />
        <Route path="/early-warning" element={<DisasterEarlyWarningPage />} />
        <Route path="/coordination" element={<DrrmCoordinationPage />} />
      </Route>

      <Route element={<StaffLayout />}>
        <Route path="/staff" element={<DashboardPage />} />
        <Route path="/staff/incidents" element={<IncidentManagementPage />} />
        <Route path="/staff/relief" element={<ReliefInventoryPage />} />
        <Route path="/staff/evac-center" element={<MapControlPage />} />
        <Route path="/staff/drrm" element={<DrrmManagementPage />} />
        <Route path="/staff/alerts" element={<AlertsContentPage />} />
      </Route>

      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/accounts" element={<AccountManagementPage />} />
      </Route>

      <Route element={<ResponderLayout />}>
        <Route path="/responder" element={<ResponderDashboardPage />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App
