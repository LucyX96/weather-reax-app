const { ValidationError } = require('../errors');

/**
 * ValidationHelper - Centralizes all validation logic
 * Implements Single Responsibility and DRY principles
 */
class ValidationHelper {
  /**
   * Validates a latitude value
   */
  static validateLatitude(value) {
    const lat = Number.parseFloat(value);
    if (Number.isNaN(lat)) {
      throw new ValidationError('Latitudine non valida', 'latitude');
    }
    if (lat < -90 || lat > 90) {
      throw new ValidationError('Latitudine deve essere tra -90 e 90', 'latitude');
    }
    return lat;
  }

  /**
   * Validates a longitude value
   */
  static validateLongitude(value) {
    const lon = Number.parseFloat(value);
    if (Number.isNaN(lon)) {
      throw new ValidationError('Longitudine non valida', 'longitude');
    }
    if (lon < -180 || lon > 180) {
      throw new ValidationError('Longitudine deve essere tra -180 e 180', 'longitude');
    }
    return lon;
  }

  /**
   * Validates city name
   */
  static validateCity(value) {
    const city = String(value).trim();
    if (!city) {
      throw new ValidationError('Città è obbligatoria', 'city');
    }
    if (city.length < 2) {
      throw new ValidationError('Città deve avere almeno 2 caratteri', 'city');
    }
    if (city.length > 100) {
      throw new ValidationError('Città non deve superare 100 caratteri', 'city');
    }
    return city;
  }

  /**
   * Validates a required string field
   */
  static validateRequiredString(value, fieldName, minLength = 1, maxLength = 1000) {
    const str = String(value).trim();
    if (!str) {
      throw new ValidationError(`${fieldName} è obbligatorio`, fieldName);
    }
    if (str.length < minLength) {
      throw new ValidationError(
        `${fieldName} deve avere almeno ${minLength} caratteri`,
        fieldName
      );
    }
    if (str.length > maxLength) {
      throw new ValidationError(
        `${fieldName} non deve superare ${maxLength} caratteri`,
        fieldName
      );
    }
    return str;
  }

  /**
   * Validates a number is within range
   */
  static validateNumberRange(value, fieldName, min, max) {
    const num = Number.parseFloat(value);
    if (Number.isNaN(num)) {
      throw new ValidationError(`${fieldName} deve essere un numero`, fieldName);
    }
    if (num < min || num > max) {
      throw new ValidationError(
        `${fieldName} deve essere tra ${min} e ${max}`,
        fieldName
      );
    }
    return num;
  }

  /**
   * Validates comma-separated coordinates
   */
  static validateCoordinates(value) {
    const coords = String(value)
      .split(',')
      .map((c) => c.trim());

    if (coords.length !== 2) {
      throw new ValidationError(
        'Coordinate devono essere 2 valori separati da virgola',
        'coordinates'
      );
    }

    const [lat, lon] = coords;
    return {
      latitude: this.validateLatitude(lat),
      longitude: this.validateLongitude(lon),
    };
  }

  /**
   * Sanitizes a string value (removes dangerous characters)
   */
  static sanitizeString(value) {
    return String(value)
      .trim()
      .replaceAll(/<[^>]*>/g, '') // Remove HTML tags
      .replaceAll(/[^\w\s\-'.àèéìòù]/gi, '') // Keep only safe chars
      .replaceAll(/\s{2,}/g, ' '); // Remove extra spaces
  }

  /**
   * Validates and returns positive integer
   */
  static validatePositiveInteger(value, fieldName) {
    const num = Number.parseInt(value, 10);
    if (Number.isNaN(num) || num < 0) {
      throw new ValidationError(`${fieldName} deve essere un numero positivo`, fieldName);
    }
    return num;
  }
}

module.exports = ValidationHelper;
