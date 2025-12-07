/**
 * API Configuration for WTG Route Machine
 */

export const API_CONFIG = {
  // Tours API
  toursBaseUrl:
    import.meta.env.VITE_TOURS_API_URL || 'http://localhost:3002/api/tours',

  // POI API
  poisBaseUrl:
    import.meta.env.VITE_POIS_API_URL || 'http://localhost:3001/api/pois',

  // OSRM Routing API
  osrmBaseUrl: import.meta.env.VITE_OSRM_API_URL || 'http://localhost:5001',

  // API Key (optional - only required in production)
  apiKey: import.meta.env.VITE_API_KEY || '',

  // Whether API key is required
  requireApiKey: import.meta.env.VITE_REQUIRE_API_KEY === 'true',
} as const;

/**
 * Get headers with optional API key
 */
export function getApiHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (API_CONFIG.requireApiKey && API_CONFIG.apiKey) {
    headers['X-API-Key'] = API_CONFIG.apiKey;
  }

  return headers;
}
