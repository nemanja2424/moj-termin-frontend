"use client";
import { useEffect, useState, useRef } from "react";
import styles from "./aiInfo.module.css";

export default function AiInfoPage() {
  const [aiInfo, setAiInfo] = useState(null);
  const [dailyUsage, setDailyUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [selectedModel, setSelectedModel] = useState("default");
  const [savingModel, setSavingModel] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(true);

  useEffect(() => {
    // Preuzmi korisničke podatke iz localStorage
    const storedRole = localStorage.getItem("rola");
    const userId = localStorage.getItem("userId");
    const authToken = localStorage.getItem("authToken")

    setUserRole(parseInt(storedRole));
    setUserId(userId);

    const fetchData = async () => {
      try {
        // Fetch AI info iz Xano
        const aiInfoResponse = await fetch(
            `https://test.mojtermin.site/api/ai/info/${userId}`,
            {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            }
        );

        if (!aiInfoResponse.ok) {
          throw new Error("Greška pri učitavanju AI info");
        }

        const aiInfoData = await aiInfoResponse.json();
        setAiInfo(aiInfoData);
        // Čita llm-switch iz ai_info objekta
        const llmSwitch = aiInfoData.ai_info?.["llm-switch"] || "default";
        setSelectedModel(llmSwitch);

        // Fetch dnevne podatke o korišćenju
        const today = new Date().toISOString().split("T")[0];
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://test.mojtermin.site';
        const dailyUsageResponse = await fetch(
          `${apiUrl}/api/aiUsage?owner_id=${userId}&date=${today}`
        );

        const dailyUsageData = await dailyUsageResponse.json();
        setDailyUsage(dailyUsageData);

        // Mesečni podaci se ne učitavaju - samo prikazujemo procenu
      } catch (err) {
        console.error("Greška pri učitavanju podataka:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingScreen(false);
      }
    };

    fetchData();
  }, []);

  const handleModelChange = async (newModel) => {
    setSelectedModel(newModel);
    setSavingModel(true);

    try {
      // Dohvati authToken iz localStorage
      const authToken = localStorage.getItem("authToken");
      
      // Kreiraj kopiju ai_info sa novom vrednostima llm-switch
      const updatedAiInfo = {
        ...aiInfo.ai_info,
        "llm-switch": newModel,
      };

      const response = await fetch(
        `https://test.mojtermin.site/api/ai/info/${userId}`,
        {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({
            ai_info: updatedAiInfo,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Greška pri čuvanju preference");
      }

      console.log("✅ Preferenca modela uspešno sačuvana");
    } catch (err) {
      console.error("Greška pri čuvanju preference:", err);
      setError("Greška pri čuvanju preference modela");
      // Vrati na prethodnu vrednost
      const previousModel = aiInfo.ai_info?.["llm-switch"] || "default";
      setSelectedModel(previousModel);
    } finally {
      setSavingModel(false);
    }
  };

  const ProgressBar = ({ current, limit, label }) => {
    const percentage = limit > 0 ? (current / limit) * 100 : 0;
    const colorClass =
      percentage < 25 ? styles.low : percentage < 75 ? styles.medium : styles.high;

    return (
      <div className={styles.progressSection}>
        <div className={styles.progressLabel}>
          <span>{label}</span>
          <span className={styles.progressCount}>
            {current} / {limit}
          </span>
        </div>
        <div className={styles.progressBarContainer}>
          <div
            className={`${styles.progressBar} ${colorClass}`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
        <div className={styles.percentage}>{Math.round(percentage)}%</div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className={`${styles.loadingScreen} ${loadingScreen ? '' : styles.ucitano}`}>
        <span className="spinner"></span>
      </div>
    );
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  if (!aiInfo) {
    return <div className={styles.container}>AI info nije pronađen</div>;
  }

  const isOwner = userRole === 1;
  // Čita limits iz ugježdene ai_info strukture
  const limits = aiInfo.ai_info?.limits || aiInfo.limits || {};
  const paket = aiInfo.paket || "Nepoznat";
  // Ako nema paketa, korisnik je zaposlenik
  const isEmployee = !aiInfo.paket;
  
  // Helper funkcija da filtrira modele sa limit > 0
  const getActiveModels = (userLimits) => {
    if (!userLimits) return {};
    return Object.entries(userLimits)
      .filter(([key, value]) => key !== "llm-switch" && value > 0)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  };

  // Mapiranje imena modela sa srpskim naziva
  const getModelLabel = (modelName) => {
    const labels = {
      "GPT-OSS20B": "GPT-OSS 20B",
      "Mistral-24b": "Mistral 24B",
      "Qwen-3.5": "Qwen 3.5",
      "llama4": "Llama 4 Maverick"
    };
    return labels[modelName] || modelName;
  };
  
  const todayUsage = dailyUsage || {
    owner: {},
    employees: {},
    bookings: {},
  };

  return (
    <div className={styles.container}>
      {/* Status Box */}
      <div className={styles.statusBox}>
        <h1>📊 AI ASISTENT STATUS</h1>
        <div className={styles.statusContent}>
          <div className={styles.statusItem}>
            <span>Status:</span>
            <strong className={styles.statusAvailable}>✅ DOSTUPNO</strong>
          </div>

          <div className={styles.statusItem}>
            <span>Vreme:</span>
            <strong>{new Date().toLocaleDateString("sr-RS")} {new Date().toLocaleTimeString("sr-RS")}</strong>
          </div>

          <div className={styles.statusItem}>
            <span>AI verzija:</span>
            <strong>MT 1.5 agent (beta)</strong>
          </div>
        </div>
      </div>

      {/* Dnevni Limit */}
      {isOwner && (
        <div className={styles.card}>
          <h2>📅 OGRANIČENJA</h2>
          {/* Vlasnik */}
          {Object.keys(getActiveModels(limits.owner)).length > 0 ? (
            <div className={styles.userGroup}>
              <h4 className={styles.groupTitle}>👤 Vlasnik</h4>
              {Object.entries(getActiveModels(limits.owner)).map(([model, limit]) => (
                <div key={model} className={styles.modelSection}>
                  <ProgressBar
                    current={todayUsage.owner?.[model] || 0}
                    limit={limit}
                    label={getModelLabel(model)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.userGroup}>
              <h4 className={styles.groupTitle}>👤 Vlasnik</h4>
                <p>
                  Trenutno nemate dostupna pitanja za korišćenje. <br />
                  Za više informacija, kontaktirajte nas na <a href="mailto:info@mojtermin.site">info@mojtermin.site</a>
                </p>
            </div>
          )}

          {/* Zaposleni */}
          {Object.keys(getActiveModels(limits.employees)).length > 0 ? (
            <div className={styles.userGroup}>
              <h4 className={styles.groupTitle}>👥 Zaposleni</h4>
              {Object.entries(getActiveModels(limits.employees)).map(([model, limit]) => (
                <div key={model} className={styles.modelSection}>
                  <ProgressBar
                    current={todayUsage.employees?.[model] || 0}
                    limit={limit}
                    label={getModelLabel(model)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.userGroup}>
              <h4 className={styles.groupTitle}>👥 Zaposleni</h4>
                <p>
                  Trenutno nemate dostupna pitanja za zaposlene. <br />
                  Za više informacija, kontaktirajte nas na <a href="mailto:info@mojtermin.site">info@mojtermin.site</a>
                </p>
            </div>
          )}

          {/* Klijenti */}
          {Object.keys(getActiveModels(limits.bookings)).length > 0 ? (
            <div className={styles.userGroup}>
              <h4 className={styles.groupTitle}>🛒 Klijenti</h4>
              {Object.entries(getActiveModels(limits.bookings)).map(([model, limit]) => (
                <div key={model} className={styles.modelSection}>
                  <ProgressBar
                    current={todayUsage.bookings?.[model] || 0}
                    limit={limit}
                    label={getModelLabel(model)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.userGroup}>
              <h4 className={styles.groupTitle}>🛒 Klijenti</h4>
                <p>
                  Trenutno nemate dostupna pitanja za klijente. <br />
                  Za više informacija, kontaktirajte nas na <a href="mailto:info@mojtermin.site">info@mojtermin.site</a>
                </p>
            </div>
          )}
        </div>
      )}      

      {/* Model Preference & Assistant Info */}
      {isOwner && (
        <div className={styles.card}>
          {/* PREFERENCIJA MODELA */}
          <h2>🤖 PREFERENCIJA MODELA</h2>

          <div className={styles.preferenceContent}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="llmSwitch"
                value="default"
                checked={selectedModel === "default"}
                onChange={() => handleModelChange("default")}
                disabled={savingModel}
              />
              <span>Automatski izbor (preporučeno)</span>
            </label>

            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="llmSwitch"
                value="jeftin"
                checked={selectedModel === "jeftin"}
                onChange={() => handleModelChange("jeftin")}
                disabled={savingModel}
              />
              <span>Prioritet: Osnovni model</span>
            </label>

            {savingModel && <p className={styles.savingText}>Čuvanje preferencije...</p>}
          </div>

          <div className={styles.info}>
            <strong>ℹ️ Kako funkcioniše:</strong>
            <ul>
              <li>
                <strong>Automatski izbor:</strong> Aplikacija koristi prvo naprednije modele dostupne u vašem paketu, kako biste dobili najbolje rezultate.
              </li>
              <li>
                <strong>Prioritet osnovni:</strong> Fokusira se na finansijski efikasne modele, čuvajući napredne modele za kada su zaista potrebni.
              </li>
            </ul>
          </div>

          <div style={{marginTop:'15px', padding:'0px 8px'}}>
            <p>
              Odabrana preferenca se koristi za sve vaše zaposlene i klijente. Svako od njih ima svoja ograničenja.
            </p>
          </div>

          {/* Separator */}
          <div className={styles.divider}></div>

          {/* O ASISTENTU */}
          <h2>ℹ️ O ASISTENTU</h2>

          <div className={styles.assistantInfo}>
            <div className={styles.infoRow}>
              <span>Verzija:</span>
              <strong>MT 1.5 agent (beta)</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Tip:</span>
              <strong>Business Analytics AI</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Dostupnost:</span>
              <strong>24/7</strong>
            </div>

            <div className={styles.separator}></div>

            <div className={styles.infoSection}>
              <h4>Dostupni modeli:</h4>
              <ul>
                <li>
                  <strong>Llama 4 Maverick:</strong> Najnapredniji model za precizne i detaljne odgovore na pitanja klijenata i složene zahteve.
                </li>
                <li>
                  <strong>Qwen 3.5:</strong> Efikasan model koji brzo generiše kvalitetne odgovore i štedi resurse.
                </li>
                <li>
                  <strong>GPT-OSS 20B:</strong> Pouzdan model za standardne odgovore i svakodnevnu komunikaciju sa klijentima.
                </li>
              </ul>
            </div>

            <div className={styles.infoSection}>
              <h4>Mogućnosti:</h4>
              <ul>
                <li>✓ Analiza termina</li>
                <li>✓ Preporuke optimizacije</li>
                <li>✓ Grafici i vizuelizacija</li>
                <li>✓ Upravljanje terminima</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {!isOwner && (
        <div className={styles.card}>
          <h2>ℹ️ O ASISTENTU</h2>

          <div className={styles.assistantInfo}>
            <div className={styles.infoRow}>
              <span>Verzija:</span>
              <strong>MT 1.5 agent (beta)</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Tip:</span>
              <strong>Business Analytics AI</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Dostupnost:</span>
              <strong>24/7</strong>
            </div>

            <div className={styles.separator}></div>

            <div className={styles.infoSection}>
              <h4>Dostupni modeli:</h4>
              <ul>
                <li>
                  <strong>Llama 4 Maverick:</strong> Najnapredniji model za precizne i detaljne odgovore na pitanja klijenata i složene zahteve.
                </li>
                <li>
                  <strong>Qwen 3.5:</strong> Efikasan model koji brzo generiše kvalitetne odgovore i štedi resurse.
                </li>
                <li>
                  <strong>GPT-OSS 20B:</strong> Pouzdan model za standardne odgovore i svakodnevnu komunikaciju sa klijentima.
                </li>
              </ul>
            </div>

            <div className={styles.infoSection}>
              <h4>Mogućnosti:</h4>
              <ul>
                <li>✓ Analiza termina</li>
                <li>✓ Preporuke optimizacije</li>
                <li>✓ Financijski izveštaji</li>
                <li>✓ Grafici i vizuelizacija</li>
                <li>✓ Upravljanje terminima</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
