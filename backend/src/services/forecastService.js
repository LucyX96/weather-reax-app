const { ForecastInputDTO, ForecastOutputDTO } = require('../models/dto');
const ValidationHelper = require('../utils/ValidationHelper');

/**
 * ForecastService
 * Business logic for forecast operations following Single Responsibility
 * Delegates validation to ValidationHelper
 */
class ForecastService {
  constructor(weatherRepository) {
    this.weatherRepository = weatherRepository;
  }

  /**
   * Gets weather forecast data
   * @param {number} latitude Latitude coordinate
   * @param {number} longitude Longitude coordinate
   * @param {Object} params Query parameters
   * @returns {Promise<ForecastOutputDTO>}
   */
  async getForecast(latitude, longitude, params = {}) {
    try {
      // Validate coordinates using helper
      const validLat = ValidationHelper.validateLatitude(latitude);
      const validLon = ValidationHelper.validateLongitude(longitude);

      // Validate input
      const input = ForecastInputDTO.fromInput({
        latitude: validLat,
        longitude: validLon,
        ...params,
      });
      input.validate();

      // Get forecast parameters
      const forecastParams = input.getForecastParams();
      const { latitude: requestLat, longitude: requestLon, ...apiParams } = forecastParams;

      // Fetch from repository
      const forecastData = await this.weatherRepository.fetchForecastData(
        requestLat,
        requestLon,
        apiParams
      );

      // Validate output
      forecastData.validate();

      return forecastData;
    } catch (error) {
      // Error handling is centralized - just rethrow
      throw error;
    }
  }

  /**
   * Gets simple weather forecast (backward compatibility /api/weather)
   * @param {number} latitude Latitude coordinate
   * @param {number} longitude Longitude coordinate
   * @returns {Promise<ForecastOutputDTO>}
   */
  async getSimpleWeather(latitude, longitude) {
    return this.getForecast(latitude, longitude, {
      hourly: 'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
      current_weather: 'true',
      timezone: 'auto',
    });
  }
}

module.exports = ForecastService;
