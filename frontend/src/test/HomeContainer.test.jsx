import { render, screen } from '@testing-library/react';
import HomeContainer from '../containers/HomeContainer';

vi.mock('../component/useWeather', () => ({
  default: () => ({
    place: { name: 'Roma', country: 'Italia', latitude: 41.9, longitude: 12.5 },
    weather: {
      current_weather: { temperature: 20, windspeed: 5, winddirection: 200, time: '2026-03-26T12:00' },
      hourly: {
        time: ['2026-03-26T12:00'],
        temperature_2m: [20],
        precipitation: [0],
        wind_speed_10m: [5],
        relative_humidity_2m: [60]
      }
    },
    error: '',
    loading: false,
    fiveDayForecast: null,
    multipleCitiesWeather: null,
    searchWeather: vi.fn(),
    searchMultipleCities: vi.fn(),
  }),
}));

describe('HomeContainer (Smart Component)', () => {
  it('renderizza il componente Home presentazionale con dati dal hook', () => {
    render(<HomeContainer />);

    expect(screen.getByText(/App Meteo/)).toBeInTheDocument();
    expect(screen.getByText(/Roma/)).toBeInTheDocument();
  });

  it('gestisce l\'input per il confronto città', () => {
    render(<HomeContainer />);

    const input = screen.getByPlaceholderText(/Inserisci città separate da virgola/);
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('');
  });
});
