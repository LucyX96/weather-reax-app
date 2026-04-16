/**
 * ForecastController
 * Handles HTTP requests for forecast endpoints
 */
class ForecastController {
  constructor(forecastService) {
    this.forecastService = forecastService;
  }

  /**
   * GET /api/weather
   * Gets weather data (backward compatibility route)
   */
  async getWeather(req, res, next) {
    try {
      const { latitude, longitude } = req.query;
      const result = await this.forecastService.getSimpleWeather(latitude, longitude);
      res.json(result.toObject());
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /v1/forecast
   * Gets forecast data with advanced parameters
   */
  async getForecast(req, res, next) {
    try {
      const { latitude, longitude, ...params } = req.query;
      const result = await this.forecastService.getForecast(latitude, longitude, params);
      res.json(result.toObject());
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ForecastController;
