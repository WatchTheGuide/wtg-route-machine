/**
 * Express App Configuration
 */
import express from 'express';
import cors from 'cors';
import { poiRoutes } from './routes/index.js';
export function createApp() {
    const app = express();
    // Middleware
    app.use(cors());
    app.use(express.json());
    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.json({
            status: 'ok',
            service: 'poi-server',
            timestamp: new Date().toISOString(),
        });
    });
    // POI routes
    app.use('/', poiRoutes);
    // 404 handler
    app.use((_req, res) => {
        res.status(404).json({
            error: 'Not found',
            code: 'NOT_FOUND',
        });
    });
    return app;
}
//# sourceMappingURL=app.js.map