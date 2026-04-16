/**
 * DTO for Forecast Output
 * Represents standardized forecast response
 */
class ForecastOutputDTO {
  constructor(data) {
    this.data = data;
  }

  /**
   * Creates instance from API response
   * @param {Object} apiResponse Forecast data from weather API
   * @returns {ForecastOutputDTO}
   */
  static fromApiResponse(apiResponse) {
    if (!apiResponse) {
      throw new Error('API response is required');
    }
    return new ForecastOutputDTO(apiResponse);
  }

  /**
   * Validates the output structure
   * @throws {Error} if validation fails
   */
  validate() {
    if (!this.data || typeof this.data !== 'object') {
      throw new Error('Dati forecast non validi');
    }
  }

  /**
   * Converts to plain object for serialization
   */
  toObject() {
    return this.data;
  }
}

module.exports = ForecastOutputDTO;
