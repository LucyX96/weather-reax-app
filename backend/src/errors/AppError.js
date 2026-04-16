/**
 * AppError - Custom application error class
 * Implements consistent error handling across the application
 * Follows SOLID principles: Single Responsibility, Open/Closed
 */
class AppError extends Error {
  constructor(message, statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = new Date().toISOString();
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON response format
   */
  toJSON() {
    const payload = {
      error: this.message,
      code: this.errorCode,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    };

    if (this.field) {
      payload.field = this.field;
    }

    if (this.details) {
      payload.details = this.details;
    }

    return payload;
  }
}

/**
 * ValidationError - 400 Bad Request
 * Thrown when input validation fails
 */
class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * NotFoundError - 404 Not Found
 * Thrown when a resource cannot be found
 */
class NotFoundError extends AppError {
  constructor(message, resourceType = null) {
    super(message, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
    this.resourceType = resourceType;
  }
}

/**
 * TimeoutError - 504 Gateway Timeout
 * Thrown when external API calls exceed timeout
 */
class TimeoutError extends AppError {
  constructor(message = 'Timeout nella richiesta', endpoint = null) {
    super(message, 504, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
    this.endpoint = endpoint;
  }
}

/**
 * ExternalServiceError - 502 Bad Gateway
 * Thrown when external APIs return errors
 */
class ExternalServiceError extends AppError {
  constructor(message, statusCode = 502, service = null) {
    super(message, statusCode, 'EXTERNAL_SERVICE_ERROR');
    this.name = 'ExternalServiceError';
    this.service = service;
  }
}

/**
 * AuthenticationError - 401 Unauthorized
 * Thrown when authentication fails
 */
class AuthenticationError extends AppError {
  constructor(message = 'Autenticazione richiesta') {
    super(message, 401, 'AUTH_ERROR');
    this.name = 'AuthenticationError';
  }
}

module.exports = {
  AppError,
  ValidationError,
  NotFoundError,
  TimeoutError,
  ExternalServiceError,
  AuthenticationError,
};
