import axios, { AxiosInstance } from 'axios';
import type { Tour, TourCategory, TourDifficulty } from '../types';
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
   * Get all tours for a specific city
   */
  async getToursByCity(cityId: string): Promise<Tour[]> {
    const { data } = await this.client.get<ToursResponse>(`/${cityId}`);

    // Convert summary to full Tour type (without full POI data for list view)
    return data.tours.map((summary) => ({
      ...summary,
      // Tours list doesn't include full POI data, will be loaded on detail view
      pois: [],
    })) as Tour[];
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
  async getAllTours(): Promise<Tour[]> {
    const cities = await this.getCities();
    const allTours: Tour[] = [];

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
  ): Promise<Tour[]> {
    const tours = await this.getToursByCity(cityId);
    return tours.filter((tour) => tour.category === category);
  }

  /**
   * Filter tours by difficulty
   */
  async getToursByDifficulty(
    cityId: string,
    difficulty: TourDifficulty
  ): Promise<Tour[]> {
    const tours = await this.getToursByCity(cityId);
    return tours.filter((tour) => tour.difficulty === difficulty);
  }

  /**
   * Search tours by name or description
   */
  async searchTours(cityId: string, query: string): Promise<Tour[]> {
    if (!query.trim()) {
      return [];
    }

    const { data } = await this.client.get<SearchResponse>(
      `/${cityId}/search`,
      {
        params: { q: query },
      }
    );

    // Convert summary to full Tour type
    return data.tours.map((summary) => ({
      ...summary,
      pois: [],
    })) as Tour[];
  }
}

// Singleton instance
export const toursService = new ToursService();
