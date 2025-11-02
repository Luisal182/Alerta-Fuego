import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Incident } from '../types';

export const useDashboardIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // inicial  Fetch of all the incidents
  const fetchIncidents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIncidents(data ?? []);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error fetching incidents';
      setError(message);
      console.error('Error fetching incidents:', message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();

    // Subscription in real time
    const subscription = supabase
      .channel('incidents-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'incidents',
        },
        (payload) => {
          console.log('Realtime event:', payload.eventType, payload);

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
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });


    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        throw error;
      }

      //Force actualitation inmediatly 
      setIncidents(current =>
        current.map(inc =>
          inc.id === id ? { ...inc, status: status as any, updated_at: new Date().toISOString() } : inc
        )
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating status';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateAssistanceType = async (id: string, assistanceType: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({ assistance_type: assistanceType, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Error updating assistance type:', error);
        throw error;
      }

      // Force updadete inmediatly
      setIncidents(current =>
        current.map(inc =>
          inc.id === id ? { ...inc, assistance_type: assistanceType as any, updated_at: new Date().toISOString() } : inc
        )
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error updating assistance type';
      setError(message);
      return { success: false, error: message };
    }
  };

  const dispatchResources = async (id: string, resources: string[]) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .update({
          dispatched_resources: resources,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Error dispatching resources:', error);
        throw error;
      }

      // Forzar actualización local inmediatamente
      setIncidents(current =>
        current.map(inc =>
          inc.id === id ? { ...inc, dispatched_resources: resources, updated_at: new Date().toISOString() } : inc
        )
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error dispatching resources';
      setError(message);
      return { success: false, error: message };
    }
  };

  // DELETE incident
  const deleteIncident = async (id: string) => {
    try {
      const { error } = await supabase
        .from('incidents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting incident:', error);
        throw error;
      }

      setIncidents(current =>
        current.filter(inc => inc.id !== id)
      );

      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error deleting incident';
      setError(message);
      return { success: false, error: message };
    }
  };

  return {
    incidents,
    loading,
    error,
    updateStatus,
    updateAssistanceType,
    dispatchResources,
    deleteIncident,
  };
};