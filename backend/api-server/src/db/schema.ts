/**
 * Combined schema file for Drizzle Kit
 * This file consolidates all schemas for migration generation
 * (Drizzle-kit doesn't handle ESM .js extensions well)
 */

import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

// ============================================
// USERS TABLE
// ============================================
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'editor', 'viewer'] })
    .notNull()
    .default('editor'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============================================
// REFRESH TOKENS TABLE
// ============================================
export const refreshTokens = sqliteTable('refresh_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
});

// ============================================
// TOURS TABLE
// ============================================
export const tours = sqliteTable('tours', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull(),

  // Localized names
  namePl: text('name_pl').notNull(),
  nameEn: text('name_en'),
  nameDe: text('name_de'),
  nameFr: text('name_fr'),
  nameUk: text('name_uk'),

  // Localized descriptions
  descriptionPl: text('description_pl').notNull(),
  descriptionEn: text('description_en'),
  descriptionDe: text('description_de'),
  descriptionFr: text('description_fr'),
  descriptionUk: text('description_uk'),

  // Tour metadata
  category: text('category', {
    enum: ['history', 'architecture', 'nature', 'food', 'art', 'nightlife'],
  }).notNull(),
  difficulty: text('difficulty', {
    enum: ['easy', 'medium', 'hard'],
  }).notNull(),
  distance: integer('distance').notNull().default(0),
  duration: integer('duration').notNull().default(0),
  imageUrl: text('image_url'),

  // POIs as JSON array (embedded data)
  poisJson: text('pois_json').default('[]'),

  // Status and flags
  status: text('status', {
    enum: ['draft', 'published', 'archived'],
  })
    .notNull()
    .default('draft'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  views: integer('views').notNull().default(0),

  // Timestamps
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============================================
// POIS TABLE
// ============================================
export const pois = sqliteTable('pois', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull(),

  // Localized names
  namePl: text('name_pl').notNull(),
  nameEn: text('name_en'),
  nameDe: text('name_de'),
  nameFr: text('name_fr'),
  nameUk: text('name_uk'),

  // Localized descriptions
  descriptionPl: text('description_pl'),
  descriptionEn: text('description_en'),
  descriptionDe: text('description_de'),
  descriptionFr: text('description_fr'),
  descriptionUk: text('description_uk'),

  // POI metadata
  category: text('category', {
    enum: [
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
    ],
  }).notNull(),

  // Location
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  address: text('address'),

  // Additional info
  imageUrl: text('image_url'),
  openingHours: text('opening_hours'),
  website: text('website'),
  phone: text('phone'),

  // Timestamps
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// ============================================
// TOUR_POIS JUNCTION TABLE
// ============================================
export const tourPois = sqliteTable(
  'tour_pois',
  {
    tourId: text('tour_id')
      .notNull()
      .references(() => tours.id, { onDelete: 'cascade' }),
    poiId: text('poi_id')
      .notNull()
      .references(() => pois.id, { onDelete: 'cascade' }),
    order: integer('order').notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.tourId, table.poiId] }),
  })
);
