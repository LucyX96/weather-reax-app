import { handleClientError } from '../services/helpers';

export function buildApiError(error) {
  return handleClientError(error);
}
