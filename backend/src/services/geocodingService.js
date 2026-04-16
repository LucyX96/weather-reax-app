const { GeocodeInputDTO, GeocodeOutputDTO } = require('../models/dto');
const { ErrorHandler } = require('../errors');
const ValidationHelper = require('../utils/ValidationHelper');

/**
 * GeocodingService
 * Business logic for geocoding operations following Single Responsibility
 * Delegates validation to ValidationHelper and error handling to ErrorHandler
 */
class GeocodingService {
  constructor(weatherRepository) {
    this.weatherRepository = weatherRepository;
  }

  /**
   * Geocodes a city name and returns geocoding data
   * @param {string} city City name
   * @returns {Promise<GeocodeOutputDTO>}
   */
  async geocodeCity(city) {
    try {
      // Validate input using helper
      const validatedCity = ValidationHelper.validateCity(city);

      // Create DTO for validation
      const input = GeocodeInputDTO.fromInput({ q: validatedCity });
      input.validate();

      // Fetch from repository
      const geocodeData = await this.weatherRepository.fetchGeocodeData(validatedCity);

      // Validate output
      geocodeData.validate();

      return geocodeData;
    } catch (error) {
      // Error handling is centralized - just rethrow
      throw error;
    }
  }
}

module.exports = GeocodingService;
