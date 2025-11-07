import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Column 1 - Logo & Description */}
        <div className={styles.footerColumn}>
          <div className={styles.footerLogo}>
            <div className={styles.footerLogoIcon}>🔥</div>
            <span className={styles.footerLogoText}>Alerta-Fuego</span>
          </div>
          <p className={styles.footerDescription}>
            Forest fire reporting and monitoring system for the protection of our communities.
          </p>
        </div>

        {/* Column 2 - Emergency Contact */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle}>Emergency Contact</h3>
          <div className={styles.footerContactItem}>
            <span className={styles.footerContactIcon}>📞</span>
            <span>133 (Fire Department)</span>
          </div>
          <div className={styles.footerContactItem}>
            <span className={styles.footerContactIcon}>📞</span>
            <span>132 (CONAF)</span>
          </div>
          <div className={styles.footerContactItem}>
            <span className={styles.footerContactIcon}>✉️</span>
            <a href="mailto:emergencias@alerta-fuego.cl" className={styles.footerLink}>
              emergencias@alerta-fuego.cl
            </a>
          </div>
        </div>

        {/* Column 3 - Legal Information */}
        <div className={styles.footerColumn}>
          <h3 className={styles.footerTitle}>Legal Information</h3>
          <p className={styles.footerCopyright}>
            © 2025 Alerta-Fuego. All rights reserved.
          </p>
          <p className={styles.footerLegal}>
            This system is intended solely for real emergency reports. Misuse may result in legal sanctions.
          </p>
        </div>
      </div>
    </footer>
  );
}