import PropTypes from "prop-types";
import { getHourlyForecastSlice } from '../../services/weatherMappers';

function HourlyForecast({ weather }) {
  const hourlyForecast = getHourlyForecastSlice(weather);

  if (!weather?.hourly?.time || !weather?.hourly?.temperature_2m || !weather?.hourly?.precipitation) {
    return null;
  }

  if (hourlyForecast.length === 0) {
    return (
      <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "12px" }}>
        <p>Nessuna previsione oraria disponibile.</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>Previsioni orarie</h3>

      <div className="grid">
        {hourlyForecast.map((entry, index) => (
          <div
            key={entry.time}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr",
              padding: "10px",
              borderBottom: "1px solid var(--border)",
              background: index % 2 === 0 ? "var(--card-bg)" : "transparent",
              borderRadius: "4px"
            }}
          >
            <span>{entry.time}</span>
            <span>{entry.temperatureLabel}</span>
            <span>{entry.precipitationLabel}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

HourlyForecast.propTypes = {
  weather: PropTypes.shape({
    current_weather: PropTypes.shape({
      time: PropTypes.string,
    }),
    hourly: PropTypes.shape({
      time: PropTypes.arrayOf(PropTypes.string),
      temperature_2m: PropTypes.arrayOf(PropTypes.number),
      precipitation: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
};

export default HourlyForecast;
