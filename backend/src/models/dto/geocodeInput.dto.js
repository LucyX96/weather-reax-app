/**
 * DTO for Geocoding Input
 * Represents the input validation for geocoding requests
 */
class GeocodeInputDTO {
  constructor(q) {
    this.q = q;
  }

  /**
   * Validates the geocode input
   * @throws {Error} if validation fails
   */
  validate() {
    if (!this.q || typeof this.q !== 'string') {
      throw new Error('Il parametro q deve essere una stringa.');
    }
    if (this.q.length < 1 || this.q.length > 100) {
      throw new Error('Il parametro q deve essere tra 1 e 100 caratteri.');
    }
  }

  /**
   * Creates instance from raw input
   * @param {Object} input Raw input object
   * @returns {GeocodeInputDTO}
   */
  static fromInput(input) {
    return new GeocodeInputDTO(input?.q);
  }
}

module.exports = GeocodeInputDTO;
