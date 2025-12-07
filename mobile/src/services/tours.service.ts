import axios, { AxiosInstance } from 'axios';
import type { Tour, TourSummary, TourCategory, TourDifficulty } from '../types';
import { API_CONFIG, getApiHeaders } from '../config/api';

/**
 * API Response types (matching backend)
 */
interface CitiesResponse {
  cities: Array<{
    id: string;
    name: string;
    toursCount: number;
  }>;
}

interface ToursResponse {
  tours: Array<{
    id: string;
    cityId: string;
    name: Record<string, string>;
    description: Record<string, string>;
    category: TourCategory;
    difficulty: TourDifficulty;
    distance: number;
    duration: number;
    imageUrl: string;
    poisCount: number;
  }>;
}

interface TourResponse {
  tour: Tour;
}

interface SearchResponse {
  tours: Array<{
    id: string;
    cityId: string;
    name: Record<string, string>;
    description: Record<string, string>;
    category: TourCategory;
    difficulty: TourDifficulty;
    distance: number;
    duration: number;
    imageUrl: string;
    poisCount: number;
  }>;
  query: string;
  count: number;
}

/**
 * Tours Service
 * Communicates with Tours Backend API
 */
class ToursService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.toursBaseUrl,
      headers: getApiHeaders(),
      timeout: 10000,
    });
  }

  /**
   * Get list of all cities with tour counts
   */
  async getCities() {
    const { data } = await this.client.get<CitiesResponse>('/cities');
    return data.cities;
  }

  /**
   * Get all tours for a specific city (returns summaries with poisCount)
   */
  async getToursByCity(cityId: string): Promise<TourSummary[]> {
    const { data } = await this.client.get<ToursResponse>(`/${cityId}`);
    return data.tours as TourSummary[];
  }

  /**
   * Get a single tour by ID (with full POI data)
   */
  async getTourById(cityId: string, tourId: string): Promise<Tour | undefined> {
    try {
      const { data } = await this.client.get<TourResponse>(
        `/${cityId}/${tourId}`
      );
      return data.tour;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return undefined;
      }
      throw error;
    }
  }

  /**
   * Get all tours (for browsing all cities)
   */
  async getAllTours(): Promise<TourSummary[]> {
    const cities = await this.getCities();
    const allTours: TourSummary[] = [];

    // Fetch tours for each city
    for (const city of cities) {
      const tours = await this.getToursByCity(city.id);
      allTours.push(...tours);
    }

    return allTours;
  }

  /**
   * Filter tours by category
   */
  async getToursByCategory(
    cityId: string,
    category: TourCategory
  ): Promise<TourSummary[]> {
    const tours = await this.getToursByCity(cityId);
    return tours.filter((tour) => tour.category === category);
  }

  /**
   * Filter tours by difficulty
   */
  async getToursByDifficulty(
    cityId: string,
    difficulty: TourDifficulty
  ): Promise<TourSummary[]> {
    const tours = await this.getToursByCity(cityId);
    return tours.filter((tour) => tour.difficulty === difficulty);
  }

  /**
   * Search tours by name or description
   */
  async searchTours(cityId: string, query: string): Promise<TourSummary[]> {
    if (!query.trim()) {
      return [];
    }

    const { data } = await this.client.get<SearchResponse>(
      `/${cityId}/search`,
      {
        params: { q: query },
      }
    );

    return data.tours as TourSummary[];
  }
}

// Singleton instance
export const toursService = new ToursService();
