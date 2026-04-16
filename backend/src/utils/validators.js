const ValidationHelper = require('./ValidationHelper');

/**
 * Validator utilities - Wrapper for backward compatibility
 * Delegates to ValidationHelper following DRY principle
 */

/**
 * Validates latitude value
 */
function validateLatitude(value) {
  try {
    ValidationHelper.validateLatitude(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates longitude value
 */
function validateLongitude(value) {
  try {
    ValidationHelper.validateLongitude(value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates coordinate string (single or comma-separated)
 */
function validateCoordinates(value) {
  try {
    ValidationHelper.validateCoordinates(value);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  validateLatitude,
  validateLongitude,
  validateCoordinates,
  ValidationHelper, // Export helper for direct use
};
