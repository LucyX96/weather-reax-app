/**
 * DTO for Weather Data
 */
export class WeatherDTO {
  constructor(data) {
    this.data = data;
  }

  /**
   * Creates instance from API response
   */
  static fromApiResponse(data) {
    if (!data || typeof data !== 'object') {
      throw new Error('Dati meteo non validi');
    }
    return new WeatherDTO(data);
  }

  /**
   * Validates the DTO
   */
  validate() {
    if (!this.data || typeof this.data !== 'object') {
      throw new Error('Dati meteo non validi');
    }
  }

  /**
   * Gets current weather
   */
  getCurrentWeather() {
    return this.data.current_weather;
  }

  /**
   * Gets hourly data
   */
  getHourly() {
    return this.data.hourly;
  }

  /**
   * Gets daily data
   */
  getDaily() {
    return this.data.daily;
  }

  /**
   * Converts to plain object
   */
  toObject() {
    return this.data;
  }
}
