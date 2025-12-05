/**
 * WTG Routes - App Configuration
 */

// @ts-ignore - __DEV__ is defined by React Native/Expo
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;

export const config = {
  // Base URL
  baseUrl: isDev ? 'http://localhost' : 'https://osrm.watchtheguide.com',

  // API endpoints
  endpoints: {
    poi: isDev
      ? 'http://localhost:4000/api/poi'
      : 'https://osrm.watchtheguide.com/api/poi',
    tours: isDev
      ? 'http://localhost:4001/api/tours'
      : 'https://osrm.watchtheguide.com/api/tours',
    ai: isDev
      ? 'http://localhost:4002/api/ai'
      : 'https://osrm.watchtheguide.com/api/ai',
  },

  // API Key
  apiKey: process.env.EXPO_PUBLIC_API_KEY || '',

  // Cities configuration
  cities: [
    {
      id: 'krakow',
      name: 'Kraków',
      center: [19.9449, 50.0647] as [number, number],
      zoom: 13,
      osrmPorts: { foot: 5001, bicycle: 5002, car: 5003 },
    },
    {
      id: 'warszawa',
      name: 'Warszawa',
      center: [21.0122, 52.2297] as [number, number],
      zoom: 12,
      osrmPorts: { foot: 5011, bicycle: 5012, car: 5013 },
    },
    {
      id: 'wroclaw',
      name: 'Wrocław',
      center: [17.0385, 51.1079] as [number, number],
      zoom: 13,
      osrmPorts: { foot: 5021, bicycle: 5022, car: 5023 },
    },
    {
      id: 'trojmiasto',
      name: 'Trójmiasto',
      center: [18.6466, 54.352] as [number, number],
      zoom: 11,
      osrmPorts: { foot: 5031, bicycle: 5032, car: 5033 },
    },
  ],

  // Map configuration
  map: {
    tileUrl: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    minZoom: 10,
    maxZoom: 19,
    defaultZoom: 14,
  },

  // Navigation settings
  navigation: {
    distanceThresholdMeters: 30, // Distance to trigger next step
    offRouteThresholdMeters: 50, // Distance to consider off-route
    recalculateDelayMs: 3000, // Wait before recalculating
    voiceEnabled: true,
    voiceLanguage: 'pl-PL',
  },

  // Subscription limits
  limits: {
    free: {
      savedRoutes: 3,
      aiSearchPerDay: 0,
      offlineMaps: false,
    },
    premium: {
      savedRoutes: -1, // unlimited
      aiSearchPerDay: -1, // unlimited
      offlineMaps: true,
    },
  },

  // Feature flags
  features: {
    aiSearch: true,
    offlineMaps: false, // Coming soon
    tours: true,
    cloudSync: true,
  },
} as const;

export type CityId = keyof typeof config.cities;
