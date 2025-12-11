/**
 * Database Import Script
 *
 * Imports all data from JSON files into the database:
 * - POIs from src/data/poi/*.json
 * - Tours from src/data/tours/*.json
 *
 * Usage: npm run db:import
 */

import { db, pois, tours, closeDatabase } from './db/index.js';
import { eq, count } from 'drizzle-orm';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { NewPoi, NewTour } from './db/schema/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// City IDs for import
const CITIES = ['krakow', 'warszawa', 'wroclaw', 'trojmiasto'];

// Legacy POI category mapping
const LEGACY_CATEGORY_MAP: Record<string, string> = {
  landmark: 'historical',
  church: 'religious',
  religious: 'religious',
  museum: 'museum',
  park: 'park',
  restaurant: 'restaurant',
  cafe: 'cafe',
  shopping: 'shopping',
  entertainment: 'entertainment',
  viewpoint: 'viewpoint',
  monument: 'monument',
  historical: 'historical',
  other: 'other',
};

// Map legacy category to DB category
function mapCategory(category: string): string {
  return LEGACY_CATEGORY_MAP[category] || 'other';
}

interface LegacyPOIFile {
  id: string;
  name: string;
  pois: LegacyPOI[];
}

interface LegacyPOI {
  id: string;
  name?:
    | string
    | { pl?: string; en?: string; de?: string; fr?: string; uk?: string };
  description?:
    | string
    | { pl?: string; en?: string; de?: string; fr?: string; uk?: string };
  category?: string;
  coordinate?: [number, number];
  coordinates?: [number, number]; // Some files use this
  address?: string;
  openingHours?: string | Record<string, string>;
  imageUrl?: string;
  website?: string;
  phone?: string;
}

interface LegacyTour {
  id: string;
  cityId: string;
  name: { pl?: string; en?: string; de?: string; fr?: string; uk?: string };
  description: {
    pl?: string;
    en?: string;
    de?: string;
    fr?: string;
    uk?: string;
  };
  category: string;
  difficulty: string;
  distance: number;
  duration: number;
  imageUrl?: string;
  pois?: Array<{
    id: string;
    name?: string;
    description?: string;
    category?: string;
    coordinate?: [number, number];
    address?: string;
  }>;
}

// Convert legacy POI to DB format
function convertLegacyPOI(poi: LegacyPOI, cityId: string): NewPoi {
  const now = new Date().toISOString();

  // Handle both string and object names
  const getName = (
    name:
      | string
      | { pl?: string; en?: string; de?: string; fr?: string; uk?: string }
      | undefined,
    lang: string
  ): string => {
    if (!name) return '';
    if (typeof name === 'string') return name;
    return name[lang as keyof typeof name] || '';
  };

  const getDescription = (
    desc:
      | string
      | { pl?: string; en?: string; de?: string; fr?: string; uk?: string }
      | undefined,
    lang: string
  ): string | null => {
    if (!desc) return null;
    if (typeof desc === 'string') return desc;
    return desc[lang as keyof typeof desc] || null;
  };

  // Handle openingHours - can be string or object
  const getOpeningHours = (
    hours: string | Record<string, string> | undefined
  ): string | null => {
    if (!hours) return null;
    if (typeof hours === 'string') return JSON.stringify({ info: hours });
    return JSON.stringify(hours);
  };

  // Get coordinates - some files use 'coordinate', some use 'coordinates'
  const coords = poi.coordinate || poi.coordinates || [0, 0];

  return {
    id: poi.id,
    cityId,
    namePl: getName(poi.name, 'pl') || poi.id,
    nameEn: getName(poi.name, 'en') || null,
    nameDe: getName(poi.name, 'de') || null,
    nameFr: getName(poi.name, 'fr') || null,
    nameUk: getName(poi.name, 'uk') || null,
    descriptionPl: getDescription(poi.description, 'pl'),
    descriptionEn: getDescription(poi.description, 'en'),
    descriptionDe: getDescription(poi.description, 'de'),
    descriptionFr: getDescription(poi.description, 'fr'),
    descriptionUk: getDescription(poi.description, 'uk'),
    category: mapCategory(poi.category || 'other') as NewPoi['category'],
    longitude: coords[0],
    latitude: coords[1],
    address: poi.address || null,
    openingHours: getOpeningHours(poi.openingHours),
    imageUrl: poi.imageUrl || null,
    website: poi.website || null,
    phone: poi.phone || null,
    createdAt: now,
    updatedAt: now,
  };
}

// Convert legacy Tour to DB format
function convertLegacyTour(tour: LegacyTour): NewTour {
  const now = new Date().toISOString();

  return {
    id: tour.id,
    cityId: tour.cityId,
    namePl: tour.name.pl || tour.id,
    nameEn: tour.name.en || null,
    nameDe: tour.name.de || null,
    nameFr: tour.name.fr || null,
    nameUk: tour.name.uk || null,
    descriptionPl: tour.description.pl || '',
    descriptionEn: tour.description.en || null,
    descriptionDe: tour.description.de || null,
    descriptionFr: tour.description.fr || null,
    descriptionUk: tour.description.uk || null,
    category: tour.category as NewTour['category'],
    difficulty: tour.difficulty as NewTour['difficulty'],
    distance: tour.distance,
    duration: tour.duration,
    imageUrl: tour.imageUrl || null,
    poisJson: JSON.stringify(tour.pois || []),
    status: 'published',
    featured: false,
    views: 0,
    createdAt: now,
    updatedAt: now,
  };
}

async function importPOIs(): Promise<number> {
  let totalImported = 0;

  for (const cityId of CITIES) {
    const filePath = join(__dirname, `data/poi/${cityId}.json`);

    if (!existsSync(filePath)) {
      console.log(`  ℹ️  Skipping ${cityId} - file not found`);
      continue;
    }

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const fileData = JSON.parse(fileContent);

      // Handle both formats: { pois: [...] } or [...]
      const legacyPois: LegacyPOI[] = Array.isArray(fileData)
        ? fileData
        : (fileData as LegacyPOIFile).pois || [];

      console.log(`  📍 Importing ${legacyPois.length} POIs for ${cityId}...`);

      let imported = 0;
      for (const poi of legacyPois) {
        // Skip if POI already exists
        const existing = db
          .select()
          .from(pois)
          .where(eq(pois.id, poi.id))
          .get();
        if (existing) {
          continue;
        }

        const newPoi = convertLegacyPOI(poi, cityId);
        db.insert(pois).values(newPoi).run();
        imported++;
      }

      console.log(`  ✅ Imported ${imported} new POIs for ${cityId}`);
      totalImported += imported;
    } catch (error) {
      console.error(`  ❌ Error importing ${cityId}:`, error);
    }
  }

  return totalImported;
}

async function importTours(): Promise<number> {
  let totalImported = 0;

  for (const cityId of CITIES) {
    const filePath = join(__dirname, `data/tours/${cityId}.json`);

    if (!existsSync(filePath)) {
      console.log(`  ℹ️  Skipping ${cityId} - file not found`);
      continue;
    }

    try {
      const fileContent = readFileSync(filePath, 'utf-8');
      const legacyTours: LegacyTour[] = JSON.parse(fileContent);

      console.log(
        `  🗺️  Importing ${legacyTours.length} tours for ${cityId}...`
      );

      let imported = 0;
      for (const tour of legacyTours) {
        // Skip if tour already exists
        const existing = db
          .select()
          .from(tours)
          .where(eq(tours.id, tour.id))
          .get();
        if (existing) {
          continue;
        }

        const newTour = convertLegacyTour(tour);
        db.insert(tours).values(newTour).run();
        imported++;
      }

      console.log(`  ✅ Imported ${imported} new tours for ${cityId}`);
      totalImported += imported;
    } catch (error) {
      console.error(`  ❌ Error importing ${cityId}:`, error);
    }
  }

  return totalImported;
}

async function main(): Promise<void> {
  console.log('\n📦 Starting database import...\n');

  try {
    // Import POIs
    console.log('🔸 Importing POIs...\n');
    const poisImported = await importPOIs();

    // Import Tours
    console.log('\n🔸 Importing Tours...\n');
    const toursImported = await importTours();

    // Get totals
    const totalPois = db.select({ count: count() }).from(pois).get();
    const totalTours = db.select({ count: count() }).from(tours).get();

    console.log('\n✨ Import complete!');
    console.log(`📊 Total POIs in database: ${totalPois?.count || 0}`);
    console.log(`📊 Total Tours in database: ${totalTours?.count || 0}`);
    console.log(`\n   New POIs imported: ${poisImported}`);
    console.log(`   New Tours imported: ${toursImported}\n`);
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
}

// Run import
main();
