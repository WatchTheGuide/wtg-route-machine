/**
 * WTG API Server - Entry Point
 * Unified API server for POI, Tours, and Admin endpoints
 */

import app from './app.js';
import config from './config.js';
import { runMigrations } from './db/migrate.js';

const PORT = config.port;

// Run database migrations on startup (if enabled)
const startServer = async () => {
  // Run migrations automatically in development or if explicitly enabled
  if (config.nodeEnv === 'development' || config.autoMigrate) {
    try {
      console.log('🔄 Checking database migrations...');
      await runMigrations();
    } catch (error) {
      console.error('❌ Migration failed:', error);
      // In production, exit on migration failure
      if (config.nodeEnv === 'production') {
        process.exit(1);
      }
    }
  }

  app.listen(PORT, () => {
    console.log('');
    console.log('='.repeat(50));
    console.log('🚀 WTG API Server');
    console.log('='.repeat(50));
    console.log(`   Port: ${PORT}`);
    console.log(`   Environment: ${config.nodeEnv}`);
    console.log('');
    console.log('📍 Public Endpoints:');
    console.log(`   Health:     http://localhost:${PORT}/health`);
    console.log(`   POI:        http://localhost:${PORT}/api/poi`);
    console.log(`   Tours:      http://localhost:${PORT}/api/tours`);
    console.log('');
    console.log('🔐 Admin Endpoints:');
    console.log(`   Auth:       http://localhost:${PORT}/api/admin/auth`);
    console.log(`   Tours:      http://localhost:${PORT}/api/admin/tours`);
    console.log('='.repeat(50));
    console.log('');
  });
};

// Start the server
startServer();
