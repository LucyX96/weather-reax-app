# Weather App

Applicazione full-stack per la visualizzazione di previsioni meteo in tempo reale basata su Open-Meteo.

## Panoramica

Weather App è un’applicazione con architettura frontend + backend:

- Frontend: React + Vite  
- Backend: Express.js  
- API esterna: Open-Meteo (nessuna API key richiesta)

L’utente inserisce una città e l’app:
- risolve il nome tramite geocoding  
- recupera i dati meteo tramite backend proxy  
- mostra meteo attuale, orario e previsioni giornaliere  
- gestisce caching, offline e errori  

## Funzionalità

- Ricerca città con input testuale  
- Previsioni attuali (temperatura, umidità, vento, precipitazioni)  
- Previsioni orarie (12 ore)  
- Previsioni a 5 giorni (min/max)  
- Confronto meteo tra più città  
- Caching intelligente (TTL 1 ora)  
- Modalità offline con fallback cache  
- Proxy backend per sicurezza  
- Service layer centralizzato (WeatherService, ApiClient)  
- Sanitizzazione input (XSS / injection)  
- Gestione privacy (no dati sensibili in localStorage)  
- Error handling avanzato (retry + boundary React)  
- Responsive design  

## Struttura del Progetto

```
weather-app/
├── backend/
├── frontend/
├── LICENSE
└── README.md
```

## Installazione

### Prerequisiti

- Node.js >= 16  
- npm o yarn  

## Avvio Rapido

```
git clone https://github.com/yourusername/weather-app.git
cd weather-app
```

## Configurazione Backend

```
cd backend
npm install
cp .env.example .env
```

Esempio `.env`:

```
PORT=3001
WEATHER_API_KEY=
WEATHER_API_URL=https://api.open-meteo.com
WEATHER_GEOCODE_URL=https://geocoding-api.open-meteo.com
```

Avvio:

```
npx cross-env PORT=3001 node server.js
```

## Configurazione Frontend

```
cd ../frontend
npm install
cp .env.example .env
```

`.env`:

```
VITE_API_BASE_URL=http://localhost:3001
```

Avvio:

```
npm run dev
```

## API

- GET /api/geocode?q=<città>  
- GET /v1/forecast?...  

## Test

```
cd frontend
npm run test:run
```

## Sicurezza

- Nessuna API key nel frontend  
- Uso variabili ambiente  
- Sanitizzazione input  

## Licenza

MIT 
