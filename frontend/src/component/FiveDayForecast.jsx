import PropTypes from "prop-types";

function FiveDayForecast({ forecast }) {
  if (!forecast || !Array.isArray(forecast)) return null;

  return (
    <div className="card">
      <h3>Previsioni a 5 giorni</h3>
      <div className="grid">
        {forecast.map((day, index) => (
          <div
            key={day.date}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              padding: "10px",
              borderBottom: index < forecast.length - 1 ? "1px solid var(--border)" : "none",
              alignItems: "center",
              background: index % 2 === 0 ? "var(--card-bg)" : "transparent",
              borderRadius: "4px"
            }}
          >
            <span style={{ fontWeight: "bold" }}>{new Date(day.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
            <span>Min: {day.min ?? 'N/A'}°C</span>
            <span>Max: {day.max ?? 'N/A'}°C</span>
          </div>
        ))}
      </div>
    </div>
  );
}

FiveDayForecast.propTypes = {
  forecast: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      min: PropTypes.number,
      max: PropTypes.number
    })
  )
};

export default FiveDayForecast;