import PropTypes from "prop-types";
import { formatOrNA } from '../../services/helpers';
import { getCurrentWeatherMetrics } from '../../services/weatherMappers';

function WeatherCard({ place, weather }) {
  const metrics = getCurrentWeatherMetrics(weather);

  if (!place || !metrics) return null;

  const { current, windSpeed, precipitation, humidity } = metrics;

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
          <p><span className="weather-icon">💨</span><strong>Vento:</strong> {formatOrNA(windSpeed, 'km/h')}</p>
        </div>
        <div>
          <p><span className="weather-icon">🧭</span><strong>Direzione:</strong> {current.winddirection == null ? 'N/A' : `${current.winddirection}°`}</p>
        </div>
        <div>
          <p><span className="weather-icon">💧</span><strong>Precipitazione:</strong> {formatOrNA(precipitation, 'mm')}</p>
        </div>
        <div>
          <p><span className="weather-icon">💦</span><strong>Umidità:</strong> {humidity == null ? 'N/A' : `${humidity}%`}</p>
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
