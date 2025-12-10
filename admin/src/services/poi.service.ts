/**
 * POI Service - Admin POI API calls
 * Handles fetching POI data for city selection and tour association
 */

import apiClient from './api.client';

// POI category aligned with backend
export type POICategory =
  | 'landmark'
  | 'museum'
  | 'park'
  | 'restaurant'
  | 'viewpoint'
  | 'church';

// POI from backend API
export interface CityPOI {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [longitude, latitude]
  category: POICategory;
  imageUrl?: string;
  thumbnailUrl?: string;
  estimatedTime?: number; // minutes
  openingHours?: string;
  closedDays?: string;
  website?: string;
  address?: string;
  ticketPrice?: string;
  tags?: string[];
}

export interface CityInfo {
  id: string;
  name: string;
  poiCount: number;
}

export interface CategoryInfo {
  id: POICategory;
  name: string;
  icon: string;
  color: string;
}

export interface POIListResponse {
  city: string;
  count: number;
  pois: CityPOI[];
}

export interface POICitiesResponse {
  cities: CityInfo[];
}

export interface CategoriesResponse {
  categories: CategoryInfo[];
}

export interface NearbyPOIResponse {
  city: string;
  location: { lon: number; lat: number };
  radius: number;
  count: number;
  pois: (CityPOI & { distance: number })[];
}

/**
 * POI Service
 */
export const poiService = {
  /**
   * Get all cities with POI counts
   */
  async getCities(): Promise<CityInfo[]> {
    const response = await apiClient.get<POICitiesResponse>('/api/poi/cities');
    return response.cities;
  },

  /**
   * Get all POI categories
   */
  async getCategories(): Promise<CategoryInfo[]> {
    const response = await apiClient.get<CategoriesResponse>(
      '/api/poi/categories'
    );
    return response.categories;
  },

  /**
   * Get POIs for a specific city
   * @param cityId - City identifier (krakow, warszawa, wroclaw, trojmiasto)
   * @param categories - Optional filter by categories
   */
  async getPOIsForCity(
    cityId: string,
    categories?: POICategory[]
  ): Promise<CityPOI[]> {
    const params: Record<string, string> = {};
    if (categories && categories.length > 0) {
      params.category = categories.join(',');
    }
    const response = await apiClient.get<POIListResponse>(
      `/api/poi/${cityId}`,
      params
    );
    return response.pois;
  },

  /**
   * Get POI by ID
   * @param cityId - City identifier
   * @param poiId - POI identifier
   */
  async getPOI(cityId: string, poiId: string): Promise<CityPOI> {
    const response = await apiClient.get<{ poi: CityPOI }>(
      `/api/poi/${cityId}/${poiId}`
    );
    return response.poi;
  },

  /**
   * Search POIs by query string
   * @param cityId - City identifier
   * @param query - Search query
   */
  async searchPOIs(cityId: string, query: string): Promise<CityPOI[]> {
    const response = await apiClient.get<{
      pois: CityPOI[];
      query: string;
      count: number;
    }>(`/api/poi/${cityId}/search`, { q: query });
    return response.pois;
  },

  /**
   * Get nearby POIs
   * @param cityId - City identifier
   * @param lon - Longitude
   * @param lat - Latitude
   * @param radius - Radius in meters (default 500)
   */
  async getNearbyPOIs(
    cityId: string,
    lon: number,
    lat: number,
    radius: number = 500
  ): Promise<(CityPOI & { distance: number })[]> {
    const response = await apiClient.get<NearbyPOIResponse>(
      `/api/poi/${cityId}/near`,
      {
        lon: String(lon),
        lat: String(lat),
        radius: String(radius),
      }
    );
    return response.pois;
  },
};

export default poiService;
