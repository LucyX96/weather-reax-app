const {
  AppError,
  ValidationError,
  NotFoundError,
  TimeoutError,
  ExternalServiceError,
} = require('./AppError');

/**
 * ErrorHandler - Centralizes all error handling logic
 * Implements Single Responsibility and DRY principles
 */
class ErrorHandler {
  /**
   * Handles validation errors from DTOs
   */
  static handleValidationError(error, field = null) {
    return new ValidationError(error.message, field);
  }

  /**
   * Handles not found errors
   */
  static handleNotFoundError(resourceType, message = null) {
    const msg = message || `${resourceType} non trovato`;
    return new NotFoundError(msg, resourceType);
  }

  /**
   * Handles API timeout errors
   */
  static handleTimeoutError(endpoint = null) {
    return new TimeoutError('Timeout nella richiesta', endpoint);
  }

  /**
   * Handles external service errors
   */
  static handleExternalServiceError(statusCode, message, service = null) {
    return new ExternalServiceError(message, statusCode, service);
  }

  /**
   * Handles abort errors from fetch operations
   */
  static handleAbortError(endpoint = null) {
    const error = new TimeoutError('Timeout nella richiesta', endpoint);
    return error;
  }

  /**
   * Handles fetch errors and converts them to AppError
   */
  static handleFetchError(error, context = null) {
    if (error.name === 'AbortError') {
      return this.handleAbortError(context);
    }

    if (error instanceof AppError) {
      return error;
    }

    // Generic network/system error
    return new AppError(
      error.message || 'Errore durante la comunicazione',
      500,
      'NETWORK_ERROR'
    );
  }

  /**
   * Formats error response for HTTP response
   */
  static formatErrorResponse(error) {
    if (error instanceof AppError) {
      return {
        statusCode: error.statusCode,
        body: error.toJSON(),
      };
    }

    // Fallback for non-AppError instances
    return {
      statusCode: 500,
      body: {
        error: 'Errore interno del server',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Logs error for debugging purposes
   */
  static logError(error, context = null) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` [${context}]` : '';
    console.error(`${timestamp} - Error${contextStr}:`, error);
  }

  /**
   * Checks if error is operational (expected) vs programming error
   */
  static isOperationalError(error) {
    return error instanceof AppError && error.isOperational;
  }

  static createValidationError(message, field = null) {
    return new ValidationError(message, field);
  }
}

module.exports = ErrorHandler;
