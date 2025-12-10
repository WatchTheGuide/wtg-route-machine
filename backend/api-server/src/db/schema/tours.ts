/**
 * Tours table schema
 * Stores curated walking tours (admin-managed)
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

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
  distance: integer('distance').notNull().default(0), // meters
  duration: integer('duration').notNull().default(0), // seconds
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

export type Tour = typeof tours.$inferSelect;
export type NewTour = typeof tours.$inferInsert;
