import apiClient from './ApiClient';
import { ENDPOINTS } from '../models/weather';
import { GeocodeDTO, WeatherDTO } from '../models/dto';
import { AppError, executeSafely, normalizeError } from './errorHandling';
import {
  buildCurrentWeatherParams,
  buildFiveDayForecastParams,
  mapCityWeather,
  mapFiveDayForecast,
} from './weatherMappers';

async function executeApiCall(request, fallbackMessage) {
  return executeSafely(async () => {
    const response = await request();
    return response.data;
  }, fallbackMessage);
}

async function executeApiCallWithContext(request, contextLabel, fallbackMessage) {
  try {
    return await executeApiCall(request, fallbackMessage);
  } catch (error) {
    const normalizedError = normalizeError(error, fallbackMessage);
    throw new AppError(`${contextLabel}: ${normalizedError.message}`, {
      statusCode: normalizedError.statusCode,
      cause: normalizedError,
    });
  }
}

export async function geocodeCity(city) {
  const data = await executeApiCallWithContext(
    () => apiClient.get(ENDPOINTS.GEO_CODE, { params: { q: city } }),
    'Geocoding error',
    'Errore durante il geocoding.'
  );

  return GeocodeDTO.fromApiResponse(data);
}

export async function getCurrentWeather(latitude, longitude) {
  const data = await executeApiCallWithContext(
    () => apiClient.get(ENDPOINTS.FORECAST, { params: buildCurrentWeatherParams(latitude, longitude) }),
    'Weather error',
    'Errore durante il recupero del meteo.'
  );

  return WeatherDTO.fromApiResponse(data);
}

export async function getForecastByParams(params) {
  return executeApiCallWithContext(
    () => apiClient.get(ENDPOINTS.FORECAST, { params }),
    'Forecast error',
    'Errore durante il recupero della forecast avanzata.'
  );
}

export async function getFiveDayForecast(latitude, longitude) {
  const data = await executeApiCallWithContext(
    () => apiClient.get(ENDPOINTS.FORECAST, { params: buildFiveDayForecastParams(latitude, longitude) }),
    'Forecast error',
    'Errore durante il recupero della forecast a 5 giorni.'
  );

  return mapFiveDayForecast(data);
}

export async function getMultipleCitiesWeather(cities) {
  if (!Array.isArray(cities) || cities.length === 0) {
    throw new Error('Serve almeno una città per il confronto.');
  }

  return executeSafely(async () => {
    const geocodes = await Promise.all(cities.map((city) => geocodeCity(city)));
    const weatherEntries = await Promise.all(
      geocodes.map(async (geocode) => {
        const weather = await getCurrentWeather(geocode.latitude, geocode.longitude);
        return mapCityWeather(geocode, weather.toObject());
      })
    );

    return weatherEntries;
  }, 'Errore durante il confronto tra città.');
}

export default {
  geocodeCity,
  getCurrentWeather,
  getForecastByParams,
  getFiveDayForecast,
  getMultipleCitiesWeather,
};
