import { sanitize as _sanitize, sanitizeHeaders as _sanitizeHeaders } from '../services/helpers';

export function sanitizeInput(value) {
  return _sanitize(value);
}

export function isValidCityName(value) {
  const sanitized = sanitizeInput(value);
  return sanitized.length > 0 && sanitized.length <= 100;
}

export function sanitizeHeaders(headers = {}) {
  return _sanitizeHeaders(headers);
}

const CONSENT_KEY = 'weather_app_geolocation_consent';

export function requestGeolocationConsent() {
  const granted = globalThis.confirm(
    'Vuoi consentire l\'utilizzo della geolocalizzazione per ottenere previsioni meteo più accurate?'
  );
  globalThis.localStorage.setItem(CONSENT_KEY, JSON.stringify({ granted, timestamp: Date.now() }));
  return granted;
}

export function hasGeolocationConsent() {
  try {
    const stored = globalThis.localStorage.getItem(CONSENT_KEY);
    if (!stored) {
      return false;
    }
    const { granted } = JSON.parse(stored);
    return Boolean(granted);
  } catch (error) {
    console.error('Errore durante il controllo del consenso geolocalizzazione:', error);
    return false;
  }
}

export function getAuthToken() {
  // In this app no auth token is stored, but this helper centralizes token usage.
  return null;
}
