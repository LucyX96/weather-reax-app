import { useState } from 'react';
import { saveCache, readCache } from '../services/CacheService';
import { geocodeCity, getCurrentWeather, getFiveDayForecast, getMultipleCitiesWeather } from '../services/weatherApiService';
import { isValidCityName, sanitizeInput } from '../security/SecurityUtils';
import { CACHE_KEYS } from '../models/weather';
import { normalizeError } from '../services/errorHandling';

function isOnline() {
  return navigator.onLine;
}

async function getOrSetCache(cacheKey, fetcher, offlineMessage) {
  const cachedData = await readCache(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  if (!isOnline()) {
    throw new Error(offlineMessage);
  }

  const freshData = await fetcher();
  await saveCache(cacheKey, freshData);
  return freshData;
}

async function getGeocodeData(city) {
  return getOrSetCache(
    CACHE_KEYS.GEOCODE(city),
    async () => (await geocodeCity(city)).toObject(),
    'Offline: dati geocoding non disponibili in cache.'
  );
}

async function getWeatherData(latitude, longitude) {
  return getOrSetCache(
    CACHE_KEYS.CURRENT_WEATHER(latitude, longitude),
    async () => (await getCurrentWeather(latitude, longitude)).toObject(),
    'Offline: dati meteo non disponibili in cache.'
  );
}

async function getForecastData(latitude, longitude) {
  return getOrSetCache(
    CACHE_KEYS.FORECAST(latitude, longitude),
    () => getFiveDayForecast(latitude, longitude),
    'Offline: forecast non disponibile in cache.'
  );
}

async function tryOfflineRecovery(city) {
  const cachedPlace = await readCache(CACHE_KEYS.GEOCODE(city));

  if (!cachedPlace) {
    return null;
  }

  const { latitude, longitude } = cachedPlace;
  const [cachedWeather, cachedForecast] = await Promise.all([
    readCache(CACHE_KEYS.CURRENT_WEATHER(latitude, longitude)),
    readCache(CACHE_KEYS.FORECAST(latitude, longitude)),
  ]);

  if (!cachedWeather) {
    return null;
  }

  return { place: cachedPlace, weather: cachedWeather, forecast: cachedForecast };
}

function useWeather() {
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [multipleCitiesWeather, setMultipleCitiesWeather] = useState(null);

  async function searchWeather(city) {
    const sanitizedCity = sanitizeInput(city);

    try {
      setLoading(true);
      setError('');
      setPlace(null);
      setWeather(null);
      setFiveDayForecast(null);

      if (!isValidCityName(sanitizedCity)) {
        throw new Error('Inserisci una città valida.');
      }

      const geoData = await getGeocodeData(sanitizedCity);
      setPlace(geoData);

      const weatherData = await getWeatherData(geoData.latitude, geoData.longitude);
      setWeather(weatherData);

      const forecastData = await getForecastData(geoData.latitude, geoData.longitude);
      setFiveDayForecast(forecastData);

      if (!isOnline()) {
        setError('Modalità offline: dati dalla cache.');
      }
    } catch (err) {
      if (!isOnline()) {
        const recovered = await tryOfflineRecovery(sanitizedCity);
        if (recovered) {
          setPlace(recovered.place);
          setWeather(recovered.weather);
          setFiveDayForecast(recovered.forecast);
          setError('Modalità offline: dati dalla cache.');
          setLoading(false);
          return;
        }
      }

      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }

  async function searchMultipleCities(cities) {
    try {
      setLoading(true);
      setError('');
      setMultipleCitiesWeather(null);

      const sanitizedCities = cities
        .map((city) => sanitizeInput(city))
        .filter((city) => isValidCityName(city));

      if (sanitizedCities.length === 0) {
        throw new Error('Inserisci almeno una città valida.');
      }

      const data = await getMultipleCitiesWeather(sanitizedCities);
      setMultipleCitiesWeather(data);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }

  return {
    place,
    weather,
    error,
    loading,
    fiveDayForecast,
    multipleCitiesWeather,
    searchWeather,
    searchMultipleCities,
  };
}

export default useWeather;
