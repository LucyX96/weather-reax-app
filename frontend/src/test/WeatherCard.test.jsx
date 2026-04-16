import { render, screen } from '@testing-library/react';
import WeatherCard from '../component/presentational/WeatherCard';

describe('WeatherCard (Presentational)', () => {
  it('non renderizza se place mancante o current_weather mancante', () => {
    const { container } = render(<WeatherCard place={null} weather={null} />);
    expect(container).toBeEmptyDOMElement();

    const { container: c2 } = render(<WeatherCard place={{ name: 'Roma', country: 'IT' }} weather={{}} />);
    expect(c2).toBeEmptyDOMElement();
  });

  it('renderizza i dati corretti se presenti', () => {
    render(
      <WeatherCard
        place={{ name: 'Roma', country: 'Italia' }}
        weather={{
          current_weather: { temperature: 15, windspeed: 10, winddirection: 270, time: '2026-03-26T10:00' },
          hourly: {
            time: ['2026-03-26T09:00', '2026-03-26T10:00', '2026-03-26T11:00'],
            precipitation: [0, 1, 0.2],
            wind_speed_10m: [5, 10, 8],
            relative_humidity_2m: [60, 65, 70],
          },
        }}
      />
    );

    expect(screen.getByText(/Roma/i)).toBeInTheDocument();
    expect(screen.getByText(/Italia/i)).toBeInTheDocument();
    expect(screen.getByText(/15 °C/)).toBeInTheDocument();
    expect(screen.getByText(/10 km\/h/)).toBeInTheDocument();
    expect(screen.getByText(/270°/)).toBeInTheDocument();
    expect(screen.getByText(/1 mm/)).toBeInTheDocument();
    expect(screen.getByText(/65%/)).toBeInTheDocument();
    expect(screen.getByText(/2026-03-26T10:00/)).toBeInTheDocument();
  });
});
