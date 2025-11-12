//   NOT USED YET.  
//   For future implementation realtime and Sound notification
import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { playAlertSound } from '../utils/alertSounds';

export const useRealtimeNotifications = () => {
  useEffect(() => {
    // Escuchar cambios en tabla incidents
    const channel = supabase
      .channel('incidents-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'incidents',
        },
        (payload: any) => {
          const newIncident = payload.new;
          
          console.log('✅ New incident:', newIncident);
          
          // Sonido
          playAlertSound(newIncident.risk_level);
          
          // Toast
          toast.success(`🚨 New ${newIncident.risk_level} incident!`, {
            duration: 4000,
            position: 'top-center',
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
};