import PropTypes from "prop-types";

function CityComparison({ citiesWeather }) {
  if (!citiesWeather || !Array.isArray(citiesWeather)) return null;

  return (
    <div>
      <h3>Confronto Meteo Città</h3>
      <div className="grid grid-2">
        {citiesWeather.map((cityData, index) => (
          <div
            key={index}
            className="card"
            style={{ margin: 0 }}
          >
            <h4>{cityData.city}</h4>
            <p><span className="weather-icon">🌡️</span><strong>Temperatura:</strong> {cityData.temperature !== undefined ? `${cityData.temperature}°C` : 'N/A'}</p>
            <p><span className="weather-icon">☁️</span><strong>Condizioni:</strong> {cityData.weather}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

CityComparison.propTypes = {
  citiesWeather: PropTypes.arrayOf(
    PropTypes.shape({
      city: PropTypes.string.isRequired,
      temperature: PropTypes.number,
      weather: PropTypes.string
    })
  )
};

export default CityComparison;