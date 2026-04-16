const { buildExternalUrl, buildFetchOptions } = require('../utils/apiClient');
const { GeocodeOutputDTO, ForecastOutputDTO } = require('../models/dto');
const { ErrorHandler, NotFoundError, TimeoutError } = require('../errors');

/**
 * WeatherRepository
 * Handles all external API calls following Single Responsibility principle
 * Delegates error handling to ErrorHandler
 */
class WeatherRepository {
  constructor(weatherApiKey, weatherApiUrl, geocodeUrl) {
    this.weatherApiKey = weatherApiKey;
    this.weatherApiUrl = weatherApiUrl;
    this.geocodeUrl = geocodeUrl;
  }

  /**
   * Fetches geocoding data from external API
   * @param {string} city City name to geocode
   * @param {number} timeout Timeout in milliseconds
   * @returns {Promise<GeocodeOutputDTO>}
   */
  async fetchGeocodeData(city, timeout = 30000) {
    const url = buildExternalUrl(this.geocodeUrl, '/v1/search', {
      name: city,
      count: 1,
      language: 'it',
      format: 'json',
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, buildFetchOptions(controller.signal, this.weatherApiKey));
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw ErrorHandler.handleExternalServiceError(
          response.status,
          `Errore API geocoding: ${response.status}`,
          'geocoding'
        );
      }

      const data = await response.json();

      if (!data?.results || data.results.length === 0) {
        throw new NotFoundError('Città non trovata', 'city');
      }

      const place = data.results[0];
      return GeocodeOutputDTO.fromApiResponse(place);
    } catch (error) {
      clearTimeout(timeoutId);
      throw ErrorHandler.handleFetchError(error, 'geocoding');
    }
  }

  /**
   * Fetches forecast data from external API
   * @param {number} latitude Latitude coordinate
   * @param {number} longitude Longitude coordinate
   * @param {Object} params Query parameters
   * @param {number} timeout Timeout in milliseconds
   * @returns {Promise<ForecastOutputDTO>}
   */
  async fetchForecastData(latitude, longitude, params = {}, timeout = 30000) {
    const requestParams = {
      latitude,
      longitude,
      ...params,
    };

    const url = buildExternalUrl(this.weatherApiUrl, '/v1/forecast', requestParams);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, buildFetchOptions(controller.signal, this.weatherApiKey));
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw ErrorHandler.handleExternalServiceError(
          response.status,
          errData?.reason || `Errore API forecast: ${response.status}`,
          'forecast'
        );
      }

      const data = await response.json();
      return ForecastOutputDTO.fromApiResponse(data);
    } catch (error) {
      clearTimeout(timeoutId);
      throw ErrorHandler.handleFetchError(error, 'forecast');
    }
  }
}

module.exports = WeatherRepository;
