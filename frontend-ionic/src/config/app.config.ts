/**
 * Application Configuration
 * API endpoints and authentication
 */

// Default city ID - hardcoded to avoid circular dependency with route.types.ts
const DEFAULT_CITY_ID = 'krakow';

interface ProductionConfig {
  enabled: boolean;
  baseUrl: string;
  apiKey: string;
}

interface DevelopmentConfig {
  enabled: boolean;
  baseUrl: string;
  ports: {
    foot: number;
    bicycle: number;
    car: number;
  };
}

interface AppConfig {
  production: ProductionConfig;
  development: DevelopmentConfig;
  maxWaypoints: number;
  defaultCity: string;
  getConfig: () => ProductionConfig | DevelopmentConfig;
  getOsrmUrl: (profile?: string, cityId?: string) => string;
  getHeaders: () => Record<string, string>;
}

export const CONFIG: AppConfig = {
  // Production API configuration
  production: {
    enabled: false,
    baseUrl: 'https://osrm.watchtheguide.com/api',
    apiKey: '61bb903f104f6e155de37fa44c9c4d3226b8842c36d62286c47d912eaaf42353',
  },

  // Local development configuration
  development: {
    enabled: false,
    baseUrl: 'http://localhost',
    ports: {
      foot: 5001,
      bicycle: 5002,
      car: 5003,
    },
  },

  // Maximum number of waypoints
  maxWaypoints: 10,

  // Default city ID
  defaultCity: DEFAULT_CITY_ID,

  // Get active configuration
  getConfig() {
    return this.production.enabled ? this.production : this.development;
  },

  // Build OSRM URL for given profile and city
  getOsrmUrl(profile = 'foot', cityId?: string) {
    const config = this.getConfig();
    const city = cityId || this.defaultCity;

    if ('apiKey' in config) {
      // Production: https://osrm.watchtheguide.com/api/{city}/{profile}
      return `${config.baseUrl}/${city}/${profile}`;
    } else {
      // Development: http://localhost:{port} (city-specific ports to be configured)
      const devConfig = config as DevelopmentConfig;
      const port =
        devConfig.ports[profile as keyof typeof devConfig.ports] || 5001;
      return `${devConfig.baseUrl}:${port}`;
    }
  },

  // Get headers for API requests
  getHeaders(): Record<string, string> {
    const config = this.getConfig();

    if ('apiKey' in config && config.apiKey) {
      return {
        'X-API-Key': config.apiKey,
      };
    }

    return {};
  },
};

export default CONFIG;
