/**
 * Admin Tours Service - CRUD operations for admin panel
 * Extends tours.service.ts with write operations
 */

import crypto from 'crypto';
import type {
  AdminTour,
  AdminTourSummary,
  TourInput,
  TourStatus,
  TourCity,
} from '../types/index.js';

// In-memory storage for admin tours
// In production, this would be replaced with a database
const adminTours: Map<string, AdminTour> = new Map();

const CITIES = ['krakow', 'warszawa', 'wroclaw', 'trojmiasto'] as const;
type CityId = (typeof CITIES)[number];

const CITY_NAMES: Record<CityId, string> = {
  krakow: 'Kraków',
  warszawa: 'Warszawa',
  wroclaw: 'Wrocław',
  trojmiasto: 'Trójmiasto',
};

// Initialize with some sample data
const initializeSampleTours = () => {
  const sampleTour: AdminTour = {
    id: 'sample-tour-1',
    cityId: 'krakow',
    name: {
      pl: 'Droga Królewska',
      en: 'Royal Road',
      de: 'Königsweg',
      fr: 'Route Royale',
      uk: 'Королівська дорога',
    },
    description: {
      pl: 'Spacer śladami królów przez Kraków',
      en: 'A walk following the footsteps of kings through Krakow',
      de: 'Ein Spaziergang auf den Spuren der Könige durch Krakau',
      fr: 'Une promenade sur les traces des rois à travers Cracovie',
      uk: 'Прогулянка слідами королів через Краків',
    },
    category: 'history',
    difficulty: 'easy',
    distance: 2500,
    duration: 5400,
    imageUrl: '/images/tours/royal-road.jpg',
    pois: [],
    status: 'published',
    featured: true,
    views: 1234,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
  };
  adminTours.set(sampleTour.id, sampleTour);
};

initializeSampleTours();

class AdminToursService {
  /**
   * Get all tours for admin (with filters)
   */
  async getAllTours(filters?: {
    cityId?: string;
    status?: TourStatus;
    category?: string;
    difficulty?: string;
    search?: string;
  }): Promise<AdminTourSummary[]> {
    let tours = Array.from(adminTours.values());

    // Apply filters
    if (filters) {
      if (filters.cityId) {
        tours = tours.filter((t) => t.cityId === filters.cityId);
      }
      if (filters.status) {
        tours = tours.filter((t) => t.status === filters.status);
      }
      if (filters.category) {
        tours = tours.filter((t) => t.category === filters.category);
      }
      if (filters.difficulty) {
        tours = tours.filter((t) => t.difficulty === filters.difficulty);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        tours = tours.filter((t) =>
          Object.values(t.name).some((n) =>
            n.toLowerCase().includes(searchLower)
          )
        );
      }
    }

    // Sort by updatedAt descending (newest first)
    tours.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return tours.map((t) => this.toSummary(t));
  }

  /**
   * Get a single tour by ID
   */
  async getTourById(tourId: string): Promise<AdminTour | null> {
    return adminTours.get(tourId) || null;
  }

  /**
   * Create a new tour
   */
  async createTour(input: TourInput): Promise<AdminTour> {
    const now = new Date().toISOString();
    const id = `tour-${crypto.randomUUID()}`;

    const tour: AdminTour = {
      id,
      cityId: input.cityId,
      name: input.name,
      description: input.description,
      category: input.category,
      difficulty: input.difficulty,
      distance: input.distance,
      duration: input.duration,
      imageUrl: input.imageUrl,
      pois: input.pois,
      status: input.status || 'draft',
      featured: input.featured || false,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    adminTours.set(id, tour);
    return tour;
  }

  /**
   * Update an existing tour
   */
  async updateTour(
    tourId: string,
    input: Partial<TourInput>
  ): Promise<AdminTour | null> {
    const existing = adminTours.get(tourId);
    if (!existing) {
      return null;
    }

    const updated: AdminTour = {
      ...existing,
      ...(input.cityId && { cityId: input.cityId }),
      ...(input.name && { name: input.name }),
      ...(input.description && { description: input.description }),
      ...(input.category && { category: input.category }),
      ...(input.difficulty && { difficulty: input.difficulty }),
      ...(input.distance !== undefined && { distance: input.distance }),
      ...(input.duration !== undefined && { duration: input.duration }),
      ...(input.imageUrl && { imageUrl: input.imageUrl }),
      ...(input.pois && { pois: input.pois }),
      ...(input.status && { status: input.status }),
      ...(input.featured !== undefined && { featured: input.featured }),
      updatedAt: new Date().toISOString(),
    };

    adminTours.set(tourId, updated);
    return updated;
  }

  /**
   * Delete a tour
   */
  async deleteTour(tourId: string): Promise<boolean> {
    return adminTours.delete(tourId);
  }

  /**
   * Bulk delete tours
   */
  async bulkDelete(tourIds: string[]): Promise<{ deleted: number }> {
    let deleted = 0;
    for (const id of tourIds) {
      if (adminTours.delete(id)) {
        deleted++;
      }
    }
    return { deleted };
  }

  /**
   * Duplicate a tour
   */
  async duplicateTour(tourId: string): Promise<AdminTour | null> {
    const original = adminTours.get(tourId);
    if (!original) {
      return null;
    }

    const now = new Date().toISOString();
    const newId = `tour-${crypto.randomUUID()}`;

    const duplicate: AdminTour = {
      ...original,
      id: newId,
      name: {
        pl: `${original.name.pl} (kopia)`,
        en: `${original.name.en} (copy)`,
        de: `${original.name.de} (Kopie)`,
        fr: `${original.name.fr} (copie)`,
        uk: `${original.name.uk} (копія)`,
      },
      status: 'draft',
      featured: false,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    adminTours.set(newId, duplicate);
    return duplicate;
  }

  /**
   * Publish a tour (change status to published)
   */
  async publishTour(tourId: string): Promise<AdminTour | null> {
    return this.updateTour(tourId, { status: 'published' });
  }

  /**
   * Archive a tour
   */
  async archiveTour(tourId: string): Promise<AdminTour | null> {
    return this.updateTour(tourId, { status: 'archived' });
  }

  /**
   * Get cities with tour counts (for admin)
   */
  async getCities(): Promise<TourCity[]> {
    const tours = Array.from(adminTours.values());

    return CITIES.map((cityId) => ({
      id: cityId,
      name: CITY_NAMES[cityId],
      toursCount: tours.filter((t) => t.cityId === cityId).length,
    }));
  }

  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<{
    totalTours: number;
    publishedTours: number;
    draftTours: number;
    archivedTours: number;
    featuredTours: number;
    totalViews: number;
    toursByCity: Record<string, number>;
    toursByCategory: Record<string, number>;
  }> {
    const tours = Array.from(adminTours.values());

    const toursByCity: Record<string, number> = {};
    const toursByCategory: Record<string, number> = {};

    for (const tour of tours) {
      toursByCity[tour.cityId] = (toursByCity[tour.cityId] || 0) + 1;
      toursByCategory[tour.category] =
        (toursByCategory[tour.category] || 0) + 1;
    }

    return {
      totalTours: tours.length,
      publishedTours: tours.filter((t) => t.status === 'published').length,
      draftTours: tours.filter((t) => t.status === 'draft').length,
      archivedTours: tours.filter((t) => t.status === 'archived').length,
      featuredTours: tours.filter((t) => t.featured).length,
      totalViews: tours.reduce((sum, t) => sum + t.views, 0),
      toursByCity,
      toursByCategory,
    };
  }

  /**
   * Convert AdminTour to AdminTourSummary
   */
  private toSummary(tour: AdminTour): AdminTourSummary {
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
      status: tour.status,
      featured: tour.featured,
      views: tour.views,
      createdAt: tour.createdAt,
      updatedAt: tour.updatedAt,
    };
  }
}

export const adminToursService = new AdminToursService();
