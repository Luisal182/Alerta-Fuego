import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardPage.module.css';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1 className={styles.dashboardTitle}>📊 Emergency Dashboard</h1>
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

      <div className={styles.dashboardContent}>
        <div className={styles.card}>
          <h2>Reports Management</h2>
          <p>Coming soon...</p>
          <p>Here you will manage:</p>
          <ul>
            <li>View pending reports</li>
            <li>Change status (pending → in_progress → resolved)</li>
            <li>Select assistance type (police, firefighter, medical, helicopter, rescue)</li>
            <li>Dispatch resources</li>
            <li>Delete false reports</li>
          </ul>
        </div>
      </div>
    </div>
  );
}