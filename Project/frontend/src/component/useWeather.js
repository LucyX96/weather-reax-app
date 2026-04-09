import { useState, useCallback } from 'react';
import { saveCache, readCache } from '../services/CacheService';
import { geocodeCity, getCurrentWeather, getFiveDayForecast, getMultipleCitiesWeather } from '../services/WeatherService';
import { isValidCityName, sanitizeInput } from '../security/SecurityUtils';

function isOnline() {
  return navigator.onLine;
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

      const geocodeKey = `geocode_${sanitizedCity.toLowerCase()}`;
      let geoData = await readCache(geocodeKey);

      if (!geoData) {
        if (!isOnline()) {
          throw new Error('Offline: dati geocoding non disponibili in cache.');
        }
        geoData = await geocodeCity(sanitizedCity);
        await saveCache(geocodeKey, geoData);
      }

      setPlace(geoData);

      const weatherKey = `weather_${geoData.latitude}_${geoData.longitude}`;
      let weatherData = await readCache(weatherKey);

      if (!weatherData) {
        if (!isOnline()) {
          throw new Error('Offline: dati meteo non disponibili in cache.');
        }
        weatherData = await getCurrentWeather(geoData.latitude, geoData.longitude);
        await saveCache(weatherKey, weatherData);
      }

      setWeather(weatherData);

      const forecastKey = `forecast_${geoData.latitude}_${geoData.longitude}`;
      let forecastData = await readCache(forecastKey);
      if (!forecastData && isOnline()) {
        forecastData = await getFiveDayForecast(geoData.latitude, geoData.longitude);
        await saveCache(forecastKey, forecastData);
      }
      setFiveDayForecast(forecastData);

      if (!isOnline()) {
        setError('Modalità offline: dati dalla cache.');
      }
    } catch (err) {
      if (!isOnline()) {
        const sanitizedCity = sanitizeInput(city);
        const geocodeKey = `geocode_${sanitizedCity.toLowerCase()}`;
        const cachedPlace = await readCache(geocodeKey);
        if (cachedPlace) {
          setPlace(cachedPlace);
          const weatherKey = `weather_${cachedPlace.latitude}_${cachedPlace.longitude}`;
          const cachedWeather = await readCache(weatherKey);
          if (cachedWeather) {
            setWeather(cachedWeather);
            const forecastKey = `forecast_${cachedPlace.latitude}_${cachedPlace.longitude}`;
            setFiveDayForecast(await readCache(forecastKey));
            setError('Modalità offline: dati dalla cache.');
            setLoading(false);
            return;
          }
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