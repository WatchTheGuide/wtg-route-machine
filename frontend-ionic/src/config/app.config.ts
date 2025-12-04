/**
 * Application Configuration
 * API endpoints and authentication
 */

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
  getConfig: () => ProductionConfig | DevelopmentConfig;
  getOsrmUrl: (profile?: string) => string;
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

  // Get active configuration
  getConfig() {
    return this.production.enabled ? this.production : this.development;
  },

  // Build OSRM URL for given profile
  getOsrmUrl(profile = 'foot') {
    const config = this.getConfig();

    if ('apiKey' in config) {
      return `${config.baseUrl}/${profile}`;
    } else {
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
