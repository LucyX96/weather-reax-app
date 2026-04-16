import { useState } from 'react';
import ForecastPage from '../component/ForecastPage';

/**
 * ForecastContainer
 * Smart container for the forecast page
 */
function ForecastContainer() {
  const [params, setParams] = useState({
    latitude: '41.90',
    longitude: '12.50',
    forecast_days: '7',
    hourly: 'temperature_2m,precipitation,cloud_cover',
  });
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadForecast = async () => {
    try {
      setLoading(true);
      setError('');
      setData(null);

      const url = new URL('http://localhost:3001/v1/forecast');
      Object.entries(params).forEach(([k, v]) => {
        if (v) url.searchParams.set(k, v);
      });

      const response = await fetch(url.toString());
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Errore di forecast');
      }

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForecastPage
      params={params}
      onParamsChange={setParams}
      data={data}
      error={error}
      loading={loading}
      onLoadForecast={loadForecast}
    />
  );
}

export default ForecastContainer;
