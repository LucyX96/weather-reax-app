export class AppError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = 'AppError';
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? 'APP_ERROR';
    this.cause = options.cause;
  }
}

function buildMessage(error, fallbackMessage) {
  if (error?.response) {
    return (
      error.response.data?.error ||
      error.response.data?.message ||
      error.response.statusText ||
      fallbackMessage
    );
  }

  if (error?.request) {
    return 'Nessuna risposta dal server. Controlla la connessione.';
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

function buildStatusCode(error) {
  if (error?.response?.status) {
    return error.response.status;
  }

  if (error?.request) {
    return 503;
  }

  if (error instanceof AppError) {
    return error.statusCode;
  }

  return 500;
}

export function normalizeError(error, fallbackMessage = 'Errore imprevisto.') {
  if (error instanceof AppError) {
    return error;
  }

  return new AppError(buildMessage(error, fallbackMessage), {
    statusCode: buildStatusCode(error),
    cause: error,
  });
}

export async function executeSafely(operation, fallbackMessage) {
  try {
    return await operation();
  } catch (error) {
    throw normalizeError(error, fallbackMessage);
  }
}
