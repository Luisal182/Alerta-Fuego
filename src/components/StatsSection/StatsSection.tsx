import type { Incident } from '../../types';
import styles from './StatsSection.module.css';

interface StatCard {
  icon: string;
  label: string;
  value: number;
  color: string;
}

interface StatsSectionProps {
  incidents: Incident[];
}

export const StatsSection = ({ incidents }: StatsSectionProps) => {
  const calculateStats = () => {
    const today = new Date().toDateString();
    
    return {
      total: incidents.length,
      active: incidents.filter(i => i.status === 'pending' || i.status === 'in_progress').length,
      resolved: incidents.filter(i => i.status === 'resolved').length,
      today: incidents.filter(i => 
        new Date(i.created_at).toDateString() === today
      ).length,
    };
  };

  const stats = calculateStats();

  const statCards: StatCard[] = [
    {
      icon: '📊',
      label: 'Total Incidents',
      value: stats.total,
      color: '#3B82F6',
    },
    {
      icon: '⚡',
      label: 'Active',
      value: stats.active,
      color: '#F59E0B',
    },
    {
      icon: '✅',
      label: 'Resolved',
      value: stats.resolved,
      color: '#10B981',
    },
    {
      icon: '📅',
      label: 'Today',
      value: stats.today,
      color: '#8B5CF6',
    },
  ];


  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsGrid}>
        {statCards.map((card, index) => (
          <div
            key={index}
            className={styles.statCard}
            style={{
              '--card-color': card.color,
              '--animation-delay': `${index * 100}ms`,
            } as React.CSSProperties}
          >
            <div className={styles.cardContent}>
              <div className={styles.iconWrapper}>
                <span className={styles.icon}>{card.icon}</span>
              </div>
              <div className={styles.textContent}>
                <div className={styles.statValue}>{card.value}</div>
                <div className={styles.statLabel}>{card.label}</div>
              </div>
            </div>
            <div className={styles.cardBorder}></div>
          </div>
        ))}
      </div>
    </div>
  );
};