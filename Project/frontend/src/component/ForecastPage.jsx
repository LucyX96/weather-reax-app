import { useState } from 'react';

function ForecastPage() {
  const [params, setParams] = useState({ latitude: '41.90', longitude: '12.50', forecast_days: '7', hourly: 'temperature_2m,precipitation,cloud_cover' });
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const loadForecast = async () => {
    try {
      setLoading(true);
      setError('');
      setData(null);

      const url = new URL('http://localhost:3001/v1/forecast');
      Object.entries(params).forEach(([k, v]) => { if (v) url.searchParams.set(k, v); });

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
    <div style={{ maxWidth: '900px', margin: '40px auto' }}>
      <h1>Forecast avanzata</h1>
      <p>Usa i parametri per chiamare /v1/forecast.</p>

      <div style={{ display: 'grid', gap: '10px', marginBottom: '20px' }}>
        <input value={params.latitude} onChange={(e) => setParams((p) => ({ ...p, latitude: e.target.value }))} placeholder="latitude" />
        <input value={params.longitude} onChange={(e) => setParams((p) => ({ ...p, longitude: e.target.value }))} placeholder="longitude" />
        <input value={params.forecast_days} onChange={(e) => setParams((p) => ({ ...p, forecast_days: e.target.value }))} placeholder="forecast_days" />
        <input value={params.hourly} onChange={(e) => setParams((p) => ({ ...p, hourly: e.target.value }))} placeholder="hourly" />
        <button onClick={loadForecast} disabled={loading}>{loading ? 'Caricamento...' : 'Carica forecast'}</button>
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

export default ForecastPage;
