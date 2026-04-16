/**
 * DTO for Geocoding Data
 * Shared between frontend and backend
 */
export class GeocodeDTO {
  constructor(name, country, latitude, longitude) {
    this.name = name;
    this.country = country;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   * Creates instance from API response
   */
  static fromApiResponse(data) {
    if (!data?.name || !data?.country || typeof data?.latitude !== 'number' || typeof data?.longitude !== 'number') {
      throw new TypeError('Dati geocoding non validi');
    }
    return new GeocodeDTO(data.name, data.country, data.latitude, data.longitude);
  }

  /**
   * Validates the DTO
   */
  validate() {
    if (!this.name || !this.country) {
      throw new Error('Nome e paese sono obbligatori');
    }
    if (typeof this.latitude !== 'number' || typeof this.longitude !== 'number') {
      throw new TypeError('Latitudine e longitudine devono essere numeri');
    }
    if (this.latitude < -90 || this.latitude > 90) {
      throw new Error('Latitudine non valida');
    }
    if (this.longitude < -180 || this.longitude > 180) {
      throw new Error('Longitudine non valida');
    }
  }

  /**
   * Converts to plain object
   */
  toObject() {
    return {
      name: this.name,
      country: this.country,
      latitude: this.latitude,
      longitude: this.longitude,
    };
  }
}
