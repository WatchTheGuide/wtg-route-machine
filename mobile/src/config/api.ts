import { Capacitor } from '@capacitor/core';

/**
 * API Configuration for WTG Route Machine
 *
 * Automatically detects platform and uses correct localhost URL:
 * - iOS Simulator: localhost works
 * - Android Emulator: must use 10.0.2.2 (special IP pointing to host)
 * - Web: localhost works
 */

/**
 * Get localhost URL based on platform
 * @param port - Port number
 * @returns Correct localhost URL for current platform
 */
function getLocalhostUrl(port: number): string {
  const platform = Capacitor.getPlatform();

  // Android emulator cannot use localhost - must use 10.0.2.2
  if (platform === 'android') {
    return `http://10.0.2.2:${port}`;
  }

  // iOS simulator and web can use localhost
  return `http://localhost:${port}`;
}

export const API_CONFIG = {
  // Tours API
  // Priority: .env.production > .env.development > localhost fallback
  toursBaseUrl:
    import.meta.env.VITE_TOURS_API_URL || `${getLocalhostUrl(3002)}/api/tours`,

  // POI API
  poisBaseUrl:
    import.meta.env.VITE_POIS_API_URL || `${getLocalhostUrl(3001)}/api/pois`,

  // OSRM Routing API
  osrmBaseUrl: import.meta.env.VITE_OSRM_API_URL || getLocalhostUrl(5001),

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
