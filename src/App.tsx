import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useStore } from './store/useStore'
import Landing from './pages/Landing'
import Onboarding from './pages/Onboarding'
import Simulation from './pages/Simulation'
import Dashboard from './pages/Dashboard'
import './App.css'

function App() {
  const location = useLocation()

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/simulation/:scenarioId" element={<Simulation />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
