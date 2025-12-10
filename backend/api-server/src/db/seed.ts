/**
 * Database Seed Script
 *
 * Creates default admin user and optionally sample data.
 * Run: npm run db:seed
 */

import bcrypt from 'bcrypt';
import { db, users, tours, pois, tourPois } from './index.js';
import { eq } from 'drizzle-orm';
import type { NewTour, NewPoi } from './schema/index.js';

const SALT_ROUNDS = 10;

interface SeedConfig {
  adminEmail: string;
  adminPassword: string;
  adminId: string;
  includeSampleData: boolean;
}

const defaultConfig: SeedConfig = {
  adminEmail: 'admin@wtg.pl',
  adminPassword: 'admin123',
  adminId: 'admin-1',
  includeSampleData: process.env.SEED_SAMPLE_DATA === 'true',
};

async function seedDefaultAdmin(config: SeedConfig): Promise<void> {
  // Check if admin already exists
  const existingAdmin = db
    .select()
    .from(users)
    .where(eq(users.email, config.adminEmail))
    .get();

  if (existingAdmin) {
    console.log(`✓ Admin user already exists: ${config.adminEmail}`);
    return;
  }

  const passwordHash = await bcrypt.hash(config.adminPassword, SALT_ROUNDS);
  const now = new Date().toISOString();

  db.insert(users)
    .values({
      id: config.adminId,
      email: config.adminEmail,
      passwordHash,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    })
    .run();

  console.log(`✓ Created default admin user: ${config.adminEmail}`);
  console.log(`  Password: ${config.adminPassword}`);
  console.log('  ⚠️  Change the password in production!');
}

async function seedSampleTours(): Promise<void> {
  // Check if tours already exist
  const existingTours = db.select().from(tours).all();
  if (existingTours.length > 0) {
    console.log(`✓ Tours already exist (${existingTours.length} tours)`);
    return;
  }

  const now = new Date().toISOString();

  // Sample tours for Kraków (using correct schema fields)
  const sampleTours: NewTour[] = [
    {
      id: 'tour-krakow-oldtown',
      cityId: 'krakow',
      nameEn: 'Old Town Walking Tour',
      namePl: 'Spacer po Starym Mieście',
      nameUk: 'Прогулянка Старим містом',
      nameDe: 'Altstadt-Rundgang',
      nameFr: 'Visite à pied de la vieille ville',
      descriptionEn:
        'Discover the historic heart of Kraków on this comprehensive walking tour through the Old Town.',
      descriptionPl:
        'Odkryj historyczne serce Krakowa na tej kompleksowej wycieczce pieszej po Starym Mieście.',
      descriptionUk:
        'Відкрийте історичне серце Кракова під час цієї комплексної пішохідної екскурсії по Старому місту.',
      descriptionDe:
        'Entdecken Sie das historische Herz Krakaus auf diesem umfassenden Rundgang durch die Altstadt.',
      descriptionFr:
        'Découvrez le cœur historique de Cracovie lors de cette visite complète à pied de la vieille ville.',
      difficulty: 'easy',
      duration: 5400, // 90 minutes in seconds
      distance: 3500, // meters
      category: 'history',
      imageUrl: null,
      status: 'published',
      featured: false,
      views: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'tour-krakow-kazimierz',
      cityId: 'krakow',
      nameEn: 'Jewish Quarter Heritage',
      namePl: 'Dziedzictwo Kazimierza',
      nameUk: 'Спадщина єврейського кварталу',
      nameDe: 'Jüdisches Viertel Erbe',
      nameFr: 'Patrimoine du quartier juif',
      descriptionEn:
        'Explore the historic Jewish quarter of Kazimierz, once a thriving center of Jewish culture.',
      descriptionPl:
        'Poznaj historyczną dzielnicę żydowską Kazimierz, niegdyś tętniące życiem centrum kultury żydowskiej.',
      descriptionUk:
        'Досліджуйте історичний єврейський квартал Казімеж, колись процвітаючий центр єврейської культури.',
      descriptionDe:
        'Erkunden Sie das historische jüdische Viertel Kazimierz, einst ein blühendes Zentrum jüdischer Kultur.',
      descriptionFr:
        'Explorez le quartier juif historique de Kazimierz, autrefois un centre florissant de la culture juive.',
      difficulty: 'easy',
      duration: 4500, // 75 minutes in seconds
      distance: 2800, // meters
      category: 'history',
      imageUrl: null,
      status: 'published',
      featured: false,
      views: 0,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const tour of sampleTours) {
    db.insert(tours).values(tour).run();
    console.log(`✓ Created tour: ${tour.nameEn}`);
  }
}

async function seedSamplePOIs(): Promise<void> {
  // Check if POIs already exist
  const existingPois = db.select().from(pois).all();
  if (existingPois.length > 0) {
    console.log(`✓ POIs already exist (${existingPois.length} POIs)`);
    return;
  }

  const now = new Date().toISOString();

  // Categories available: historical, religious, museum, park, restaurant, cafe, shopping, entertainment, viewpoint, monument, other
  const samplePois: NewPoi[] = [
    {
      id: 'poi-rynek-glowny',
      cityId: 'krakow',
      nameEn: 'Main Market Square',
      namePl: 'Rynek Główny',
      nameUk: 'Головний ринок',
      nameDe: 'Hauptmarkt',
      nameFr: 'Grande Place du Marché',
      descriptionEn:
        "One of the largest medieval town squares in Europe, the heart of Kraków's Old Town.",
      descriptionPl:
        'Jeden z największych średniowiecznych placów miejskich w Europie, serce krakowskiego Starego Miasta.',
      descriptionUk:
        'Одна з найбільших середньовічних міських площ у Європі, серце Старого міста Кракова.',
      descriptionDe:
        'Einer der größten mittelalterlichen Stadtplätze Europas, das Herz der Krakauer Altstadt.',
      descriptionFr:
        "L'une des plus grandes places médiévales d'Europe, le cœur de la vieille ville de Cracovie.",
      category: 'historical',
      latitude: 50.0617,
      longitude: 19.9374,
      address: 'Rynek Główny, 31-010 Kraków',
      openingHours: JSON.stringify({ open: true }),
      imageUrl: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'poi-sukiennice',
      cityId: 'krakow',
      nameEn: 'Cloth Hall',
      namePl: 'Sukiennice',
      nameUk: 'Сукенниці',
      nameDe: 'Tuchhallen',
      nameFr: 'Halle aux Draps',
      descriptionEn:
        "A Renaissance-era trading hall in the center of Main Market Square, one of Kraków's most recognizable icons.",
      descriptionPl:
        'Renesansowy budynek handlowy w centrum Rynku Głównego, jeden z najbardziej rozpoznawalnych symboli Krakowa.',
      descriptionUk:
        "Торговельна зала епохи Ренесансу в центрі Головного ринку, одна з найвідоміших пам'яток Кракова.",
      descriptionDe:
        'Eine Handelshalle aus der Renaissance im Zentrum des Hauptmarktes, eines der bekanntesten Wahrzeichen Krakaus.',
      descriptionFr:
        "Une halle commerciale de l'époque Renaissance au centre de la Grande Place, l'une des icônes les plus reconnaissables de Cracovie.",
      category: 'monument',
      latitude: 50.0617,
      longitude: 19.9368,
      address: 'Rynek Główny 1/3, 31-042 Kraków',
      openingHours: JSON.stringify({
        monday: '10:00-18:00',
        tuesday: '10:00-18:00',
        wednesday: '10:00-18:00',
        thursday: '10:00-18:00',
        friday: '10:00-20:00',
        saturday: '10:00-18:00',
        sunday: '10:00-18:00',
      }),
      imageUrl: null,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'poi-wawel',
      cityId: 'krakow',
      nameEn: 'Wawel Royal Castle',
      namePl: 'Zamek Królewski na Wawelu',
      nameUk: 'Вавельський королівський замок',
      nameDe: 'Königsschloss Wawel',
      nameFr: 'Château royal du Wawel',
      descriptionEn:
        'The residency of Polish kings for centuries, a symbol of national pride perched atop Wawel Hill.',
      descriptionPl:
        'Przez wieki rezydencja polskich królów, symbol narodowej dumy na wzgórzu wawelskim.',
      descriptionUk:
        'Резиденція польських королів протягом століть, символ національної гордості на Вавельському пагорбі.',
      descriptionDe:
        'Jahrhundertelang die Residenz polnischer Könige, ein Symbol des Nationalstolzes auf dem Wawel-Hügel.',
      descriptionFr:
        'La résidence des rois polonais pendant des siècles, un symbole de fierté nationale perché au sommet de la colline du Wawel.',
      category: 'museum',
      latitude: 50.0541,
      longitude: 19.9352,
      address: 'Wawel 5, 31-001 Kraków',
      openingHours: JSON.stringify({
        monday: 'closed',
        tuesday: '09:30-17:00',
        wednesday: '09:30-17:00',
        thursday: '09:30-17:00',
        friday: '09:30-17:00',
        saturday: '09:30-17:00',
        sunday: '09:30-17:00',
      }),
      imageUrl: null,
      createdAt: now,
      updatedAt: now,
    },
  ];

  for (const poi of samplePois) {
    db.insert(pois).values(poi).run();
    console.log(`✓ Created POI: ${poi.nameEn}`);
  }
}

async function linkToursWithPois(): Promise<void> {
  // Check if links already exist
  const existingLinks = db.select().from(tourPois).all();
  if (existingLinks.length > 0) {
    console.log(
      `✓ Tour-POI links already exist (${existingLinks.length} links)`
    );
    return;
  }

  const links = [
    { tourId: 'tour-krakow-oldtown', poiId: 'poi-rynek-glowny', order: 1 },
    { tourId: 'tour-krakow-oldtown', poiId: 'poi-sukiennice', order: 2 },
    { tourId: 'tour-krakow-oldtown', poiId: 'poi-wawel', order: 3 },
  ];

  for (const link of links) {
    db.insert(tourPois).values(link).run();
    console.log(`✓ Linked tour ${link.tourId} -> POI ${link.poiId}`);
  }
}

async function seed(): Promise<void> {
  console.log('\n🌱 Starting database seed...\n');

  try {
    // Always seed admin user
    await seedDefaultAdmin(defaultConfig);

    // Optionally seed sample data
    if (defaultConfig.includeSampleData) {
      console.log('\n📦 Seeding sample data...\n');
      await seedSampleTours();
      await seedSamplePOIs();
      await linkToursWithPois();
    }

    console.log('\n✅ Database seed completed!\n');
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

// Run seed
seed();
