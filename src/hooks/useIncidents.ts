import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Incident } from '../types';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  
  // Guardamos el momento en que inicia la sesión de la app
  const sessionStartTime = new Date().toISOString();

  useEffect(() => {
    // Fetch inicial de incidentes
    const fetchIncidents = async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching incidents:', error);
      } else {
        setIncidents(data ?? []);
      }
    };

    fetchIncidents();

    // Suscripción en tiempo real
    const subscription = supabase
      .channel('public:incidents')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newIncident = payload.new as Incident;
            setIncidents(current => [newIncident, ...current]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedIncident = payload.new as Incident;
            setIncidents(current =>
              current.map(inc =>
                inc.id === updatedIncident.id ? updatedIncident : inc
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedIncident = payload.old as Incident;
            setIncidents(current =>
              current.filter(inc => inc.id !== deletedIncident.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup al desmontar
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addIncident = async (incident: {
    latitude: number;
    longitude: number;
    description: string;
    risk_level: string;
  }) => {
    const { data, error } = await supabase
      .from('incidents')
      .insert([incident])
      .select();

    if (error) {
      console.error('Error inserting incident:', error);
      throw error;
    }

    return data?.[0] || null;
    // No actualizamos el estado aquí porque la suscripción lo hará
  };

  // Filtro: incidentes desde que se abrió la app
  const recentIncidents = incidents.filter((incident) => {
    return new Date(incident.created_at) > new Date(sessionStartTime);
  });

  return {
    incidents,
    recentIncidents,
    setIncidents,
    addIncident,
  };
}