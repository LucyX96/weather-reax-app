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
    if (globalThis.window?.Capacitor?.Plugins?.Storage) {
      // Mobile: usa Capacitor Storage
      await globalThis.window.Capacitor.Plugins.Storage.set({ key: CACHE_KEY_PREFIX + key, value });
    } else {
      // Web: localStorage
      localStorage.setItem(CACHE_KEY_PREFIX + key, value);
    }
  } catch (e) {
    console.warn('Errore nel salvare in cache:', e);
  }
}

// Funzione per recuperare dati dalla cache se validi
async function getCache(key) {
  try {
    let itemStr;
    if (globalThis.window?.Capacitor?.Plugins?.Storage) {
      // Mobile
      const { value } = await globalThis.window.Capacitor.Plugins.Storage.get({ key: CACHE_KEY_PREFIX + key });
      itemStr = value;
    } else {
      // Web
      itemStr = localStorage.getItem(CACHE_KEY_PREFIX + key);
    }
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
    if (globalThis.window?.Capacitor?.Plugins?.Storage) {
      await globalThis.window.Capacitor.Plugins.Storage.remove({ key: CACHE_KEY_PREFIX + key });
    } else {
      localStorage.removeItem(CACHE_KEY_PREFIX + key);
    }
  } catch (e) {
    console.warn('Errore nel rimuovere dalla cache:', e);
  }
}

export { setCache, getCache, removeCache };