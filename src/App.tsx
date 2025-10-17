import { useState } from 'react'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';
import Layout from './components/Layout/Layout';
import Map from './components/Map/Map';
import ReportForm from './components/ReportForm/ReportForm';


function App() {

  const [selectedLat, setSelectedLat] = useState(-33.4489);
  const [selectedLng, setSelectedLng] = useState(-70.6693);

  const handleReportClick = () => {
    console.log('Report button clicked');
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    console.log('Location selected:', lat, lng);
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  return (
    <div className="App">
      <Header onReportClick={handleReportClick} />
      
     <Layout
     leftPanel={<Map onLocationSelect={handleLocationSelect} />}
     rightPanel={<ReportForm initialLat={selectedLat} initialLng={selectedLng} />}
     />
      <Footer />
    </div>
  );
}

export default App;
