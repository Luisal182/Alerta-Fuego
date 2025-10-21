import { useState, useEffect } from 'react'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import Layout from './components/Layout/Layout';
import Map from './components/Map/Map';
import ReportForm from './components/ReportForm/ReportForm';
import type { RiskLevel } from './types';
import { useIncidents } from './hooks/useIncidents'; // ajusta ruta si hace falta


function App() {

  const [selectedLat, setSelectedLat] = useState(-33.4489);
  const [selectedLng, setSelectedLng] = useState(-70.6693);
  const [isDarkMode, setIsDarkMode] = useState (false)

  const [selectedRisk, setSelectedRisk] = useState<RiskLevel>('medium');

  const { incidents, addIncident } = useIncidents();


  // Función para actualizar el riesgo seleccionado
  const handleRiskLevelChange = (risk: RiskLevel) => {
    setSelectedRisk(risk);
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
     incidents={incidents}/>}
     rightPanel={<ReportForm initialLat={selectedLat} initialLng={selectedLng}
     onRiskLevelChange={handleRiskLevelChange} 
     onSubmitIncident={addIncident} />}
     />
      <Footer />
    </div>
  );
}

export default App;
