import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useDashboardIncidents } from '../../hooks/useDashboardIncidents';
import IncidentsTable from '../../components/IncidentsTable/IncidentsTable';
import styles from './DashboardPage.module.css';
import toast from 'react-hot-toast';
import { StatsSection } from '../../components/StatsSection/StatsSection';
import { useDarkMode } from '../../hooks/useDarkMode';
import { useEffect, useRef } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const { isDarkMode, handleThemeToggle } = useDarkMode();
  const navigate = useNavigate();
  const {
    incidents,
    loading,
    error,
    updateStatus,
    updateAssistanceType,
    dispatchResources,
    deleteIncident,
  } = useDashboardIncidents();

  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  // Ref to track last incident ID for notifications
  const lastIncidentIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (incidents.length > 0) {
      const latestIncident = incidents[0];
      const latestIncidentTime = new Date(latestIncident.created_at).getTime();

      const secondIncidentTime = incidents[1] 
        ? new Date(incidents[1].created_at).getTime()
        : Infinity;
        
      if (
        lastIncidentIdRef.current !== latestIncident.id && 
        latestIncidentTime > secondIncidentTime
      ) {
        lastIncidentIdRef.current = latestIncident.id;
        
        toast.success(`🚨 NEW ${latestIncident.risk_level} incident!`, {
          duration: 4000,
          position: 'top-center',
        });
      }
    }
  }, [incidents]);

    const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Filter incidents
  const filteredIncidents = incidents.filter(incident => {
    if (statusFilter && incident.status !== statusFilter) return false;
    if (riskFilter && incident.risk_level !== riskFilter) return false;
    return true;
  });

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>📊 Emergency Dashboard</h1>
        
        <button 
      onClick={handleThemeToggle}
      className={styles.themeToggle}
      aria-label="Toggle theme"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>

        <div className={styles.userInfo}>
          <span className={styles.userEmail}>{user?.email}</span>
          <button
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* New component for Cards*/}
      <StatsSection incidents={filteredIncidents} />

      <div className={styles.dashboardContent}>
        {error && (
          <div className={styles.errorMessage}>
            ❌ {error}
          </div>
        )}

        {/* Filtros */}
        <div className={styles.filtersBar}>
          <div className={styles.filterGroup}>
            <label>Status:</label>
            <select
              value={statusFilter || ''}
              onChange={(e) => setStatusFilter(e.target.value || null)}
              className={styles.filterSelect}
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className={styles.filterGroup}>
            <label>Risk Level:</label>
            <select
              value={riskFilter || ''}
              onChange={(e) => setRiskFilter(e.target.value || null)}
              className={styles.filterSelect}
            >
              <option value="">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <span className={styles.countBadge}>
            {filteredIncidents.length} incident{filteredIncidents.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Tabla */}
        <IncidentsTable
          incidents={filteredIncidents}
          loading={loading}
          onStatusChange={updateStatus}
          onAssistanceTypeChange={updateAssistanceType}
          onDispatchResources={dispatchResources}
          onDelete={deleteIncident}
        />
      </div>
    </div>
  );
}