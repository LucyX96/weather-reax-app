// Shared helpers and lightweight service classes
export class StorageService {
  static async set(key, value) {
    const v = typeof value === 'string' ? value : JSON.stringify(value);
    if (globalThis?.window?.Capacitor?.Plugins?.Storage) {
      await globalThis.window.Capacitor.Plugins.Storage.set({ key, value: v });
    } else {
      globalThis.localStorage.setItem(key, v);
    }
  }

  static async get(key) {
    if (globalThis?.window?.Capacitor?.Plugins?.Storage) {
      const { value } = await globalThis.window.Capacitor.Plugins.Storage.get({ key });
      return value;
    }
    return globalThis.localStorage.getItem(key);
  }

  static async remove(key) {
    if (globalThis?.window?.Capacitor?.Plugins?.Storage) {
      await globalThis.window.Capacitor.Plugins.Storage.remove({ key });
    } else {
      globalThis.localStorage.removeItem(key);
    }
  }
}

export const formatOrNA = (value, unit = '') => {
  if (value == null) return 'N/A';
  return `${value}${unit ? ' ' + unit : ''}`;
};

export const isValidNumber = (value) => {
  return !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(Number.parseFloat(value));
};

export const sanitize = (value) => {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replaceAll(/<[^>]*>/g, '')
    .replaceAll(/[^a-zA-ZÀ-ÿ0-9 ,'-]/g, '')
    .replaceAll(/\s{2,}/g, ' ');
};

export const sanitizeHeaders = (headers = {}) => {
  const safeHeaders = {};
  Object.entries(headers).forEach(([key, value]) => {
    if (typeof value === 'string') {
      safeHeaders[key] = value.replaceAll(/[\r\n]/g, '');
    }
  });
  return safeHeaders;
};

export function parseCommaSeparatedValues(value) {
  return String(value || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}
