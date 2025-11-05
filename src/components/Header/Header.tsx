
import styles from './Header.module.css';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    onReportClick?: () => void;  
    onThemeToggle: () => void;
    isDarkMode: boolean;
}

export default function Header({ onThemeToggle, isDarkMode  }: HeaderProps) { 
    const navigate = useNavigate();
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
                    className={styles.loginButton}
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
                
                <button 
                    className={styles.signupButton}
                    onClick={() => navigate('/signup')}
                >
                    Sign Up
                </button>    
            </div>
        </header>
    );
}