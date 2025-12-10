/**
 * Tour POIs junction table schema
 * Links tours to their POIs with ordering
 */

import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';
import { tours } from './tours.js';
import { pois } from './pois.js';

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

export type TourPoi = typeof tourPois.$inferSelect;
export type NewTourPoi = typeof tourPois.$inferInsert;
