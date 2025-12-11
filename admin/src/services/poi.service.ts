/**
 * POI Service - Admin POI API calls
 * Handles fetching POI data for city selection and tour association
 */

import apiClient from './api.client';
import type { LocalizedString } from '@/types';

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
  name: LocalizedString;
  description: LocalizedString;
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

// Admin POI with city info
export interface AdminPOI extends CityPOI {
  cityId: string;
  cityName: string;
}

// Admin POI list response
export interface AdminPOIListResponse {
  pois: AdminPOI[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Admin POI stats response
export interface AdminPOIStatsResponse {
  totalPOIs: number;
  byCity: { cityId: string; cityName: string; count: number }[];
  byCategory: { category: POICategory; count: number }[];
  categories: CategoryInfo[];
  cities: CityInfo[];
}

// Admin POI filters
export interface AdminPOIFilters {
  cityId?: string;
  category?: POICategory;
  search?: string;
  page?: number;
  limit?: number;
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

  // ============================================
  // ADMIN POI METHODS
  // ============================================

  /**
   * Get all POIs with filters (admin)
   */
  async getAllPOIs(filters?: AdminPOIFilters): Promise<AdminPOIListResponse> {
    const params: Record<string, string> = {};
    if (filters?.cityId) params.cityId = filters.cityId;
    if (filters?.category) params.category = filters.category;
    if (filters?.search) params.search = filters.search;
    if (filters?.page) params.page = String(filters.page);
    if (filters?.limit) params.limit = String(filters.limit);

    return apiClient.get<AdminPOIListResponse>('/api/admin/poi', params);
  },

  /**
   * Get POI statistics (admin)
   */
  async getPOIStats(): Promise<AdminPOIStatsResponse> {
    return apiClient.get<AdminPOIStatsResponse>('/api/admin/poi/stats');
  },

  /**
   * Bulk delete POIs (admin)
   */
  async bulkDeletePOIs(
    items: { cityId: string; poiId: string }[]
  ): Promise<{ deleted: number; failed: number }> {
    return apiClient.post<{ deleted: number; failed: number }>(
      '/api/admin/poi/bulk-delete',
      { items }
    );
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

  /**
   * Create a new POI
   */
  async createPOI(cityId: string, poi: Omit<CityPOI, 'id'>): Promise<CityPOI> {
    return apiClient.post<CityPOI>(`/api/admin/poi/${cityId}`, poi);
  },

  /**
   * Update an existing POI
   */
  async updatePOI(
    cityId: string,
    poiId: string,
    poi: Partial<CityPOI>
  ): Promise<CityPOI> {
    return apiClient.put<CityPOI>(`/api/admin/poi/${cityId}/${poiId}`, poi);
  },

  /**
   * Delete a POI
   */
  async deletePOI(cityId: string, poiId: string): Promise<void> {
    return apiClient.delete<void>(`/api/admin/poi/${cityId}/${poiId}`);
  },
};

export default poiService;
