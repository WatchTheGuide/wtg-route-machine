import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.VITE_DEV_SERVER_URL || 'http://localhost:5174',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },

    env: {
      apiUrl: process.env.VITE_API_URL || 'http://localhost:3000',
      // Admin credentials for E2E testing
      adminEmail: process.env.CYPRESS_ADMIN_EMAIL || 'admin@wtg-tours.com',
      adminPassword: process.env.CYPRESS_ADMIN_PASSWORD || 'test-password-123',
    },
  },
});
