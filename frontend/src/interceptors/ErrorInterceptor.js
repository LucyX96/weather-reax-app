import { normalizeError } from '../services/errorHandling';

export function buildApiError(error) {
  return normalizeError(error, 'Errore durante la chiamata API.');
}
