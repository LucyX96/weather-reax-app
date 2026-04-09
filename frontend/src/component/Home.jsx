import HourlyForecast from "./HourlyForecast";
import SearchBar from "./SearchBar";
import useWeather from "./useWeather";
import WeatherCard from "./WeatherCard";
import FiveDayForecast from "./FiveDayForecast";
import CityComparison from "./CityComparison";
import { useState } from "react";

function Home() {
  const { place, weather, error, loading, fiveDayForecast, multipleCitiesWeather, searchWeather, searchMultipleCities } = useWeather();
  const [citiesInput, setCitiesInput] = useState("");

  const handleMultipleSearch = () => {
    const cities = citiesInput.split(',').map(c => c.trim()).filter(c => c);
    if (cities.length > 0) {
      searchMultipleCities(cities);
    }
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "40px auto", padding: "20px" }}>
      <h1>App Meteo</h1>

      <SearchBar onSearch={searchWeather} loading={loading} />

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
            onChange={(e) => setCitiesInput(e.target.value)}
            style={{
              flex: 1,
              minWidth: "200px",
            }}
          />
          <button
            onClick={handleMultipleSearch}
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
  // No props for this component
};

export default Home;