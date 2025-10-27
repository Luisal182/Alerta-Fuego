import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import Layout from './components/Layout/Layout';
import Map from './components/Map/Map';
import ReportForm from './components/ReportForm/ReportForm';
import { useIncidents } from './hooks/useIncidents';
import { useLocation } from './hooks/useLocation';
import { useDarkMode } from './hooks/useDarkMode';
import { useTimeFilter } from './hooks/useTimeFilter';
import { useRiskLevel } from './hooks/useRiskLevel';

function App() {
  // Hooks personalizados
  const { isDarkMode, handleThemeToggle } = useDarkMode();
  const { selectedLat, selectedLng, mapCenter, handleLocationSelect, handleUseMyLocation } = useLocation();
  const { timeFilter, setTimeFilter, getFilteredIncidents } = useTimeFilter();
  const { selectedRisk, handleRiskLevelChange } = useRiskLevel();
  const { incidents, addIncident } = useIncidents();

  // Props derivados
  const filteredIncidents = getFilteredIncidents(incidents);

  // Manejadores
  const handleReportClick = () => {
    console.log('Report button clicked');
  };

  return (
    <div className="App">
      <Header
        onReportClick={handleReportClick}
        onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
      />

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

      <Footer />
    </div>
  );
}

export default App;