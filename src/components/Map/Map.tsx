import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import styles from './Map.module.css';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
}

// Sample incidents data (will come from Supabase later)
const sampleIncidents = [
  { id: 1, lat: -33.45, lng: -70.65, risk: 'high', description: 'Large fire near forest' },
  { id: 2, lat: -33.48, lng: -70.70, risk: 'medium', description: 'Smoke detected' },
  { id: 3, lat: -33.43, lng: -70.68, risk: 'medium', description: 'Small fire controlled' },
  { id: 4, lat: -33.46, lng: -70.66, risk: 'low', description: 'Minor incident' },
  { id: 5, lat: -33.47, lng: -70.64, risk: 'high', description: 'Active wildfire' },
];

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      console.log('Map clicked:', lat, lng);
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    },
  });
  return null;
}

export default function Map({ onLocationSelect }: MapProps) {
  const center: LatLngExpression = [-33.4489, -70.6693]; // Santiago, Chile
  const zoom = 12;

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
      {/* Map Header */}
      <div className={styles.mapHeader}>
        <span className={styles.mapHeaderIcon}>🗺️</span>
        <h2 className={styles.mapHeaderTitle}>Incident Map</h2>
      </div>

      {/* Map */}
      <div className={styles.mapWrapper}>
        <MapContainer
          center={center}
          zoom={zoom}
          className={styles.leafletMap}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Map click handler */}
          <MapClickHandler onLocationSelect={onLocationSelect} />

          {/* Render incident markers */}
          {sampleIncidents.map((incident) => (
            <CircleMarker
              key={incident.id}
              center={[incident.lat, incident.lng]}
              radius={getRiskRadius(incident.risk)}
              pathOptions={{
                fillColor: getRiskColor(incident.risk),
                fillOpacity: 0.9,
                color: 'white',
                weight: 3,
              }}
            >
              <Popup>
                <div className={styles.popup}>
                  <p className={styles.popupCoords}>
                    <strong>Coordinates:</strong><br />
                    {incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}
                  </p>
                  <p className={styles.popupRisk}>
                    <strong>Risk Level:</strong> <span style={{ color: getRiskColor(incident.risk) }}>
                      {incident.risk.toUpperCase()}
                    </span>
                  </p>
                  <p className={styles.popupDesc}>
                    <strong>Description:</strong><br />
                    {incident.description}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Legend */}
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