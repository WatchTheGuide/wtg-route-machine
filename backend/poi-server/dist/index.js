/**
 * POI Server Entry Point
 */
import { createApp } from './app.js';
const PORT = process.env.PORT || 4000;
const app = createApp();
app.listen(PORT, () => {
    console.log(`🏛️  POI Server running on port ${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Cities: http://localhost:${PORT}/cities`);
    console.log(`   Categories: http://localhost:${PORT}/categories`);
});
//# sourceMappingURL=index.js.map