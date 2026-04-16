import apiClient from '../services/ApiClient';
import { renderHook, act } from '@testing-library/react';
import useWeather from '../component/useWeather';

describe('useWeather', () => {
  beforeEach(() => {
    apiClient.get = vi.fn();
    globalThis.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    globalThis.navigator = { onLine: true };
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('gestisce geocoding OK e meteo OK', async () => {
    globalThis.localStorage.getItem.mockReturnValue(null); // No cache
    apiClient.get
      .mockResolvedValueOnce({ data: { latitude: 41.9, longitude: 12.5, name: 'Roma', country: 'Italia' } })
      .mockResolvedValueOnce({ data: { current_weather: { temperature: 10, windspeed: 5, winddirection: 180, time: '2026-03-26T10:00' }, hourly: { time: ['t1'], temperature_2m: [10], precipitation: [0], wind_speed_10m: [5], relative_humidity_2m: [60] } } })
      .mockResolvedValueOnce({ data: { daily: { time: ['2026-03-26'], temperature_2m_min: [8], temperature_2m_max: [15] } } });

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchWeather('Roma');
    });

    expect(result.current.place).toEqual({ latitude: 41.9, longitude: 12.5, name: 'Roma', country: 'Italia' });
    expect(result.current.weather).toHaveProperty('current_weather');
    expect(result.current.fiveDayForecast).toHaveLength(1);
    expect(result.current.error).toBe('');
    expect(result.current.loading).toBe(false);
  });

  it('gestisce errore fetch connessione', async () => {
    globalThis.localStorage.getItem.mockReturnValue(null);
    apiClient.get.mockRejectedValue({ request: {}, message: 'Network Error' });

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchWeather('Roma');
    });

    expect(result.current.error).toContain('Geocoding error');
    expect(result.current.weather).toBeNull();
  });

  it('usa cache quando offline', async () => {
    const cachedPlace = { latitude: 41.9, longitude: 12.5, name: 'Roma', country: 'Italia' };
    const cachedWeather = { current_weather: { temperature: 10, windspeed: 5, winddirection: 180, time: '2026-03-26T10:00' }, hourly: { time: ['t1'], temperature_2m: [10], precipitation: [0], wind_speed_10m: [5], relative_humidity_2m: [60] } };
    const cachedForecast = [{ date: '2026-03-26', min: 8, max: 15 }];

    globalThis.localStorage.getItem
      .mockReturnValueOnce(JSON.stringify({ data: cachedPlace, createdAt: Date.now(), ttl: 3600000 })) // geocode cache
      .mockReturnValueOnce(JSON.stringify({ data: cachedWeather, createdAt: Date.now(), ttl: 3600000 })) // weather cache
      .mockReturnValueOnce(JSON.stringify({ data: cachedForecast, createdAt: Date.now(), ttl: 3600000 })); // forecast cache
    globalThis.navigator.onLine = false;

    const { result } = renderHook(() => useWeather());

    await act(async () => {
      await result.current.searchWeather('Roma');
    });

    expect(result.current.place).toEqual(cachedPlace);
    expect(result.current.weather).toEqual(cachedWeather);
    expect(result.current.fiveDayForecast).toEqual(cachedForecast);
    expect(result.current.error).toBe('Modalità offline: dati dalla cache.');
    expect(result.current.loading).toBe(false);
  });
});
