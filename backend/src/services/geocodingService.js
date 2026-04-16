const { GeocodeInputDTO } = require('../models/dto');
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
    const validatedCity = ValidationHelper.validateCity(city);
    const input = GeocodeInputDTO.fromInput({ q: validatedCity });
    input.validate();

    const geocodeData = await this.weatherRepository.fetchGeocodeData(validatedCity);
    geocodeData.validate();

    return geocodeData;
  }
}

module.exports = GeocodingService;
