/* eslint-env vitest */
import { render, screen } from '@testing-library/react';
import Home from '../component/Home';

vi.mock('../component/useWeather', () => ({
  default: () => ({
    place: { name: 'Roma', country: 'Italia' },
    weather: { current_weather: { temperature: 20, windspeed: 5, winddirection: 200, time: '2026-03-26T12:00' }, hourly: { time: ['t1'], temperature_2m: [20], precipitation: [0] } },
    error: '',
    loading: false,
    searchWeather: vi.fn(),
  }),
}));

describe('Home', () => {
  it('visualizza i componenti e i dati', () => {
    render(<Home />);

    expect(screen.getByText(/App Meteo/)).toBeInTheDocument();
    expect(screen.getByText(/Roma/)).toBeInTheDocument();
    expect(screen.getAllByText(/20 °C/).length).toBeGreaterThanOrEqual(1);
  });
});
