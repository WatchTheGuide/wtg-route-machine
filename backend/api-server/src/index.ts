/**
 * WTG API Server - Entry Point
 * Unified API server for POI, Tours, and Admin endpoints
 */

import app from './app.js';
import config from './config.js';

const PORT = config.port;

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
