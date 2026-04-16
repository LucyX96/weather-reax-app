import PropTypes from "prop-types";
import HourlyForecast from "./presentational/HourlyForecast";
import SearchBar from "./presentational/SearchBar";
import WeatherCard from "./presentational/WeatherCard";
import FiveDayForecast from "./presentational/FiveDayForecast";
import CityComparison from "./presentational/CityComparison";

/**
 * Home
 * Presentational component - receives all data as props from HomeContainer
 * No internal state, no API calls
 */
function Home({
  place,
  weather,
  error,
  loading,
  fiveDayForecast,
  multipleCitiesWeather,
  onSearch,
  citiesInput,
  onCitiesInputChange,
  onMultipleSearch,
}) {
  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
      <h1>App Meteo</h1>

      <SearchBar onSearch={onSearch} loading={loading} />

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <WeatherCard place={place} weather={weather} />
      <FiveDayForecast forecast={fiveDayForecast} />
      <HourlyForecast weather={weather} />

      {/* Sezione confronto città */}
      <div className="card">
        <h2>Confronto Meteo tra Città</h2>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Inserisci città separate da virgola (es. Roma, Milano, Napoli)"
            value={citiesInput}
            onChange={(e) => onCitiesInputChange(e.target.value)}
            style={{
              flex: 1,
              minWidth: "200px",
            }}
          />
          <button
            onClick={onMultipleSearch}
            disabled={loading}
            style={{
              backgroundColor: loading ? "var(--border)" : "var(--primary)",
              color: "white",
            }}
          >
            {loading ? "Caricamento..." : "Confronta"}
          </button>
        </div>
        <CityComparison citiesWeather={multipleCitiesWeather} />
      </div>
    </div>
  );
}

Home.propTypes = {
  place: PropTypes.shape({
    name: PropTypes.string,
    country: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  }),
  weather: PropTypes.object,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  fiveDayForecast: PropTypes.array,
  multipleCitiesWeather: PropTypes.array,
  onSearch: PropTypes.func.isRequired,
  citiesInput: PropTypes.string.isRequired,
  onCitiesInputChange: PropTypes.func.isRequired,
  onMultipleSearch: PropTypes.func.isRequired,
};

export default Home;