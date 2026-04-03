'use client';

import styles from './footer.module.css';
import Image from 'next/image';
import useRedirekt from '@/hooks/useRedirekt';

const Footer = () => {
  const redirekt = useRedirekt();
  const currentYear = new Date().getFullYear();

  return (
    <footer id='footer' className={styles.footer}>
      {/* Main Footer Content */}
      <div className={styles['footer-wrapper']}>
        {/* Brand Section */}
        <div className={styles['footer-brand']}>
          <a href="/" className={styles.noAnim}>
            <div className={styles['brand-container']}>
              <Image src={'/Images/logo3.png'} alt='Moj Termin logo' width={50} height={50} />
              <h3>Moj Termin</h3>
            </div>
          </a>
          <p className={styles['brand-description']}>
            Jednostavno digitalno zakazivanje termina – za svaki biznis.
          </p>
        </div>

        {/* Links Grid */}
        <div className={styles['footer-grid']}>
          {/* Navigation Section */}
          <div className={styles['footer-section']}>
            <h4>Navigacija</h4>
            <ul>
              <li><a onClick={() => {redirekt('/panel')}}>Preduzetnički panel</a></li>
              <li><a onClick={() => {redirekt('/about')}}>O nama</a></li>
              <li><a onClick={() => {redirekt('/login-preduzeca?register=true')}}>Probaj besplatno</a></li>
              <li><a href="/pomoc">Pomoć</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className={styles['footer-section']}>
            <h4>Kontakt</h4>
            <div className={styles['contact-list']}>
              <a href="mailto:info@mojtermin.site" className={styles['contact-item']}>
                <span className={styles['contact-icon']}>✉</span>
                <span>info@mojtermin.site</span>
              </a>
              <a href="mailto:jakovljevic.nemanja@outlook.com" className={styles['contact-item']}>
                <span className={styles['contact-icon']}>✉</span>
                <span>jakovljevic.nemanja@outlook.com</span>
              </a>
              <a href="tel:+381604339800" className={styles['contact-item']}>
                <span className={styles['contact-icon']}>☎</span>
                <span>+381 60 433 9800</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles['footer-bottom']}>
        <p>Powered by ASISDev © {currentYear} Moj Termin. Sva prava zadržana.</p>
      </div>
    </footer>
  );
};

export default Footer;
