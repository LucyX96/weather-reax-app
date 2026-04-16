import { useState } from 'react';
import ForecastPage from '../component/ForecastPage';
import { getForecastByParams } from '../services/weatherApiService';
import { normalizeError } from '../services/errorHandling';

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

      const result = await getForecastByParams(
        Object.fromEntries(Object.entries(params).filter(([, value]) => value))
      );
      setData(result);
    } catch (err) {
      setError(normalizeError(err).message);
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
