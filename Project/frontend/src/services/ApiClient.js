import axios from 'axios';
import { sanitizeHeaders, getAuthToken } from '../security/SecurityUtils';
import { buildApiError } from '../interceptors/ErrorInterceptor';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 25000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      ...sanitizeHeaders(config.headers),
      'X-Requested-With': 'XMLHttpRequest',
    };

    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(buildApiError(error))
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(buildApiError(error))
);

export async function retryRequest(requestFn, retries = 2, delayMs = 500) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = buildApiError(error);
      if (attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
      }
    }
  }
  throw lastError;
}

export default apiClient;
