import { useState, useEffect } from 'react'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import Layout from './components/Layout/Layout';
import Map from './components/Map/Map';
import ReportForm from './components/ReportForm/ReportForm';


function App() {

  const [selectedLat, setSelectedLat] = useState(-33.4489);
  const [selectedLng, setSelectedLng] = useState(-70.6693);
  const [isDarkMode, setIsDarkMode] = useState (false)

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
     leftPanel={<Map onLocationSelect={handleLocationSelect} />}
     rightPanel={<ReportForm initialLat={selectedLat} initialLng={selectedLng} />}
     />
      <Footer />
    </div>
  );
}

export default App;
