import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { supabase } from '../../lib/supabase';
import type { Incident } from '../../types';
import styles from './Map.module.css';
import 'leaflet/dist/leaflet.css';
import type { RiskLevel } from '../../types';

interface MapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedRisk?: RiskLevel;
  incidents: Incident[];
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

export default function Map({ onLocationSelect,selectedRisk }: MapProps) {
  const center: LatLngExpression = [-33.4489, -70.6693]; // Santiago, Chile
  const zoom = 12;

  const [incidents, setIncidents] = useState<Incident[]>([]);

  // Convierte el riesgo a color para marcador
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

  // Convierte el riesgo a tamaño para marcador
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

  // Carga inicial de incidentes
  useEffect(() => {
        // Carga inicial
        const fetchIncidents = async () => {
          const { data, error } = await supabase.from('incidents').select('*');
          if (error) {
            console.error('Error loading incidents:', error);
            return;
          }
          setIncidents(data || []);
        };
    
        fetchIncidents();
        
    const subscription = supabase
      .channel('public:incidents')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        (payload) => {
          setIncidents((current) => {
            const newIncident = payload.new as Incident;
            const oldIncident = payload.old as Incident;
            switch (payload.eventType) {
              case 'INSERT':
                return [newIncident, ...current];
              case 'UPDATE':
                return current.map((inc) =>
                  inc.id === newIncident.id ? newIncident : inc
                );
              case 'DELETE':
                return current.filter((inc) => inc.id !== oldIncident.id);
              default:
                return current;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.mapHeader}>
        <span className={styles.mapHeaderIcon}>🗺️</span>
        <h2 className={styles.mapHeaderTitle}>Incident Map</h2>
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer center={center} zoom={zoom} className={styles.leafletMap} zoomControl={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <MapClickHandler onLocationSelect={onLocationSelect} />

          {incidents.map((incident) => {
            // Ajustamos nombres porque en la DB está snake_case
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
