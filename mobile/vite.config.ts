/// <reference types="vitest" />

import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), legacy()],
  server: {
    proxy: {
      '/api/tours': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api/poi': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/api/osrm': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
