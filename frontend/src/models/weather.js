export const ENDPOINTS = {
  GEO_CODE: '/api/geocode',
  FORECAST: '/v1/forecast',
};

export const CACHE_KEYS = {
  GEOCODE: (city) => `geocode_${city.toLowerCase()}`,
  CURRENT_WEATHER: (lat, lon) => `weather_${lat}_${lon}`,
  FORECAST: (lat, lon) => `forecast_${lat}_${lon}`,
};
