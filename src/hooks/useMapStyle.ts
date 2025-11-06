import { useState } from 'react';

type MapStyle = '2d' | 'satellite';

export const useMapStyle = () => {
  const [mapStyle, setMapStyle] = useState<MapStyle>('2d');

  const getTileLayer = () => {
    if (mapStyle === 'satellite') {
      // Satellite view (ESRI)
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    // Standard 2D OpenStreetMap
    return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  };

  const getAttribution = () => {
    if (mapStyle === 'satellite') {
      return '&copy; <a href="https://www.esri.com/">Esri</a>';
    }
    return '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
  };

  const toggleMapStyle = () => {
    setMapStyle(prev => prev === '2d' ? 'satellite' : '2d');
  };

  return {
    mapStyle,
    getTileLayer,
    getAttribution,
    toggleMapStyle,
  };
};