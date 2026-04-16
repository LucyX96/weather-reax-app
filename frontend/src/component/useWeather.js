import { useState, useCallback } from 'react';
import { saveCache, readCache } from '../services/CacheService';
import { geocodeCity, getCurrentWeather, getFiveDayForecast, getMultipleCitiesWeather } from '../services/weatherApiService';
import { isValidCityName, sanitizeInput } from '../security/SecurityUtils';

function isOnline() {
  return navigator.onLine;
}

// Helper to get cached or fetch geocode data
async function getGeocodeData(sanitizedCity) {
  const geocodeKey = `geocode_${sanitizedCity.toLowerCase()}`;
  let geoData = await readCache(geocodeKey);

  if (!geoData) {
    if (!isOnline()) {
      throw new Error('Offline: dati geocoding non disponibili in cache.');
    }
    const geocodeResult = await geocodeCity(sanitizedCity);
    geoData = geocodeResult.toObject();
    await saveCache(geocodeKey, geoData);
  }

  return geoData;
}

// Helper to get cached or fetch weather data
async function getWeatherData(latitude, longitude) {
  const weatherKey = `weather_${latitude}_${longitude}`;
  let weatherData = await readCache(weatherKey);

  if (!weatherData) {
    if (!isOnline()) {
      throw new Error('Offline: dati meteo non disponibili in cache.');
    }
    const weatherResult = await getCurrentWeather(latitude, longitude);
    weatherData = weatherResult.toObject();
    await saveCache(weatherKey, weatherData);
  }

  return weatherData;
}

// Helper to get cached or fetch forecast data
async function getForecastData(latitude, longitude) {
  const forecastKey = `forecast_${latitude}_${longitude}`;
  let forecastData = await readCache(forecastKey);
  if (!forecastData && isOnline()) {
    forecastData = await getFiveDayForecast(latitude, longitude);
    await saveCache(forecastKey, forecastData);
  }
  return forecastData;
}

// Helper to try recovering from offline error with cache
async function tryOfflineRecovery(sanitizedCity) {
  const geocodeKey = `geocode_${sanitizedCity.toLowerCase()}`;
  const cachedPlace = await readCache(geocodeKey);
  
  if (!cachedPlace) {
    return null;
  }

  const weatherKey = `weather_${cachedPlace.latitude}_${cachedPlace.longitude}`;
  const cachedWeather = await readCache(weatherKey);
  
  if (!cachedWeather) {
    return null;
  }

  const forecastKey = `forecast_${cachedPlace.latitude}${cachedPlace.longitude}`;
  const cachedForecast = await readCache(forecastKey);

  return { place: cachedPlace, weather: cachedWeather, forecast: cachedForecast };
}

function useWeather() {
  const [place, setPlace] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [multipleCitiesWeather, setMultipleCitiesWeather] = useState(null);

  const searchWeather = useCallback(async (city) => {
    try {
      setLoading(true);
      setError('');
      setPlace(null);
      setWeather(null);
      setFiveDayForecast(null);

      const sanitizedCity = sanitizeInput(city);
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
        const sanitizedCity = sanitizeInput(city);
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

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Errore imprevisto.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMultipleCities = useCallback(async (cities) => {
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Errore imprevisto.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

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