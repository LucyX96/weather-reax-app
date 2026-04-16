const { ErrorHandler } = require('../errors');

/**
 * Global error handler middleware
 * Centralizes error handling following Single Responsibility principle
 * Should be used as the last middleware in the app
 */
function errorHandler(err, req, res, next) {
  // Log all errors for debugging
  ErrorHandler.logError(err, `${req.method} ${req.path}`);

  // Format and send response
  const { statusCode, body } = ErrorHandler.formatErrorResponse(err);
  res.status(statusCode).json(body);
}

module.exports = {
  errorHandler,
};
