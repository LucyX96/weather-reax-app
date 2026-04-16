const { query, validationResult } = require('express-validator');
const { validateLatitudeInput, validateLongitudeInput } = require('../utils/validators');
const { ErrorHandler } = require('../errors');

/**
 * Validation middleware for geocoding requests
 */
const validateGeocode = [
  query('q')
    .isString()
    .isLength({ min: 1, max: 100 })
    .withMessage('Il parametro q deve essere una stringa tra 1 e 100 caratteri')
    .trim()
    .escape(),
];

/**
 * Validation middleware for weather requests
 */
const validateWeather = [
  query('latitude')
    .isFloat({ min: -90, max: 90 })
    .withMessage('Latitude deve essere un numero tra -90 e 90'),
  query('longitude')
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude deve essere un numero tra -180 e 180'),
];

/**
 * Validation middleware for forecast requests
 */
const validateForecast = [
  query('latitude')
    .exists()
    .withMessage('latitude è obbligatorio')
    .custom(validateLatitudeInput)
    .withMessage('latitude deve essere numero o lista di numeri'),
  query('longitude')
    .exists()
    .withMessage('longitude è obbligatorio')
    .custom(validateLongitudeInput)
    .withMessage('longitude deve essere numero o lista di numeri'),
];

/**
 * Middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationError = ErrorHandler.createValidationError('Dati di input non validi');
    validationError.details = errors.array();
    return next(validationError);
  }
  next();
};

module.exports = {
  validateGeocode,
  validateWeather,
  validateForecast,
  handleValidationErrors,
};
