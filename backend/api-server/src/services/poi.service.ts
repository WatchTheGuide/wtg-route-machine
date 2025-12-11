/**
 * POI Service
 * Handles loading and querying POI data
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import type {
  POI,
  POICity,
  CategoryInfo,
  CityInfo,
  POICategory,
} from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data directory path
const DATA_DIR = join(__dirname, '..', 'data', 'poi');

// Cache for loaded data
let citiesCache: Map<string, POICity> | null = null;
let categoriesCache: CategoryInfo[] | null = null;

/**
 * Load categories from JSON file
 */
export function loadCategories(): CategoryInfo[] {
  if (categoriesCache) {
    return categoriesCache;
  }

  const filePath = join(DATA_DIR, 'categories.json');
  if (!existsSync(filePath)) {
    throw new Error('Categories file not found');
  }

  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  categoriesCache = data.categories as CategoryInfo[];
  return categoriesCache;
}

/**
 * Load POI data for a specific city
 */
function loadCityData(cityId: string): POICity | null {
  const filePath = join(DATA_DIR, `${cityId}.json`);
  if (!existsSync(filePath)) {
    return null;
  }

  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  return data as POICity;
}

/**
 * Save POI data for a specific city
 */
function saveCityData(cityId: string, data: POICity): void {
  const filePath = join(DATA_DIR, `${cityId}.json`);
  writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');

  // Update cache if it exists
  if (citiesCache && citiesCache.has(cityId)) {
    citiesCache.set(cityId, data);
  }
}

/**
 * Load all cities data
 */
export function loadAllCities(): Map<string, POICity> {
  if (citiesCache) {
    return citiesCache;
  }

  const cityIds = ['krakow', 'warszawa', 'wroclaw', 'trojmiasto'];
  const cities = new Map<string, POICity>();

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
export function getCities(): CityInfo[] {
  const cities = loadAllCities();
  const result: CityInfo[] = [];

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
export function getPOIsForCity(
  cityId: string,
  categories?: POICategory[]
): POI[] | null {
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
export function getCityName(cityId: string): string | null {
  const cities = loadAllCities();
  const city = cities.get(cityId);
  return city?.name ?? null;
}

/**
 * Get a specific POI by city and POI ID
 */
export function getPOI(cityId: string, poiId: string): POI | null {
  const cities = loadAllCities();
  const city = cities.get(cityId);

  if (!city) {
    return null;
  }

  return city.pois.find((poi) => poi.id === poiId) ?? null;
}

/**
 * Helper function to search in LocalizedString
 */
function localizedStringIncludes(
  ls: { pl: string; en?: string; de?: string; fr?: string; uk?: string },
  query: string
): boolean {
  const q = query.toLowerCase();
  return (
    ls.pl?.toLowerCase().includes(q) ||
    ls.en?.toLowerCase().includes(q) ||
    ls.de?.toLowerCase().includes(q) ||
    ls.fr?.toLowerCase().includes(q) ||
    ls.uk?.toLowerCase().includes(q) ||
    false
  );
}

/**
 * Search POIs by query string
 */
export function searchPOIs(cityId: string, query: string): POI[] | null {
  const cities = loadAllCities();
  const city = cities.get(cityId);

  if (!city) {
    return null;
  }

  const lowerQuery = query.toLowerCase();

  return city.pois.filter((poi) => {
    // Search in name (all languages)
    if (localizedStringIncludes(poi.name, lowerQuery)) {
      return true;
    }
    // Search in description (all languages)
    if (localizedStringIncludes(poi.description, lowerQuery)) {
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
function getDistance(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
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
export function getNearbyPOIs(
  cityId: string,
  lon: number,
  lat: number,
  radiusMeters: number = 1000
): (POI & { distance: number })[] | null {
  const cities = loadAllCities();
  const city = cities.get(cityId);

  if (!city) {
    return null;
  }

  const results = city.pois
    .map((poi) => {
      const distance = getDistance(
        lon,
        lat,
        poi.coordinates[0],
        poi.coordinates[1]
      );
      return { ...poi, distance };
    })
    .filter((poi) => poi.distance <= radiusMeters)
    .sort((a, b) => a.distance - b.distance);

  return results;
}

/**
 * Clear cache (useful for testing or hot-reload)
 */
export function clearPOICache(): void {
  citiesCache = null;
  categoriesCache = null;
}

/**
 * Check if a city exists
 */
export function cityExists(cityId: string): boolean {
  const cities = loadAllCities();
  return cities.has(cityId);
}

/**
 * Validate category
 */
export function isValidCategory(category: string): category is POICategory {
  const validCategories: POICategory[] = [
    'landmark',
    'museum',
    'park',
    'restaurant',
    'viewpoint',
    'church',
  ];
  return validCategories.includes(category as POICategory);
}

/**
 * Parse categories from query string
 */
export function parseCategories(categoryParam?: string): POICategory[] {
  if (!categoryParam) {
    return [];
  }

  return categoryParam
    .split(',')
    .map((c) => c.trim().toLowerCase())
    .filter(isValidCategory) as POICategory[];
}

/**
 * Create a new POI
 */
export function createPOI(cityId: string, poi: Omit<POI, 'id'>): POI {
  const cityData = loadCityData(cityId);
  if (!cityData) {
    throw new Error(`City ${cityId} not found`);
  }

  const newPOI: POI = {
    ...poi,
    id: randomUUID(),
  };

  cityData.pois.push(newPOI);
  saveCityData(cityId, cityData);
  return newPOI;
}

/**
 * Update an existing POI
 */
export function updatePOI(
  cityId: string,
  poiId: string,
  updates: Partial<POI>
): POI | null {
  const cityData = loadCityData(cityId);
  if (!cityData) return null;

  const index = cityData.pois.findIndex((p) => p.id === poiId);
  if (index === -1) return null;

  // Prevent ID update
  const { id, ...safeUpdates } = updates as any;

  const updatedPOI = { ...cityData.pois[index], ...safeUpdates, id: poiId };
  cityData.pois[index] = updatedPOI;
  saveCityData(cityId, cityData);
  return updatedPOI;
}

/**
 * Delete a POI
 */
export function deletePOI(cityId: string, poiId: string): boolean {
  const cityData = loadCityData(cityId);
  if (!cityData) return false;

  const initialLength = cityData.pois.length;
  cityData.pois = cityData.pois.filter((p) => p.id !== poiId);

  if (cityData.pois.length !== initialLength) {
    saveCityData(cityId, cityData);
    return true;
  }
  return false;
}

/**
 * Get all POIs from all cities (for admin)
 */
export interface POIWithCity extends POI {
  cityId: string;
  cityName: string;
}

export function getAllPOIs(options?: {
  cityId?: string;
  category?: POICategory;
  search?: string;
}): POIWithCity[] {
  const cities = loadAllCities();
  const result: POIWithCity[] = [];

  for (const [cityId, city] of cities) {
    // Filter by city if specified
    if (options?.cityId && cityId !== options.cityId) {
      continue;
    }

    for (const poi of city.pois) {
      // Filter by category if specified
      if (options?.category && poi.category !== options.category) {
        continue;
      }

      // Filter by search query if specified
      if (options?.search) {
        const lowerQuery = options.search.toLowerCase();
        const matches =
          localizedStringIncludes(poi.name, lowerQuery) ||
          localizedStringIncludes(poi.description, lowerQuery) ||
          poi.address?.toLowerCase().includes(lowerQuery) ||
          poi.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery));
        if (!matches) {
          continue;
        }
      }

      result.push({
        ...poi,
        cityId,
        cityName: city.name,
      });
    }
  }

  return result;
}

/**
 * Get POI statistics for admin dashboard
 */
export function getPOIStats(): {
  totalPOIs: number;
  byCity: { cityId: string; cityName: string; count: number }[];
  byCategory: { category: POICategory; count: number }[];
} {
  const cities = loadAllCities();
  const byCity: { cityId: string; cityName: string; count: number }[] = [];
  const categoryCount = new Map<POICategory, number>();
  let totalPOIs = 0;

  for (const [cityId, city] of cities) {
    byCity.push({
      cityId,
      cityName: city.name,
      count: city.pois.length,
    });
    totalPOIs += city.pois.length;

    for (const poi of city.pois) {
      categoryCount.set(
        poi.category,
        (categoryCount.get(poi.category) || 0) + 1
      );
    }
  }

  const byCategory = Array.from(categoryCount.entries()).map(
    ([category, count]) => ({
      category,
      count,
    })
  );

  return { totalPOIs, byCity, byCategory };
}

/**
 * Bulk delete POIs
 */
export function bulkDeletePOIs(items: { cityId: string; poiId: string }[]): {
  deleted: number;
  failed: number;
} {
  let deleted = 0;
  let failed = 0;

  for (const { cityId, poiId } of items) {
    if (deletePOI(cityId, poiId)) {
      deleted++;
    } else {
      failed++;
    }
  }

  return { deleted, failed };
}
