import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import Layout from './components/Layout/Layout';
import Map from './components/Map/Map';
import ReportForm from './components/ReportForm/ReportForm';
import LoginPage from './pages/LoginPage/LoginPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { useIncidents } from './hooks/useIncidents';
import { useDarkMode } from './hooks/useDarkMode';
import { useLocation } from './hooks/useLocation';
import { useTimeFilter } from './hooks/useTimeFilter';
import { useRiskLevel } from './hooks/useRiskLevel';

function MapPageContent() {
  // Personalise Hooks 
  const { selectedLat, selectedLng, mapCenter, handleLocationSelect, handleUseMyLocation } = useLocation();
  const { timeFilter, setTimeFilter, getFilteredIncidents } = useTimeFilter();
  const { selectedRisk, handleRiskLevelChange } = useRiskLevel();
  const { incidents, addIncident } = useIncidents();

  // derivate Props 
  const filteredIncidents = getFilteredIncidents(incidents);


  return (
    <Layout
      leftPanel={
        <Map
          onLocationSelect={handleLocationSelect}
          selectedRisk={selectedRisk}
          incidents={filteredIncidents}
          mapCenter={mapCenter}
          timeFilter={timeFilter}
          onTimeFilterChange={setTimeFilter}
        />
      }
      rightPanel={
        <ReportForm
          initialLat={selectedLat}
          initialLng={selectedLng}
          onRiskLevelChange={handleRiskLevelChange}
          onSubmitIncident={addIncident}
          onLocationUpdate={handleUseMyLocation}
        />
      }
    />
  );
}

function App() {
  const { isDarkMode, handleThemeToggle } = useDarkMode();

  return (
    <BrowserRouter>
      <div className="App">
        <Header
          onReportClick={() => console.log('Report button clicked')}
          onThemeToggle={handleThemeToggle}
          isDarkMode={isDarkMode}
        />

        <Routes>
          {/* Public page - Mapa */}
          <Route path="/" element={<MapPageContent />} />

          {/* Public page - Login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected page - Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;