/* eslint-env vitest */
import { render, screen } from '@testing-library/react';
import HourlyForecast from '../component/HourlyForecast';

describe('HourlyForecast', () => {
  it('non renderizza senza dati hourly', () => {
    const { container } = render(<HourlyForecast weather={{}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('mostra messaggio se eventuali array vuoti', () => {
    render(<HourlyForecast weather={{ hourly: { time: [], temperature_2m: [], precipitation: [] } }} />);
    expect(screen.getByText(/Nessuna previsione oraria disponibile\./)).toBeInTheDocument();
  });

  it('renderizza riga previsioni con valori se presenti', () => {
    render(
      <HourlyForecast weather={{ hourly: { time: ['10:00', '11:00'], temperature_2m: [5,6], precipitation: [0,1] } }} />
    );

    expect(screen.getByText('10:00')).toBeInTheDocument();
    expect(screen.getByText('5 °C')).toBeInTheDocument();
    expect(screen.getByText('0 mm')).toBeInTheDocument();
  });
});
