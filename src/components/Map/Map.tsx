import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents, useMap } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import type { Incident } from '../../types';
import styles from './Map.module.css';
import 'leaflet/dist/leaflet.css';
import type { RiskLevel } from '../../types';


interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedRisk?: RiskLevel;
  incidents: Incident[];
  mapCenter?: [number, number];  
}

//To change the map center, After "use location"
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.flyTo(center, map.getZoom(), {
    duration: 1.5 
  });
  return null;
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    },
  });
  return null;
}

export default function Map({ onLocationSelect, selectedRisk, incidents, mapCenter }: MapProps) {
  const center: LatLngExpression = [-33.4489, -70.6693]; // Santiago, Chile
  const zoom = 12;

  // Change risk in to a color for the marker
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return '#FF4444';
      case 'medium':
        return '#FF8C00';
      case 'low':
        return '#4ADE80';
      default:
        return '#FF8C00';
    }
  };

  // conversion the risk in to a size for the circle/marker
  const getRiskRadius = (risk: string) => {
    switch (risk) {
      case 'high':
        return 20;
      case 'medium':
        return 17;
      case 'low':
        return 15;
      default:
        return 17;
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <span className={styles.mapHeaderIcon}>🗺️</span>
        <h2 className={styles.mapHeaderTitle}>Incident Map</h2>
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer center={center} zoom={zoom} className={styles.leafletMap} zoomControl={false}>
          {/* Si hay nuevo centro, mover el mapa */}
          {mapCenter && <ChangeMapView center={mapCenter} />}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <MapClickHandler onLocationSelect={onLocationSelect} />

          {incidents.map((incident) => {
            const lat = Number(incident.latitude);
            const lng = Number(incident.longitude);
            const risk = (incident.risk_level || 'medium').toLowerCase();

            return (
              <CircleMarker
                key={incident.id}
                center={[lat, lng]}
                radius={getRiskRadius(risk)}
                pathOptions={{
                  fillColor: getRiskColor(risk),
                  fillOpacity: 0.9,
                  color: 'white',
                  weight: 3,
                }}
              >
                <Popup>
                  <div className={styles.popup}>
                    <p className={styles.popupCoords}>
                      <strong>Coordinates:</strong><br />
                      {lat.toFixed(4)}, {lng.toFixed(4)}
                    </p>
                    <p className={styles.popupRisk}>
                      <strong>Risk Level:</strong>{' '}
                      <span style={{ color: getRiskColor(risk) }}>
                        {risk.toUpperCase()}
                      </span>
                    </p>
                    <p className={styles.popupDesc}>
                      <strong>Description:</strong><br />
                      {incident.description}
                    </p>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>

        <div className={styles.legend}>
          <h3 className={styles.legendTitle}>Risk Level</h3>
          <div className={styles.legendItem}>
            <div className={styles.legendCircle} style={{ background: '#FF4444' }}></div>
            <span>High</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendCircle} style={{ background: '#FF8C00' }}></div>
            <span>Medium</span>
          </div>
          <div className={styles.legendItem}>
            <div className={styles.legendCircle} style={{ background: '#4ADE80' }}></div>
            <span>Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}