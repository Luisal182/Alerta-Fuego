import styles from './FilterBar.module.css';

interface FilterBarProps {
  timeFilter: string;
  onTimeFilterChange: (filter: 'all' | '30min' | '1h' | 'today') => void;
}

export default function FilterBar({ timeFilter, onTimeFilterChange }: FilterBarProps) {
  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>⏱️ Time Range:</label>
        <select 
          className={styles.filterSelect}
          value={timeFilter}
          onChange={(e) => onTimeFilterChange(e.target.value as any)}
        >
          <option value="all">All Time</option>
          <option value="30min">Last 30 minutes</option>
          <option value="1h">Last hour</option>
          <option value="today">Today</option>
        </select>
      </div>
    </div>
  );
}