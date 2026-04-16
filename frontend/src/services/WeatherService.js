import apiClient, { retryRequest } from './ApiClient';
import { sanitizeInput, isValidCityName } from '../security/SecurityUtils';
import { ENDPOINTS } from '../models/weather';

function validateCoords(value) {
  return !Number.isNaN(Number.parseFloat(value)) && Number.isFinite(Number.parseFloat(value));
}

export async function geocodeCity(city) {
  const sanitizedCity = sanitizeInput(city);
  if (!isValidCityName(sanitizedCity)) {
    throw new Error('Nome città non valido.');
  }

  const request = () => apiClient.get(ENDPOINTS.GEO_CODE, { params: { q: sanitizedCity } });
  const response = await retryRequest(request, 2, 500);
  return response.data;
}

export async function getCurrentWeather(latitude, longitude) {
  if (!validateCoords(latitude) || !validateCoords(longitude)) {
    throw new Error('Coordinate geografiche non valide.');
  }

  const params = {
    latitude,
    longitude,
    hourly: 'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,relative_humidity_2m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    current_weather: 'true',
    timezone: 'auto',
  };

  const request = () => apiClient.get(ENDPOINTS.FORECAST, { params });
  const response = await retryRequest(request, 2, 500);
  return response.data;
}

export async function getFiveDayForecast(latitude, longitude) {
  if (!validateCoords(latitude) || !validateCoords(longitude)) {
    throw new Error('Coordinate geografiche non valide.');
  }

  const params = {
    latitude,
    longitude,
    daily: 'temperature_2m_max,temperature_2m_min',
    forecast_days: '5',
    timezone: 'auto',
  };

  const request = () => apiClient.get(ENDPOINTS.FORECAST, { params });
  const response = await retryRequest(request, 2, 500);
  const data = response.data;

  if (!data?.daily?.time) {
    throw new Error('Dati forecast non disponibili');
  }

  return data.daily.time.map((date, index) => ({
    date,
    min: data.daily.temperature_2m_min[index],
    max: data.daily.temperature_2m_max[index],
  }));
}

export async function getMultipleCitiesWeather(cities) {
  if (!Array.isArray(cities) || cities.length === 0) {
    throw new Error('Serve almeno una città per il confronto.');
  }

  const geocodes = await Promise.all(cities.map((city) => geocodeCity(city)));
  const weatherPromises = geocodes.map(({ latitude, longitude, name, country }) =>
    getCurrentWeather(latitude, longitude).then((weather) => ({
      city: `${name}, ${country}`,
      temperature: weather.current_weather?.temperature,
      weather: weather.current_weather?.weathercode ? getWeatherDescription(weather.current_weather.weathercode) : 'N/A',
    }))
  );

  return Promise.all(weatherPromises);
}

function getWeatherDescription(code) {
  const descriptions = {
    0: 'Cielo sereno',
    1: 'Prevalentemente sereno',
    2: 'Parzialmente nuvoloso',
    3: 'Nuvoloso',
    45: 'Nebbia',
    48: 'Nebbia con brina',
    51: 'Pioggerella leggera',
    53: 'Pioggerella',
    55: 'Pioggerella intensa',
    61: 'Pioggia leggera',
    63: 'Pioggia',
    65: 'Pioggia intensa',
    71: 'Neve leggera',
    73: 'Neve',
    75: 'Neve intensa',
    95: 'Temporale',
    96: 'Temporale con grandine leggera',
    99: 'Temporale con grandine',
  };
  return descriptions[code] || 'Condizioni variabili';
}
