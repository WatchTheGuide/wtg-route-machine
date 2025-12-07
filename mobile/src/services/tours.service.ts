import type { Tour, TourCategory, TourDifficulty } from '../types';
import { TOURS } from '../data/tours';

/**
 * Tours Service
 * Provides access to curated tours data
 * In production, this would fetch from backend API
 */
class ToursService {
  /**
   * Get all tours for a specific city
   */
  async getToursByCity(cityId: string): Promise<Tour[]> {
    // Simulate API delay
    await this.delay(300);

    return TOURS.filter((tour) => tour.cityId === cityId);
  }

  /**
   * Get a single tour by ID
   */
  async getTourById(tourId: string): Promise<Tour | undefined> {
    // Simulate API delay
    await this.delay(200);

    return TOURS.find((tour) => tour.id === tourId);
  }

  /**
   * Get all tours (for browsing all cities)
   */
  async getAllTours(): Promise<Tour[]> {
    // Simulate API delay
    await this.delay(300);

    return TOURS;
  }

  /**
   * Filter tours by category
   */
  async getToursByCategory(
    cityId: string,
    category: TourCategory
  ): Promise<Tour[]> {
    await this.delay(300);

    return TOURS.filter(
      (tour) => tour.cityId === cityId && tour.category === category
    );
  }

  /**
   * Filter tours by difficulty
   */
  async getToursByDifficulty(
    cityId: string,
    difficulty: TourDifficulty
  ): Promise<Tour[]> {
    await this.delay(300);

    return TOURS.filter(
      (tour) => tour.cityId === cityId && tour.difficulty === difficulty
    );
  }

  /**
   * Search tours by name or description
   */
  async searchTours(cityId: string, query: string): Promise<Tour[]> {
    await this.delay(300);

    const lowerQuery = query.toLowerCase();
    return TOURS.filter(
      (tour) =>
        tour.cityId === cityId &&
        (tour.name.toLowerCase().includes(lowerQuery) ||
          tour.description.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Helper: simulate API delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Singleton instance
export const toursService = new ToursService();
