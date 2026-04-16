import PropTypes from 'prop-types';

/**
 * ForecastPage
 * Presentational component - receives all data as props from ForecastContainer
 * No internal state, no API calls
 */
function ForecastPage({
  params,
  onParamsChange,
  data,
  error,
  loading,
  onLoadForecast,
}) {
  return (
    <div style={{ maxWidth: '900px', margin: '40px auto' }}>
      <h1>Forecast avanzata</h1>
      <p>Usa i parametri per chiamare /v1/forecast.</p>

      <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
        <input
          value={params.latitude}
          onChange={(e) => onParamsChange((p) => ({ ...p, latitude: e.target.value }))}
          placeholder="latitude"
        />
        <input
          value={params.longitude}
          onChange={(e) => onParamsChange((p) => ({ ...p, longitude: e.target.value }))}
          placeholder="longitude"
        />
        <input
          value={params.forecast_days}
          onChange={(e) => onParamsChange((p) => ({ ...p, forecast_days: e.target.value }))}
          placeholder="forecast_days"
        />
        <input
          value={params.hourly}
          onChange={(e) => onParamsChange((p) => ({ ...p, hourly: e.target.value }))}
          placeholder="hourly"
        />
        <button onClick={onLoadForecast} disabled={loading}>
          {loading ? 'Caricamento...' : 'Carica forecast'}
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '16px' }}>{error}</div>}

      {data && (
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', background: '#f5f5f5', padding: '12px', borderRadius: '8px' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}

ForecastPage.propTypes = {
  params: PropTypes.shape({
    latitude: PropTypes.string.isRequired,
    longitude: PropTypes.string.isRequired,
    forecast_days: PropTypes.string,
    hourly: PropTypes.string,
  }).isRequired,
  onParamsChange: PropTypes.func.isRequired,
  data: PropTypes.object,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  onLoadForecast: PropTypes.func.isRequired,
};

export default ForecastPage;
