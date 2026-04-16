import { render, screen } from '@testing-library/react';
import Home from '../component/Home';

describe('Home (Presentational)', () => {
  const mockSetCitiesInput = vi.fn();
  const mockOnSearch = vi.fn();
  const mockOnMultipleSearch = vi.fn();

  it('visualizza i componenti e i dati ricevuti come props', () => {
    render(
      <Home
        place={{ name: 'Roma', country: 'Italia' }}
        weather={{
          current_weather: { temperature: 20, windspeed: 5, winddirection: 200, time: '2026-03-26T12:00' },
          hourly: { time: ['t1'], temperature_2m: [20], precipitation: [0], wind_speed_10m: [5], relative_humidity_2m: [60] }
        }}
        error=""
        loading={false}
        fiveDayForecast={null}
        multipleCitiesWeather={null}
        onSearch={mockOnSearch}
        citiesInput=""
        onCitiesInputChange={mockSetCitiesInput}
        onMultipleSearch={mockOnMultipleSearch}
      />
    );

    expect(screen.getByText(/App Meteo/)).toBeInTheDocument();
    expect(screen.getByText(/Roma/)).toBeInTheDocument();
  });
});

