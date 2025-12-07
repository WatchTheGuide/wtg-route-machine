# Epic 5.1: Backend API dla Kuratorowanych Wycieczek

**Cel:** Zbudować backend API do zarządzania i wystawiania kuratorowanych wycieczek, zgodny z istniejącą architekturą WTG Route Machine.

**Priorytet:** 🔴 Wysoki

**Zależności:**

- Epic 3 (Backend Multi-City) ✅
- Epic 4 (POI Server) ✅
- US 7.7 (Frontend Tours - Mobile) ✅

---

## Architektura

### Komponenty

- **Tours Service** - Node.js/TypeScript serwis (podobny do POI Server)
- **Nginx Reverse Proxy** - routing z ochroną API key
- **Tours Data** - JSON files z treścią wycieczek (nie w kodzie aplikacji)

### Endpointy

```
GET  /api/tours/cities                    - Lista miast z liczbą wycieczek
GET  /api/tours/:cityId                   - Wycieczki dla miasta
GET  /api/tours/:cityId/:tourId           - Szczegóły wycieczki
GET  /api/tours/:cityId/search?q=query    - Szukaj wycieczek
```

### Ochrona API

- **Development**: brak ochrony (localhost)
- **Production**: API key w headerze `X-API-Key` (wspólny z OSRM i POI)
- **Nginx map**: `/etc/nginx/api-keys.map` (już istniejący)

---

## US 5.1.1: Tours Service - Struktura projektu

**Jako** deweloper  
**Chcę** stworzyć Tours Service zgodny z architekturą POI Server  
**Aby** zapewnić spójność kodu i łatwość maintenance

### Kryteria akceptacji

- [x] Katalog: `backend/tours-server/`
- [x] TypeScript + Node.js + Express (jak POI Server)
- [x] Struktura podobna do POI Server:
  ```
  backend/tours-server/
  ├── src/
  │   ├── app.ts              # Express app config
  │   ├── index.ts            # Server entry point
  │   ├── types/
  │   │   ├── tour.types.ts   # Tour, TourCategory, etc.
  │   │   └── index.ts
  │   ├── services/
  │   │   ├── tours.service.ts  # Business logic
  │   │   └── index.ts
  │   ├── routes/
  │   │   ├── tours.routes.ts   # Express routes
  │   │   └── index.ts
  │   └── data/
  │       ├── tours/
  │       │   ├── krakow.json
  │       │   ├── warszawa.json
  │       │   ├── wroclaw.json
  │       │   └── trojmiasto.json
  │       └── categories.json
  ├── package.json
  ├── tsconfig.json
  ├── .gitignore
  └── README.md
  ```
- [x] Port: **3002** (POI Server używa 3001)
- [x] Skrypty npm: `dev`, `build`, `start`, `test`
- [x] Health check endpoint: `GET /health`

### TypeScript Types

```typescript
// src/types/tour.types.ts

export type TourCategory =
  | 'history'
  | 'architecture'
  | 'art'
  | 'food'
  | 'nature';

export type TourDifficulty = 'easy' | 'medium' | 'hard';

export interface TourPOI {
  id: string;
  name: string;
  description: string;
  category: string;
  coordinate: [number, number]; // [lon, lat]
  address?: string;
}

export interface Tour {
  id: string;
  cityId: string;
  name: string;
  description: string;
  category: TourCategory;
  difficulty: TourDifficulty;
  distance: number; // metry
  duration: number; // sekundy
  imageUrl?: string;
  pois: TourPOI[];
  tags?: string[];
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API Response Types
export interface ToursListResponse {
  city: string;
  count: number;
  tours: Tour[];
}

export interface TourDetailResponse {
  tour: Tour;
}

export interface CitiesResponse {
  cities: Array<{
    id: string;
    name: string;
    tourCount: number;
  }>;
}

export interface SearchResponse {
  city: string;
  query: string;
  count: number;
  tours: Tour[];
}

export interface ErrorResponse {
  error: string;
  code: string;
}
```

### Dependencies

```json
{
  "name": "@wtg/tours-server",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/node": "^20.10.0",
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "nodemon": "^3.0.2"
  }
}
```

---

## US 5.1.2: Tours Data Structure

**Jako** content manager  
**Chcę** przechowywać wycieczki w JSON files poza kodem aplikacji  
**Aby** móc łatwo aktualizować treść bez rebuildu aplikacji

### Kryteria akceptacji

- [x] JSON files w `backend/tours-server/src/data/tours/`
- [x] Jeden plik na miasto: `{cityId}.json`
- [x] Walidacja struktury przy starcie serwisu
- [x] Minimum 2 wycieczki na miasto (8 wycieczek total)
- [x] Wszystkie POI z poprawymi współrzędnymi
- [x] Categories w osobnym pliku: `categories.json`

### Przykład: `krakow.json`

```json
[
  {
    "id": "krakow-landmarks",
    "cityId": "krakow",
    "name": "Najważniejsze zabytki Krakowa",
    "description": "Spacer po centrum Krakowa z wizytą w najważniejszych zabytkach miasta",
    "category": "history",
    "difficulty": "easy",
    "distance": 5200,
    "duration": 10800,
    "imageUrl": "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&q=80",
    "tags": ["must-see", "zabytki", "centrum"],
    "featured": true,
    "pois": [
      {
        "id": "krakow-rynek",
        "name": "Rynek Główny",
        "description": "Największy średniowieczny rynek w Europie",
        "category": "landmark",
        "coordinate": [19.938, 50.0619],
        "address": "Rynek Główny, Kraków"
      },
      {
        "id": "krakow-sukiennice",
        "name": "Sukiennice",
        "description": "Zabytkowe hale targowe z XVI wieku",
        "category": "landmark",
        "coordinate": [19.9375, 50.0617],
        "address": "Rynek Główny 1/3, Kraków"
      },
      {
        "id": "krakow-mariacki",
        "name": "Kościół Mariacki",
        "description": "Gotycka bazylika z XIV wieku",
        "category": "landmark",
        "coordinate": [19.9395, 50.0618],
        "address": "plac Mariacki 5, Kraków"
      },
      {
        "id": "krakow-wawel",
        "name": "Zamek Królewski na Wawelu",
        "description": "Rezydencja królów polskich",
        "category": "landmark",
        "coordinate": [19.9355, 50.0544],
        "address": "Wawel 5, Kraków"
      }
    ],
    "createdAt": "2024-12-01T10:00:00Z",
    "updatedAt": "2024-12-07T14:30:00Z"
  },
  {
    "id": "krakow-churches",
    "cityId": "krakow",
    "name": "Historyczne kościoły Krakowa",
    "description": "Odkryj najpiękniejsze świątynie Krakowa od gotyku po barok",
    "category": "architecture",
    "difficulty": "medium",
    "distance": 6800,
    "duration": 14400,
    "imageUrl": "https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80",
    "tags": ["architektura", "kościoły", "kultura"],
    "featured": false,
    "pois": [
      {
        "id": "krakow-mariacki-church",
        "name": "Bazylika Mariacka",
        "description": "Gotycka bazylika z ołtarzem Wita Stwosza",
        "category": "landmark",
        "coordinate": [19.9395, 50.0618],
        "address": "plac Mariacki 5, Kraków"
      },
      {
        "id": "krakow-katedra-church",
        "name": "Katedra na Wawelu",
        "description": "Sanktuarium narodowe Polski",
        "category": "landmark",
        "coordinate": [19.9349, 50.0542],
        "address": "Wawel 3, Kraków"
      }
    ],
    "createdAt": "2024-12-01T10:00:00Z",
    "updatedAt": "2024-12-07T14:30:00Z"
  }
]
```

### Przykład: `categories.json`

```json
{
  "history": {
    "name": "Historia",
    "description": "Wycieczki historyczne po najważniejszych zabytkach",
    "icon": "time",
    "color": "#ff6600"
  },
  "architecture": {
    "name": "Architektura",
    "description": "Architektoniczne perły miast",
    "icon": "business",
    "color": "#454545"
  },
  "art": {
    "name": "Sztuka",
    "description": "Muzea, galerie i street art",
    "icon": "color-palette",
    "color": "#9c27b0"
  },
  "food": {
    "name": "Kulinaria",
    "description": "Tradycyjne smaki i lokale",
    "icon": "restaurant",
    "color": "#4caf50"
  },
  "nature": {
    "name": "Przyroda",
    "description": "Parki, ogrody i zieleń miejska",
    "icon": "leaf",
    "color": "#8bc34a"
  }
}
```

---

## US 5.1.3: Tours Service - Business Logic

**Jako** deweloper  
**Chcę** zaimplementować logikę biznesową Tours Service  
**Aby** obsługiwać requesty API

### Kryteria akceptacji

- [x] `ToursService` class z metodami:
  - `getCities()` - lista miast z licznikami
  - `getToursByCity(cityId, category?)` - wycieczki dla miasta
  - `getTourById(cityId, tourId)` - szczegóły wycieczki
  - `searchTours(cityId, query)` - wyszukiwanie
  - `getFeaturedTours(cityId)` - wyróżnione wycieczki
- [x] Lazy loading JSON files (cache w pamięci)
- [x] Walidacja cityId i tourId
- [x] Error handling z kodem błędu
- [x] TypeScript strict mode

### Implementacja: `tours.service.ts`

```typescript
// src/services/tours.service.ts

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { Tour, TourCategory } from '../types/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cache dla danych
let toursCache: Map<string, Tour[]> | null = null;
let categoriesCache: any = null;

// Wspierane miasta
const CITIES = {
  krakow: 'Kraków',
  warszawa: 'Warszawa',
  wroclaw: 'Wrocław',
  trojmiasto: 'Trójmiasto (Gdańsk)',
} as const;

export type CityId = keyof typeof CITIES;

/**
 * Load tours from JSON file for specific city
 */
function loadToursForCity(cityId: string): Tour[] {
  const filePath = join(__dirname, '..', 'data', 'tours', `${cityId}.json`);
  try {
    const data = readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Failed to load tours for ${cityId}:`, error);
    return [];
  }
}

/**
 * Load all tours and cache them
 */
function loadAllTours(): Map<string, Tour[]> {
  if (toursCache) {
    return toursCache;
  }

  toursCache = new Map();

  for (const cityId of Object.keys(CITIES)) {
    const tours = loadToursForCity(cityId);
    toursCache.set(cityId, tours);
  }

  return toursCache;
}

/**
 * Load categories
 */
export function loadCategories(): any {
  if (categoriesCache) {
    return categoriesCache;
  }

  const filePath = join(__dirname, '..', 'data', 'categories.json');
  try {
    const data = readFileSync(filePath, 'utf-8');
    categoriesCache = JSON.parse(data);
    return categoriesCache;
  } catch (error) {
    console.error('Failed to load categories:', error);
    return {};
  }
}

/**
 * Check if city exists
 */
export function cityExists(cityId: string): boolean {
  return cityId in CITIES;
}

/**
 * Get city name
 */
export function getCityName(cityId: string): string | undefined {
  return CITIES[cityId as CityId];
}

/**
 * Get all cities with tour counts
 */
export function getCities(): Array<{
  id: string;
  name: string;
  tourCount: number;
}> {
  const tours = loadAllTours();

  return Object.entries(CITIES).map(([id, name]) => ({
    id,
    name,
    tourCount: tours.get(id)?.length || 0,
  }));
}

/**
 * Get tours for a city (optionally filtered by category)
 */
export function getToursByCity(
  cityId: string,
  category?: TourCategory
): Tour[] | null {
  if (!cityExists(cityId)) {
    return null;
  }

  const tours = loadAllTours();
  const cityTours = tours.get(cityId) || [];

  if (category) {
    return cityTours.filter((tour) => tour.category === category);
  }

  return cityTours;
}

/**
 * Get a specific tour by ID
 */
export function getTourById(cityId: string, tourId: string): Tour | null {
  if (!cityExists(cityId)) {
    return null;
  }

  const tours = loadAllTours();
  const cityTours = tours.get(cityId) || [];

  return cityTours.find((tour) => tour.id === tourId) || null;
}

/**
 * Search tours by query
 */
export function searchTours(cityId: string, query: string): Tour[] | null {
  if (!cityExists(cityId)) {
    return null;
  }

  const tours = loadAllTours();
  const cityTours = tours.get(cityId) || [];
  const lowerQuery = query.toLowerCase();

  return cityTours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(lowerQuery) ||
      tour.description.toLowerCase().includes(lowerQuery) ||
      tour.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get featured tours for a city
 */
export function getFeaturedTours(cityId: string): Tour[] | null {
  if (!cityExists(cityId)) {
    return null;
  }

  const tours = loadAllTours();
  const cityTours = tours.get(cityId) || [];

  return cityTours.filter((tour) => tour.featured === true);
}
```

---

## US 5.1.4: Tours API Routes

**Jako** deweloper  
**Chcę** zdefiniować Express routes dla Tours API  
**Aby** obsługiwać HTTP requesty

### Kryteria akceptacji

- [x] Routes w `src/routes/tours.routes.ts`
- [x] RESTful endpoints z proper HTTP status codes
- [x] Walidacja parametrów i query params
- [x] Error handling z JSON responses
- [x] CORS enabled
- [x] TypeScript typowanie dla Request/Response

### Implementacja: `tours.routes.ts`

```typescript
// src/routes/tours.routes.ts

import { Router, Request, Response } from 'express';
import {
  getCities,
  getToursByCity,
  getTourById,
  searchTours,
  getFeaturedTours,
  cityExists,
  getCityName,
  loadCategories,
} from '../services/tours.service.js';
import type {
  ToursListResponse,
  TourDetailResponse,
  CitiesResponse,
  SearchResponse,
  ErrorResponse,
} from '../types/index.js';

const router = Router();

/**
 * GET /api/tours/cities
 * List all cities with tour counts
 */
router.get('/cities', (_req: Request, res: Response<CitiesResponse>) => {
  const cities = getCities();
  res.json({ cities });
});

/**
 * GET /api/tours/categories
 * List all tour categories
 */
router.get('/categories', (_req: Request, res: Response) => {
  const categories = loadCategories();
  res.json({ categories });
});

/**
 * GET /api/tours/:cityId
 * Get tours for a specific city
 * Query params:
 *   - category: filter by category (optional)
 *   - featured: get only featured tours (optional)
 */
router.get(
  '/:cityId',
  (
    req: Request<
      { cityId: string },
      unknown,
      unknown,
      { category?: string; featured?: string }
    >,
    res: Response<ToursListResponse | ErrorResponse>
  ) => {
    const { cityId } = req.params;
    const { category, featured } = req.query;

    if (!cityExists(cityId)) {
      res.status(404).json({
        error: `City '${cityId}' not found`,
        code: 'CITY_NOT_FOUND',
      });
      return;
    }

    let tours;
    if (featured === 'true') {
      tours = getFeaturedTours(cityId);
    } else {
      tours = getToursByCity(cityId, category as any);
    }

    const cityName = getCityName(cityId);

    res.json({
      city: cityName || cityId,
      count: tours?.length || 0,
      tours: tours || [],
    });
  }
);

/**
 * GET /api/tours/:cityId/search
 * Search tours by query
 * Query params:
 *   - q: search query (required)
 */
router.get(
  '/:cityId/search',
  (
    req: Request<{ cityId: string }, unknown, unknown, { q?: string }>,
    res: Response<SearchResponse | ErrorResponse>
  ) => {
    const { cityId } = req.params;
    const { q } = req.query;

    if (!cityExists(cityId)) {
      res.status(404).json({
        error: `City '${cityId}' not found`,
        code: 'CITY_NOT_FOUND',
      });
      return;
    }

    if (!q || q.trim().length === 0) {
      res.status(400).json({
        error: 'Search query is required',
        code: 'MISSING_QUERY',
      });
      return;
    }

    const tours = searchTours(cityId, q.trim());
    const cityName = getCityName(cityId);

    res.json({
      city: cityName || cityId,
      query: q.trim(),
      count: tours?.length || 0,
      tours: tours || [],
    });
  }
);

/**
 * GET /api/tours/:cityId/:tourId
 * Get a specific tour by ID
 */
router.get(
  '/:cityId/:tourId',
  (
    req: Request<{ cityId: string; tourId: string }>,
    res: Response<TourDetailResponse | ErrorResponse>
  ) => {
    const { cityId, tourId } = req.params;

    if (!cityExists(cityId)) {
      res.status(404).json({
        error: `City '${cityId}' not found`,
        code: 'CITY_NOT_FOUND',
      });
      return;
    }

    const tour = getTourById(cityId, tourId);

    if (!tour) {
      res.status(404).json({
        error: `Tour '${tourId}' not found in ${cityId}`,
        code: 'TOUR_NOT_FOUND',
      });
      return;
    }

    res.json({ tour });
  }
);

export const toursRoutes = router;
```

---

## US 5.1.5: Nginx Configuration dla Tours API

**Jako** devops engineer  
**Chcę** skonfigurować Nginx do routingu Tours API z ochroną API key  
**Aby** zapewnić bezpieczeństwo i routing na produkcji

### Kryteria akceptacji

- [x] Nowa konfiguracja: `backend/nginx/tours-api.conf`
- [x] Routing: `/api/tours/*` → `localhost:3002`
- [x] Ochrona API key używając istniejącej mapy `/etc/nginx/api-keys.map`
- [x] Development mode: brak ochrony dla localhost
- [x] Production mode: wymagany header `X-API-Key`
- [x] CORS headers
- [x] Rate limiting (100 req/min per IP)

### Implementacja: `tours-api.conf`

```nginx
# Tours API Configuration
# Requires: /etc/nginx/api-keys.map (shared with OSRM and POI API)

# Tours API upstream
upstream tours_api {
    server 127.0.0.1:3002;
    keepalive 16;
}

# API key validation map (shared)
map $http_x_api_key $api_client_name {
    include /etc/nginx/api-keys.map;
}

# Rate limiting zone for tours API
limit_req_zone $binary_remote_addr zone=tours_api_limit:10m rate=100r/m;

server {
    listen 80;
    server_name tours.wtg.local;  # Development

    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'X-API-Key, Content-Type' always;

    # OPTIONS preflight
    if ($request_method = 'OPTIONS') {
        return 204;
    }

    # Tours API endpoints
    location /api/tours/ {
        # Rate limiting
        limit_req zone=tours_api_limit burst=20 nodelay;

        # API key validation (production only)
        # In development (localhost), skip validation
        set $require_auth 0;
        if ($server_addr != "127.0.0.1") {
            set $require_auth 1;
        }

        if ($require_auth = 1) {
            # Check if API key is valid
            if ($api_client_name = "") {
                return 401 '{"error":"Invalid or missing API key","code":"UNAUTHORIZED"}';
            }
        }

        # Proxy to Tours API
        proxy_pass http://tours_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Client-Name $api_client_name;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
    }

    # Health check (no auth required)
    location /api/tours/health {
        proxy_pass http://tours_api/health;
        access_log off;
    }
}
```

### Production Configuration

Na produkcji dodaj do głównego pliku `/etc/nginx/nginx.conf`:

```nginx
# Include tours API config
include /etc/nginx/sites-enabled/tours-api.conf;
```

API keys są **współdzielone** z OSRM i POI API z pliku `/etc/nginx/api-keys.map`:

```
"dev-test-key-12345" "development";
"61bb903f104f6e155de37fa44c9c4d32..." "wtg-web-app";
"a1b2c3d4e5f6789..." "wtg-mobile-app";
```

---

## US 5.1.6: Docker Configuration dla Tours Server

**Jako** devops engineer  
**Chcę** skonteneryzować Tours Server  
**Aby** zapewnić łatwy deployment i skalowanie

### Kryteria akceptacji

- [x] `Dockerfile` dla Tours Server
- [x] Multi-stage build (build + production)
- [x] Docker Compose integracja
- [x] Volume dla tours data (łatwe aktualizacje treści)
- [x] Health check w Docker

### Implementacja: `backend/tours-server/Dockerfile`

```dockerfile
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built files
COPY --from=builder /app/dist ./dist

# Copy tours data
COPY src/data ./dist/data

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "dist/index.js"]
```

### Docker Compose Extension

Dodaj do `backend/docker-compose.yml`:

```yaml
services:
  # ... existing services (OSRM, POI Server)

  tours-server:
    build:
      context: ./tours-server
      dockerfile: Dockerfile
    container_name: wtg-tours-server
    ports:
      - '3002:3002'
    volumes:
      # Mount tours data for easy updates without rebuild
      - ./tours-server/src/data:/app/dist/data:ro
    environment:
      - NODE_ENV=production
      - PORT=3002
    restart: unless-stopped
    healthcheck:
      test:
        [
          'CMD',
          'node',
          '-e',
          "require('http').get('http://localhost:3002/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})",
        ]
      interval: 30s
      timeout: 3s
      retries: 3
    networks:
      - wtg-network

networks:
  wtg-network:
    driver: bridge
```

### Uruchamianie

```bash
# Build i start
cd backend
docker-compose up -d tours-server

# Sprawdź logi
docker logs wtg-tours-server

# Health check
curl http://localhost:3002/health

# Test API
curl http://localhost:3002/api/tours/cities
```

---

## US 5.1.7: Migracja Danych z Mobile App

**Jako** deweloper  
**Chcę** przenieść dane wycieczek z `mobile/src/data/tours.ts` do Tours Server  
**Aby** dane były zarządzane centralnie na backendzie

### Kryteria akceptacji

- [x] Przekonwertować TypeScript tours data do JSON files
- [x] Zachować wszystkie pola i strukturę
- [x] Stworzyć 4 pliki JSON (krakow, warszawa, wroclaw, trojmiasto)
- [x] Dodać metadata (createdAt, updatedAt, featured)
- [x] Usunąć hardcoded data z mobile app
- [x] Zaktualizować `toursService` w mobile aby używał API

### Migration Script

```bash
#!/bin/bash
# scripts/migrate-tours-data.sh

echo "Migrating tours data from mobile app to tours-server..."

SOURCE_DIR="mobile/src/data"
TARGET_DIR="backend/tours-server/src/data/tours"

mkdir -p "$TARGET_DIR"

# Extract tours per city from tours.ts
# This would be a Node.js script that parses tours.ts and creates JSON files

node scripts/extract-tours-data.js

echo "Tours data migrated successfully!"
```

### Update Mobile App Service

```typescript
// mobile/src/services/tours.service.ts

import type { Tour, TourCategory, TourDifficulty } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_TOURS_API_URL || 'http://localhost:3002/api/tours';
const API_KEY = import.meta.env.VITE_API_KEY || 'dev-test-key-12345';

class ToursService {
  private async fetchWithAuth(url: string): Promise<Response> {
    return fetch(url, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    });
  }

  async getToursByCity(cityId: string): Promise<Tour[]> {
    const response = await this.fetchWithAuth(`${API_BASE_URL}/${cityId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch tours: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tours;
  }

  async getTourById(cityId: string, tourId: string): Promise<Tour | undefined> {
    const response = await this.fetchWithAuth(
      `${API_BASE_URL}/${cityId}/${tourId}`
    );

    if (!response.ok) {
      if (response.status === 404) return undefined;
      throw new Error(`Failed to fetch tour: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tour;
  }

  async searchTours(cityId: string, query: string): Promise<Tour[]> {
    const response = await this.fetchWithAuth(
      `${API_BASE_URL}/${cityId}/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to search tours: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tours;
  }
}

export const toursService = new ToursService();
```

---

## Testing

### Manual Testing

```bash
# Start Tours Server
cd backend/tours-server
npm run dev

# Test endpoints
curl http://localhost:3002/health
curl http://localhost:3002/api/tours/cities
curl http://localhost:3002/api/tours/krakow
curl http://localhost:3002/api/tours/krakow/krakow-landmarks
curl "http://localhost:3002/api/tours/krakow/search?q=wawel"

# Test with API key (production simulation)
curl -H "X-API-Key: dev-test-key-12345" \
  http://localhost:3002/api/tours/krakow
```

### Integration Testing

```bash
# Start all services
cd backend
docker-compose up -d

# Test through Nginx proxy
curl http://localhost/api/tours/cities

# Test API key validation
curl -H "X-API-Key: invalid-key" \
  http://localhost/api/tours/krakow
# Expected: 401 Unauthorized

curl -H "X-API-Key: dev-test-key-12345" \
  http://localhost/api/tours/krakow
# Expected: 200 OK with tours data
```

---

## Deployment

### Development

```bash
# Start tours server standalone
cd backend/tours-server
npm run dev

# Or with Docker Compose
cd backend
docker-compose up tours-server
```

### Production

```bash
# Build and deploy
cd backend/tours-server
npm run build
npm start

# With Docker
docker-compose -f docker-compose.prod.yml up -d tours-server

# Update Nginx config
sudo cp nginx/tours-api.conf /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/tours-api.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Documentation

### API Documentation

Create `backend/tours-server/API.md`:

````markdown
# Tours API Documentation

## Base URL

- Development: `http://localhost:3002/api/tours`
- Production: `https://api.wtg.com/api/tours`

## Authentication

Production requires `X-API-Key` header with valid API key.

## Endpoints

### GET /cities

List all cities with tour counts.

**Response:**

```json
{
  "cities": [
    { "id": "krakow", "name": "Kraków", "tourCount": 2 },
    { "id": "warszawa", "name": "Warszawa", "tourCount": 2 }
  ]
}
```
````

### GET /:cityId

Get tours for a city.

**Query params:**

- `category` (optional): Filter by category
- `featured=true` (optional): Get only featured tours

**Response:**

```json
{
  "city": "Kraków",
  "count": 2,
  "tours": [...]
}
```

### GET /:cityId/:tourId

Get a specific tour.

**Response:**

```json
{
  "tour": {
    "id": "krakow-landmarks",
    "name": "Najważniejsze zabytki Krakowa",
    ...
  }
}
```

### GET /:cityId/search

Search tours.

**Query params:**

- `q` (required): Search query

**Response:**

```json
{
  "city": "Kraków",
  "query": "wawel",
  "count": 1,
  "tours": [...]
}
```

```

---

## Definition of Done

- [ ] Tours Server zaimplementowany zgodnie z architekturą POI Server
- [ ] Dane wycieczek w JSON files (nie w kodzie aplikacji)
- [ ] Wszystkie endpointy API działają poprawnie
- [ ] Nginx konfiguracja z API key protection
- [ ] Docker Compose integracja
- [ ] Mobile app używa Tours API zamiast lokalnych danych
- [ ] Testy manualne przeszły pomyślnie
- [ ] Dokumentacja API stworzona
- [ ] Deployment guide zaktualizowany
- [ ] Code review completed
- [ ] Merged to main branch

---

## Metrics

### Performance Targets
- Response time: < 100ms dla listy wycieczek
- Response time: < 50ms dla pojedynczej wycieczki
- Memory usage: < 100MB
- Startup time: < 5 sekund

### API Usage (Production)
- Rate limit: 100 requests/minute per IP
- Max payload size: 1MB
- CORS: Enabled dla dozwolonych origin

---

## Future Enhancements (Post-MVP)

- [ ] Admin panel do zarządzania wycieczkami
- [ ] Wersjonowanie wycieczek (A/B testing)
- [ ] Analytics (najpopularniejsze wycieczki)
- [ ] User ratings i reviews
- [ ] Dynamic image optimization
- [ ] Multi-language support dla treści
- [ ] Tours recommendations based on user preferences
- [ ] Integration z systemem rezerwacji
```
