import { useState } from 'react';

export const useLocation = () => {
  const [selectedLat, setSelectedLat] = useState(-33.4489);
  const [selectedLng, setSelectedLng] = useState(-70.6693);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>(undefined);

  // handle location selection on the map
  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };  
  const handleUseMyLocation = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
    setMapCenter([lat, lng]);
  };

  return {
    selectedLat,
    selectedLng,
    mapCenter,
    handleLocationSelect,
    handleUseMyLocation,
  };
};