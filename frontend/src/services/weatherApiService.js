import apiClient from './ApiClient';
import { ENDPOINTS } from '../models/weather';
import { GeocodeDTO, WeatherDTO } from '../models/dto';

/**
 * WeatherApiService
 * Handles all API calls to the backend for weather data
 */

/**
 * Geocodes a city name
 */
export async function geocodeCity(city) {
  try {
    const response = await apiClient.get(ENDPOINTS.GEO_CODE, {
      params: { q: city },
    });
    return GeocodeDTO.fromApiResponse(response.data);
  } catch (error) {
    throw new Error(`Geocoding error: ${error.message}`);
  }
}

/**
 * Gets current weather data for coordinates
 */
export async function getCurrentWeather(latitude, longitude) {
  try {
    const params = {
      latitude,
      longitude,
      hourly: 'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,relative_humidity_2m',
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
      current_weather: 'true',
      timezone: 'auto',
    };

    const response = await apiClient.get(ENDPOINTS.FORECAST, { params });
    return WeatherDTO.fromApiResponse(response.data);
  } catch (error) {
    throw new Error(`Weather error: ${error.message}`);
  }
}

/**
 * Gets 5-day forecast
 */
export async function getFiveDayForecast(latitude, longitude) {
  try {
    const params = {
      latitude,
      longitude,
      daily: 'temperature_2m_max,temperature_2m_min',
      forecast_days: '5',
      timezone: 'auto',
    };

    const response = await apiClient.get(ENDPOINTS.FORECAST, { params });
    const data = response.data;

    if (!data?.daily?.time) {
      throw new Error('Invalid forecast data structure');
    }

    return data.daily.time.map((date, index) => ({
      date,
      min: data.daily.temperature_2m_min[index],
      max: data.daily.temperature_2m_max[index],
    }));
  } catch (error) {
    throw new Error(`Forecast error: ${error.message}`);
  }
}

/**
 * Gets weather data for multiple cities
 */
export async function getMultipleCitiesWeather(cities) {
  if (!Array.isArray(cities) || cities.length === 0) {
    throw new Error('Cities array is required');
  }

  try {
    const geocodes = await Promise.all(cities.map((city) => geocodeCity(city)));

    const weatherPromises = geocodes.map((geo) =>
      getCurrentWeather(geo.latitude, geo.longitude).then((weather) => ({
        city: geo.name,
        temperature: weather.data?.current_weather?.temperature,
        weather: getWeatherDescription(weather.data?.current_weather?.weathercode),
      }))
    );

    return Promise.all(weatherPromises);
  } catch (error) {
    throw new Error(`Multiple cities error: ${error.message}`);
  }
}

/**
 * Helper function to get weather description from WMO code
 */
function getWeatherDescription(code) {
  const descriptions = {
    0: 'Cielo sereno',
    1: 'Cielo sereno',
    2: 'Nuvoloso',
    3: 'Molto nuvoloso',
    45: 'Nebbia',
    48: 'Nebbia',
    51: 'Pioggia leggera',
    53: 'Pioggia moderata',
    55: 'Pioggia intensa',
    61: 'Pioggia',
    63: 'Pioggia moderata',
    65: 'Pioggia forte',
    71: 'Neve leggera',
    73: 'Neve moderata',
    75: 'Neve intensa',
    80: 'Pioggia leggera e intermittente',
    81: 'Pioggia moderata e intermittente',
    82: 'Pioggia forte e intermittente',
    85: 'Neve leggera e intermittente',
    86: 'Neve moderata e intermittente',
    95: 'Temporale',
    96: 'Temporale con grandine leggera',
    99: 'Temporale con grandine forte',
  };
  return descriptions[code] || 'Sconosciuto';
}

export default {
  geocodeCity,
  getCurrentWeather,
  getFiveDayForecast,
  getMultipleCitiesWeather,
};
