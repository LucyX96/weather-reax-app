/**
 * DTO for Geocoding Output
 * Represents standardized geocoding response
 */
class GeocodeOutputDTO {
  constructor(name, country, latitude, longitude) {
    this.name = name;
    this.country = country;
    this.latitude = latitude;
    this.longitude = longitude;
  }

  /**
   * Creates instance from API response
   * @param {Object} apiPlace Place data from geocoding API
   * @returns {GeocodeOutputDTO}
   */
  static fromApiResponse(apiPlace) {
    if (!apiPlace) {
      throw new Error('Place data is required');
    }
    
    const { name, country, latitude, longitude } = apiPlace;
    
    if (!name || !country || typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new Error('Dati geocoding incompleti dal\'API esterna');
    }

    return new GeocodeOutputDTO(name, country, latitude, longitude);
  }

  /**
   * Validates the output structure
   * @throws {Error} if validation fails
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
   * Converts to plain object for serialization
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

module.exports = GeocodeOutputDTO;
