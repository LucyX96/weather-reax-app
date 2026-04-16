/**
 * DTO for Forecast Input
 * Represents the input validation for forecast requests
 */
class ForecastInputDTO {
  constructor(latitude, longitude, params = {}) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.params = params;
  }

  /**
   * Validates the forecast input
   * @throws {Error} if validation fails
   */
  validate() {
    // Validate latitude
    if (!this.latitude) {
      throw new Error('Latitude è obbligatorio');
    }

    const latitudes = this.parseCoordinates(this.latitude);
    if (!latitudes || latitudes.some(Number.isNaN)) {
      throw new Error('Latitude deve essere un numero o lista di numeri');
    }
    if (latitudes.some(lat => lat < -90 || lat > 90)) {
      throw new Error('Latitude deve essere tra -90 e 90');
    }

    // Validate longitude
    if (!this.longitude) {
      throw new Error('Longitude è obbligatorio');
    }

    const longitudes = this.parseCoordinates(this.longitude);
    if (!longitudes || longitudes.some(Number.isNaN)) {
      throw new Error('Longitude deve essere un numero o lista di numeri');
    }
    if (longitudes.some(lon => lon < -180 || lon > 180)) {
      throw new Error('Longitude deve essere tra -180 e 180');
    }
  }

  /**
   * Parses coordinate strings to numbers
   * @param {string|number} value Coordinate value
   * @returns {number[]} Array of parsed coordinates
   */
  parseCoordinates(value) {
    if (typeof value === 'number') {
      return [value];
    }
    if (typeof value === 'string') {
      return value.split(',').map(v => Number.parseFloat(v.trim()));
    }
    return null;
  }

  /**
   * Gets allowed parameters for the forecast API
   */
  static getAllowedParams() {
    return [
      'latitude', 'longitude', 'elevation', 'hourly', 'daily', 'current',
      'current_weather', 'temperature_unit', 'wind_speed_unit', 'precipitation_unit',
      'timeformat', 'timezone', 'past_days', 'forecast_days', 'forecast_hours',
      'forecast_minutely_15', 'past_hours', 'past_minutely_15',
      'start_date', 'end_date', 'start_hour', 'end_hour', 'start_minutely_15',
      'end_minutely_15', 'models', 'cell_selection'
    ];
  }

  /**
   * Creates instance from raw input
   * @param {Object} input Raw input object
   * @returns {ForecastInputDTO}
   */
  static fromInput(input) {
    const allowed = this.getAllowedParams();
    const params = {};

    Object.keys(input || {}).forEach((key) => {
      if (!allowed.includes(key)) {
        return;
      }

      if (key === 'current') {
        if (input[key] && input[key] !== 'false' && input[key] !== '0') {
          params.current_weather = 'true';
        }
        return;
      }

      params[key] = input[key];
    });

    return new ForecastInputDTO(input?.latitude, input?.longitude, params);
  }

  /**
   * Gets the parameters to send to the external API
   */
  getForecastParams() {
    const params = { ...this.params };

    // Set defaults if not specified
    if (!params.hourly && !params.daily && !params.current_weather) {
      params.hourly = 'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m';
      params.daily = 'temperature_2m_max,temperature_2m_min,precipitation_sum';
      params.current_weather = 'true';
    }

    if (!params.timezone) {
      params.timezone = 'auto';
    }

    params.latitude = this.latitude;
    params.longitude = this.longitude;

    return params;
  }
}

module.exports = ForecastInputDTO;
