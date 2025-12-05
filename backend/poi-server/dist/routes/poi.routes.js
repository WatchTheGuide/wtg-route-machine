/**
 * POI Routes
 */
import { Router } from 'express';
import { loadCategories, getCities, getPOIsForCity, getCityName, getPOI, searchPOIs, getNearbyPOIs, cityExists, parseCategories, } from '../services/poi.service.js';
const router = Router();
/**
 * GET /cities
 * List all cities with POI counts
 */
router.get('/cities', (_req, res) => {
    const cities = getCities();
    res.json({ cities });
});
/**
 * GET /categories
 * List all POI categories with icons and colors
 */
router.get('/categories', (_req, res) => {
    const categories = loadCategories();
    res.json({ categories });
});
/**
 * GET /:cityId
 * List POIs for a specific city
 * Query params:
 *   - category: comma-separated list of categories to filter
 */
router.get('/:cityId', (req, res) => {
    const { cityId } = req.params;
    const { category } = req.query;
    if (!cityExists(cityId)) {
        res.status(404).json({
            error: `City '${cityId}' not found`,
            code: 'CITY_NOT_FOUND',
        });
        return;
    }
    const categories = parseCategories(category);
    const pois = getPOIsForCity(cityId, categories.length > 0 ? categories : undefined);
    const cityName = getCityName(cityId);
    res.json({
        city: cityName || cityId,
        count: pois?.length || 0,
        pois: pois || [],
    });
});
/**
 * GET /:cityId/search
 * Search POIs by query string
 * Query params:
 *   - q: search query
 */
router.get('/:cityId/search', (req, res) => {
    const { cityId } = req.params;
    const { q } = req.query;
    if (!cityExists(cityId)) {
        res.status(404).json({
            error: `City '${cityId}' not found`,
            code: 'CITY_NOT_FOUND',
        });
        return;
    }
    if (!q || q.trim().length === 0) {
        res.status(400).json({
            error: 'Search query is required',
            code: 'MISSING_QUERY',
        });
        return;
    }
    const pois = searchPOIs(cityId, q.trim());
    const cityName = getCityName(cityId);
    res.json({
        city: cityName || cityId,
        query: q.trim(),
        count: pois?.length || 0,
        pois: pois || [],
    });
});
/**
 * GET /:cityId/near
 * Get POIs near a specific location
 * Query params:
 *   - lon: longitude (required)
 *   - lat: latitude (required)
 *   - radius: search radius in meters (optional, default 1000)
 */
router.get('/:cityId/near', (req, res) => {
    const { cityId } = req.params;
    const { lon, lat, radius } = req.query;
    if (!cityExists(cityId)) {
        res.status(404).json({
            error: `City '${cityId}' not found`,
            code: 'CITY_NOT_FOUND',
        });
        return;
    }
    if (!lon || !lat) {
        res.status(400).json({
            error: 'Longitude (lon) and latitude (lat) are required',
            code: 'MISSING_COORDINATES',
        });
        return;
    }
    const lonNum = parseFloat(lon);
    const latNum = parseFloat(lat);
    const radiusNum = radius ? parseInt(radius, 10) : 1000;
    if (isNaN(lonNum) || isNaN(latNum)) {
        res.status(400).json({
            error: 'Invalid coordinates',
            code: 'INVALID_COORDINATES',
        });
        return;
    }
    const pois = getNearbyPOIs(cityId, lonNum, latNum, radiusNum);
    const cityName = getCityName(cityId);
    res.json({
        city: cityName || cityId,
        location: { lon: lonNum, lat: latNum },
        radius: radiusNum,
        count: pois?.length || 0,
        pois: pois || [],
    });
});
/**
 * GET /:cityId/:poiId
 * Get details of a specific POI
 */
router.get('/:cityId/:poiId', (req, res) => {
    const { cityId, poiId } = req.params;
    if (!cityExists(cityId)) {
        res.status(404).json({
            error: `City '${cityId}' not found`,
            code: 'CITY_NOT_FOUND',
        });
        return;
    }
    const poi = getPOI(cityId, poiId);
    if (!poi) {
        res.status(404).json({
            error: `POI '${poiId}' not found in city '${cityId}'`,
            code: 'POI_NOT_FOUND',
        });
        return;
    }
    res.json({ poi });
});
export default router;
//# sourceMappingURL=poi.routes.js.map