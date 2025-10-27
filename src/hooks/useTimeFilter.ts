import { useState } from 'react';
import type { Incident } from '../types';

export const useTimeFilter = () => {
  const [timeFilter, setTimeFilter] = useState<'all' | '30min' | '1h' | 'today'>('all');

  // Filtrar incidentes según el rango de tiempo
  const getFilteredIncidents = (incidents: Incident[]) => {
    const now = new Date();

    switch (timeFilter) {
      case '30min':
        return incidents.filter(inc =>
          new Date(inc.created_at) > new Date(now.getTime() - 30 * 60 * 1000)
        );
      case '1h':
        return incidents.filter(inc =>
          new Date(inc.created_at) > new Date(now.getTime() - 60 * 60 * 1000)
        );
      case 'today':
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        return incidents.filter(inc =>
          new Date(inc.created_at) > startOfDay
        );
      default:
        return incidents;
    }
  };

  return {
    timeFilter,
    setTimeFilter,
    getFilteredIncidents,
  };
};