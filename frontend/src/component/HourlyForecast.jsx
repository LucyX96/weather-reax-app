import PropTypes from "prop-types";

function HourlyForecast({ weather }) {
  if (!weather?.hourly?.time || !weather?.hourly?.temperature_2m || !weather?.hourly?.precipitation) return null;

  const nowIndex = weather?.current_weather?.time ? weather.hourly.time.indexOf(weather.current_weather.time) : -1;
  const start = nowIndex >= 0 ? nowIndex : 0;
  const times = weather.hourly.time.slice(start, start + 12);
  const temperatures = weather.hourly.temperature_2m.slice(start, start + 12);
  const precipitation = weather.hourly.precipitation.slice(start, start + 12);

  if (times.length === 0 || temperatures.length === 0 || precipitation.length === 0) {
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
        {times.map((time, index) => (
          <div
            key={time}
            style={{
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr",
              padding: "10px",
              borderBottom: "1px solid var(--border)",
              background: index % 2 === 0 ? "var(--card-bg)" : "transparent",
              borderRadius: "4px"
            }}
          >
            <span>{time}</span>
            <span>{temperatures[index] !== undefined ? `${temperatures[index]} °C` : 'N/A'}</span>
            <span>{precipitation[index] !== undefined ? `${precipitation[index]} mm` : 'N/A'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

HourlyForecast.propTypes = {
  weather: PropTypes.shape({
    hourly: PropTypes.shape({
      time: PropTypes.arrayOf(PropTypes.string),
      temperature_2m: PropTypes.arrayOf(PropTypes.number),
      precipitation: PropTypes.arrayOf(PropTypes.number),
    }),
  }),
};

export default HourlyForecast;