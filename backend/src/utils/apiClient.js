/**
 * Utility for building external API URLs
 */
function buildExternalUrl(base, path, params = {}) {
  const url = new URL(`${base}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
}

/**
 * Utility for building fetch options
 */
function buildFetchOptions(signal, apiKey = null) {
  const headers = {
    'Accept': 'application/json',
  };
  if (apiKey) {
    headers['X-API-Key'] = apiKey;
  }
  return { signal, headers };
}

module.exports = {
  buildExternalUrl,
  buildFetchOptions,
};
