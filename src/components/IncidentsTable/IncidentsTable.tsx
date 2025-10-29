import { useState } from 'react';
import type { Incident } from '../../types';
import styles from './IncidentsTable.module.css';

interface IncidentsTableProps {
  incidents: Incident[];
  loading: boolean;
  onStatusChange: (id: string, status: string) => Promise<any>;
  onAssistanceTypeChange: (id: string, type: string) => Promise<any>;
  onDispatchResources: (id: string, resources: string[]) => Promise<any>;
  onDelete: (id: string) => Promise<any>;
}

const STATUS_OPTIONS = ['pending', 'in_progress', 'resolved'];
const ASSISTANCE_OPTIONS = ['police', 'firefighter', 'medical', 'helicopter', 'rescue'];
const RESOURCE_OPTIONS = ['unit1', 'unit2', 'unit3', 'unit4', 'unit5'];

export default function IncidentsTable({
  incidents,
  loading,
  onStatusChange,
  onAssistanceTypeChange,
  onDispatchResources,
  onDelete,
}: IncidentsTableProps) {
  const [showResourceModal, setShowResourceModal] = useState<string | null>(null);
  const [selectedResources, setSelectedResources] = useState<string[]>([]);

  if (loading) {
    return <div className={styles.loading}>Loading incidents...</div>;
  }

  if (incidents.length === 0) {
    return <div className={styles.empty}>No incidents found</div>;
  }

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return styles.statusPending;
      case 'in_progress':
        return styles.statusInProgress;
      case 'resolved':
        return styles.statusResolved;
      default:
        return '';
    }
  };

  const handleResourceModalOpen = (id: string, current: string[]) => {
    setShowResourceModal(id);
    setSelectedResources(current || []);
  };

  const handleResourceToggle = (resource: string) => {
    setSelectedResources(prev =>
      prev.includes(resource)
        ? prev.filter(r => r !== resource)
        : [...prev, resource]
    );
  };

  const handleResourceSave = async () => {
    if (showResourceModal) {
      await onDispatchResources(showResourceModal, selectedResources);
      setShowResourceModal(null);
      setSelectedResources([]);
    }
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Location</th>
            <th>Description</th>
            <th>Risk</th>
            <th>Status</th>
            <th>Assistance</th>
            <th>Resources</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incidents.map((incident) => (
            <tr key={incident.id} className={styles.row}>
              <td className={styles.id}>{incident.id.slice(0, 8)}...</td>
              
              <td className={styles.location}>
                {Number(incident.latitude).toFixed(4)}, {Number(incident.longitude).toFixed(4)}
              </td>

              <td className={styles.description}>
                {incident.description.slice(0, 50)}...
              </td>

              <td className={styles.risk}>
                <span
                  className={styles.riskBadge}
                  style={{ backgroundColor: getRiskColor(incident.risk_level) }}
                >
                  {incident.risk_level.toUpperCase()}
                </span>
              </td>

              <td className={styles.status}>
                <select
                  className={`${styles.select} ${getStatusBadgeClass(incident.status)}`}
                  value={incident.status}
                  onChange={(e) => onStatusChange(incident.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </td>

              <td className={styles.assistance}>
                <select
                  className={styles.select}
                  value={incident.assistance_type || ''}
                  onChange={(e) => onAssistanceTypeChange(incident.id, e.target.value)}
                >
                  <option value="">Select...</option>
                  {ASSISTANCE_OPTIONS.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </td>

              <td className={styles.resources}>
                <button
                  className={styles.dispatchBtn}
                  onClick={() => handleResourceModalOpen(incident.id, incident.dispatched_resources || [])}
                >
                  📡 Dispatch
                </button>
                {incident.dispatched_resources && incident.dispatched_resources.length > 0 && (
                  <div className={styles.resourcesList}>
                    {incident.dispatched_resources.map(r => (
                      <span key={r} className={styles.resourceTag}>{r}</span>
                    ))}
                  </div>
                )}
              </td>

              <td className={styles.created}>
                {new Date(incident.created_at).toLocaleDateString()}
              </td>

              <td className={styles.actions}>
                <button
                  className={styles.deleteBtn}
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this incident?')) {
                      onDelete(incident.id);
                    }
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para despachar recursos */}
      {showResourceModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h3>Dispatch Resources</h3>
            <div className={styles.resourcesGrid}>
              {RESOURCE_OPTIONS.map(resource => (
                <label key={resource} className={styles.resourceCheckbox}>
                  <input
                    type="checkbox"
                    checked={selectedResources.includes(resource)}
                    onChange={() => handleResourceToggle(resource)}
                  />
                  <span>{resource}</span>
                </label>
              ))}
            </div>
            <div className={styles.modalActions}>
              <button
                className={styles.saveBtn}
                onClick={handleResourceSave}
              >
                Save
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowResourceModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}