'use client';

import styles from './LocationPermission.module.css';
import { useLocationPermission } from '@/hooks/useLocationPermission';

export default function LocationPermission({ onAllow, onDeny }) {
  const { requestPermission, denyPermission, loading } = useLocationPermission();

  const handleAllow = async () => {
    const result = await requestPermission();
    
    if (result.success) {
      const { latitude, longitude } = result.location;
      onAllow({ latitude, longitude });
    } else {
      let errorMessage = 'Nije moguće pristupiti lokaciji.';
      
      if (result.reason) {
        errorMessage += ' ' + result.reason;
      }
      
      alert(errorMessage);
    }
  };

  const handleDeny = async () => {
    await denyPermission();
    onDeny?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <i className="fa-solid fa-map-location-dot"></i>
          <h2>Dozvola za lokaciju</h2>
        </div>

        <div className={styles.content}>
          <p className={styles.description}>
            Prikaži mi firme iz moje lokacije da lakše pronađeš najbolji termin
          </p>
          <div className={styles.benefits}>
            <div className={styles.benefit}>
              <i className="fa-solid fa-map-pin"></i>
              <span>Pronađi bliske firme</span>
            </div>
            <div className={styles.benefit}>
              <i className="fa-solid fa-clock"></i>
              <span>Brže zakazivanje</span>
            </div>
            <div className={styles.benefit}>
              <i className="fa-solid fa-star"></i>
              <span>Najbolje preporuke</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button 
            className={styles.denyBtn}
            onClick={handleDeny}
            disabled={loading}
          >
            <i className="fa-solid fa-times"></i>
            Odbij
          </button>
          <button 
            className={styles.allowBtn}
            onClick={handleAllow}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Učitavanje...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i>
                Dozvoli
              </>
            )}
          </button>
        </div>

        <p className={styles.privacy}>
          Tvoja lokacija se koristi samo za pronalaženje bliskijih firmi. 
          Pročitaj našu <a href="/terms">politiku privatnosti</a>.
        </p>
      </div>
    </div>
  );
}
