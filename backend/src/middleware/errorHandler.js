/**
 * Global error handler middleware
 * Should be used as the last middleware in the app
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Handle DTO validation errors
  if (err.message?.includes('è obbligatorio')) {
    return res.status(400).json({ error: err.message });
  }

  if (err.message?.includes('non valido')) {
    return res.status(400).json({ error: err.message });
  }

  // Handle timeout errors
  if (err.message?.includes('Timeout')) {
    return res.status(504).json({ error: err.message });
  }

  // Handle not found errors
  if (err.message?.includes('non trovata')) {
    return res.status(404).json({ error: err.message });
  }

  // Handle other errors
  res.status(500).json({ error: 'Errore interno del server' });
}

module.exports = {
  errorHandler,
};
