// WeatherService.js
// Servizio per gestire le chiamate API ai servizi meteo
// Include geocoding, previsioni correnti, 5 giorni, ecc.

const BACKEND_URL = 'http://localhost:3001';

// Funzione per geocoding
async function geocodeCity(city) {
  const response = await fetch(`${BACKEND_URL}/api/geocode?q=${encodeURIComponent(city)}`);
  if (!response.ok) {
    throw new Error(`Errore geocoding: ${response.status}`);
  }
  return await response.json();
}

// Funzione per previsioni correnti con variabili aggiuntive
async function getCurrentWeather(latitude, longitude) {
  const url = new URL(`${BACKEND_URL}/v1/forecast`);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('hourly', 'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,relative_humidity_2m');
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min,precipitation_sum');
  url.searchParams.set('current_weather', 'true');
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Errore meteo: ${response.status}`);
  }
  return await response.json();
}

// Funzione per previsioni a 5 giorni
async function getFiveDayForecast(latitude, longitude) {
  const url = new URL(`${BACKEND_URL}/v1/forecast`);
  url.searchParams.set('latitude', latitude);
  url.searchParams.set('longitude', longitude);
  url.searchParams.set('daily', 'temperature_2m_max,temperature_2m_min');
  url.searchParams.set('forecast_days', '5');
  url.searchParams.set('timezone', 'auto');

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Errore forecast 5 giorni: ${response.status}`);
  }
  const data = await response.json();

  // Trasforma in array [{ date, min, max }]
  if (!data.daily || !data.daily.time) {
    throw new Error('Dati forecast non disponibili');
  }
  return data.daily.time.map((date, index) => ({
    date,
    min: data.daily.temperature_2m_min[index],
    max: data.daily.temperature_2m_max[index]
  }));
}

// Funzione per meteo corrente di più città
async function getMultipleCitiesWeather(cities) {
  // Prima geocoding per tutte le città
  const geocodes = await Promise.all(cities.map(city => geocodeCity(city)));

  // Poi previsioni correnti in parallelo
  const weatherPromises = geocodes.map(({ latitude, longitude, name, country }) =>
    getCurrentWeather(latitude, longitude).then(weather => ({
      city: `${name}, ${country}`,
      temperature: weather.current_weather.temperature,
      weather: weather.current_weather.weathercode ? getWeatherDescription(weather.current_weather.weathercode) : 'N/A'
    }))
  );

  return await Promise.all(weatherPromises);
}

// Funzione helper per descrizione meteo (semplificata)
function getWeatherDescription(code) {
  // Mappa semplificata dei codici WMO
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
    99: 'Temporale con grandine'
  };
  return descriptions[code] || 'Condizioni variabili';
}

export { geocodeCity, getCurrentWeather, getFiveDayForecast, getMultipleCitiesWeather };