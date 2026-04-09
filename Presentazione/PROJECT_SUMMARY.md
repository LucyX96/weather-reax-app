# 🌦️ Weather App - Riassunto Progetto

## Descrizione Applicazione

La **Weather App** è un'applicazione web moderna per la ricerca e visualizzazione di dati meteorologici in tempo reale. L'app consente agli utenti di cercare il meteo in qualsiasi città del mondo, visualizzare previsioni orarie e a 5 giorni, confrontare le condizioni tra più città simultaneamente, e accedere ai dati anche in modalità offline tramite caching intelligente.

### Tecnologie Utilizzate
- **Frontend:** React 19, Vite, Axios, Vitest, React Testing Library
- **Backend:** Express.js, Helmet, CORS, Morgan, express-validator
- **API Esterne:** Open-Meteo (geocoding e previsioni meteo)
- **Storage:** LocalStorage con TTL (1 ora)

---

## Principali Funzionalità

### 1. **Ricerca e Geocoding**
- Ricerca rapida di città con validazione real-time
- Conversione indirizzo geografico → coordinate (latitudine/longitudine)
- Sanitizzazione input per sicurezza XSS

### 2. **Visualizzazione Dati Meteo**
- **Meteo Corrente:** Temperatura, velocità vento, direzione, umidità
- **Previsioni Orarie:** 12 ore di forecast con temperatura e precipitazioni
- **Previsioni 5 Giorni:** Temperature min/max giornaliere
- **Confronto Città:** Visualizzazione simultanea del meteo di più città

### 3. **Modalità Offline**
- Caching con TTL (validità 1 ora)
- Recupero dati dalla cache quando offline
- Notifica esplicita della modalità offline

### 4. **Architettura di Sicurezza**
- **Backend Proxy:** API Key gestita lato server, mai esposta al client
- **Sanitizzazione:** Input validation e output encoding
- **Gestione Errori:** Normalizzazione globale degli errori
- **Retry Logic:** Tentativi automatici con backoff esponenziale (timeout 25s)
- **Consenso Geolocalizzazione:** Richiesta esplicita per GDPR compliance

---

## Utilizzo dell'IA nel Progetto

### Fase 1: Pianificazione e Requisiti
Ho utilizzato ChatGPT per:
- Definire le architetture di sicurezza più idonee
- Pianificare la struttura delle cartelle e la separazione delle responsabilità
- Identificare vulnerabilità comuni e best practices per app meteo

### Fase 2: Generazione Codice
L'IA ha generato:
- Struttura di base per servizi (ApiClient, WeatherService, CacheService)
- Componenti React con PropTypes validation
- Route backend con validazione express-validator
- Test suite completa (SecurityUtils, CacheService, useWeather)

### Fase 3: Debugging e Risoluzione Problemi
Ho usato l'IA per:
- **Risoluzione Mock Axios:** Quando i test fallivano con "Cannot read properties of undefined", l'IA mi ha guidato a capire che il mock doveva restituire `{ request: {} }` per simulare un errore di rete
- **Retry Logic:** L'IA ha applicato correttamente `buildApiError()` nel retry per garantire che gli errori fossero sempre normalizzati
- **Gestione Cache TTL:** Ha implementato logica per verificare scadenza e ripulire automaticamente i dati scaduti

### Fase 4: Miglioramenti di Sicurezza
L'IA ha suggerito e implementato:
- Regex sanitizzazione per input (solo caratteri alfabetici, spazi, trattini, apostrofi)
- Header sanitization per prevenire CRLF injection
- Timeout request (25 secondi) per prevenire DoS
- Validazione coordinate geografiche (-90/+90 lat, -180/+180 lon)

---

## Cosa Ho Imparato

1. **Importanza del Proxy Backend:** Gestire API Key lato server è fondamentale per sicurezza. Il frontend non dovrebbe mai esporre credenziali.

2. **Mock Testing Challenge:** Capire quando e come mockare servizi complessi (Axios, localStorage) richiede pianificazione attenta delle interfacce.

3. **Error Boundary + Error Interceptor Synergy:** Combinare React ErrorBoundary con un Error Interceptor centralizzato crea UX robusta.

4. **TTL Caching Pattern:** Implementare cache intelligente con scadenza automatica riduce significativamente le richieste API.

---

## Sfide Affrontate

- **Sincronizzazione Mock:** I test inizialmente fallivano perché il mock non restituiva la struttura corretta dell'errore Axios
- **Gestione Stato Offline:** Combinare validità cache con stato `navigator.onLine` richiede logica attenta
- **Validazione Coordinate:** Distinguere tra input "non numerico" e "fuori range" per errori specifici

---

## Cosa Mi Ha Orgogliosamente Sorpreso

La **gestione della sicurezza a 360 gradi:** dall'API Key backend-only, alla sanitizzazione input, al caching sicuro con TTL fino al consenso esplicito. L'app non è solo funzionale, ma anche **production-ready dal punto di vista della conformità legale** (GDPR, gestione dati sensibili).

---

## Miglioramenti Futuri

Se avessi più tempo, implementerei:

1. **Autenticazione Opzionale:** Salvare "città preferite" per utenti registrati
2. **Mappe Interattive:** Integrazione Leaflet per visualizzare localizzazione su mappa
3. **Notifiche Meteo:** Sistema di allerte per condizioni meteo critiche
4. **Dark Mode Avanzato:** Toggle tema gestito in localStorage
5. **Packaging PWA:** Service Worker per full offline capability e installabilità

---

**Conclusione:** Questo progetto dimostra come **intelligenza artificiale, sicurezza, e buone pratiche di sviluppo** possono coesistere naturalmente in un'applicazione moderna, grazie a una architettura data-driven e rigorosa separazione dei concerns.
