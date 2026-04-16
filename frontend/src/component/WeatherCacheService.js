// WeatherCacheService.js
// Servizio per gestire il caching dei dati meteo
// Compatibile con web (localStorage) e mobile (Capacitor Storage)

const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 ora
const CACHE_KEY_PREFIX = 'weather_cache_';

// Funzione per salvare dati in cache
async function setCache(key, data) {
  const item = {
    data,
    timestamp: Date.now()
  };
  try {
    const value = JSON.stringify(item);
    const { StorageService } = await import('../services/helpers');
    await StorageService.set(CACHE_KEY_PREFIX + key, value);
  } catch (e) {
    console.warn('Errore nel salvare in cache:', e);
  }
}

// Funzione per recuperare dati dalla cache se validi
async function getCache(key) {
  try {
    const { StorageService } = await import('../services/helpers');
    const itemStr = await StorageService.get(CACHE_KEY_PREFIX + key);
    if (!itemStr) return null;
    const item = JSON.parse(itemStr);
    if (Date.now() - item.timestamp > CACHE_EXPIRY_MS) {
      // Rimuovi cache scaduta
      await removeCache(key);
      return null;
    }
    return item.data;
  } catch (e) {
    console.warn('Errore nel recuperare dalla cache:', e);
    return null;
  }
}

// Funzione per rimuovere dalla cache
async function removeCache(key) {
  try {
    const { StorageService } = await import('../services/helpers');
    await StorageService.remove(CACHE_KEY_PREFIX + key);
  } catch (e) {
    console.warn('Errore nel rimuovere dalla cache:', e);
  }
}

export { setCache, getCache, removeCache };