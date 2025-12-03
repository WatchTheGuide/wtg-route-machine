/**
 * WTG Route Machine - Configuration
 * API endpoints and authentication
 */

const CONFIG = {
  // Production API configuration
  production: {
    enabled: true,
    baseUrl: 'https://osrm.watchtheguide.com/api',
    apiKey: 'dev-test-key-12345', // TODO: Replace with production key
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

  // Get active configuration
  getConfig() {
    return this.production.enabled ? this.production : this.development;
  },

  // Build OSRM URL for given profile
  getOsrmUrl(profile = 'foot') {
    const config = this.getConfig();

    if (config === this.production) {
      return `${config.baseUrl}/${profile}`;
    } else {
      const port = config.ports[profile] || 5001;
      return `${config.baseUrl}:${port}`;
    }
  },

  // Get headers for API requests
  getHeaders() {
    const config = this.getConfig();

    if (config === this.production && config.apiKey) {
      return {
        'X-API-Key': config.apiKey,
      };
    }

    return {};
  },
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
