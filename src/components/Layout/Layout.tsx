import  type {ReactNode} from 'react';
import styles from './Layout.module.css';

interface LayoutProps {
   leftPanel: ReactNode;
   rightPanel: ReactNode;
}
 
export default function Layout({ leftPanel, rightPanel }:  LayoutProps) {
    return (
        <>

    {/* Breathing room top*/}
    <div className={styles.breathingRoom}></div>
    {/* Main split screen layout */}
    <main className={styles.mainContent}>
    {/* Left Panel - Map */}
        <div className={styles.leftPanel}>
       {leftPanel}
       </div>
       {/* Right Panel - Form */}
         <div className={styles.rightPanel}>
         {rightPanel}
         </div>
    </main>
    {/* Breathing room bottom */}
    <div className={styles.breathingRoom}></div>

    </>
);
}