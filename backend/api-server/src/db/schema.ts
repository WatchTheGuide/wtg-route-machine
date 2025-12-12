/**
 * Combined schema file for Drizzle Kit
 * This file consolidates all schemas for migration generation
 * (Drizzle-kit doesn't handle ESM .js extensions well)
 */

import crypto from 'crypto';
import {
  sqliteTable,
  text,
  integer,
  real,
  primaryKey,
  index,
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

  // Media IDs as JSON array (US 8.16 - Tour Media Integration)
  mediaIds: text('media_ids').default('[]'),
  primaryMediaId: text('primary_media_id'),

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

// ============================================
// MEDIA TABLE (Epic 8.10 - Media Manager)
// ============================================
export const media = sqliteTable(
  'media',
  {
    // Primary key
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),

    // File information
    filename: text('filename').notNull(), // UUID-based: abc123.jpg
    originalName: text('original_name').notNull(), // User's filename
    mimeType: text('mime_type').notNull(), // image/jpeg
    sizeBytes: integer('size_bytes').notNull(),

    // Image dimensions
    width: integer('width').notNull(),
    height: integer('height').notNull(),

    // URLs (relative paths)
    url: text('url').notNull(), // /uploads/abc123.jpg
    thumbnailUrl: text('thumbnail_url').notNull(), // /uploads/thumbnails/abc123-thumb.jpg

    // Metadata
    title: text('title'),
    altText: text('alt_text'),
    tags: text('tags').notNull().default('[]'), // JSON array

    // Context (where was it uploaded from?)
    contextType: text('context_type', {
      enum: ['tour', 'poi', 'standalone'],
    }),
    contextId: text('context_id'),

    // User tracking
    uploadedBy: text('uploaded_by')
      .notNull()
      .references(() => users.id),

    // Timestamps
    createdAt: text('created_at')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
    updatedAt: text('updated_at')
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  },
  (table) => ({
    // Indexes for performance (CRITICAL: Added per code review)
    uploadedByIdx: index('media_uploaded_by_idx').on(table.uploadedBy),
    contextTypeIdx: index('media_context_type_idx').on(table.contextType),
    contextIdx: index('media_context_idx').on(
      table.contextType,
      table.contextId
    ),
    createdAtIdx: index('media_created_at_idx').on(table.createdAt),
  })
);
