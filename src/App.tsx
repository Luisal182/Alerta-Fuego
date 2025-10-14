import { useState } from 'react'
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  const handleReportClick = () => {
    console.log('Report button clicked');
  };

  return (
    <div className="App">
      <Header onReportClick={handleReportClick} />
      
      <div className="main-content-temp">
        <h2>Main Content Area</h2>
        <p>El Header y Footer está funcionando. Aquí irá el mapa y el formulario.</p>
      </div>
      <Footer />
    </div>
  );
}

export default App;
