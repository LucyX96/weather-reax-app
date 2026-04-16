import { formatOrNA } from './helpers';

const WEATHER_DESCRIPTIONS = {
  0: 'Cielo sereno',
  1: 'Prevalentemente sereno',
  2: 'Parzialmente nuvoloso',
  3: 'Nuvoloso',
  45: 'Nebbia',
  48: 'Nebbia con brina',
  51: 'Pioggerella leggera',
  53: 'Pioggerella moderata',
  55: 'Pioggerella intensa',
  61: 'Pioggia leggera',
  63: 'Pioggia moderata',
  65: 'Pioggia intensa',
  71: 'Neve leggera',
  73: 'Neve moderata',
  75: 'Neve intensa',
  80: 'Rovesci leggeri',
  81: 'Rovesci moderati',
  82: 'Rovesci intensi',
  85: 'Rovesci di neve leggeri',
  86: 'Rovesci di neve intensi',
  95: 'Temporale',
  96: 'Temporale con grandine leggera',
  99: 'Temporale con grandine',
};

function getHourlyIndex(weather, currentTime) {
  return currentTime && weather?.hourly?.time ? weather.hourly.time.indexOf(currentTime) : -1;
}

export function getWeatherDescription(code) {
  return WEATHER_DESCRIPTIONS[code] || 'Condizioni variabili';
}

export function mapFiveDayForecast(data) {
  const daily = data?.daily;

  if (!daily?.time || !daily?.temperature_2m_min || !daily?.temperature_2m_max) {
    throw new Error('Dati forecast non disponibili');
  }

  return daily.time.map((date, index) => ({
    date,
    min: daily.temperature_2m_min[index],
    max: daily.temperature_2m_max[index],
  }));
}

export function mapCityWeather(geocode, weather) {
  return {
    city: [geocode.name, geocode.country].filter(Boolean).join(', '),
    temperature: weather.current_weather?.temperature,
    weather: getWeatherDescription(weather.current_weather?.weathercode),
  };
}

export function getCurrentWeatherMetrics(weather) {
  const current = weather?.current_weather;

  if (!current) {
    return null;
  }

  const normalizedHour = current.time ? `${current.time.slice(0, 13)}:00` : undefined;
  const currentIndex = getHourlyIndex(weather, normalizedHour);

  return {
    current,
    windSpeed: currentIndex >= 0 ? weather.hourly?.wind_speed_10m?.[currentIndex] : undefined,
    precipitation: currentIndex >= 0 ? weather.hourly?.precipitation?.[currentIndex] : undefined,
    humidity: currentIndex >= 0 ? weather.hourly?.relative_humidity_2m?.[currentIndex] : undefined,
  };
}

export function getHourlyForecastSlice(weather, limit = 12) {
  const hourly = weather?.hourly;

  if (!hourly?.time || !hourly?.temperature_2m || !hourly?.precipitation) {
    return [];
  }

  const startIndex = Math.max(getHourlyIndex(weather, weather?.current_weather?.time), 0);

  return hourly.time.slice(startIndex, startIndex + limit).map((time, index) => ({
    time,
    temperatureLabel: formatOrNA(hourly.temperature_2m[startIndex + index], '°C'),
    precipitationLabel: formatOrNA(hourly.precipitation[startIndex + index], 'mm'),
  }));
}

export function buildCurrentWeatherParams(latitude, longitude) {
  return {
    latitude,
    longitude,
    hourly:
      'temperature_2m,precipitation,cloud_cover,wind_speed_10m,wind_direction_10m,relative_humidity_2m',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum',
    current_weather: 'true',
    timezone: 'auto',
  };
}

export function buildFiveDayForecastParams(latitude, longitude) {
  return {
    latitude,
    longitude,
    daily: 'temperature_2m_max,temperature_2m_min',
    forecast_days: '5',
    timezone: 'auto',
  };
}
