# 🌦️ Weather App — Architettura e Configurazione

Applicazione **full-stack** per la visualizzazione di previsioni meteo in tempo reale.

- **Frontend:** React + Vite  
- **Backend:** Express.js  
- **API esterna:** Open-Meteo (nessuna API key richiesta)

---

## ✨ Caratteristiche

- **Ricerca Città:** Inserisci il nome di una città per ottenere previsioni accurate.
- **Previsioni Attuali:** Temperatura, umidità, velocità vento, direzione vento e precipitazioni correnti.
- **Previsioni Orarie:** Dettagli orari per le prossime 12 ore.
- **Previsioni a 5 Giorni:** Temperature minime e massime giornaliere.
- **Confronto Città:** Confronta il meteo corrente di più città contemporaneamente.
- **Caching Intelligente:** Memorizzazione locale dei dati con scadenza di 1 ora e validazione del formato.
- **Modalità Offline:** Utilizzo automatico dei dati dalla cache quando la connessione è assente.
- **Proxy Sicuro Backend:** Le chiamate API passano dal backend, così la chiave rimane nascosta nel file `.env`.
- **Service Layer Centralizzato:** `WeatherService` e `ApiClient` gestiscono error handling, timeout e retry.
- **Sanitizzazione Input:** Filtraggio lato client per ridurre rischi XSS / injection.
- **Handling Privacy:** Nessuna informazione sensibile salvata in localStorage e supporto a consenso geolocalizzazione.
- **Gestione Errori:** Boundary React e wrapper errori per risposte leggibili.
- **Responsive Design:** Ottimizzato per dispositivi mobili e desktop con UI moderna.

---

## 📁 Struttura del Progetto
weather-app/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── .env.example
│   ├── src/
│   │   ├── component/
│   │   ├── services/
│   │   ├── interceptors/
│   │   ├── security/
│   │   ├── models/
│   │   └── test/
│   └── public/
└── README.md
weather-app/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── src/
│   │   ├── component/
│   │   └── test/
│   └── public/
└── README.md

---

## 🚀 Installazione e Configurazione

### Prerequisiti
- **Node.js** (versione 16 o superiore)
- **npm** o **yarn**
- Connessione internet per le API esterne

### 1. Clonare il Repository
```bash
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

### 2. Configurazione Backend
```bash
cd backend
npm install
```

#### Variabili d'Ambiente
Copia l'esempio e salva i valori sensibili in `backend/.env`:
```
cp .env.example .env
```

Esempio di variabili:
```
PORT=3001
WEATHER_API_KEY=
WEATHER_API_URL=https://api.open-meteo.com
WEATHER_GEOCODE_URL=https://geocoding-api.open-meteo.com
```

> Non inserire chiavi API direttamente nel codice frontend.

#### Avviare il Backend
```bash
# Per compatibilità cross-platform:
npx cross-env PORT=3001 node server.js

# Oppure direttamente:
PORT=3001 node server.js
```

Il backend sarà disponibile su: `http://localhost:3001/`

### 3. Configurazione Frontend
```bash
cd ../frontend
npm install
```

#### Variabili d'Ambiente Frontend
Copia l'esempio nella cartella frontend:
```
cp .env.example .env
```

Il file `frontend/.env` può contenere:
```
VITE_API_BASE_URL=http://localhost:3001
```

#### Avviare il Frontend
```bash
npm run dev
```

Il frontend sarà disponibile su: `http://localhost:5173/` (o porta successiva se occupata, es. 5174, 5175)

### 4. Verifica Installazione
- Apri il browser e vai su `http://localhost:5173/`
- Inserisci una città (es. "Roma") e verifica che appaiano i dati meteo
- Controlla la console del browser per eventuali errori

---

## 🛠️ Uso

1. **Ricerca Città:** Inserisci il nome di una città nel campo di ricerca.
2. **Visualizzazione Dati:** Vengono mostrati temperatura attuale, umidità, vento, precipitazioni e previsioni orarie.
3. **Previsioni a 5 Giorni:** Scorri per vedere le temperature min/max giornaliere.
4. **Confronto Città:** Nella sezione "Confronto Meteo tra Città", inserisci più città separate da virgola per confrontarle.
5. **Caching Automatico:** I dati vengono salvati localmente per 1 ora.
6. **Modalità Offline:** Se la connessione cade, l'app usa i dati dalla cache se disponibili.

### API Endpoints (Backend)
- `GET /api/geocode?q=<città>` - Geocoding per coordinate
- `GET /v1/forecast?latitude=...&longitude=...&hourly=...&current_weather=true` - Previsioni correnti dettagliate
- `GET /v1/forecast?latitude=...&longitude=...&daily=...&forecast_days=5` - Previsioni a 5 giorni
- `GET /api/weather?latitude=...&longitude=...` - Compatibilità legacy

---

## 🔐 Sicurezza e Best Practice
- Non hardcodare chiavi API nel codice frontend.
- Usa variabili d'ambiente in backend e un proxy sicuro per l'accesso alle API esterne.
- Le librerie terze parti devono avere licenze compatibili: preferisci **MIT** o **Apache 2.0**.
- Evita librerie GPL se l'app non è completamente open source.
- Sanitizza input utente prima di inviarlo al backend.
- Memorizza solo dati non sensibili in `localStorage` (meteo e cache TTL), non dati personali.
- Se aggiungi geolocalizzazione, richiedi consenso esplicito e non salvare coordinate in chiaro senza motivo.

### Esempio backend Spring Boot per proteggere la API key
```java
@RestController
@RequestMapping("/api")
public class WeatherProxyController {

    @Value("${weather.api.key}")
    private String weatherApiKey;

    @GetMapping("/forecast")
    public ResponseEntity<String> forecast(@RequestParam Map<String,String> params) {
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl("https://api.open-meteo.com/v1/forecast");
        params.forEach(builder::queryParam);

        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", weatherApiKey);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = new RestTemplate().exchange(builder.toUriString(), HttpMethod.GET, entity, String.class);
        return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
    }
}
```

---

## 🧪 Test

### Eseguire i Test Frontend
```bash
cd frontend
npm run test:run
```

### Test Copertura
- Hook `useWeather`: Geocoding, fetch meteo, errori, caching offline
- Componenti: Rendering, props, interazioni
- Error Boundary: Gestione errori React

---

## 🔧 Sviluppo

### Comandi Disponibili
- `npm run dev` - Avvia server di sviluppo
- `npm run build` - Build per produzione
- `npm run preview` - Anteprima build
- `npm run lint` - Controllo ESLint
- `npm run test` - Esegui test

### Aggiungere Nuove Funzionalità
- Modifica componenti in `src/component/`
- Aggiorna test in `src/test/`
- Per API backend, modifica `server.js`

---

## 📚 Tecnologie Utilizzate

- **Frontend:** React 19, Vite, React Router, PropTypes
- **Backend:** Express.js, CORS, Helmet, Morgan, Express Validator
- **Servizi:** WeatherCacheService (localStorage/Capacitor per compatibilità mobile), WeatherService (chiamate API)
- **Test:** Vitest, React Testing Library
- **Styling:** CSS Modules, CSS Variables, Flexbox/Grid
- **API:** Open-Meteo (Geocoding + Forecast)

---

## 🐛 Risoluzione Problemi

### Timeout nelle Richieste API
Se ricevi errori di timeout (es. `DOMException [AbortError]: This operation was aborted` o `ETIMEDOUT`), il timeout è stato aumentato a 30 secondi nel backend. Se persiste, verifica la connessione internet o la disponibilità dell'API Open-Meteo.

### Porta Occupata
Se la porta 5173 è occupata, Vite userà automaticamente la successiva disponibile (es. 5174, 5175).

### Errori di Build o Dipendenze
- Assicurati di avere Node.js >= 16
- Esegui `npm install` in entrambe le cartelle
- Cancella `node_modules` e reinstalla se necessario

### Cache e Dati Offline
I dati sono cachati per 1 ora. Per svuotare la cache, apri la console del browser e esegui `localStorage.clear()`.

### Test Falliti
Esegui `npm run test:run` per verificare. Se falliscono, controlla i mock nei file di test.

---

1. Fork il progetto
2. Crea un branch per la tua feature (`git checkout -b feature/nuova-funzionalità`)
3. Commit le modifiche (`git commit -am 'Aggiungi nuova funzionalità'`)
4. Push al branch (`git push origin feature/nuova-funzionalità`)
5. Apri una Pull Request

---

## 📄 Licenza

Questo progetto è distribuito sotto licenza MIT. Vedi il file `LICENSE` per dettagli.

### 🧭 Utilizzo
Apri l'app nel browser

🧭 Utilizzo
Apri l'app nel browser
Inserisci una città (es: Roma, Milano, London)
Visualizza:
meteo corrente
previsioni orarie

### 📡 Esempi di Utilizzo API
🔎 Geocoding
GET /api/geocode?q=Rome

Risposta:
{
  "name": "Rome",
  "country": "Italy",
  "latitude": 41.9,
  "longitude": 12.5
}

🌤️ Previsioni Meteo
GET /v1/forecast?latitude=41.9&longitude=12.5&current_weather=true

Risposta (semplificata):

{
  "current_weather": {
    "temperature": 22.5,
    "windspeed": 10.2,
    "winddirection": 180
  },
  "hourly": {
    "time": ["2026-04-07T10:00"],
    "temperature_2m": [22.5]
  }
}

⚠️ Gestione Errori

L'app gestisce diversi tipi di errore:

#### Backend

Formato standard:
{
  "error": "Messaggio errore",
  "details": []
}

Errori comuni
400 → input non valido (es: città vuota)
404 → città non trovata
500 → errore server o API esterna

#### Frontend
Messaggi di errore mostrati all’utente
Retry automatico (max 2 tentativi)
Fallback UI tramite ErrorBoundary

🔄 Flusso dei Dati
Input utente → città
/api/geocode → coordinate
/v1/forecast → dati meteo
Rendering UI

### 🛡️ Sicurezza e Validazione
Backend
Validazione input (express-validator)
Sanitizzazione dati
Protezione XSS
Helmet (HTTP headers)

#### Frontend
Validazione input utente (regex)
PropTypes
Error Boundary

### 🧪 Testing
cd frontend
npm test
npm run test:run

Copertura:

Componenti React
Custom hook
Gestione errori
### ⚙️ Configurazione
Variabili d’ambiente

PORT=3001

### 📌 Note Tecniche
Architettura separata frontend/backend
Nessuna API key richiesta (Open-Meteo)
Retry automatico per errori temporanei
Validazione doppio livello

### 📈 Miglioramenti Futuri
Cache (Redis)
Geolocalizzazione utente
Multi-language
Grafici meteo
PWA
