/**
 * POIs (Points of Interest) table schema
 * Stores tourist attractions and landmarks
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

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
  openingHours: text('opening_hours'), // JSON string
  website: text('website'),
  phone: text('phone'),

  // Timestamps
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export type Poi = typeof pois.$inferSelect;
export type NewPoi = typeof pois.$inferInsert;
