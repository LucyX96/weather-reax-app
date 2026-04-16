const CACHE_PREFIX = 'weather_cache_';
const DEFAULT_TTL = 60 * 60 * 1000; // 1 ora

function buildKey(key) {
  return `${CACHE_PREFIX}${key}`;
}

function isValidCacheItem(item) {
  return Boolean(
    item &&
      typeof item === 'object' &&
      Object.hasOwn(item, 'data') &&
      typeof item.createdAt === 'number' &&
      typeof item.ttl === 'number'
  );
}

function isExpired(item) {
  return Date.now() - item.createdAt > item.ttl;
}

export async function saveCache(key, data, ttl = DEFAULT_TTL) {
  try {
    const item = {
      data,
      createdAt: Date.now(),
      ttl,
    };
    localStorage.setItem(buildKey(key), JSON.stringify(item));
  } catch (error) {
    console.warn('CacheService saveCache fallita:', error);
  }
}

export async function readCache(key) {
  try {
    const raw = localStorage.getItem(buildKey(key));
    if (!raw) {
      return null;
    }

    const item = JSON.parse(raw);

    if (!isValidCacheItem(item)) {
      await clearCache(key);
      return null;
    }

    if (isExpired(item)) {
      await clearCache(key);
      return null;
    }

    return item.data;
  } catch (error) {
    console.warn('CacheService readCache fallita:', error);
    await clearCache(key);
    return null;
  }
}

export async function clearCache(key) {
  try {
    localStorage.removeItem(buildKey(key));
  } catch (error) {
    console.warn('CacheService clearCache fallita:', error);
  }
}

export async function clearAllCache() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k));
  } catch (error) {
    console.warn('CacheService clearAllCache fallita:', error);
  }
}
