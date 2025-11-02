import { useState } from 'react';
import type { Incident } from '../../types';
import styles from './IncidentsTable.module.css';
import toast from 'react-hot-toast';

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
  // ⭐ NUEVOS ESTADOS para tracking
  const [updatingRows, setUpdatingRows] = useState<Set<string>>(new Set());
  const [deletingRows, setDeletingRows] = useState<Set<string>>(new Set());

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

  // ⭐ FUNCIÓN MODIFICADA - Añadido toast
  const handleResourceSave = async () => {
    if (showResourceModal) {
      try {
        await onDispatchResources(showResourceModal, selectedResources);
        toast.success('Resources dispatched! 📡');
        setShowResourceModal(null);
        setSelectedResources([]);
      } catch (error) {
        toast.error('Failed to dispatch resources');
      }
    }
  };
  // ⭐ NUEVA FUNCIÓN - Status con toast y loading
  const handleStatusChangeWithToast = async (id: string, status: string) => {
    setUpdatingRows(prev => new Set(prev).add(id));
    try {
      await onStatusChange(id, status);
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingRows(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // ⭐ NUEVA FUNCIÓN - Delete con confirmación toast
  const handleDeleteWithToast = async (id: string) => {
    toast((t) => (
      <div>
        <p style={{ margin: '0 0 12px 0' }}>🗑️ Delete this incident?</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              setDeletingRows(prev => new Set(prev).add(id));
              try {
                await onDelete(id);
                toast.success('Incident deleted');
              } catch (error) {
                toast.error('Failed to delete incident');
              } finally {
                setDeletingRows(prev => {
                  const next = new Set(prev);
                  next.delete(id);
                  return next;
                });
              }
            }}
            style={{
              background: '#F56565',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 12px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              background: '#CBD5E0',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 12px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
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
            <tr key={incident.id} className={styles.row}
            style={{ 
              opacity: (updatingRows.has(incident.id) || deletingRows.has(incident.id)) ? 0.5 : 1,
              transition: 'opacity 0.3s ease'
            }}
          >
              
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
                  onChange={(e) => handleStatusChangeWithToast(incident.id, e.target.value)}
                  disabled={updatingRows.has(incident.id)}
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
                  onClick={() => handleDeleteWithToast(incident.id)}
                  title="Delete"
                  disabled={deletingRows.has(incident.id)}
                >
                  {deletingRows.has(incident.id) ? '⏳' : '🗑️'}
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