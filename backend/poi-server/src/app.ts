/**
 * Express App Configuration
 */

import express, { type Express, type Request, type Response } from 'express';
import cors from 'cors';
import { poiRoutes } from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'poi-server',
      timestamp: new Date().toISOString(),
    });
  });

  // POI routes
  app.use('/', poiRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not found',
      code: 'NOT_FOUND',
    });
  });

  return app;
}
