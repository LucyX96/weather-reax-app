import PropTypes from "prop-types";
import { formatOrNA } from '../../services/helpers';

function WeatherCard({ place, weather }) {
  if (!place || !weather?.current_weather) return null;

  const current = weather.current_weather;
  // Extract hour from current.time (e.g., "2026-03-30T16:45" -> "2026-03-30T16:00")
  const currentHour = current.time ? current.time.substring(0, 13) + ':00' : undefined;
  const currentIndex = currentHour && weather?.hourly?.time ? weather.hourly.time.indexOf(currentHour) : -1;
  const currentPrecipitation = currentIndex >= 0 ? weather.hourly.precipitation?.[currentIndex] : undefined;
  const currentHumidity = currentIndex >= 0 ? weather.hourly.relative_humidity_2m?.[currentIndex] : undefined;
  const currentWindSpeed = currentIndex >= 0 ? weather.hourly.wind_speed_10m?.[currentIndex] : undefined;

  return (
    <div className="card">
      <h2>
        {place.name || 'Nome non disponibile'}, {place.country || 'Paese non disponibile'}
      </h2>
      <div className="grid grid-3">
        <div>
          <p><span className="weather-icon">🌡️</span><strong>Temperatura:</strong> {formatOrNA(current.temperature, '°C')}</p>
        </div>
        <div>
          <p><span className="weather-icon">💨</span><strong>Vento:</strong> {formatOrNA(currentWindSpeed, 'km/h')}</p>
        </div>
        <div>
          <p><span className="weather-icon">🧭</span><strong>Direzione:</strong> {formatOrNA(current.winddirection, '°')}</p>
        </div>
        <div>
          <p><span className="weather-icon">💧</span><strong>Precipitazione:</strong> {formatOrNA(currentPrecipitation, 'mm')}</p>
        </div>
        <div>
          <p><span className="weather-icon">💦</span><strong>Umidità:</strong> {formatOrNA(currentHumidity, '%')}</p>
        </div>
      </div>
      <p><span className="weather-icon">🕒</span><strong>Ora rilevazione:</strong> {current.time || 'N/A'}</p>
    </div>
  );
}

WeatherCard.propTypes = {
  place: PropTypes.shape({
    name: PropTypes.string,
    country: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  weather: PropTypes.shape({
    current_weather: PropTypes.shape({
      temperature: PropTypes.number,
      windspeed: PropTypes.number,
      winddirection: PropTypes.number,
      time: PropTypes.string,
    }),
    hourly: PropTypes.shape({
      time: PropTypes.arrayOf(PropTypes.string),
      precipitation: PropTypes.arrayOf(PropTypes.number),
      relative_humidity_2m: PropTypes.arrayOf(PropTypes.number),
      wind_speed_10m: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
};

export default WeatherCard;