'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './klijent.module.css';
import Footer from '@/components/Footer';

export default function KlijentPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('appointments');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editData, setEditData] = useState({ username: '', email: '', brTel: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ stara_lozinka: '', nova_lozinka: '', potvrdaNova_lozinka: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      const rola = localStorage.getItem('rola');

      if (!authToken || rola !== '3') {
        router.push('/');
        return;
      }

      // Dekoduj token da dobije info
      const decoded = jwtDecode(authToken);
      setUser(decoded);
      
      fetchUserData(userId);
    } catch (error) {
      console.error('Greška pri autentifikaciji:', error);
      router.push('/');
    }
  };

  const fetchUserData = async (userId) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const response = await fetch(`https://mojtermin.site/api/klijent/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.status === 200 && data.klijent) {
        // Postavi korisničke podatke
        setUser(data.klijent);
        
        // Postavi termine
        if (Array.isArray(data.termini)) {
          setAppointments(data.termini);
        }
      }
    } catch (error) {
      console.error('Greška pri preuzimanju podataka korisnika:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('rola');
    router.push('/');
  };

  const handleEditProfile = () => {
    if (user) {
      setEditData({
        username: user.username || '',
        email: user.email || '',
        brTel: user.brTel || ''
      });
      setIsEditingProfile(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditData({ username: '', email: '', brTel: '' });
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const response = await fetch(`https://mojtermin.site/api/klijent/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: editData.username,
          email: editData.email,
          brTel: editData.brTel
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Ažuriraj user state
        setUser({
          ...user,
          username: editData.username,
          email: editData.email,
          brTel: editData.brTel
        });
        setIsEditingProfile(false);
        toast.success('Profil je uspešno ažuriran!');
      } else {
        toast.error(data.message || 'Greška pri ažuriranju profila');
      }
    } catch (error) {
      console.error('Greška pri ažuriranju profila:', error);
      toast.error('Greška pri ažuriranju profila');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    // Validacija
    if (!passwordData.stara_lozinka) {
      toast.error('Unesite postojeću lozinku');
      return;
    }
    if (!passwordData.nova_lozinka) {
      toast.error('Unesite novu lozinku');
      return;
    }
    if (passwordData.nova_lozinka !== passwordData.potvrdaNova_lozinka) {
      toast.error('Nove lozinke se ne poklapaju');
      return;
    }
    if (passwordData.nova_lozinka.length < 6) {
      toast.error('Nova lozinka mora imati najmanje 6 karaktera');
      return;
    }

    setSavingPassword(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');

      const response = await fetch(`https://mojtermin.site/api/klijent/${userId}/lozinka`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stara_lozinka: passwordData.stara_lozinka,
          nova_lozinka: passwordData.nova_lozinka
        })
      });

      const data = await response.json();

      if (response.ok) {
        setIsChangingPassword(false);
        setPasswordData({ stara_lozinka: '', nova_lozinka: '', potvrdaNova_lozinka: '' });
        toast.success('Lozinka je uspešno promenjena!');
      } else {
        toast.error(data.error || 'Greška pri promeni lozinke');
      }
    } catch (error) {
      console.error('Greška pri promeni lozinke:', error);
      toast.error('Greška pri promeni lozinke');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ stara_lozinka: '', nova_lozinka: '', potvrdaNova_lozinka: '' });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingScreen}>
          <span className="spinner"></span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <a href="/">
              <img src="/Images/logo3.png" alt="Moj Termin" />
            </a>
          </div>
          <h1>Moj Profil</h1>
          <div className={styles.headerActions}>
            <button 
              className={styles.logoutBtn}
              onClick={handleLogout}
            >
              <i className="fa-solid fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
              Odjavi se
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className={styles.mainContent}>
        {/* TABS */}
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tab} ${activeTab === 'appointments' ? styles.active : ''}`}
            onClick={() => setActiveTab('appointments')}
          >
            <i className="fa-solid fa-calendar-check"></i>
            Moja Zakazivanja
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="fa-solid fa-user"></i>
            Profil
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'password' ? styles.active : ''}`}
            onClick={() => setActiveTab('password')}
          >
            <i className="fa-solid fa-lock"></i>
            Bezbedonost
          </button>
        </div>

        {/* APPOINTMENTS TAB */}
        {activeTab === 'appointments' && (
          <div className={styles.tabContent}>
            <h2>Moja Zakazivanja ({appointments?.length || 0})</h2>
            {appointments && appointments.length > 0 ? (
              <div className={styles.appointmentsList}>
                {appointments.map((appointment) => {
                  let status = 'pending';
                  let statusText = 'Čekanje na potvrdu';
                  
                  if (appointment.otkazano) {
                    status = 'cancelled';
                    statusText = 'Otkazano';
                  } else if (appointment.potvrdio) {
                    status = 'confirmed';
                    statusText = 'Potvrđeno';
                  }
                  
                  const handleClick = () => {
                    if (appointment.preduzece?.id && appointment.token) {
                      router.push(`/zakazi/${appointment.preduzece.vlasnik_id}/izmeni/${appointment.token}`);
                    }
                  };
                  
                  return (
                    <div 
                      key={appointment.id} 
                      className={styles.appointmentCard}
                      onClick={handleClick}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className={styles.appointmentHeader}>
                        <div>
                          <h3>{appointment.preduzece?.ime || 'Preduzeće'}</h3>
                          <p className={styles.appointmentSubtitle}>{appointment.preduzece?.adresa || 'Adresa'}</p>
                        </div>
                        <span className={`${styles.status} ${styles[status]}`}>
                          {statusText}
                        </span>
                      </div>

                      <div className={styles.serviceInfo}>
                        <div className={styles.serviceItem}>
                          <label>Usluga:</label>
                          <span>{appointment.usluga?.usluga || 'N/A'}</span>
                        </div>
                        <div className={styles.serviceItem}>
                          <label>Cena:</label>
                          <span>{appointment.usluga?.cena || 'N/A'} RSD</span>
                        </div>
                        <div className={styles.serviceItem}>
                          <label>Trajanje:</label>
                          <span>{appointment.usluga?.trajanje_prikaz || appointment.usluga?.trajanje || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className={styles.appointmentDetails}>
                        <div className={styles.detail}>
                          <i className="fa-solid fa-calendar"></i>
                          <span>{new Date(appointment.datum_rezervacije).toLocaleDateString('sr-RS')}</span>
                        </div>
                        <div className={styles.detail}>
                          <i className="fa-solid fa-clock"></i>
                          <span>{appointment.vreme_rezervacije}</span>
                        </div>
                        <div className={styles.detail}>
                          <i className="fa-solid fa-user"></i>
                          <span>{appointment.ime}</span>
                        </div>
                      </div>

                      {appointment.opis && (
                        <div className={styles.appointmentDescription}>
                          <strong>Opis:</strong> {appointment.opis}
                        </div>
                      )}
                      
                      <div className={styles.appointmentFooter}>
                        <span className={styles.appointmentDate}>
                          Zakazano: {new Date(appointment.created_at).toLocaleDateString('sr-RS')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <i className="fa-solid fa-calendar-times"></i>
                <h3>Nema zakazivanja</h3>
                <p>Još niste zakazali termin. Krenite sa pretragom na početnoj strani!</p>
                <button 
                  className={styles.primaryBtn}
                  onClick={() => router.push('/')}
                >
                  Vrati se na početak
                </button>
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className={styles.tabContent}>
            <h2>Moj Profil</h2>
            <div className={styles.profileCard}>
              {isEditingProfile ? (
                <>
                  <div className={styles.profileField}>
                    <label>Korisničko Ime:</label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div className={styles.profileField}>
                    <label>Email:</label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div className={styles.profileField}>
                    <label>Broj Telefona:</label>
                    <input
                      type="tel"
                      value={editData.brTel}
                      onChange={(e) => setEditData({ ...editData, brTel: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button
                      onClick={handleSaveProfile}
                      disabled={savingProfile}
                      className={styles.primaryBtn}
                      style={{ flex: 1 }}
                    >
                      {savingProfile ? 'Čuvanje...' : 'Sačuvaj'}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={savingProfile}
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        background: '#f0f0f0',
                        cursor: 'pointer',
                        fontWeight: '600',
                        disabled: savingProfile
                      }}
                    >
                      Otkaži
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.profileField}>
                    <label>Korisničko Ime:</label>
                    <p>{user?.username || 'N/A'}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Email:</label>
                    <p>{user?.email || 'N/A'}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Broj Telefona:</label>
                    <p>{user?.brTel || 'N/A'}</p>
                  </div>
                  <div className={styles.profileField}>
                    <label>Registrovan:</label>
                    <p>{user?.created_at ? new Date(user.created_at).toLocaleDateString('sr-RS') : 'N/A'}</p>
                  </div>
                  <button
                    onClick={handleEditProfile}
                    className={styles.primaryBtn}
                    style={{ marginTop: '20px', width: '100%' }}
                  >
                    <i className="fa-solid fa-edit" style={{ marginRight: '8px' }}></i>
                    Izmeni Profil
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* PASSWORD TAB */}
        {activeTab === 'password' && (
          <div className={styles.tabContent}>
            <h2>Prosledi Lozinku</h2>
            <div className={styles.profileCard}>
              {isChangingPassword ? (
                <>
                  <div className={styles.profileField}>
                    <label>Postojeća Lozinka:</label>
                    <input
                      type="password"
                      value={passwordData.stara_lozinka}
                      onChange={(e) => setPasswordData({ ...passwordData, stara_lozinka: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      placeholder="Unesite vašu postojeću lozinku"
                    />
                  </div>
                  <div className={styles.profileField}>
                    <label>Nova Lozinka:</label>
                    <input
                      type="password"
                      value={passwordData.nova_lozinka}
                      onChange={(e) => setPasswordData({ ...passwordData, nova_lozinka: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      placeholder="Unesite novu lozinku"
                    />
                  </div>
                  <div className={styles.profileField}>
                    <label>Potvrdi Novu Lozinku:</label>
                    <input
                      type="password"
                      value={passwordData.potvrdaNova_lozinka}
                      onChange={(e) => setPasswordData({ ...passwordData, potvrdaNova_lozinka: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                      placeholder="Ponovite novu lozinku"
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button
                      onClick={handleChangePassword}
                      disabled={savingPassword}
                      className={styles.primaryBtn}
                      style={{ flex: 1 }}
                    >
                      {savingPassword ? 'Čuvanje...' : 'Promeni Lozinku'}
                    </button>
                    <button
                      onClick={handleCancelPasswordChange}
                      disabled={savingPassword}
                      style={{
                        flex: 1,
                        padding: '12px 24px',
                        border: '1px solid #ccc',
                        borderRadius: '10px',
                        background: '#f0f0f0',
                        cursor: 'pointer',
                        fontWeight: '600'
                      }}
                    >
                      Otkaži
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ color: '#666', marginBottom: '20px' }}>
                    Promenite vašu lozinku da biste zaštitili vaš nalog
                  </p>
                  <button
                    onClick={() => setIsChangingPassword(true)}
                    className={styles.primaryBtn}
                    style={{ width: '100%' }}
                  >
                    <i className="fa-solid fa-key" style={{ marginRight: '8px' }}></i>
                    Promeni Lozinku
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

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
