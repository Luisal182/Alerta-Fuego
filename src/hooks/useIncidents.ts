import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // ajusta la ruta si es necesario
import type { Incident } from '../types';   // asegúrate que este tipo existe y es correcto

export function useIncidents() {
    const [incidents, setIncidents] = useState<Incident[]>([]);
  
    useEffect(() => {
      // Carga inicial y suscripción igual que antes
    }, []);
  
    // Función para agregar incidente a la base y actualizar estado
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
  
    return { incidents, setIncidents, addIncident };
  }
  