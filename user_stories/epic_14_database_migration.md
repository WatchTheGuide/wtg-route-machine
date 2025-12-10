# Epic 14: Migracja Storage na Bazę Danych

## Przegląd

Migracja z obecnego in-memory storage i plików JSON na trwałą bazę danych SQLite/PostgreSQL w celu zapewnienia persystencji danych między restartami serwera.

## Obecny stan storage

| Dane              | Obecny typ    | Status                                   |
| ----------------- | ------------- | ---------------------------------------- |
| Admin Tours       | SQLite (DB)   | ✅ Zmigrowane - US 14.3                  |
| Users             | SQLite (DB)   | ✅ Zmigrowane - US 14.2                  |
| Refresh Tokens    | SQLite (DB)   | ✅ Zmigrowane - US 14.2                  |
| Admin POI         | SQLite (DB)   | ✅ Zmigrowane - US 14.4 (79 POI)         |
| Tours (publiczne) | JSON files    | ⚠️ OK dla read-only                      |
| POI (publiczne)   | JSON files    | ⚠️ OK dla read-only (fallback)           |

## Cel

- Trwałe przechowywanie wszystkich danych CRUD
- Zachowanie kompatybilności z istniejącymi serwisami
- Minimalna zmiana API - tylko warstwa storage
- Możliwość łatwej migracji między SQLite (dev) a PostgreSQL (prod)

## Technologia

- **Development**: SQLite (zero-config, plik lokalny)
- **Production**: PostgreSQL (AWS RDS lub container)
- **ORM**: Drizzle ORM (type-safe, lightweight, SQL-like)
- **Migracje**: Drizzle Kit

### Dlaczego Drizzle ORM?

1. **Type-safety** - pełne TypeScript support, inferowane typy z schema
2. **Lightweight** - mały footprint, szybki cold start
3. **SQL-like** - intuicyjny dla znających SQL
4. **Multi-DB** - jeden kod dla SQLite i PostgreSQL
5. **Migracje** - wbudowany system migracji

## User Stories

---

## US 14.1: Setup Drizzle ORM i Schema ✅ COMPLETED

**Jako** deweloper  
**Chcę** skonfigurować Drizzle ORM ze schematem bazy danych  
**Aby** mieć type-safe dostęp do bazy danych

### Kryteria akceptacji:

- [x] Instalacja zależności: `drizzle-orm`, `drizzle-kit`, `better-sqlite3`
- [x] Konfiguracja `drizzle.config.ts`
- [x] Utworzenie schema w `src/db/schema/`:
  - [x] `users.ts` - tabela użytkowników
  - [x] `refresh_tokens.ts` - tokeny odświeżania
  - [x] `tours.ts` - wycieczki (admin)
  - [x] `pois.ts` - punkty zainteresowania
  - [x] `tour_pois.ts` - junction table
- [x] Konfiguracja połączenia DB w `src/db/index.ts`
- [x] Wsparcie dla zmiennej `DATABASE_URL` (SQLite)
- [x] Wygenerowanie migracji SQL
- [x] Skrypty npm: `db:generate`, `db:migrate`, `db:push`, `db:studio`

### Pliki utworzone:

```
backend/api-server/
├── drizzle.config.ts
├── drizzle/migrations/
│   └── 0000_charming_galactus.sql
└── src/db/
    ├── index.ts          # DB connection + Drizzle instance
    ├── migrate.ts        # Migration runner
    ├── schema.ts         # Combined schema for drizzle-kit
    └── schema/
        ├── index.ts
        ├── users.ts
        ├── refresh_tokens.ts
        ├── tours.ts
        ├── pois.ts
        └── tour_pois.ts
```

### Estymacja: 0.5 dnia ✅

### Schema (draft):

```typescript
// src/db/schema/users.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role', { enum: ['admin', 'editor'] })
    .notNull()
    .default('editor'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// src/db/schema/refresh_tokens.ts
export const refreshTokens = sqliteTable('refresh_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: text('expires_at').notNull(),
  createdAt: text('created_at').notNull(),
});

// src/db/schema/tours.ts
export const tours = sqliteTable('tours', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull(),
  namePl: text('name_pl').notNull(),
  nameEn: text('name_en'),
  nameDe: text('name_de'),
  nameFr: text('name_fr'),
  nameUk: text('name_uk'),
  descriptionPl: text('description_pl').notNull(),
  descriptionEn: text('description_en'),
  descriptionDe: text('description_de'),
  descriptionFr: text('description_fr'),
  descriptionUk: text('description_uk'),
  category: text('category').notNull(),
  difficulty: text('difficulty').notNull(),
  distance: integer('distance').notNull().default(0),
  duration: integer('duration').notNull().default(0),
  imageUrl: text('image_url'),
  status: text('status', { enum: ['draft', 'published', 'archived'] })
    .notNull()
    .default('draft'),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  views: integer('views').notNull().default(0),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// src/db/schema/tour_pois.ts (junction table)
export const tourPois = sqliteTable('tour_pois', {
  tourId: text('tour_id')
    .notNull()
    .references(() => tours.id),
  poiId: text('poi_id').notNull(),
  order: integer('order').notNull(),
});

// src/db/schema/pois.ts
export const pois = sqliteTable('pois', {
  id: text('id').primaryKey(),
  cityId: text('city_id').notNull(),
  namePl: text('name_pl').notNull(),
  nameEn: text('name_en'),
  descriptionPl: text('description_pl'),
  descriptionEn: text('description_en'),
  category: text('category').notNull(),
  latitude: real('latitude').notNull(),
  longitude: real('longitude').notNull(),
  address: text('address'),
  imageUrl: text('image_url'),
  openingHours: text('opening_hours'),
  website: text('website'),
  phone: text('phone'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
```

### Estymacja: 0.5 dnia

---

## US 14.2: Migracja Auth Service na DB ✅ COMPLETED

**Jako** administrator  
**Chcę** aby użytkownicy i sesje były zapisywane w bazie danych  
**Aby** loginy i sesje przetrwały restart serwera

### Kryteria akceptacji:

- [x] Refaktor `auth.service.ts`:
  - [x] Zastąpienie `users: Map` na queries do DB
  - [x] Zastąpienie `refreshTokens: Map` na queries do DB
  - [x] Zachowanie identycznego API metod
- [x] Seed script dla domyślnego admina:
  - [x] `npm run db:seed` - tworzy admin@wtg.pl
  - [x] Sprawdzenie czy user już istnieje przed tworzeniem
- [x] Automatyczne tworzenie tabel przy pierwszym uruchomieniu
- [x] Testy jednostkowe z in-memory SQLite (140 tests pass)

### Pliki zmodyfikowane:

```
backend/api-server/src/
├── services/
│   └── auth.service.ts       # Pełna migracja na Drizzle ORM
└── db/
    └── seed.ts               # Skrypt seedowania (admin + sample data)
```

### Nowe komendy:

- `npm run db:seed` - tworzy domyślnego admina i opcjonalnie dane testowe

### Dodatkowe metody w auth.service.ts:

- `deleteAllUserTokens(userId)` - wylogowanie ze wszystkich sesji
- `cleanupExpiredTokens()` - usuwanie wygasłych tokenów (maintenance)

### Zmiana w auth.service.ts:

```typescript
// Before (in-memory)
const users: Map<string, User> = new Map();
const user = Array.from(users.values()).find((u) => u.email === email);

// After (Drizzle)
import { db } from '../db/index.js';
import { users, refreshTokens } from '../db/schema/index.js';
import { eq } from 'drizzle-orm';

const user = await db.select().from(users).where(eq(users.email, email)).get();
```

### Estymacja: 1 dzień ✅

---

## US 14.3: Migracja Admin Tours Service na DB ✅ COMPLETED

**Jako** administrator  
**Chcę** aby utworzone wycieczki były zapisywane w bazie danych  
**Aby** wycieczki przetrwały restart serwera

### Kryteria akceptacji:

- [x] Refaktor `admin.tours.service.ts`:
  - [x] Zastąpienie `adminTours: Map` na queries do DB
  - [x] CRUD operations przez Drizzle ORM
  - [x] Obsługa POIs przez JSON column (`poisJson`)
- [x] Zachowanie filtrowania (cityId, status, category, search)
- [x] Zachowanie wszystkich operacji: create, update, delete, duplicate, publish, archive, bulk delete
- [x] Testy jednostkowe z in-memory SQLite (38 tests pass)

### Implementacja:

#### Podejście do POIs:

Zamiast junction table (`tour_pois`), POIs są przechowywane jako JSON w kolumnie `pois_json`. To pozwala na:

- Zachowanie wstecznej kompatybilności z testami
- Prostsze queries bez JOINów
- Możliwość przechowywania POIs bez konieczności ich uprzedniego utworzenia w DB

#### Pliki zmodyfikowane:

```
backend/api-server/src/
├── db/
│   ├── schema.ts             # Dodano kolumnę poisJson
│   └── schema/
│       └── tours.ts          # Dodano kolumnę poisJson
└── services/
    └── admin.tours.service.ts  # Pełna migracja na Drizzle ORM
```

#### Kluczowe zmiany w admin.tours.service.ts:

```typescript
// Before (in-memory)
const adminTours: Map<string, AdminTour> = new Map();
adminTours.set(newTour.id, newTour);

// After (Drizzle)
import { db } from '../db/index.js';
import { tours } from '../db/schema/index.js';
import { eq, like, and, or, sql } from 'drizzle-orm';

await db.insert(tours).values({
  ...tourData,
  poisJson: JSON.stringify(tourData.pois || []),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});
```

#### Helper dla parsowania POIs:

```typescript
function parsePois(poisJson: string | null): TourPOI[] {
  if (!poisJson) return [];
  try {
    return JSON.parse(poisJson);
  } catch {
    return [];
  }
}
```

### Estymacja: 1.5 dnia ✅

---

## US 14.4: Migracja POI Service na DB ✅ COMPLETED

**Jako** administrator  
**Chcę** aby POI były przechowywane w bazie danych  
**Aby** móc dodawać i edytować POI przez admin panel

### Kryteria akceptacji:

- [x] Nowy `admin.poi.service.ts`:
  - [x] CRUD operations dla POI (create, read, update, delete)
  - [x] Bulk delete
  - [x] Filtrowanie (cityId, category, search)
  - [x] Statystyki (count by city, total count)
- [x] Import istniejących POI z JSON:
  - [x] Script `npm run db:import-pois`
  - [x] Migracja wszystkich 4 miast (79 POI)
  - [x] Mapowanie kategorii (legacy -> DB schema)
- [x] Testy jednostkowe (28 testów)
- [x] Zachowanie publicznego `poi.service.ts` (JSON fallback)

### Implementacja:

#### Nowy serwis admin.poi.service.ts:

```typescript
// CRUD operations
createPOI(input: CreatePOIInput): Promise<AdminPOI>
getPOIById(id: string): Promise<AdminPOI | null>
updatePOI(id: string, updates: UpdatePOIInput): Promise<AdminPOI | null>
deletePOI(id: string): Promise<boolean>
bulkDeletePOIs(ids: string[]): Promise<number>

// Queries
getAllPOIs(filters?: POIFilters): Promise<POISummary[]>
getPOIsForCity(cityId: string): Promise<AdminPOI[]>
getPOICountByCity(): Promise<{ cityId: string; count: number }[]>
getTotalPOICount(): Promise<number>

// Utilities
getCategories(): string[]
poiExists(id: string): Promise<boolean>
importLegacyPOI(legacyPoi, cityId): Promise<AdminPOI>
```

#### Kategorie DB (rozszerzone):

```typescript
type POICategoryDB =
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
```

#### Import z JSON:

```bash
npm run db:import-pois

# Output:
# 🚀 Starting POI import from JSON files...
# 📍 Importing 20 POIs for Kraków...
# ✅ Imported 20 POIs for krakow
# ...
# ✨ Import complete!
# 📊 Total POIs in database: 79
```

#### Pliki utworzone/zmodyfikowane:

```
backend/api-server/src/
├── services/
│   ├── admin.poi.service.ts       # NEW - CRUD dla POI
│   └── admin.poi.service.test.ts  # NEW - 28 testów
├── import-pois.ts                  # NEW - skrypt importu
└── package.json                    # Dodano db:import-pois
```

### Estymacja: 1.5 dnia ✅

---

## US 14.5: Migracje Bazy Danych

**Jako** deweloper  
**Chcę** mieć system migracji bazy danych  
**Aby** móc bezpiecznie aktualizować schema w produkcji

### Kryteria akceptacji:

- [ ] Konfiguracja Drizzle Kit:
  - [ ] `drizzle.config.ts` z konfiguracją migracji
  - [ ] Folder `drizzle/migrations/` dla plików SQL
- [ ] Skrypty npm:
  - [ ] `npm run db:generate` - generowanie migracji z schema
  - [ ] `npm run db:migrate` - aplikowanie migracji
  - [ ] `npm run db:push` - push schema (dev only)
  - [ ] `npm run db:studio` - Drizzle Studio (GUI)
- [ ] Automatyczne migracje przy starcie serwera (opcjonalne)
- [ ] Dokumentacja procesu migracji

### Struktura plików:

```
backend/api-server/
├── drizzle/
│   └── migrations/
│       ├── 0000_initial.sql
│       ├── 0001_add_pois.sql
│       └── meta/
│           └── _journal.json
├── drizzle.config.ts
├── src/
│   └── db/
│       ├── index.ts          # DB connection
│       ├── migrate.ts        # Migration runner
│       └── schema/
│           ├── index.ts      # Schema exports
│           ├── users.ts
│           ├── refresh_tokens.ts
│           ├── tours.ts
│           ├── tour_pois.ts
│           └── pois.ts
└── package.json
```

### Estymacja: 0.5 dnia

---

## US 14.6: Wsparcie PostgreSQL (Produkcja)

**Jako** DevOps  
**Chcę** aby aplikacja wspierała PostgreSQL w produkcji  
**Aby** mieć skalowalną i niezawodną bazę danych

### Kryteria akceptacji:

- [ ] Abstrakcja schema dla multi-DB:
  - [ ] Użycie `drizzle-orm/pg-core` dla PostgreSQL
  - [ ] Conditional import based on `DATABASE_URL`
- [ ] Instalacja `pg` driver dla PostgreSQL
- [ ] Konfiguracja connection pooling
- [ ] Docker Compose z PostgreSQL:
  - [ ] `docker-compose.dev.yml` - SQLite
  - [ ] `docker-compose.prod.yml` - PostgreSQL
- [ ] Dokumentacja deployment

### Konfiguracja środowiskowa:

```env
# Development (SQLite)
DATABASE_URL=file:./data/wtg.db

# Production (PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/wtg?schema=public
```

### Estymacja: 1 dzień

---

## US 14.7: Seedy i Import Danych

**Jako** deweloper  
**Chcę** mieć skrypty do seedowania bazy danych  
**Aby** szybko ustawić środowisko developerskie

### Kryteria akceptacji:

- [ ] Seed script (`npm run db:seed`):
  - [ ] Tworzenie domyślnego admina
  - [ ] Przykładowe wycieczki (opcjonalnie)
- [ ] Import script (`npm run db:import`):
  - [ ] Import wycieczek z `data/tours/*.json`
  - [ ] Import POI z `data/poi/*.json`
  - [ ] Mapowanie struktur JSON -> DB
  - [ ] Walidacja danych przed importem
- [ ] Reset script (`npm run db:reset`):
  - [ ] Usunięcie wszystkich danych
  - [ ] Re-run migracji
  - [ ] Re-run seedów

### Estymacja: 0.5 dnia

---

## Podsumowanie estymacji

| User Story | Nazwa                    | Estymacja   | Status       |
| ---------- | ------------------------ | ----------- | ------------ |
| US 14.1    | Setup Drizzle ORM        | 0.5 dnia    | ✅ COMPLETED |
| US 14.2    | Auth Service Migration   | 1 dzień     | ✅ COMPLETED |
| US 14.3    | Tours Service Migration  | 1.5 dnia    | ✅ COMPLETED |
| US 14.4    | POI Service Migration    | 1.5 dnia    | ✅ COMPLETED |
| US 14.5    | Migracje DB              | 0.5 dnia    | ⏳ Partial   |
| US 14.6    | PostgreSQL Production    | 1 dzień     | 📋 Planned   |
| US 14.7    | Seedy i Import           | 0.5 dnia    | ⏳ Partial   |
| **TOTAL**  |                          | **6.5 dni** | **4/7 done** |

## Postęp implementacji

### Ukończone (4/7):
- ✅ **US 14.1**: Setup Drizzle ORM - schema, konfiguracja, typy
- ✅ **US 14.2**: Auth Service - users i refresh_tokens w DB
- ✅ **US 14.3**: Admin Tours Service - tours w DB z poisJson
- ✅ **US 14.4**: Admin POI Service - CRUD dla POI + import 79 POI

### Częściowo ukończone:
- ⏳ **US 14.5**: Migracje - podstawowa konfiguracja działa
- ⏳ **US 14.7**: Seedy - `db:seed` i `db:import-pois` działają

### Do zrobienia:
- 📋 **US 14.6**: PostgreSQL dla produkcji

## Kolejność implementacji

```mermaid
graph TD
    A[US 14.1: Setup Drizzle] --> B[US 14.2: Auth Service]
    A --> C[US 14.3: Tours Service]
    A --> E[US 14.5: Migracje]
    C --> D[US 14.4: POI Service]
    B --> G[US 14.7: Seedy]
    C --> G
    D --> G
    E --> F[US 14.6: PostgreSQL]
    B --> F
    C --> F
    D --> F
```

## Rekomendowana kolejność:

1. **US 14.1** - Setup Drizzle ORM (podstawa)
2. **US 14.5** - System migracji (przed zmianami w serwisach)
3. **US 14.2** - Auth Service (najpilniejsze - sesje tracone)
4. **US 14.3** - Tours Service (drugie w kolejności - wycieczki tracone)
5. **US 14.4** - POI Service (rozszerzenie funkcjonalności)
6. **US 14.7** - Seedy i import (ułatwienie developmentu)
7. **US 14.6** - PostgreSQL (przed deploymentem produkcyjnym)

## Ryzyka i mitygacja

| Ryzyko                                | Prawdopodobieństwo | Mitygacja                                 |
| ------------------------------------- | ------------------ | ----------------------------------------- |
| Zmiana API serwisów                   | Niskie             | Testy jednostkowe, zachowanie interfejsów |
| Utrata danych podczas migracji        | Niskie             | Backup JSONów, import script              |
| Problemy z kompatybilnością SQLite/PG | Średnie            | Testy na obu bazach, Drizzle abstrakcja   |
| Performance degradation               | Niskie             | Indeksy, connection pooling, cache        |

## Definicja ukończenia (DoD)

- [ ] Wszystkie serwisy używają Drizzle ORM
- [ ] Dane przetrwają restart serwera
- [ ] Testy jednostkowe przechodzą na obu bazach
- [ ] Dokumentacja zaktualizowana
- [ ] Docker Compose z PostgreSQL działa
- [ ] Import z JSON zakończony pomyślnie
