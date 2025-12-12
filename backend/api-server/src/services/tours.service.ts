/**
 * Tours Service
 * Handles loading and querying tour data (public API)
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Tour, TourSummary, TourCity } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const CITIES = ['krakow', 'warszawa', 'wroclaw', 'trojmiasto'] as const;
type CityId = (typeof CITIES)[number];

const CITY_NAMES: Record<CityId, string> = {
  krakow: 'Kraków',
  warszawa: 'Warszawa',
  wroclaw: 'Wrocław',
  trojmiasto: 'Trójmiasto',
};

class ToursService {
  private toursCache: Map<CityId, Tour[]> = new Map();

  /**
   * Load tours from JSON file for a specific city
   */
  private async loadToursForCity(cityId: CityId): Promise<Tour[]> {
    if (this.toursCache.has(cityId)) {
      return this.toursCache.get(cityId)!;
    }

    const filePath = join(__dirname, '../data/tours', `${cityId}.json`);
    const content = await readFile(filePath, 'utf-8');
    const tours = JSON.parse(content) as Tour[];

    this.toursCache.set(cityId, tours);
    return tours;
  }

  /**
   * Get list of all cities with tour counts
   */
  async getCities(): Promise<TourCity[]> {
    const cities: TourCity[] = [];

    for (const cityId of CITIES) {
      const tours = await this.loadToursForCity(cityId);
      cities.push({
        id: cityId,
        name: CITY_NAMES[cityId],
        toursCount: tours.length,
      });
    }

    return cities;
  }

  /**
   * Get all tours for a specific city
   */
  async getToursByCity(cityId: string): Promise<TourSummary[]> {
    if (!this.isCityId(cityId)) {
      throw new Error(`Invalid city ID: ${cityId}`);
    }

    const tours = await this.loadToursForCity(cityId);
    return tours.map((tour) => this.toSummary(tour));
  }

  /**
   * Get a specific tour by city and tour ID
   */
  async getTourById(cityId: string, tourId: string): Promise<Tour | null> {
    if (!this.isCityId(cityId)) {
      throw new Error(`Invalid city ID: ${cityId}`);
    }

    const tours = await this.loadToursForCity(cityId);
    return tours.find((tour) => tour.id === tourId) || null;
  }

  /**
   * Search tours by query (name or description)
   */
  async searchTours(cityId: string, query: string): Promise<TourSummary[]> {
    if (!this.isCityId(cityId)) {
      throw new Error(`Invalid city ID: ${cityId}`);
    }

    const tours = await this.loadToursForCity(cityId);
    const lowerQuery = query.toLowerCase();

    const matchingTours = tours.filter((tour) => {
      // Search in all language versions
      const nameMatches = Object.values(tour.name).some((name) =>
        name.toLowerCase().includes(lowerQuery)
      );
      const descMatches = Object.values(tour.description).some((desc) =>
        desc.toLowerCase().includes(lowerQuery)
      );

      return nameMatches || descMatches;
    });

    return matchingTours.map((tour) => this.toSummary(tour));
  }

  /**
   * Get all tours across all cities
   */
  async getAllTours(): Promise<TourSummary[]> {
    const allTours: TourSummary[] = [];

    for (const cityId of CITIES) {
      const tours = await this.getToursByCity(cityId);
      allTours.push(...tours);
    }

    return allTours;
  }

  /**
   * Get tours by category
   */
  async getToursByCategory(category: string): Promise<TourSummary[]> {
    const allTours = await this.getAllTours();
    return allTours.filter((tour) => tour.category === category);
  }

  /**
   * Convert Tour to TourSummary (without full POI data)
   */
  private toSummary(tour: Tour): TourSummary {
    return {
      id: tour.id,
      cityId: tour.cityId,
      name: tour.name,
      description: tour.description,
      category: tour.category,
      difficulty: tour.difficulty,
      distance: tour.distance,
      duration: tour.duration,
      imageUrl: tour.imageUrl,
      poisCount: tour.pois.length,
      mediaIds: tour.mediaIds || [],
      primaryMediaId: tour.primaryMediaId,
    };
  }

  /**
   * Type guard for city ID
   */
  private isCityId(value: string): value is CityId {
    return CITIES.includes(value as CityId);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.toursCache.clear();
  }
}

// Singleton instance
export const toursService = new ToursService();
