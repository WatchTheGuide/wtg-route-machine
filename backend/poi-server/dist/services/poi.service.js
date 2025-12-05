/**
 * POI Service
 * Handles loading and querying POI data
 */
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Data directory path
const DATA_DIR = join(__dirname, '..', 'data');
// Cache for loaded data
let citiesCache = null;
let categoriesCache = null;
/**
 * Load categories from JSON file
 */
export function loadCategories() {
    if (categoriesCache) {
        return categoriesCache;
    }
    const filePath = join(DATA_DIR, 'categories.json');
    if (!existsSync(filePath)) {
        throw new Error('Categories file not found');
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    categoriesCache = data.categories;
    return categoriesCache;
}
/**
 * Load POI data for a specific city
 */
function loadCityData(cityId) {
    const filePath = join(DATA_DIR, `${cityId}.json`);
    if (!existsSync(filePath)) {
        return null;
    }
    const data = JSON.parse(readFileSync(filePath, 'utf-8'));
    return data;
}
/**
 * Load all cities data
 */
export function loadAllCities() {
    if (citiesCache) {
        return citiesCache;
    }
    const cityIds = ['krakow', 'warszawa', 'wroclaw', 'trojmiasto'];
    const cities = new Map();
    for (const cityId of cityIds) {
        const cityData = loadCityData(cityId);
        if (cityData) {
            cities.set(cityId, cityData);
        }
    }
    citiesCache = cities;
    return cities;
}
/**
 * Get list of cities with POI counts
 */
export function getCities() {
    const cities = loadAllCities();
    const result = [];
    for (const [id, city] of cities) {
        result.push({
            id,
            name: city.name,
            poiCount: city.pois.length,
        });
    }
    return result;
}
/**
 * Get POIs for a specific city
 */
export function getPOIsForCity(cityId, categories) {
    const cities = loadAllCities();
    const city = cities.get(cityId);
    if (!city) {
        return null;
    }
    let pois = city.pois;
    // Filter by categories if specified
    if (categories && categories.length > 0) {
        pois = pois.filter((poi) => categories.includes(poi.category));
    }
    return pois;
}
/**
 * Get city name by ID
 */
export function getCityName(cityId) {
    const cities = loadAllCities();
    const city = cities.get(cityId);
    return city?.name ?? null;
}
/**
 * Get a specific POI by city and POI ID
 */
export function getPOI(cityId, poiId) {
    const cities = loadAllCities();
    const city = cities.get(cityId);
    if (!city) {
        return null;
    }
    return city.pois.find((poi) => poi.id === poiId) ?? null;
}
/**
 * Search POIs by query string
 */
export function searchPOIs(cityId, query) {
    const cities = loadAllCities();
    const city = cities.get(cityId);
    if (!city) {
        return null;
    }
    const lowerQuery = query.toLowerCase();
    return city.pois.filter((poi) => {
        // Search in name
        if (poi.name.toLowerCase().includes(lowerQuery)) {
            return true;
        }
        // Search in description
        if (poi.description.toLowerCase().includes(lowerQuery)) {
            return true;
        }
        // Search in tags
        if (poi.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
            return true;
        }
        // Search in address
        if (poi.address?.toLowerCase().includes(lowerQuery)) {
            return true;
        }
        return false;
    });
}
/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in meters
 */
function getDistance(lon1, lat1, lon2, lat2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
/**
 * Get POIs near a specific location
 */
export function getNearbyPOIs(cityId, lon, lat, radiusMeters = 1000) {
    const cities = loadAllCities();
    const city = cities.get(cityId);
    if (!city) {
        return null;
    }
    const results = city.pois
        .map((poi) => {
        const distance = getDistance(lon, lat, poi.coordinates[0], poi.coordinates[1]);
        return { ...poi, distance };
    })
        .filter((poi) => poi.distance <= radiusMeters)
        .sort((a, b) => a.distance - b.distance);
    return results;
}
/**
 * Clear cache (useful for testing or hot-reload)
 */
export function clearCache() {
    citiesCache = null;
    categoriesCache = null;
}
/**
 * Check if a city exists
 */
export function cityExists(cityId) {
    const cities = loadAllCities();
    return cities.has(cityId);
}
/**
 * Validate category
 */
export function isValidCategory(category) {
    const validCategories = [
        'landmark',
        'museum',
        'park',
        'restaurant',
        'viewpoint',
        'church',
    ];
    return validCategories.includes(category);
}
/**
 * Parse categories from query string
 */
export function parseCategories(categoryParam) {
    if (!categoryParam) {
        return [];
    }
    return categoryParam
        .split(',')
        .map((c) => c.trim().toLowerCase())
        .filter(isValidCategory);
}
//# sourceMappingURL=poi.service.js.map