/**
 * Admin POI Service
 * CRUD operations for POIs using Drizzle ORM
 */

import { randomUUID } from 'crypto';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../db/index.js';
import { pois } from '../db/schema/index.js';

// ============================================
// Types
// ============================================

export type POICategoryDB =
  | 'historical'
  | 'religious'
  | 'museum'
  | 'park'
  | 'restaurant'
  | 'cafe'
  | 'shopping'
  | 'entertainment'
  | 'viewpoint'
  | 'monument'
  | 'other';

export interface AdminPOI {
  id: string;
  cityId: string;
  namePl: string;
  nameEn?: string | null;
  nameDe?: string | null;
  nameFr?: string | null;
  nameUk?: string | null;
  descriptionPl?: string | null;
  descriptionEn?: string | null;
  descriptionDe?: string | null;
  descriptionFr?: string | null;
  descriptionUk?: string | null;
  category: POICategoryDB;
  latitude: number;
  longitude: number;
  address?: string | null;
  imageUrl?: string | null;
  openingHours?: string | null;
  website?: string | null;
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePOIInput {
  cityId: string;
  namePl: string;
  nameEn?: string;
  nameDe?: string;
  nameFr?: string;
  nameUk?: string;
  descriptionPl?: string;
  descriptionEn?: string;
  descriptionDe?: string;
  descriptionFr?: string;
  descriptionUk?: string;
  category: POICategoryDB;
  latitude: number;
  longitude: number;
  address?: string;
  imageUrl?: string;
  openingHours?: string;
  website?: string;
  phone?: string;
}

export interface UpdatePOIInput {
  namePl?: string;
  nameEn?: string | null;
  nameDe?: string | null;
  nameFr?: string | null;
  nameUk?: string | null;
  descriptionPl?: string | null;
  descriptionEn?: string | null;
  descriptionDe?: string | null;
  descriptionFr?: string | null;
  descriptionUk?: string | null;
  category?: POICategoryDB;
  latitude?: number;
  longitude?: number;
  address?: string | null;
  imageUrl?: string | null;
  openingHours?: string | null;
  website?: string | null;
  phone?: string | null;
}

export interface POIFilters {
  cityId?: string;
  category?: POICategoryDB;
  search?: string;
}

export interface POISummary {
  id: string;
  cityId: string;
  namePl: string;
  nameEn?: string | null;
  category: POICategoryDB;
  latitude: number;
  longitude: number;
}

// ============================================
// Service Functions
// ============================================

/**
 * Create a new POI
 */
export async function createPOI(input: CreatePOIInput): Promise<AdminPOI> {
  const now = new Date().toISOString();
  const id = randomUUID();

  await db.insert(pois).values({
    id,
    cityId: input.cityId,
    namePl: input.namePl,
    nameEn: input.nameEn || null,
    nameDe: input.nameDe || null,
    nameFr: input.nameFr || null,
    nameUk: input.nameUk || null,
    descriptionPl: input.descriptionPl || null,
    descriptionEn: input.descriptionEn || null,
    descriptionDe: input.descriptionDe || null,
    descriptionFr: input.descriptionFr || null,
    descriptionUk: input.descriptionUk || null,
    category: input.category,
    latitude: input.latitude,
    longitude: input.longitude,
    address: input.address || null,
    imageUrl: input.imageUrl || null,
    openingHours: input.openingHours || null,
    website: input.website || null,
    phone: input.phone || null,
    createdAt: now,
    updatedAt: now,
  });

  const created = await db.select().from(pois).where(eq(pois.id, id)).get();
  return created as AdminPOI;
}

/**
 * Get POI by ID
 */
export async function getPOIById(id: string): Promise<AdminPOI | null> {
  const poi = await db.select().from(pois).where(eq(pois.id, id)).get();
  return (poi as AdminPOI) ?? null;
}

/**
 * Update a POI
 */
export async function updatePOI(
  id: string,
  updates: UpdatePOIInput
): Promise<AdminPOI | null> {
  const existing = await getPOIById(id);
  if (!existing) {
    return null;
  }

  const now = new Date().toISOString();

  await db
    .update(pois)
    .set({
      ...updates,
      updatedAt: now,
    })
    .where(eq(pois.id, id));

  return getPOIById(id);
}

/**
 * Delete a POI
 */
export async function deletePOI(id: string): Promise<boolean> {
  const existing = await getPOIById(id);
  if (!existing) {
    return false;
  }

  await db.delete(pois).where(eq(pois.id, id));
  return true;
}

/**
 * Bulk delete POIs
 */
export async function bulkDeletePOIs(ids: string[]): Promise<number> {
  let deleted = 0;

  for (const id of ids) {
    const success = await deletePOI(id);
    if (success) {
      deleted++;
    }
  }

  return deleted;
}

/**
 * Get all POIs with optional filters
 */
export async function getAllPOIs(filters?: POIFilters): Promise<POISummary[]> {
  const conditions: ReturnType<typeof eq>[] = [];

  if (filters?.cityId) {
    conditions.push(eq(pois.cityId, filters.cityId));
  }

  if (filters?.category) {
    conditions.push(eq(pois.category, filters.category));
  }

  let query = db.select().from(pois);

  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as typeof query;
  }

  const results = await query.all();

  // Filter by search if provided
  let filtered = results;
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = results.filter(
      (poi) =>
        poi.namePl.toLowerCase().includes(searchLower) ||
        poi.nameEn?.toLowerCase().includes(searchLower) ||
        poi.descriptionPl?.toLowerCase().includes(searchLower)
    );
  }

  return filtered.map((poi) => ({
    id: poi.id,
    cityId: poi.cityId,
    namePl: poi.namePl,
    nameEn: poi.nameEn,
    category: poi.category,
    latitude: poi.latitude,
    longitude: poi.longitude,
  }));
}

/**
 * Get POIs for a specific city
 */
export async function getPOIsForCity(cityId: string): Promise<AdminPOI[]> {
  const results = await db
    .select()
    .from(pois)
    .where(eq(pois.cityId, cityId))
    .all();

  return results as AdminPOI[];
}

/**
 * Get POI count by city
 */
export async function getPOICountByCity(): Promise<
  { cityId: string; count: number }[]
> {
  const results = await db
    .select({
      cityId: pois.cityId,
      count: sql<number>`count(*)`,
    })
    .from(pois)
    .groupBy(pois.cityId)
    .all();

  return results;
}

/**
 * Get available categories
 */
export function getCategories(): string[] {
  return [
    'historical',
    'religious',
    'museum',
    'park',
    'restaurant',
    'cafe',
    'shopping',
    'entertainment',
    'viewpoint',
    'monument',
    'other',
  ];
}

/**
 * Import POI from legacy format (JSON files)
 */
export async function importLegacyPOI(
  legacyPoi: {
    id: string;
    name: string;
    description: string;
    coordinates: [number, number];
    category: string;
    imageUrl?: string;
    openingHours?: string;
    website?: string;
    address?: string;
    tags?: string[];
  },
  cityId: string
): Promise<AdminPOI> {
  // Map legacy category to new category
  const categoryMap: Record<string, POICategoryDB> = {
    landmark: 'monument',
    church: 'religious',
    museum: 'museum',
    park: 'park',
    restaurant: 'restaurant',
    viewpoint: 'viewpoint',
  };

  const mappedCategory: POICategoryDB =
    categoryMap[legacyPoi.category] || 'other';

  // Use existing ID if provided
  const now = new Date().toISOString();

  await db
    .insert(pois)
    .values({
      id: legacyPoi.id,
      cityId,
      namePl: legacyPoi.name,
      nameEn: null,
      nameDe: null,
      nameFr: null,
      nameUk: null,
      descriptionPl: legacyPoi.description,
      descriptionEn: null,
      descriptionDe: null,
      descriptionFr: null,
      descriptionUk: null,
      category: mappedCategory,
      longitude: legacyPoi.coordinates[0],
      latitude: legacyPoi.coordinates[1],
      imageUrl: legacyPoi.imageUrl || null,
      openingHours: legacyPoi.openingHours || null,
      website: legacyPoi.website || null,
      address: legacyPoi.address || null,
      phone: null,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoNothing();

  const created = await db
    .select()
    .from(pois)
    .where(eq(pois.id, legacyPoi.id))
    .get();
  return created as AdminPOI;
}

/**
 * Get total POI count
 */
export async function getTotalPOICount(): Promise<number> {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(pois)
    .get();

  return result?.count || 0;
}

/**
 * Check if POI exists
 */
export async function poiExists(id: string): Promise<boolean> {
  const poi = await db
    .select({ id: pois.id })
    .from(pois)
    .where(eq(pois.id, id))
    .get();

  return !!poi;
}
