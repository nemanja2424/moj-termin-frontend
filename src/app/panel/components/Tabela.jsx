import { useEffect, useState } from "react";
import styles from "./Tabela.module.css";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";  
import { reactMaxHeadersLength } from "../../../../next.config";


export default function Tabela({ desavanjaData, fetchData, loading, izmeniTermin, showFilters, resetFiltersKey, dashboard }) {
  const [desavanja, setDesavanja] = useState([]);
  const [rola, setRola] = useState(null); //1 = vlasnik; 2 = korisnik; Eventualno 3 = admin
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [statusFilter, setStatusFilter] = useState('');
  const [lokacijaFilter, setLokacijaFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [createdFrom, setCreatedFrom] = useState('');
  const [createdTo, setCreatedTo] = useState('');

  // Normalizuj podatke - razmotuaj ako je niz nizova
  const normalizeData = (data) => {
    if (!Array.isArray(data)) return [];
    
    // Ako je niz nizova, razmotuaj ga
    if (data.length > 0 && Array.isArray(data[0])) {
      return data.flat();
    }
    return data;
  };

  useEffect(() => {
      if (desavanjaData && desavanjaData.length > 0) {
          const normalized = normalizeData(desavanjaData);
          // Mapira polja da budu kompatibilna sa komponentom
          const mapped = normalized.map(event => ({
            ...event,
            ime_firme: event.ime_lokacije || event.lokacija?.ime || '-',
            datum: event.datum_rezervacije || event.datum
          }));
          const sortirano = [...mapped].sort((a, b) => b.id - a.id);
          setDesavanja(sortirano);
      }
      let rolaInt = localStorage.getItem('rola');
      setRola(rolaInt);
  }, [desavanjaData]);

    
  const potvrdiTermin = async (termin) => {
    const authToken = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
    termin.potvrdio = userId;
    const res = await fetch("https://mojtermin.site/api/potvrdi_termin", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ termin, authToken })
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message);
      return;
    }

    toast.success("Potvrdili ste termin.");
    fetchData();
  };

  function formatirajDatum(datum) {
    if (!datum) return '';
    try {
      // Ako je format sa vremenom (2026-03-19T10:00), uzmi samo datum
      const datumStr = datum.split('T')[0];
      const [godina, mesec, dan] = datumStr.split('-');
      return `${dan}.${mesec}.${godina}`;
    } catch (e) {
      return datum;
    }
  }
  function formatirajTimestamp(timestamp) {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return timestamp; // Ako ne mogu da parsniram, vrati original
      }
      const dan = String(date.getDate()).padStart(2, '0');
      const mesec = String(date.getMonth() + 1).padStart(2, '0');
      const godina = date.getFullYear();
      const sati = String(date.getHours()).padStart(2, '0');
      const minuti = String(date.getMinutes()).padStart(2, '0');
      return `${dan}.${mesec}.${godina} ${sati}:${minuti}`;
    } catch (e) {
      return timestamp;
    }
  }


  useEffect(() => {
    let normalized = normalizeData(desavanjaData);
    let mapped = normalized.map(event => ({
      ...event,
      ime_firme: event.ime_lokacije || event.lokacija?.ime || '-',
      datum: event.datum_rezervacije || event.datum
    }));
    let sortirano = [...mapped];

    if (sortKey) {
      sortirano.sort((a, b) => {
        let valA = a[sortKey];
        let valB = b[sortKey];

        // Ako je datum, obradi posebno
        if (sortKey === 'datum') {
          valA = new Date(valA);
          valB = new Date(valB);
        } else if (sortKey === 'ime_firme') {
          valA = a.ime_firme || '';
          valB = b.ime_firme || '';
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    } else {
      // Defaultno po ID
      sortirano.sort((a, b) => b.id - a.id);
    }

    setDesavanja(sortirano);
  }, [desavanjaData, sortKey, sortOrder]);

  function handleSort(key) {
    if (sortKey === key) {
      // Ako opet klikneš na isto polje obrni redosled
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  }

  const filtriranaDesavanja = desavanja.filter(event => {
    let statusOk = true;
    let datumOk = true;
    let lokacijaOk = true;
    let createdOk = true;

    // Filtriranje po statusu
    if (statusFilter === 'nije_potvrdjen') {
      statusOk = event.potvrdio === null && !event.otkazano;
    } else if (statusFilter === 'potvrdjen') {
      statusOk = event.potvrdio !== null && event.potvrdio !== 0 && !event.otkazano;
    } else if (statusFilter === 'otkazan') {
      statusOk = event.otkazano;
    }

    // Filtriranje po datumu (koristi datum ili datum_rezervacije)
    const eventDatum = event.datum || event.datum_rezervacije;
    if (dateFrom && eventDatum) {
      datumOk = eventDatum >= dateFrom;
    }
    if (datumOk && dateTo && eventDatum) {
      datumOk = eventDatum <= dateTo;
    }

    // Filtriranje po lokaciji
    if (lokacijaFilter) {
      const eventLokacija = event.ime_firme || event.ime_lokacije || event.lokacija?.ime;
      lokacijaOk = String(eventLokacija) === lokacijaFilter;
    }

    // Created_at filter - parsira HTTP datum format (Wed, 25 Mar 2026 17:46:31 GMT)
    let createdDate = '';
    if (event.created_at) {
      try {
        const d = new Date(event.created_at);
        if (!isNaN(d.getTime())) {
          createdDate = d.toISOString().split('T')[0];
        }
      } catch (e) {
        createdDate = '';
      }
    }
    if (createdFrom && createdDate && createdDate < createdFrom) createdOk = false;
    if (createdTo && createdDate && createdDate > createdTo) createdOk = false;


    return statusOk && datumOk && lokacijaOk && createdOk;
  });
  // Helper da konvertuješ string yyyy-mm-dd u Date objekat (koristi lokalno vreme, ne UTC)
  const toDate = (str) => {
    if (!str) return null;
    const [year, month, day] = str.split('-');
    return new Date(year, month - 1, day);
  };
  
  // Helper da konvertuješ Date u string yyyy-mm-dd (koristi lokalno vreme, ne UTC)
  const toString = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };



  useEffect(() => {
    setStatusFilter('');
    setLokacijaFilter('');
    setDateFrom('');
    setDateTo('');
    setCreatedFrom('');
    setCreatedTo('');
  }, [resetFiltersKey]);

  return (
    <div className={`${styles.tabelaWrapper} ${dashboard && styles.dashboard}`}>
      <ToastContainer />
      <div className={`${styles.filters} ${showFilters ? styles.open : ''}`}>
        <label>
          Status:
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">Svi</option>
            <option value="nije_potvrdjen">Nije potvrđen</option>
            <option value="potvrdjen">Potvrđen</option>
            <option value="otkazan">Otkazan</option>
          </select>
        </label>

        {rola === "1" && (
          <label>
            Lokacija:
            <select value={lokacijaFilter} onChange={e => setLokacijaFilter(e.target.value)}>
              <option value="">Sve</option>
              {Array.isArray(desavanja) && [...new Set(desavanja.map(d => d.ime_firme))]
                .filter(id => id !== null && id !== undefined && id !== '-')
                .map(id => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
            </select>
          </label>
        )}

        
        <label>
          Datum termina (od):
          <div className={styles.datePickerWrapper}>
            <DatePicker
              selected={toDate(dateFrom)}
              onChange={(date) => setDateFrom(toString(date))}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
            />
            {dateFrom && (
              <button 
                type="button"
                className={styles.clearBtn} 
                onClick={() => setDateFrom('')}
                title="Obriši datum"
              >
                ✕
              </button>
            )}
          </div>
        </label>

        <label>
          Datum termina (do):
          <div className={styles.datePickerWrapper}>
            <DatePicker
              selected={toDate(dateTo)}
              onChange={(date) => setDateTo(toString(date))}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
            />
            {dateTo && (
              <button 
                type="button"
                className={styles.clearBtn} 
                onClick={() => setDateTo('')}
                title="Obriši datum"
              >
                ✕
              </button>
            )}
          </div>
        </label>

        <label>
          Datum zakazivanja (od):
          <div className={styles.datePickerWrapper}>
            <DatePicker
              selected={toDate(createdFrom)}
              onChange={(date) => setCreatedFrom(toString(date))}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
            />
            {createdFrom && (
              <button 
                type="button"
                className={styles.clearBtn} 
                onClick={() => setCreatedFrom('')}
                title="Obriši datum"
              >
                ✕
              </button>
            )}
          </div>
        </label>

        <label>
          Datum zakazivanja (do):
          <div className={styles.datePickerWrapper}>
            <DatePicker
              selected={toDate(createdTo)}
              onChange={(date) => setCreatedTo(toString(date))}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
            />
            {createdTo && (
              <button 
                type="button"
                className={styles.clearBtn} 
                onClick={() => setCreatedTo('')}
                title="Obriši datum"
              >
                ✕
              </button>
            )}
          </div>
        </label>
      </div>

      {loading ? (
        <p>Učitavanje...</p>
      ) : desavanjaData.length === 0 ? (
        <p>Nema zakazanih termina.</p>
      ) : (
        <table className={`${styles.tabela} ${showFilters ? styles.open : ''}`}>
          <thead>
            <tr>
              {rola === "1" && (
                <th onClick={() => handleSort('ime_firme')}>
                  Lokacija{sortKey === 'ime_firme' && (sortOrder === 'asc' ? '▲' : '▼')}
                </th>
              )}
              <th onClick={() => handleSort('created_at')}>
                Zakazano{sortKey === 'created_at' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('ime')}>
                Ime{sortKey === 'ime' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('datum')}>
                Datum{sortKey === 'datum' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('vreme_rezervacije')}>
                Vreme{sortKey === 'vreme_rezervacije' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th style={{cursor:'default'}}>
                Usluga{sortKey === 'cenovnik' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th style={{cursor:'default'}}>
                Telefon{sortKey === 'telefon' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('email')}>
                Email{sortKey === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th style={{cursor:'default'}}>Status</th>

            </tr>
          </thead>
          <tbody>
            {filtriranaDesavanja.map((event, idx) => (
              <tr key={idx} style={{cursor:'pointer'}} onClick={() => izmeniTermin(event)}>
                {rola === "1" && (
                  <td>{event.ime_firme || '-'}</td>
                )}
                <td>{formatirajTimestamp(event.created_at) || formatirajTimestamp(event.datum_rezervacije)}</td>
                <td>{event.ime || '-'}</td>
                <td>{formatirajDatum(event.datum || event.datum_rezervacije)}</td>
                <td>{event.vreme_rezervacije || '-'}</td>
                <td>{event.usluga?.usluga || '-'}</td>
                <td>
                  {event.telefon ? (
                    <a href={`tel:${event.telefon}`} style={{ color: "#3b82f6" }}>
                      {event.telefon}
                    </a>
                  ) : '-'}
                </td>
                <td>
                  {event.email ? (
                    <a href={`mailto:${event.email}`} style={{ color: "#3b82f6" }}>
                      {event.email}
                    </a>
                  ) : '-'}
                </td>
                <td>
                  {event.otkazano ? (
                    <p style={{color: 'red'}}>Termin je otkazan.</p>
                  ) : event.potvrdio === null || event.potvrdio === null ? (
                    <button
                      className={styles.btn}
                      onClick={e => {
                        e.stopPropagation();
                        potvrdiTermin(event);
                      }}
                    >
                      Potvrdi
                    </button>
                  ) : (
                    <p><strong>Potvrdio: </strong>{event.potvrdio_user?.username || `ID ${event.potvrdio}`}</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}