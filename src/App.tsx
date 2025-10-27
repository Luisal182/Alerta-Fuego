import { useState, useEffect } from 'react'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import Layout from './components/Layout/Layout';
import Map from './components/Map/Map';
import ReportForm from './components/ReportForm/ReportForm';
import type { RiskLevel } from './types';
import { useIncidents } from './hooks/useIncidents';


function App() {

  const [selectedLat, setSelectedLat] = useState(-33.4489);
  const [selectedLng, setSelectedLng] = useState(-70.6693);
  const [isDarkMode, setIsDarkMode] = useState (false)
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('medium');
  const { incidents, addIncident, recentIncidents } = useIncidents();
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);
  const [timeFilter, setTimeFilter] = useState<'all' | '30min' | '1h' | 'today'>('all');


 
  // New to handle "Use My Location"
const handleUseMyLocation = (lat: number, lng: number) => {
  setSelectedLat(lat);
  setSelectedLng(lng);
  setMapCenter([lat, lng]);
};


  const handleRiskLevelChange = (risk: RiskLevel) => {
    setSelectedRisk(risk);
  };

  // Función para filtrar incidentes por tiempo
const getFilteredIncidents = () => {
  const now = new Date();
  
  switch(timeFilter) {
    case '30min':
      return incidents.filter(inc => 
        new Date(inc.created_at) > new Date(now.getTime() - 30 * 60 * 1000)
      );
    case '1h':
      return incidents.filter(inc => 
        new Date(inc.created_at) > new Date(now.getTime() - 60 * 60 * 1000)
      );
    case 'today':
      const startOfDay = new Date(now.setHours(0,0,0,0));
      return incidents.filter(inc => 
        new Date(inc.created_at) > startOfDay
      );
    default:
      return incidents;
  }
};

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const handleReportClick = () => {
    console.log('Report button clicked');
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log('Location selected:', lat, lng);
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

   const handleThemeToggle = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="App">
      <Header
       onReportClick={handleReportClick} 
       onThemeToggle={handleThemeToggle}
        isDarkMode={isDarkMode}
       />
      
     <Layout
     leftPanel={<Map onLocationSelect={handleLocationSelect}
     selectedRisk={selectedRisk}  
     //incidents={incidents}
     incidents={getFilteredIncidents()} 
     mapCenter={mapCenter}
     timeFilter={timeFilter}
  onTimeFilterChange={setTimeFilter}
     />
    }
     rightPanel={<ReportForm initialLat={selectedLat} initialLng={selectedLng}
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
