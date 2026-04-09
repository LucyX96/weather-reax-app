export function buildApiError(error) {
  if (!error) {
    return new Error('Errore sconosciuto della rete');
  }

  if (error.response) {
    const message = error.response.data?.error || error.response.statusText || 'Errore API';
    const status = error.response.status;
    const err = new Error(`API error ${status}: ${message}`);
    err.status = status;
    return err;
  }

  if (error.request) {
    return new Error('Nessuna risposta dal server. Controlla la connessione.');
  }

  return new Error(error.message || 'Errore client');
}
