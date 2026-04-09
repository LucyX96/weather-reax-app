require('dotenv').config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { query, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Middleware per gestire errori di validazione
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Dati di input non validi", details: errors.array() });
  }
  next();
};

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const WEATHER_API_URL = process.env.WEATHER_API_URL || 'https://api.open-meteo.com';
const WEATHER_GEOCODE_URL = process.env.WEATHER_GEOCODE_URL || 'https://geocoding-api.open-meteo.com';

function buildExternalUrl(base, path, params = {}) {
  const url = new URL(`${base}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

function buildFetchOptions(signal) {
  const headers = {
    'Accept': 'application/json',
  };
  if (WEATHER_API_KEY) {
    headers['X-API-Key'] = WEATHER_API_KEY;
  }
  return { signal, headers };
}

// Route geocoding con validazione
app.get("/api/geocode", [
  query('q').isString().isLength({ min: 1, max: 100 }).withMessage('Il parametro q deve essere una stringa tra 1 e 100 caratteri').trim().escape()
], handleValidationErrors, async (req, res) => {
  try {
    const q = req.query.q;

    if (!q || q.length > 100) {
      return res.status(400).json({ error: "Parametro q non valido" });
    }

    const url = buildExternalUrl(WEATHER_GEOCODE_URL, '/v1/search', {
      name: q,
      count: 1,
      language: 'it',
      format: 'json',
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, buildFetchOptions(controller.signal));
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Errore API geocoding: ${response.status}`);
    }
    const data = await response.json();

    if (!data || !data.results || data.results.length === 0) {
      return res.status(404).json({ error: "Città non trovata" });
    }

    const place = data.results[0];
    if (!place.name || !place.country || typeof place.latitude !== 'number' || typeof place.longitude !== 'number') {
      return res.status(500).json({ error: "Dati geocoding incompleti dall'API esterna" });
    }

    res.json({
      name: place.name,
      country: place.country,
      latitude: place.latitude,
      longitude: place.longitude,
    });
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error("Timeout geocoding:", error);
      return res.status(504).json({ error: "Timeout nella richiesta geocoding" });
    }
    console.error("Errore geocode:", error);
    res.status(500).json({ error: "Errore interno del server durante il geocoding" });
  }
});

// Route weather con validazione (compatibilità /api/weather)
app.get("/api/weather", [
  query('latitude').isFloat({ min: -90, max: 90 }).withMessage('Latitude deve essere un numero tra -90 e 90'),
  query('longitude').isFloat({ min: -180, max: 180 }).withMessage('Longitude deve essere un numero tra -180 e 180')
], handleValidationErrors, async (req, res) => {
  try {
    const params = {
      latitude: req.query.latitude,
      longitude: req.query.longitude,
      hourly: 'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
      current_weather: 'true',
      timezone: 'auto',
    };

    const url = buildExternalUrl(WEATHER_API_URL, '/v1/forecast', params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, buildFetchOptions(controller.signal));
    clearTimeout(timeoutId);
    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Timeout nella richiesta api/weather' });
    }
    console.error('Errore api/weather:', error);
    res.status(500).json({ error: 'Errore interno nella route api/weather' });
  }
});

// Route /v1/forecast con parametri avanzati
app.get("/v1/forecast", [
  query('latitude').exists().withMessage('latitude è obbligatorio').custom((value) => {
    const coords = value.split(',');
    return coords.every((c) => !isNaN(parseFloat(c)));
  }).withMessage('latitude deve essere numero o lista di numeri'),
  query('longitude').exists().withMessage('longitude è obbligatorio').custom((value) => {
    const coords = value.split(',');
    return coords.every((c) => !isNaN(parseFloat(c)));
  }).withMessage('longitude deve essere numero o lista di numeri'),
], handleValidationErrors, async (req, res) => {
  try {
    const allowed = [
      'latitude','longitude','elevation','hourly','daily','current','current_weather','temperature_unit','wind_speed_unit','precipitation_unit',
      'timeformat','timezone','past_days','forecast_days','forecast_hours','forecast_minutely_15','past_hours','past_minutely_15',
      'start_date','end_date','start_hour','end_hour','start_minutely_15','end_minutely_15','models','cell_selection'
    ];

    const params = {};
    Object.keys(req.query).forEach((key) => {
      if (!allowed.includes(key)) {
        return;
      }

      if (key === 'current') {
        if (req.query[key] && req.query[key] !== 'false' && req.query[key] !== '0') {
          params.current_weather = 'true';
        }
        return;
      }

      if (key === 'current_weather') {
        params.current_weather = req.query[key];
        return;
      }

      params[key] = req.query[key];
    });

    if (!params.hourly && !params.daily && !params.current_weather) {
      params.hourly = 'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m';
      params.daily = 'temperature_2m_max,temperature_2m_min,precipitation_sum';
      params.current_weather = 'true';
    }

    if (!params.timezone) {
      params.timezone = 'auto';
    }

    const url = buildExternalUrl(WEATHER_API_URL, '/v1/forecast', params);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(url, buildFetchOptions(controller.signal));
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: errData?.reason || `Errore API forecast: ${response.status}` });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Timeout forecast:', error);
      return res.status(504).json({ error: 'Timeout nella richiesta forecast' });
    }
    console.error('Errore forecast:', error);
    res.status(500).json({ error: 'Errore interno del server durante il recupero del forecast' });
  }
});

// Middleware di errore globale
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Errore interno del server' });
});

app.listen(PORT, () => {
  console.log(`Backend attivo su http://localhost:${PORT}`);
});