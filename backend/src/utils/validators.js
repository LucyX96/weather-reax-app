/**
 * Validator utilities
 */

/**
 * Validates latitude value
 */
function validateLatitude(value) {
  const lat = Number.parseFloat(value);
  if (Number.isNaN(lat)) return false;
  return lat >= -90 && lat <= 90;
}

/**
 * Validates longitude value
 */
function validateLongitude(value) {
  const lon = Number.parseFloat(value);
  if (Number.isNaN(lon)) return false;
  return lon >= -180 && lon <= 180;
}

/**
 * Validates coordinate string (single or comma-separated)
 */
function validateCoordinates(value) {
  if (!value) return false;
  const coords = String(value).split(',');
  return coords.every((c) => !Number.isNaN(Number.parseFloat(c)));
}

module.exports = {
  validateLatitude,
  validateLongitude,
  validateCoordinates,
};
