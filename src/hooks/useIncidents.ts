import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Incident } from '../types';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  // Guardamos el momento en que inicia la sesión de la app
  const sessionStartTime = new Date().toISOString();

  useEffect(() => {
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
      return null;
    }

    if (data) {
      setIncidents((prev) => [data[0], ...prev]);
      return data[0];
    }
  };

  // 🔥 Filtro: incidentes desde que se abrió la app
  const recentIncidents = incidents.filter((incident) => {
    return new Date(incident.created_at) > new Date(sessionStartTime);
  });

  return {
    incidents,
    recentIncidents, // <-- ¡este lo usaremos en tu componente de Map!
    setIncidents,
    addIncident,
  };
}
