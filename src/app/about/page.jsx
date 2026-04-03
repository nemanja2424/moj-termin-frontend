export const revalidate = 60; // ISR

import styles from './home.module.css';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import AboutAnimations from './AboutAnimations';

export async function generateMetadata() {
  return {
    title: "O nama – MojTermin",
    description: "Saznajte više o MojTermin-u, modernom sistemu za digitalno zakazivanje termina.",
    alternates: {
      canonical: "https://mojtermin.site/about",
    },
    keywords: "zakazivanje termina, online zakazivanje, o nama",
  };
};

export default function AboutPage() {
  return (
    <div className={styles.sve}>
      <AboutAnimations />
      <Header />
      <div className={styles.hero}>
        <div className={styles['zatamni-hero']}></div>
        <div className={styles.content}>
          <div className={styles['hero-naslov']}>
            <h1 className='anim2'>Digitalno zakazivanje termina za moderan biznis</h1>
            <h3 className='anim3'>Brže i jednostavnije upravljanje terminima za vas i vaše klijente.</h3>
            <a href="#footer" className={`${styles.button1} + anim4`} style={{ marginTop: '20px' }}>Kontaktirajte nas</a>
          </div>
        </div>
      </div>

      <section className={styles['info-between']}>
        <h2 className='anim2'><br />Rešite sve svoje potrebe za zakazivanje termina na jednom mestu</h2>
        <p className='anim'>Naš sistem za digitalno zakazivanje termina je jednostavan za korišćenje i prilagodljiv svim vrstama poslovanja. Bilo da ste frizer, lekar, trener ili neko drugi ko upravlja terminima, naš alat vam omogućava brzo i efikasno upravljanje, štedeći vreme i smanjujući greške. Sa našim rešenjem, vaši klijenti će imati jednostavan pristup, a vi ćete moći da se fokusirate na rast svog biznisa.</p>
        <p className='anim3'><br/>Naš sistem nudi jednostavnu stranu za zakazivanje termina za vaše klijente, kontrolnu tablu za vas sa svim potrebnim informacijama, kao i analitiku koja vam pomaže da pratite učinkovitost vašeg poslovanja. Uz mogućnost automatskog slanja obaveštenja i bezbednost podataka, možete biti sigurni da će vaše poslovanje teći glatko i sigurno.</p>
        <p className='anim4'><br/>Bez obzira na vrstu vašeg biznisa, naš sistem je fleksibilan i lako se integriše u vaše postojeće radne procese. Pružite svojim klijentima najbolje iskustvo u zakazivanju termina i uštedite dragoceno vreme!</p>
      </section>
  
      <section className={styles['info-between']}>
        <h2 className='anim2'><br />Neka vas klijenti pronađu – bez dodatnog truda</h2>

        <p className='anim'>
          Naša platforma ne služi samo za zakazivanje termina – ona pomaže da vas novi klijenti pronađu.
          Platforma funkcioniše kao mesto na kojem korisnici dolaze kada im je potrebna određena usluga – bilo da je to šišanje, pregled, trening ili nešto drugo.
        </p>

        <p className='anim3'>
          Kada napravite nalog, vaše preduzeće dobija svoju stranicu za zakazivanje. Tu klijenti mogu da vide vaše usluge,
          slobodne termine i odmah zakažu – bez poziva, poruka i čekanja.
        </p>

        <p className='anim4'>
          Ljudi koji vas do sada nisu poznavali mogu vas pronaći preko naše platforme i postati vaši novi klijenti.
          Na taj način, ne dobijate samo alat za organizaciju, već i dodatni način da proširite svoje poslovanje.
        </p>

        <p className='anim'>
          Sve je jednostavno – vi postavite termine, a klijenti sami biraju ono što im odgovara.
          Dok vi radite svoj posao, sistem radi za vas.
        </p>
      </section>

      <section id='about' className={styles['benefits-section']}>
        <h2>Zašto odabrati naš sistem?</h2>
        <div className={styles['benefits-cards']}>

          <div className={`${styles['benefit-card']} anim2`}>
            <div className={styles['benefit-icon']}><i className="fa-regular fa-clock"></i></div>
            <div className={styles['benefit-title']}>Brzo i jednostavno zakazivanje</div>
            <div className={styles['benefit-desc']}>
              Naš sistem omogućava brzo kreiranje i pregled termina uz intuitivan interfejs koji štedi vreme i smanjuje greške.
            </div>
          </div>

          <div className={`${styles['benefit-card']} anim2`}>
            <div className={styles['benefit-icon']}><i className="fa-solid fa-mobile-screen-button"></i></div>
            <div className={styles['benefit-title']}>Pristup sa bilo kog uređaja</div>
            <div className={styles['benefit-desc']}>
              Bez obzira da li ste na računaru, tabletu ili telefonu, pristup rasporedu i podacima je uvek na dohvat ruke.
            </div>
          </div>

          <div className={`${styles['benefit-card']} anim2`}>
            <div className={styles['benefit-icon']}><i className="fa-solid fa-chart-line"></i></div>
            <div className={styles['benefit-title']}>Analitika i pregled poslovanja</div>
            <div className={styles['benefit-desc']}>
              Dobijte uvid u zauzetost, broj zakazanih termina i produktivnost zaposlenih kroz pregledne grafikone i statistiku.
            </div>
          </div>

          <div className={`${styles['benefit-card']} anim4`}>
            <div className={styles['benefit-icon']}><i className="fa-solid fa-bell"></i></div>
            <div className={styles['benefit-title']}>Automatska obaveštenja</div>
            <div className={styles['benefit-desc']}>
              Sistem automatski obaveštava klijente i osoblje o svakom novom terminu, otkazivanju ili izmeni – bez dodatnog napora.
            </div>
          </div>

          <div className={`${styles['benefit-card']} anim4`}>
            <div className={styles['benefit-icon']}><i className="fa-solid fa-lock"></i></div>
            <div className={styles['benefit-title']}>Sigurnost podataka</div>
            <div className={styles['benefit-desc']}>
              Svi podaci su zaštićeni modernim sigurnosnim protokolima kako bi vi i vaši klijenti bili bezbedni u svakom trenutku.
            </div>
          </div>

          <div className={`${styles['benefit-card']} anim4`}>
            <div className={styles['benefit-icon']}><i className="fas fa-headset"></i></div>
            <div className={styles['benefit-title']}>Lična podrška i pomoć</div>
            <div className={styles['benefit-desc']}>
              Naš tim je tu da vam pomogne pri svakom koraku – od podešavanja do svakodnevne upotrebe sistema.
            </div>
          </div>

        </div>
      </section>


      <section className={styles['cta-section']}>
        <div className={styles['zatamni-cta']}></div>
        <div className={`${styles['cta-content']} anim4`}>
          <h2>Zainteresovani? Javite se i počnite da zakazujete lako!</h2>
          <p>Moj Termin prima rezervacije umesto vas – dok vi radite, odmarate ili spavate. <br />
          Sve funkcioniše automatski: klijenti sami biraju slobodan termin, a vi dobijate obaveštenje. Jednostavno, zar ne?</p>
          <a href='mailto:info@mojtermin.site'><button className={styles['cta-button']}>Kontaktirajte nas</button></a><br/><br/>
          <span>Ili isprobajte besplatnu verziju <a href='/login-preduzeca?register=true' style={{color:"#0aadff"}}>kreiranjem naloga</a>.</span>
        </div>
      </section>

      <section className={styles['info-between']}>
        <h2 className='anim2'><br />Napredno upravljanje terminima, lokacijama i zaposlenima</h2>

        <p className='anim'>
          Platforma omogućava upravljanje više poslovnih lokacija u okviru jednog naloga, pri čemu svaka lokacija može imati definisano radno vreme, dostupne usluge i zaposlene. Sve promene se automatski primenjuju i sinhronizuju u sistemu, bez potrebe za dodatnim podešavanjima.
        </p>

        <p className='anim3'>
          Sistem automatski vodi računa o zauzetosti i prikazuje samo slobodne termine klijentima.
        </p>

        <p className='anim4'>
          Sve informacije o terminima, zaposlenima i lokacijama dostupne su kroz centralizovanu kontrolnu tablu, što omogućava brz pregled i jednostavno upravljanje svakodnevnim poslovanjem.
        </p>

        <p className='anim'>
          Uz dodatne funkcionalnosti kao što su automatska obaveštenja, evidencija zakazivanja i pregled aktivnosti, imate potpunu kontrolu nad organizacijom i efikasnošću svog poslovanja.
        </p>
      </section>

      {/*<section className="ponuda-usluga">
        <div className="container anim3">
          <h2>Dodatne usluge</h2>
          <p>
            Takođe nudimo i <strong>redizajn postojećih web sajtova</strong>,
            kao i <strong>izradu novih sajtova</strong> u potpunosti prilagođenih vašim poslovnim ciljevima.
          </p>
          <p style={{fontSize:'18px'}}>
            <br/>
            Za više informacija i individualnu ponudu, javite na <a href='mailto:jakovljevic.nemanja@outlook.com' style={{color:"#0aadff"}}>jakovljevic.nemanja@outlook.com</a>.
          </p>
        </div>
      </section>*/}
      
      <Footer />
    </div>
  );
}
