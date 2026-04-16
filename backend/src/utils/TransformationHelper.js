/**
 * TransformationHelper - Centralizes data transformation logic
 * Implements Single Responsibility and DRY principles
 * Handles: object mapping, data formatting, conversion
 */
class TransformationHelper {
  /**
   * Safely extracts and validates object properties
   */
  static extractProperties(obj, keys, defaults = {}) {
    const result = {};
    keys.forEach((key) => {
      result[key] = obj?.[key] ?? defaults[key];
    });
    return result;
  }

  /**
   * Maps object properties with transformation
   */
  static mapObject(obj, mapping) {
    const result = {};
    Object.entries(mapping).forEach(([sourceKey, targetKey]) => {
      if (sourceKey in obj) {
        result[targetKey] = obj[sourceKey];
      }
    });
    return result;
  }

  /**
   * Flattens nested object keys with delimiter
   */
  static flattenObject(obj, prefix = '', delimiter = '_') {
    const flattened = {};
    Object.entries(obj).forEach(([key, value]) => {
      const newKey = prefix ? `${prefix}${delimiter}${key}` : key;
      if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
        Object.assign(flattened, this.flattenObject(value, newKey, delimiter));
      } else {
        flattened[newKey] = value;
      }
    });
    return flattened;
  }

  /**
   * Converts array of objects to map/object keyed by specific property
   */
  static arrayToMap(array, keyProperty) {
    if (!Array.isArray(array)) return {};
    return array.reduce((map, item) => {
      if (item && keyProperty in item) {
        map[item[keyProperty]] = item;
      }
      return map;
    }, {});
  }

  /**
   * Filters object to only include specified keys
   */
  static pickProperties(obj, keys) {
    return keys.reduce((result, key) => {
      if (key in obj) {
        result[key] = obj[key];
      }
      return result;
    }, {});
  }

  /**
   * Removes specified keys from object
   */
  static omitProperties(obj, keys) {
    return Object.entries(obj).reduce((result, [key, value]) => {
      if (!keys.includes(key)) {
        result[key] = value;
      }
      return result;
    }, {});
  }

  /**
   * Safely converts value to number or default
   */
  static toNumber(value, defaultValue = 0) {
    const num = Number.parseFloat(value);
    return Number.isNaN(num) ? defaultValue : num;
  }

  /**
   * Safely converts value to integer or default
   */
  static toInteger(value, defaultValue = 0) {
    const num = Number.parseInt(value, 10);
    return Number.isNaN(num) ? defaultValue : num;
  }

  /**
   * Converts value to boolean
   */
  static toBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      return value.toLowerCase() === 'true' || value === '1';
    }
    return Boolean(value);
  }

  /**
   * Formats a value with fallback for null/undefined
   */
  static formatValue(value, unit = '', fallback = 'N/A') {
    if (value === null || value === undefined) return fallback;
    return unit ? `${value}${unit ? ' ' + unit : ''}` : String(value);
  }

  /**
   * Merges multiple objects, later values override earlier ones
   */
  static mergeObjects(...objects) {
    return objects.reduce((result, obj) => {
      return { ...result, ...obj };
    }, {});
  }

  /**
   * Groups array items by a property value
   */
  static groupBy(array, propertyName) {
    if (!Array.isArray(array)) return {};
    return array.reduce((grouped, item) => {
      const key = item[propertyName];
      if (!(key in grouped)) {
        grouped[key] = [];
      }
      grouped[key].push(item);
      return grouped;
    }, {});
  }

  /**
   * Truncates string to max length with optional suffix
   */
  static truncate(str, maxLength, suffix = '...') {
    if (String(str).length <= maxLength) {
      return str;
    }
    return String(str).substring(0, maxLength - suffix.length) + suffix;
  }
}

module.exports = TransformationHelper;
