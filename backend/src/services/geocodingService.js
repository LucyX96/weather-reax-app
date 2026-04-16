const { GeocodeInputDTO, GeocodeOutputDTO } = require('../models/dto');

/**
 * GeocodingService
 * Business logic for geocoding operations
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
    // Validate input
    const input = GeocodeInputDTO.fromInput({ q: city });
    input.validate();

    // Fetch from repository
    const geocodeData = await this.weatherRepository.fetchGeocodeData(input.q);

    if (!geocodeData) {
      throw new Error('Città non trovata');
    }

    // Validate output
    geocodeData.validate();

    return geocodeData;
  }
}

module.exports = GeocodingService;
