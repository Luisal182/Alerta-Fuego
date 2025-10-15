import { useState } from 'react'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import Layout from './components/Layout/Layout';
import ReportForm from './components/ReportForm/ReportForm';

function App() {
  const handleReportClick = () => {
    console.log('Report button clicked');
  };

  return (
    <div className="App">
      <Header onReportClick={handleReportClick} />
      
     <Layout
    leftPanel={
      <div style={{ padding: '40px' }}>
        <h2>🗺️ Incident Map</h2>
        <p>El mapa con Leaflet irá aquí</p>
      </div>
    }
    rightPanel={<ReportForm />}  />
      <Footer />
    </div>
  );
}

export default App;
