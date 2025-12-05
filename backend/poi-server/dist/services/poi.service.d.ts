/**
 * POI Service
 * Handles loading and querying POI data
 */
import type { POI, POICity, CategoryInfo, CityInfo, POICategory } from '../types/index.js';
/**
 * Load categories from JSON file
 */
export declare function loadCategories(): CategoryInfo[];
/**
 * Load all cities data
 */
export declare function loadAllCities(): Map<string, POICity>;
/**
 * Get list of cities with POI counts
 */
export declare function getCities(): CityInfo[];
/**
 * Get POIs for a specific city
 */
export declare function getPOIsForCity(cityId: string, categories?: POICategory[]): POI[] | null;
/**
 * Get city name by ID
 */
export declare function getCityName(cityId: string): string | null;
/**
 * Get a specific POI by city and POI ID
 */
export declare function getPOI(cityId: string, poiId: string): POI | null;
/**
 * Search POIs by query string
 */
export declare function searchPOIs(cityId: string, query: string): POI[] | null;
/**
 * Get POIs near a specific location
 */
export declare function getNearbyPOIs(cityId: string, lon: number, lat: number, radiusMeters?: number): (POI & {
    distance: number;
})[] | null;
/**
 * Clear cache (useful for testing or hot-reload)
 */
export declare function clearCache(): void;
/**
 * Check if a city exists
 */
export declare function cityExists(cityId: string): boolean;
/**
 * Validate category
 */
export declare function isValidCategory(category: string): category is POICategory;
/**
 * Parse categories from query string
 */
export declare function parseCategories(categoryParam?: string): POICategory[];
//# sourceMappingURL=poi.service.d.ts.map