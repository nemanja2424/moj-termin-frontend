'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './page.module.css';
import Footer from '@/components/Footer';

export default function HomeContent() {
  const router = useRouter();
  const inputRef = useRef(null);
  const [preduzeca, setPreduzeca] = useState([]);
  const [kategorije, setKategorije] = useState([]);
  const [filteredPreduzeca, setFilteredPreduzeca] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    fetchPreduzecaAndKategorije();
    checkAuthentication();
    
    // Učitaj poruku iz URL parametara
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const message = params.get('message');
      const success = params.get('success');
      
      if (success === 'true' && message) {
        toast.success(decodeURIComponent(message));
      }
    }
  }, []);

  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  const checkAuthentication = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      if (authToken && isTokenValid(authToken)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    }
  };

  const isTokenValid = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  const handleProfileClick = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // Ako je prijavljen - redirekt prema roli
    const rola = localStorage.getItem('rola');
    if (rola === '1' || rola === '2') {
      router.push('/panel');
    } else if (rola === '3') {
      router.push('/klijent');
    }
  };

  const fetchPreduzecaAndKategorije = async () => {
    try {
      const response = await fetch('https://mojtermin.site/api/preduzeca/get');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.preduzeca)) {
        setPreduzeca(data.preduzeca);
        setFilteredPreduzeca(data.preduzeca);
      }

      if (Array.isArray(data.kategorije)) {
        setKategorije(data.kategorije);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching preduzeca:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = preduzeca;

    // Primeni pretragu
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.ime_preduzeca.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.opis && p.opis.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Primeni kategoriju
    if (activeCategory !== 'all') {
      filtered = filtered.filter(p => String(p.id_kateg) === String(activeCategory));
    }

    setFilteredPreduzeca(filtered);
  }, [searchTerm, activeCategory, preduzeca]);

  const handleCardClick = (id) => {
    router.push(`/zakazi/${id}`);
  };

  const getImageUrl = (putnja) => {
    if (!putnja) return null;
    if (putnja.startsWith('http')) return putnja;
    return `https://mojtermin.site/api/logo/${putnja}`;
  };

  // Mapping kategorija na ikone
  const categoryIconMap = {
    'Frizer': 'fa-solid fa-scissors',
    'Zdravlje': 'fa-solid fa-stethoscope',
    'Zdravstvena zaštita': 'fa-solid fa-stethoscope',
    'Lepota': 'fa-solid fa-spa',
    'Teretana': 'fa-solid fa-dumbbell',
    'Restorani': 'fa-solid fa-utensils',
    'Restoran': 'fa-solid fa-utensils',
    'Fotografija': 'fa-solid fa-camera',
    'Fotografija i video': 'fa-solid fa-camera',
    'Salon': 'fa-solid fa-chair',
    'Zubni lekar': 'fa-solid fa-tooth',
    'Veterinar': 'fa-solid fa-paw',
    'Obuka': 'fa-solid fa-graduation-cap',
    
    'Auto servisi': 'fa-solid fa-car-on',
    'Tehnički pregledi': 'fa-solid fa-car',
    'Zdravstvene klinike': 'fa-solid fa-stethoscope',
    'Veterinarske klinike': 'fa-solid fa-shield-dog',
    'Stomatološke klinike': 'fa-solid fa-tooth',
    'Beauty': 'fa-solid fa-spa',
    'Frizerski saloni': 'fa-solid fa-scissors',
    'Masaža': 'fa-solid fa-hand',
    'Fitness': 'fa-solid fa-dumbbell',
    'Sportski tereni': 'fa-solid fa-basketball',
    'Sastanci': 'fa-solid fa-envelopes-bulk',
    'Grooming': 'fa-solid fa-dog',
  };

  const getIconForCategory = (categoryName) => {
    return categoryIconMap[categoryName] || 'fa-solid fa-briefcase';
  };

  // Filtrira kategorije na osnovu searchTerm-a
  const getFilteredCategories = () => {
    if (!searchTerm) {
      return kategorije;
    }

    // Filtrira kategorije koje se podudaraju sa pretragom
    return kategorije.filter(kat => 
      kat.kategorija.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className={styles.container}>
      {/* OVERLAY - Prikazuje se kada je search otvoren na mobilnom */}
      {searchOpen && (
        <>
          <div 
            className={styles.searchOverlay}
            onClick={() => {
              setSearchOpen(false);
            }}
          />
          
          {/* FILTERED CATEGORIES ON SEARCH OVERLAY */}
          <div className={styles.searchOverlayCategories}>
            <button 
              className={`${styles.overlayCategory} ${activeCategory === 'all' ? styles.overlayActive : ''}`}
              onClick={() => {
                setActiveCategory('all');
                setSearchTerm('');
                setSearchOpen(false);
              }}
            >
              <i className="fa-solid fa-grid-2"></i>
              <span>Sve</span>
            </button>
            {getFilteredCategories().map((kat) => (
              <button 
                key={kat.id}
                className={`${styles.overlayCategory} ${activeCategory === String(kat.id) ? styles.overlayActive : ''}`}
                onClick={() => {
                  setActiveCategory(String(kat.id));
                  setSearchTerm('');
                  setSearchOpen(false);
                }}
              >
                <i className={getIconForCategory(kat.kategorija)}></i>
                <span>{kat.kategorija}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* HEADER */}
      <div className={`${styles.header} ${searchOpen ? styles.headerSearchOpen : ''}`}>
        <div className={styles.headerContent}>
          {/* Logo - Skriva se na mobilnom kada je search otvoren */}
          <div className={`${styles.logo} ${searchOpen ? styles.logoHidden : ''}`}>
            <img src="/Images/logo3.png" alt="Moj Termin" />
          </div>
          
          {/* Search Bar - Normalno na desktopu, ekspanduje se na mobilnom */}
          <div className={`${styles.searchBar} ${searchOpen ? styles.searchBarActive : ''}`}>
            <i className={`fa-solid fa-search ${styles.searchIcon}`}></i>
            <input
              ref={inputRef}
              autoFocus={searchOpen}
              type="text"
              className={styles.searchInput}
              placeholder="Pretraži firme..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchOpen(false);
                }
              }}
            />
            {searchOpen && (
              <button 
                className={styles.closeSearchBtn}
                onClick={() => {
                  setSearchTerm('');
                  setSearchOpen(false);
                }}
                type="button"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            )}
          </div>

          {/* Desktop Profile Button - Skrit na mobilnom */}
          <button 
            className={`${styles.button} ${searchOpen ? styles.buttonHidden : ''}`}
            onClick={handleProfileClick}
          >
            <i className="fa-solid fa-user-circle" style={{ marginRight: '8px' }}></i>
            Profil
          </button>

          {/* Mobile Search Icon - Prikazuje se samo na mobilnom */}
          <button 
            className={styles.mobileSearchBtn}
            onClick={() => setSearchOpen(prev => !prev)}
            type="button"
          >
            <i className="fa-solid fa-search"></i>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        {searchTerm || activeCategory !== 'all' ? (
          <>
            <h1 className={styles.title}>
              {searchTerm ? `Rezultati za: "${searchTerm}"` : 'Filtrirani rezultati'}
            </h1>
            <p className={styles.subtitle}>
              {filteredPreduzeca.length} {filteredPreduzeca.length === 1 ? 'rezultat' : 'rezultata'} pronađeno
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>Pronađi termin</h1>
            <p className={styles.subtitle}>Brzo i jednostavno zakaži termin kod najboljih firmi</p>
          </>
        )}

        {/* CATEGORIES */}
        <div className={styles.categoriesBar}>
          <button 
            className={`${styles.categoryBtn} ${activeCategory === 'all' ? styles.active : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <i className="fa-solid fa-grid-2" style={{ marginRight: '6px' }}></i>
            Sve
          </button>
          {kategorije.map((kat) => (
            <button 
              key={kat.id}
              className={`${styles.categoryBtn} ${activeCategory === String(kat.id) ? styles.active : ''}`}
              onClick={() => setActiveCategory(String(kat.id))}
              title={kat.kategorija}
            >
              <i className={`${getIconForCategory(kat.kategorija)}`} style={{ marginRight: '6px' }}></i>
              {kat.kategorija}
            </button>
          ))}
        </div>

        {/* LOADING STATE */}
        {loading && (
          <div className={styles.loadingGrid}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.skeleton}></div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredPreduzeca.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <i className="fa-solid fa-search"></i>
            </div>
            <h2 className={styles.emptyStateTitle}>Nema rezultata</h2>
            <p className={styles.emptyStateText}>Pokušaj sa drugom pretragom ili kategorijom</p>
          </div>
        )}

        {/* CARDS GRID */}
        {!loading && filteredPreduzeca.length > 0 && (
          <div className={styles.cardGrid}>
            {filteredPreduzeca.map((firma) => (
              <div 
                key={firma.id} 
                className={styles.card}
                onClick={() => handleCardClick(firma.id)}
              >
                {/* IMAGE */}
                <div className={styles.cardImage}>
                  {getImageUrl(firma.putanja_za_logo) ? (
                    <img 
                      src={getImageUrl(firma.putanja_za_logo)}
                      alt={firma.ime_preduzeca}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={styles.cardImageFallback}
                    style={{ display: getImageUrl(firma.putanja_za_logo) ? 'none' : 'flex' }}
                  >
                    <i className="fa-solid fa-briefcase"></i>
                  </div>
                  {firma.id_kateg && (
                    <div className={styles.cardBadge}>
                      <i className={getIconForCategory(
                        kategorije.find(k => k.id === firma.id_kateg)?.kategorija || ''
                      )} style={{ fontSize: '20px' }}></i>
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{firma.ime_preduzeca}</h3>
                  <div className={styles.cardDescription}>
                    {firma.opis ? (
                      <div dangerouslySetInnerHTML={{ __html: firma.opis }} />
                    ) : (
                      <p>Profesionalne usluge visokog kvaliteta</p>
                    )}
                  </div>
                </div>

                {/* FOOTER */}
                <div className={styles.cardFooter}>
                    <p>
                        {firma.sponzorisano}
                    </p>
                    <button className={styles.button}>
                        Zakaži
                        <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LOGIN MODAL - Prikazuje se kada korisnik nije prijavljen i klikne na Profil */}
      {showLoginModal && (
        <div>
          <div className={styles.blur}></div>
          <div className={styles.loginModal}>
            <h2>Dobrodošli!</h2>
            <p>Potrebna je prijava da biste pristupili Vašem profilu</p>
            <div className={styles.loginModalButtons}>
              <button 
                className={styles.btn}
                onClick={() => router.push('/login')}
              >
                <i className="fa-solid fa-sign-in-alt" style={{ marginRight: '8px' }}></i>
                Prijavi se
              </button>
              <button 
                className={styles.btnSecondary}
                onClick={() => router.push('/login?register=true')}
              >
                <i className="fa-solid fa-user-plus" style={{ marginRight: '8px' }}></i>
                Registruj se
              </button>
            </div>
            <button 
              className={styles.closeBtn}
              onClick={() => setShowLoginModal(false)}
            >
              <i className="fa-solid fa-times"></i>
            </button>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Footer />
    </div>
  );
}
