/**
 * Import POIs from JSON files to database
 *
 * Usage: npm run db:import-pois
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { db } from './db/index.js';
import { pois } from './db/schema/index.js';
import { sql } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data directory path
const DATA_DIR = join(__dirname, 'data', 'poi');

// City IDs to import
const CITY_IDS = ['krakow', 'warszawa', 'wroclaw', 'trojmiasto'];

// Category mapping from legacy to new schema
const CATEGORY_MAP: Record<string, string> = {
  landmark: 'monument',
  church: 'religious',
  museum: 'museum',
  park: 'park',
  restaurant: 'restaurant',
  viewpoint: 'viewpoint',
  cafe: 'cafe',
  shopping: 'shopping',
  entertainment: 'entertainment',
  historical: 'historical',
  monument: 'monument',
  other: 'other',
};

interface LegacyPOI {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  category: string;
  imageUrl?: string;
  thumbnailUrl?: string;
  estimatedTime?: number;
  openingHours?: string;
  closedDays?: string;
  website?: string;
  address?: string;
  ticketPrice?: string;
  tags?: string[];
}

interface LegacyPOICity {
  id: string;
  name: string;
  pois: LegacyPOI[];
}

async function loadCityData(cityId: string): Promise<LegacyPOICity | null> {
  const filePath = join(DATA_DIR, `${cityId}.json`);
  if (!existsSync(filePath)) {
    console.log(`  ⚠️  File not found: ${filePath}`);
    return null;
  }

  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  return data as LegacyPOICity;
}

function mapCategory(legacyCategory: string): string {
  return CATEGORY_MAP[legacyCategory] || 'other';
}

async function importCity(cityId: string): Promise<number> {
  const cityData = await loadCityData(cityId);
  if (!cityData) {
    return 0;
  }

  console.log(
    `  📍 Importing ${cityData.pois.length} POIs for ${cityData.name}...`
  );

  let imported = 0;
  const now = new Date().toISOString();

  for (const poi of cityData.pois) {
    try {
      await db
        .insert(pois)
        .values({
          id: poi.id,
          cityId: cityId,
          namePl: poi.name,
          nameEn: null,
          nameDe: null,
          nameFr: null,
          nameUk: null,
          descriptionPl: poi.description,
          descriptionEn: null,
          descriptionDe: null,
          descriptionFr: null,
          descriptionUk: null,
          category: mapCategory(poi.category) as any,
          longitude: poi.coordinates[0],
          latitude: poi.coordinates[1],
          address: poi.address || null,
          imageUrl: poi.imageUrl || null,
          openingHours: poi.openingHours || null,
          website: poi.website || null,
          phone: null,
          createdAt: now,
          updatedAt: now,
        })
        .onConflictDoNothing();

      imported++;
    } catch (error) {
      console.error(`    ❌ Error importing POI ${poi.id}:`, error);
    }
  }

  return imported;
}

async function main() {
  console.log('🚀 Starting POI import from JSON files...\n');

  // Check current POI count
  const currentCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(pois)
    .get();

  console.log(
    `📊 Current POI count in database: ${currentCount?.count || 0}\n`
  );

  let totalImported = 0;

  for (const cityId of CITY_IDS) {
    const imported = await importCity(cityId);
    totalImported += imported;
    console.log(`  ✅ Imported ${imported} POIs for ${cityId}\n`);
  }

  // Final count
  const finalCount = await db
    .select({ count: sql<number>`count(*)` })
    .from(pois)
    .get();

  console.log(`\n✨ Import complete!`);
  console.log(`📊 Total POIs in database: ${finalCount?.count || 0}`);
  console.log(`📥 New POIs imported: ${totalImported}`);
}

main().catch(console.error);
