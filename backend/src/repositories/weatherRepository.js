const { buildExternalUrl, buildFetchOptions } = require('../utils/apiClient');
const { GeocodeOutputDTO, ForecastOutputDTO } = require('../models/dto');
const { ErrorHandler, NotFoundError } = require('../errors');

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

  async executeRequest(url, context, timeout, responseMapper) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, buildFetchOptions(controller.signal, this.weatherApiKey));
      const data = await this.parseResponse(response, context);
      return responseMapper(data);
    } catch (error) {
      throw ErrorHandler.handleFetchError(error, context);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async parseResponse(response, context) {
    if (response.ok) {
      return response.json();
    }

    const errorData = await response.json().catch(() => ({}));
    const defaultMessage = `Errore API ${context}: ${response.status}`;
    throw ErrorHandler.handleExternalServiceError(
      response.status,
      errorData?.reason || errorData?.error || defaultMessage,
      context
    );
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

    return this.executeRequest(url, 'geocoding', timeout, (data) => {
      if (!data?.results || data.results.length === 0) {
        throw new NotFoundError('Città non trovata', 'city');
      }

      return GeocodeOutputDTO.fromApiResponse(data.results[0]);
    });
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
    return this.executeRequest(url, 'forecast', timeout, (data) =>
      ForecastOutputDTO.fromApiResponse(data)
    );
  }
}

module.exports = WeatherRepository;
