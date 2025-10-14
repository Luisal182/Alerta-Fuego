
import styles from './Header.module.css';

interface HeaderProps {
    onReportClick?: () => void;  
}

export default function Header({ onReportClick }: HeaderProps) { 
    return (
        <header className={styles.header}> 
            <div className={styles.headerLeft}>
                <div className={styles.logo}>🔥</div>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Alerta-Fuego</h1>
                    <p className={styles.subtitle}>Emergency Reporting System</p>
                </div>    
            </div>       
            <button 
                className={styles.headerButton} 
                onClick={onReportClick}>  
                + Report Incident
            </button>    
        </header>
    );
}