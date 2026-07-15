import { Routes, Route, Navigate } from 'react-router-dom'
import UserLayout from './components/UserLayout'
import AdminLayout from './components/AdminLayout'
import HazardMapPage from './pages/users/HazardMapPage'
import ReliefGoodsTrackerPage from './pages/users/ReliefGoodsTrackerPage'
import IncidentReportPage from './pages/users/IncidentReportPage'
import DisasterEarlyWarningPage from './pages/users/DisasterEarlyWarningPage'
import DrrmCoordinationPage from './pages/users/DrrmCoordinationPage'
import LoginPage from './auth/users/LoginPage'
import SignupPage from './auth/users/SignupPage'
import AdminLoginPage from './auth/admin/adminLoginPage'
import AdminSignupPage from './auth/admin/adminSignupPage'

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

      <Route element={<AdminLayout />}>
        <Route path='/' element={<Navigate to="/admin" replace />} />
          


      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage/>} />

      <Route path="/adminLogin" element={<AdminLoginPage />}/>
       <Route path="/adminSignup" element={<AdminSignupPage />}/>
    </Routes>
  )
}

export default App
