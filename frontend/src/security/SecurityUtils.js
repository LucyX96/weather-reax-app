export function sanitizeInput(value) {
  if (typeof value !== 'string') {
    return '';
  }
  return value
    .trim()
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll(/[^a-zA-ZÀ-ÿ0-9 ,\-']/g, '')
    .replaceAll(/\s{2,}/g, ' ');
}

export function isValidCityName(value) {
  const sanitized = sanitizeInput(value);
  return sanitized.length > 0 && sanitized.length <= 100;
}

export function sanitizeHeaders(headers = {}) {
  const safeHeaders = {};
  Object.entries(headers).forEach(([key, value]) => {
    if (typeof value === 'string') {
      safeHeaders[key] = value.replaceAll(/[\r\n]/g, '');
    }
  });
  return safeHeaders;
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
