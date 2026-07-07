import { Routes, Route, Navigate } from 'react-router-dom'
import UserLayout from './components/UserLayout'
import HazardMapPage from './pages/users/HazardMapPage'
import ReliefGoodsTrackerPage from './pages/users/ReliefGoodsTrackerPage'
import IncidentReportPage from './pages/users/IncidentReportPage'
import DisasterEarlyWarningPage from './pages/users/DisasterEarlyWarningPage'
import DrrmCoordinationPage from './pages/users/DrrmCoordinationPage'

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
    </Routes>
  )
}

export default App
