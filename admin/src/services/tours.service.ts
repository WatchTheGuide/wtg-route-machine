/**
 * Tours Service - Admin Tours API calls
 */

import apiClient from './api.client';
import type { LocalizedString } from '@/types';

// Tour types aligned with backend
export type TourCategory =
  | 'history'
  | 'architecture'
  | 'nature'
  | 'food'
  | 'art'
  | 'nightlife';

export type TourDifficulty = 'easy' | 'medium' | 'hard';
export type TourStatus = 'draft' | 'published' | 'archived';

export interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  coordinate: [number, number];
  address: string;
  imageUrl?: string;
  openingHours?: string;
  website?: string;
  phone?: string;
}

export interface AdminTour {
  id: string;
  cityId: string;
  name: LocalizedString;
  description: LocalizedString;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number;
  duration: number;
  imageUrl: string;
  pois: POI[];
  status: TourStatus;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTourSummary {
  id: string;
  cityId: string;
  name: LocalizedString;
  description: LocalizedString;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number;
  duration: number;
  imageUrl: string;
  poisCount: number;
  status: TourStatus;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface TourInput {
  cityId: string;
  name: LocalizedString;
  description: LocalizedString;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number;
  duration: number;
  imageUrl: string;
  pois: POI[];
  status?: TourStatus;
  featured?: boolean;
}

export interface ToursFilters {
  cityId?: string;
  status?: TourStatus;
  category?: string;
  difficulty?: string;
  search?: string;
}

export interface TourStats {
  totalTours: number;
  publishedTours: number;
  draftTours: number;
  archivedTours: number;
  featuredTours: number;
  totalViews: number;
  toursByCity: Record<string, number>;
  toursByCategory: Record<string, number>;
}

export interface City {
  id: string;
  name: string;
  toursCount: number;
}

/**
 * Tours Service
 */
export const toursService = {
  /**
   * Get all tours with optional filters
   */
  async getTours(filters?: ToursFilters): Promise<AdminTourSummary[]> {
    const response = await apiClient.get<{ tours: AdminTourSummary[] }>(
      '/api/admin/tours',
      filters as Record<string, string | undefined>
    );
    return response.tours;
  },

  /**
   * Get tour by ID
   */
  async getTourById(id: string): Promise<AdminTour> {
    const response = await apiClient.get<{ tour: AdminTour }>(
      `/api/admin/tours/${id}`
    );
    return response.tour;
  },

  /**
   * Create new tour
   */
  async createTour(input: TourInput): Promise<AdminTour> {
    const response = await apiClient.post<{ tour: AdminTour }>(
      '/api/admin/tours',
      input
    );
    return response.tour;
  },

  /**
   * Update existing tour
   */
  async updateTour(id: string, input: Partial<TourInput>): Promise<AdminTour> {
    const response = await apiClient.put<{ tour: AdminTour }>(
      `/api/admin/tours/${id}`,
      input
    );
    return response.tour;
  },

  /**
   * Delete tour
   */
  async deleteTour(id: string): Promise<void> {
    await apiClient.delete<{ success: boolean }>(`/api/admin/tours/${id}`);
  },

  /**
   * Bulk delete tours
   */
  async bulkDelete(ids: string[]): Promise<{ deleted: number }> {
    const response = await apiClient.post<{ deleted: number }>(
      '/api/admin/tours/bulk-delete',
      { ids }
    );
    return response;
  },

  /**
   * Duplicate tour
   */
  async duplicateTour(id: string): Promise<AdminTour> {
    const response = await apiClient.post<{ tour: AdminTour }>(
      `/api/admin/tours/${id}/duplicate`
    );
    return response.tour;
  },

  /**
   * Publish tour
   */
  async publishTour(id: string): Promise<AdminTour> {
    const response = await apiClient.post<{ tour: AdminTour }>(
      `/api/admin/tours/${id}/publish`
    );
    return response.tour;
  },

  /**
   * Archive tour
   */
  async archiveTour(id: string): Promise<AdminTour> {
    const response = await apiClient.post<{ tour: AdminTour }>(
      `/api/admin/tours/${id}/archive`
    );
    return response.tour;
  },

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<TourStats> {
    return apiClient.get<TourStats>('/api/admin/tours/stats');
  },

  /**
   * Get cities with tour counts
   */
  async getCities(): Promise<City[]> {
    const response = await apiClient.get<{ cities: City[] }>(
      '/api/admin/tours/cities'
    );
    return response.cities;
  },
};

export default toursService;
