/**
 * Admin Tours Service - CRUD operations for admin panel
 * Uses Drizzle ORM for database operations
 * POIs are stored as JSON for simplicity and backward compatibility
 */

import crypto from 'crypto';
import { eq, like, or, sql, count, sum, and, desc } from 'drizzle-orm';
import { db, tours } from '../db/index.js';
import type { Tour as DbTour, NewTour } from '../db/schema/index.js';
import type {
  AdminTour,
  AdminTourSummary,
  TourInput,
  TourStatus,
  TourCity,
  TourPOI,
  TourCategory,
  TourDifficulty,
} from '../types/index.js';

const CITIES = ['krakow', 'warszawa', 'wroclaw', 'trojmiasto'] as const;
type CityId = (typeof CITIES)[number];

const CITY_NAMES: Record<CityId, string> = {
  krakow: 'Kraków',
  warszawa: 'Warszawa',
  wroclaw: 'Wrocław',
  trojmiasto: 'Trójmiasto',
};

/**
 * Parse POIs from JSON string
 */
function parsePois(poisJson: string | null | undefined): TourPOI[] {
  if (!poisJson) return [];
  try {
    return JSON.parse(poisJson);
  } catch {
    return [];
  }
}

/**
 * Parse mediaIds from JSON string
 */
function parseMediaIds(mediaIdsJson: string | null | undefined): string[] {
  if (!mediaIdsJson) return [];
  try {
    return JSON.parse(mediaIdsJson);
  } catch {
    return [];
  }
}

/**
 * Convert DB tour to AdminTour type
 */
function dbTourToAdminTour(dbTour: DbTour): AdminTour {
  return {
    id: dbTour.id,
    cityId: dbTour.cityId,
    name: {
      pl: dbTour.namePl,
      en: dbTour.nameEn || dbTour.namePl,
      de: dbTour.nameDe || dbTour.namePl,
      fr: dbTour.nameFr || dbTour.namePl,
      uk: dbTour.nameUk || dbTour.namePl,
    },
    description: {
      pl: dbTour.descriptionPl,
      en: dbTour.descriptionEn || dbTour.descriptionPl,
      de: dbTour.descriptionDe || dbTour.descriptionPl,
      fr: dbTour.descriptionFr || dbTour.descriptionPl,
      uk: dbTour.descriptionUk || dbTour.descriptionPl,
    },
    category: dbTour.category as TourCategory,
    difficulty: dbTour.difficulty as TourDifficulty,
    distance: dbTour.distance,
    duration: dbTour.duration,
    imageUrl: dbTour.imageUrl || '',
    pois: parsePois(dbTour.poisJson),
    mediaIds: parseMediaIds(dbTour.mediaIds),
    primaryMediaId: dbTour.primaryMediaId || undefined,
    status: dbTour.status as TourStatus,
    featured: dbTour.featured,
    views: dbTour.views,
    createdAt: dbTour.createdAt,
    updatedAt: dbTour.updatedAt,
  };
}

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
    // Build conditions array
    const conditions = [];

    if (filters?.cityId) {
      conditions.push(eq(tours.cityId, filters.cityId));
    }
    if (filters?.status) {
      conditions.push(
        eq(tours.status, filters.status as 'draft' | 'published' | 'archived')
      );
    }
    if (filters?.category) {
      conditions.push(
        eq(
          tours.category,
          filters.category as
            | 'history'
            | 'architecture'
            | 'nature'
            | 'food'
            | 'art'
            | 'nightlife'
        )
      );
    }
    if (filters?.difficulty) {
      conditions.push(
        eq(tours.difficulty, filters.difficulty as 'easy' | 'medium' | 'hard')
      );
    }
    if (filters?.search) {
      const searchPattern = `%${filters.search.toLowerCase()}%`;
      conditions.push(
        or(
          like(sql`lower(${tours.namePl})`, searchPattern),
          like(sql`lower(${tours.nameEn})`, searchPattern)
        )
      );
    }

    // Execute query with optional conditions
    let result;
    if (conditions.length > 0) {
      result = db
        .select()
        .from(tours)
        .where(and(...conditions))
        .orderBy(desc(tours.updatedAt))
        .all();
    } else {
      result = db.select().from(tours).orderBy(desc(tours.updatedAt)).all();
    }

    return result.map((t) => this.dbTourToSummary(t));
  }

  /**
   * Get a single tour by ID
   */
  async getTourById(tourId: string): Promise<AdminTour | null> {
    const dbTour = db.select().from(tours).where(eq(tours.id, tourId)).get();

    if (!dbTour) {
      return null;
    }

    return dbTourToAdminTour(dbTour);
  }

  /**
   * Create a new tour
   */
  async createTour(input: TourInput): Promise<AdminTour> {
    const now = new Date().toISOString();
    const id = `tour-${crypto.randomUUID()}`;

    const newTour: NewTour = {
      id,
      cityId: input.cityId,
      namePl: input.name.pl,
      nameEn: input.name.en,
      nameDe: input.name.de,
      nameFr: input.name.fr,
      nameUk: input.name.uk,
      descriptionPl: input.description.pl,
      descriptionEn: input.description.en,
      descriptionDe: input.description.de,
      descriptionFr: input.description.fr,
      descriptionUk: input.description.uk,
      category: input.category,
      difficulty: input.difficulty,
      distance: input.distance,
      duration: input.duration,
      imageUrl: input.imageUrl,
      poisJson: JSON.stringify(input.pois || []),
      mediaIds: JSON.stringify(input.mediaIds || []),
      primaryMediaId: input.primaryMediaId || null,
      status: input.status || 'draft',
      featured: input.featured || false,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    db.insert(tours).values(newTour).run();

    return dbTourToAdminTour(newTour as DbTour);
  }

  /**
   * Update an existing tour
   */
  async updateTour(
    tourId: string,
    input: Partial<TourInput>
  ): Promise<AdminTour | null> {
    const existing = db.select().from(tours).where(eq(tours.id, tourId)).get();
    if (!existing) {
      return null;
    }

    const updates: Partial<NewTour> = {
      updatedAt: new Date().toISOString(),
    };

    if (input.cityId !== undefined) updates.cityId = input.cityId;
    if (input.name) {
      updates.namePl = input.name.pl;
      updates.nameEn = input.name.en;
      updates.nameDe = input.name.de;
      updates.nameFr = input.name.fr;
      updates.nameUk = input.name.uk;
    }
    if (input.description) {
      updates.descriptionPl = input.description.pl;
      updates.descriptionEn = input.description.en;
      updates.descriptionDe = input.description.de;
      updates.descriptionFr = input.description.fr;
      updates.descriptionUk = input.description.uk;
    }
    if (input.category !== undefined) updates.category = input.category;
    if (input.difficulty !== undefined) updates.difficulty = input.difficulty;
    if (input.distance !== undefined) updates.distance = input.distance;
    if (input.duration !== undefined) updates.duration = input.duration;
    if (input.imageUrl !== undefined) updates.imageUrl = input.imageUrl;
    if (input.pois !== undefined) updates.poisJson = JSON.stringify(input.pois);
    if (input.mediaIds !== undefined)
      updates.mediaIds = JSON.stringify(input.mediaIds);
    if (input.primaryMediaId !== undefined)
      updates.primaryMediaId = input.primaryMediaId;
    if (input.status !== undefined) updates.status = input.status;
    if (input.featured !== undefined) updates.featured = input.featured;

    db.update(tours).set(updates).where(eq(tours.id, tourId)).run();

    return this.getTourById(tourId);
  }

  /**
   * Delete a tour
   */
  async deleteTour(tourId: string): Promise<boolean> {
    const result = db.delete(tours).where(eq(tours.id, tourId)).run();
    return result.changes > 0;
  }

  /**
   * Bulk delete tours
   */
  async bulkDelete(tourIds: string[]): Promise<{ deleted: number }> {
    let deleted = 0;
    for (const id of tourIds) {
      const result = db.delete(tours).where(eq(tours.id, id)).run();
      if (result.changes > 0) {
        deleted++;
      }
    }
    return { deleted };
  }

  /**
   * Duplicate a tour
   */
  async duplicateTour(tourId: string): Promise<AdminTour | null> {
    const original = db.select().from(tours).where(eq(tours.id, tourId)).get();
    if (!original) {
      return null;
    }

    const now = new Date().toISOString();
    const newId = `tour-${crypto.randomUUID()}`;

    const duplicate: NewTour = {
      id: newId,
      cityId: original.cityId,
      namePl: `${original.namePl} (kopia)`,
      nameEn: original.nameEn ? `${original.nameEn} (copy)` : null,
      nameDe: original.nameDe ? `${original.nameDe} (Kopie)` : null,
      nameFr: original.nameFr ? `${original.nameFr} (copie)` : null,
      nameUk: original.nameUk ? `${original.nameUk} (копія)` : null,
      descriptionPl: original.descriptionPl,
      descriptionEn: original.descriptionEn,
      descriptionDe: original.descriptionDe,
      descriptionFr: original.descriptionFr,
      descriptionUk: original.descriptionUk,
      category: original.category,
      difficulty: original.difficulty,
      distance: original.distance,
      duration: original.duration,
      imageUrl: original.imageUrl,
      poisJson: original.poisJson,
      mediaIds: original.mediaIds,
      primaryMediaId: original.primaryMediaId,
      status: 'draft',
      featured: false,
      views: 0,
      createdAt: now,
      updatedAt: now,
    };

    db.insert(tours).values(duplicate).run();

    return dbTourToAdminTour(duplicate as DbTour);
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
    const cityCounts = new Map<string, number>();

    for (const cityId of CITIES) {
      const result = db
        .select({ count: count() })
        .from(tours)
        .where(eq(tours.cityId, cityId))
        .get();
      cityCounts.set(cityId, result?.count || 0);
    }

    return CITIES.map((cityId) => ({
      id: cityId,
      name: CITY_NAMES[cityId],
      toursCount: cityCounts.get(cityId) || 0,
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
    // Total tours
    const totalResult = db.select({ count: count() }).from(tours).get();
    const totalTours = totalResult?.count || 0;

    // Published tours
    const publishedResult = db
      .select({ count: count() })
      .from(tours)
      .where(eq(tours.status, 'published'))
      .get();
    const publishedTours = publishedResult?.count || 0;

    // Draft tours
    const draftResult = db
      .select({ count: count() })
      .from(tours)
      .where(eq(tours.status, 'draft'))
      .get();
    const draftTours = draftResult?.count || 0;

    // Archived tours
    const archivedResult = db
      .select({ count: count() })
      .from(tours)
      .where(eq(tours.status, 'archived'))
      .get();
    const archivedTours = archivedResult?.count || 0;

    // Featured tours
    const featuredResult = db
      .select({ count: count() })
      .from(tours)
      .where(eq(tours.featured, true))
      .get();
    const featuredTours = featuredResult?.count || 0;

    // Total views
    const viewsResult = db
      .select({ total: sum(tours.views) })
      .from(tours)
      .get();
    const totalViews = Number(viewsResult?.total) || 0;

    // Tours by city
    const toursByCity: Record<string, number> = {};
    for (const cityId of CITIES) {
      const result = db
        .select({ count: count() })
        .from(tours)
        .where(eq(tours.cityId, cityId))
        .get();
      if ((result?.count || 0) > 0) {
        toursByCity[cityId] = result?.count || 0;
      }
    }

    // Tours by category
    const categories = [
      'history',
      'architecture',
      'nature',
      'food',
      'art',
      'nightlife',
    ] as const;
    const toursByCategory: Record<string, number> = {};
    for (const category of categories) {
      const result = db
        .select({ count: count() })
        .from(tours)
        .where(eq(tours.category, category))
        .get();
      if ((result?.count || 0) > 0) {
        toursByCategory[category] = result?.count || 0;
      }
    }

    return {
      totalTours,
      publishedTours,
      draftTours,
      archivedTours,
      featuredTours,
      totalViews,
      toursByCity,
      toursByCategory,
    };
  }

  /**
   * Increment view count for a tour
   */
  async incrementViews(tourId: string): Promise<void> {
    db.update(tours)
      .set({ views: sql`${tours.views} + 1` })
      .where(eq(tours.id, tourId))
      .run();
  }

  /**
   * Convert DB tour to AdminTourSummary
   */
  private dbTourToSummary(dbTour: DbTour): AdminTourSummary {
    const pois = parsePois(dbTour.poisJson);
    return {
      id: dbTour.id,
      cityId: dbTour.cityId,
      name: {
        pl: dbTour.namePl,
        en: dbTour.nameEn || dbTour.namePl,
        de: dbTour.nameDe || dbTour.namePl,
        fr: dbTour.nameFr || dbTour.namePl,
        uk: dbTour.nameUk || dbTour.namePl,
      },
      description: {
        pl: dbTour.descriptionPl,
        en: dbTour.descriptionEn || dbTour.descriptionPl,
        de: dbTour.descriptionDe || dbTour.descriptionPl,
        fr: dbTour.descriptionFr || dbTour.descriptionPl,
        uk: dbTour.descriptionUk || dbTour.descriptionPl,
      },
      category: dbTour.category as TourCategory,
      difficulty: dbTour.difficulty as TourDifficulty,
      distance: dbTour.distance,
      duration: dbTour.duration,
      imageUrl: dbTour.imageUrl || '',
      poisCount: pois.length,
      mediaIds: parseMediaIds(dbTour.mediaIds),
      primaryMediaId: dbTour.primaryMediaId || undefined,
      status: dbTour.status as TourStatus,
      featured: dbTour.featured,
      views: dbTour.views,
      createdAt: dbTour.createdAt,
      updatedAt: dbTour.updatedAt,
    };
  }
}

export const adminToursService = new AdminToursService();
