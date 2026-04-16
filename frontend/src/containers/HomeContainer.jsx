import { useState } from "react";
import useWeather from "../component/useWeather";
import Home from "../component/Home";
import { parseCommaSeparatedValues } from '../services/helpers';

/**
 * HomeContainer
 * Smart component that handles state and API calls
 * Passes presentational data to Home component
 */
function HomeContainer() {
  const {
    place,
    weather,
    error,
    loading,
    fiveDayForecast,
    multipleCitiesWeather,
    searchWeather,
    searchMultipleCities,
  } = useWeather();
  const [citiesInput, setCitiesInput] = useState("");

  const handleMultipleSearch = () => {
    const cities = parseCommaSeparatedValues(citiesInput);
    if (cities.length > 0) {
      searchMultipleCities(cities);
    }
  };

  return (
    <Home
      place={place}
      weather={weather}
      error={error}
      loading={loading}
      fiveDayForecast={fiveDayForecast}
      multipleCitiesWeather={multipleCitiesWeather}
      onSearch={searchWeather}
      citiesInput={citiesInput}
      onCitiesInputChange={setCitiesInput}
      onMultipleSearch={handleMultipleSearch}
    />
  );
}

export default HomeContainer;
