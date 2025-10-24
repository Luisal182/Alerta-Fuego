
import styles from './Header.module.css';

interface HeaderProps {
    onReportClick?: () => void;  
    onThemeToggle: () => void;
    isDarkMode: boolean;
}

export default function Header({ onReportClick,onThemeToggle, isDarkMode  }: HeaderProps) { 
    return (
        <header className={styles.header}> 
            <div className={styles.headerLeft}>
                <div className={styles.logo}>🔥</div>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Alerta-Fuego</h1>
                    <p className={styles.subtitle}>Emergency Reporting System</p>
                </div>    
            </div>       
            <div className={styles.headerRight}>
        <button 
          className={styles.themeToggle}
          onClick={onThemeToggle}
          aria-label="Toggle theme"
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
            <button 
                className={styles.headerButton} 
                onClick={onReportClick}>  
                + Report Incident
            </button>    
            </div>
        </header>
    );
}