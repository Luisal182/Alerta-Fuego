import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Incident } from '../types';

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

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

    // Subsc in real time
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

    // Cleanup on unmount
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
  };

  // Filter incidents created after session start time
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