const {
  validateGeocode,
  validateWeather,
  validateForecast,
  handleValidationErrors,
} = require('./validationMiddleware');
const { errorHandler } = require('./errorHandler');

module.exports = {
  validateGeocode,
  validateWeather,
  validateForecast,
  handleValidationErrors,
  errorHandler,
};
