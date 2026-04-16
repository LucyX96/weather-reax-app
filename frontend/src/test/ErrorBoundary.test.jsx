import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../component/ErrorBoundary';

function Bomb() {
  throw new Error('Boom');
}

describe('ErrorBoundary', () => {
  it('mostra fallback quando il figlio genera errore', () => {
    render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText(/Ops! Qualcosa è andato storto/)).toBeInTheDocument();

    // Per questo test verifichiamo il fallback in caso di errore, senza tentare recovery
    expect(screen.getByText(/Ops! Qualcosa è andato storto/)).toBeInTheDocument();
  });
});
