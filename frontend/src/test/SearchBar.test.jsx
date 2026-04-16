import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from '../component/presentational/SearchBar';

describe('SearchBar (Presentational)', () => {
  it('chiama onSearch con valore valido', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={false} />);

    const input = screen.getByPlaceholderText('Inserisci una città...');
    const button = screen.getByRole('button', { name: /cerca/i });

    fireEvent.change(input, { target: { value: 'Roma' }});
    fireEvent.click(button);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('Roma');
  });

  it('non chiama onSearch con stringa vuota', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={false} />);

    const button = screen.getByRole('button', { name: /cerca/i });
    fireEvent.click(button);

    expect(onSearch).not.toHaveBeenCalled();
  });

  it('blocca input non valido con caratteri speciali', () => {
    const onSearch = vi.fn();

    globalThis.alert = vi.fn();

    render(<SearchBar onSearch={onSearch} loading={false} />);
    fireEvent.change(screen.getByPlaceholderText('Inserisci una città...'), { target: { value: 'R0ma!' }});
    fireEvent.click(screen.getByRole('button', { name: /cerca/i }));

    expect(globalThis.alert).toHaveBeenCalledWith('Inserisci una città valida (solo lettere, spazi, trattini o apostrofi).');
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('disabilita il bottone durante il loading', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} loading={true} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

