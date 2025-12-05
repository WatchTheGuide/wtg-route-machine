# Epic 4: Punkty Turystyczne (POI)

**Cel:** Dodać system punktów turystycznych z backendem API i integracją z frontendem.

**Priorytet:** 🟡 Średni

**Status:** 🟡 W trakcie (Część A - Backend ukończona)

---

## Część A: Backend POI ✅

### US 4.1: Serwer POI API (Express/TypeScript) ✅

**Jako** deweloper  
**Chcę** stworzyć serwer API dla punktów turystycznych  
**Aby** frontend mógł pobierać dane POI

#### Kryteria akceptacji:

- [x] Projekt Node.js/Express z TypeScript
- [x] Struktura: `backend/poi-server/`
- [x] Port: 4000
- [x] Dockerfile i integracja z Docker Compose
- [x] Health check endpoint: `GET /health`

#### Struktura projektu:

```
backend/poi-server/
├── package.json
├── tsconfig.json
├── Dockerfile
├── src/
│   ├── index.ts              # Entry point
│   ├── app.ts                # Express app
│   ├── routes/
│   │   ├── index.ts
│   │   └── poi.routes.ts
│   ├── services/
│   │   └── poi.service.ts
│   ├── types/
│   │   └── poi.types.ts
│   └── data/
│       ├── categories.json
│       ├── krakow.json
│       ├── warszawa.json
│       ├── wroclaw.json
│       └── trojmiasto.json
└── tests/
    └── poi.test.ts
```

---

### US 4.2: Endpointy API POI ✅

**Jako** deweloper  
**Chcę** zaimplementować endpointy REST API  
**Aby** frontend mógł pobierać i wyszukiwać POI

#### Kryteria akceptacji:

- [x] `GET /poi/cities` - lista miast z liczbą POI
- [x] `GET /poi/categories` - lista kategorii z ikonami
- [x] `GET /poi/:cityId` - lista POI dla miasta
- [x] `GET /poi/:cityId/:poiId` - szczegóły POI
- [x] `GET /poi/:cityId/search?q=` - wyszukiwanie POI
- [x] `GET /poi/:cityId/near?lon=&lat=&radius=` - pobliskie POI
- [x] Filtrowanie po kategorii: `?category=museum,landmark`

#### Przykłady odpowiedzi:

**GET /poi/cities**

```json
{
  "cities": [
    { "id": "krakow", "name": "Kraków", "poiCount": 20 },
    { "id": "warszawa", "name": "Warszawa", "poiCount": 20 }
  ]
}
```

**GET /poi/krakow**

```json
{
  "city": "krakow",
  "count": 20,
  "pois": [
    {
      "id": "krakow-wawel",
      "name": "Zamek Królewski na Wawelu",
      "description": "Historyczna rezydencja królów polskich...",
      "coordinates": [19.9354, 50.054],
      "category": "landmark",
      "imageUrl": "https://upload.wikimedia.org/...",
      "estimatedTime": 120
    }
  ]
}
```

**GET /poi/categories**

```json
{
  "categories": [
    {
      "id": "landmark",
      "name": "Zabytki",
      "icon": "business",
      "color": "#FF6600"
    },
    { "id": "museum", "name": "Muzea", "icon": "library", "color": "#8B4513" },
    { "id": "park", "name": "Parki", "icon": "leaf", "color": "#228B22" },
    {
      "id": "restaurant",
      "name": "Restauracje",
      "icon": "restaurant",
      "color": "#DC143C"
    },
    {
      "id": "viewpoint",
      "name": "Punkty widokowe",
      "icon": "eye",
      "color": "#4169E1"
    },
    { "id": "church", "name": "Kościoły", "icon": "home", "color": "#9932CC" }
  ]
}
```

---

### US 4.3: Dane POI dla 4 miast ✅

**Jako** deweloper  
**Chcę** przygotować dane POI dla wszystkich miast  
**Aby** użytkownicy mieli dostęp do atrakcji turystycznych

#### Kryteria akceptacji:

- [x] Minimum 20 POI dla Krakowa (20)
- [x] Minimum 20 POI dla Warszawy (19)
- [x] Minimum 20 POI dla Wrocławia (20)
- [x] Minimum 20 POI dla Trójmiasta (20)
- [x] Zdjęcia z Wikimedia Commons
- [x] Poprawne współrzędne (weryfikacja na mapie)

#### Struktura POI:

```typescript
interface POI {
  id: string; // "{city}-{slug}"
  name: string; // Nazwa po polsku
  description: string; // 2-3 zdania opisu
  coordinates: [number, number]; // [longitude, latitude]
  category: POICategory;
  imageUrl?: string; // Wikimedia Commons
  thumbnailUrl?: string; // Miniatura
  estimatedTime?: number; // Minuty na zwiedzanie
  openingHours?: string; // "9:00-17:00"
  closedDays?: string; // "poniedziałek"
  website?: string; // Oficjalna strona
  address?: string; // Adres
  ticketPrice?: string; // "od 25 zł"
  tags?: string[]; // Tagi do wyszukiwania
}

type POICategory =
  | 'landmark' // Zabytki
  | 'museum' // Muzea
  | 'park' // Parki
  | 'restaurant' // Restauracje
  | 'viewpoint' // Punkty widokowe
  | 'church'; // Kościoły
```

#### Lista POI - Kraków (przykład):

| #   | Nazwa                     | Kategoria | Czas    |
| --- | ------------------------- | --------- | ------- |
| 1   | Zamek Królewski na Wawelu | landmark  | 120 min |
| 2   | Rynek Główny              | landmark  | 30 min  |
| 3   | Sukiennice                | landmark  | 45 min  |
| 4   | Kościół Mariacki          | church    | 30 min  |
| 5   | Dzielnica Kazimierz       | landmark  | 90 min  |
| 6   | Muzeum Narodowe           | museum    | 120 min |
| 7   | Muzeum Czartoryskich      | museum    | 90 min  |
| 8   | MOCAK                     | museum    | 60 min  |
| 9   | Fabryka Schindlera        | museum    | 90 min  |
| 10  | Muzeum Podziemi Rynku     | museum    | 60 min  |
| 11  | Planty                    | park      | 45 min  |
| 12  | Park Jordana              | park      | 30 min  |
| 13  | Błonia                    | park      | 30 min  |
| 14  | Kopiec Kościuszki         | viewpoint | 45 min  |
| 15  | Kopiec Krakusa            | viewpoint | 30 min  |
| 16  | Wieża Ratuszowa           | viewpoint | 20 min  |
| 17  | Bazylika Mariacka         | church    | 30 min  |
| 18  | Kościół na Skałce         | church    | 30 min  |
| 19  | Barbakan                  | landmark  | 20 min  |
| 20  | Collegium Maius           | museum    | 45 min  |

---

### US 4.4: Integracja z Nginx (API Key) ✅

**Jako** deweloper  
**Chcę** zabezpieczyć API POI kluczem dostępowym  
**Aby** tylko autoryzowane aplikacje miały dostęp

#### Kryteria akceptacji:

- [x] Konfiguracja Nginx dla `/api/poi/`
- [x] Walidacja API key (ten sam co OSRM)
- [x] Proxy do serwera POI (port 4000)
- [x] Odpowiedź 401 dla brakującego klucza

#### Konfiguracja Nginx:

```nginx
# POI API upstream
upstream poi_server {
    server localhost:4000;
}

# POI API (zabezpieczone)
location /api/poi/ {
    if ($api_client_name = "") {
        return 401 '{"error": "API key required", "code": "UNAUTHORIZED"}';
    }

    rewrite ^/api/poi/(.*)$ /$1 break;
    proxy_pass http://poi_server;
    include snippets/osrm-proxy-common.conf;
}

# POI Health (publiczne)
location = /api/poi/health {
    proxy_pass http://poi_server/health;
    include snippets/osrm-proxy-common.conf;
}
```

---

### US 4.5: Docker i Deployment ✅

**Jako** deweloper  
**Chcę** skonteneryzować serwer POI  
**Aby** łatwo wdrożyć go na produkcję

#### Kryteria akceptacji:

- [x] Dockerfile dla poi-server
- [x] Integracja z `docker-compose.multi-city.yml`
- [x] Osobny `docker-compose.poi.yml` dla dev
- [x] Health check w Docker

#### Dockerfile:

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY src/data/ ./data/

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "dist/index.js"]
```

#### Docker Compose:

```yaml
services:
  poi-server:
    build: ./poi-server
    container_name: poi-server
    ports:
      - '4000:4000'
    volumes:
      - ./poi-server/src/data:/app/data:ro
    environment:
      - NODE_ENV=production
      - PORT=4000
    restart: unless-stopped
```

---

## Część B: Frontend POI (Epic 4B - osobny)

> **Uwaga:** Implementacja frontendu będzie realizowana po zakończeniu backendu.

### US 4.6: Wyświetlanie POI na mapie

- Markery POI z ikonami kategorii
- Clustering dla wielu POI
- Popup z podstawowymi informacjami

### US 4.7: Panel filtrowania POI

- Toggle dla każdej kategorii
- Wyszukiwarka tekstowa

### US 4.8: Modal szczegółów POI

- Zdjęcie, opis, informacje praktyczne
- Przycisk "Dodaj do trasy"

### US 4.9: Dodawanie POI do trasy

- Integracja z useWaypoints
- Opcje: start / cel / punkt pośredni

---

## Estymacja (Backend)

| User Story        | Opis                         | Dni       |
| ----------------- | ---------------------------- | --------- |
| US 4.1            | Serwer POI (Express/TS)      | 0.5       |
| US 4.2            | Endpointy API                | 0.5       |
| US 4.3            | Dane POI (4 miasta × 20 POI) | 2         |
| US 4.4            | Integracja Nginx             | 0.5       |
| US 4.5            | Docker i deployment          | 0.5       |
| **Razem Backend** |                              | **4 dni** |

---

## Wymagania techniczne

### Technologie:

| Komponent | Technologia     |
| --------- | --------------- |
| Runtime   | Node.js 20 LTS  |
| Framework | Express 4.x     |
| Język     | TypeScript 5.x  |
| Walidacja | Zod             |
| Testy     | Vitest          |
| Container | Docker (Alpine) |

### Porty:

| Serwis        | Port |
| ------------- | ---- |
| POI Server    | 4000 |
| Nginx (proxy) | 443  |

---

## Definicja ukończenia (DoD) - Backend

- [ ] Serwer POI uruchomiony i zdrowy
- [ ] Wszystkie endpointy działają
- [ ] 80 POI (4 miasta × 20)
- [ ] API zabezpieczone kluczem
- [ ] Integracja z Nginx
- [ ] Docker Compose zaktualizowany
- [ ] Testy API przechodzą
- [ ] Dokumentacja API

---

## Źródła danych POI

1. **Wikipedia** - opisy i informacje
2. **Wikimedia Commons** - zdjęcia (CC license)
3. **OpenStreetMap** - współrzędne
4. **Oficjalne strony** - godziny, ceny

---

## Przykładowe zapytania API

```bash
# Lista miast
curl -H "X-API-Key: dev-key-123" \
  "https://api.example.com/api/poi/cities"

# POI dla Krakowa
curl -H "X-API-Key: dev-key-123" \
  "https://api.example.com/api/poi/krakow"

# POI filtrowane po kategorii
curl -H "X-API-Key: dev-key-123" \
  "https://api.example.com/api/poi/krakow?category=museum,landmark"

# Wyszukiwanie
curl -H "X-API-Key: dev-key-123" \
  "https://api.example.com/api/poi/krakow/search?q=wawel"

# Szczegóły POI
curl -H "X-API-Key: dev-key-123" \
  "https://api.example.com/api/poi/krakow/krakow-wawel"

# Kategorie
curl -H "X-API-Key: dev-key-123" \
  "https://api.example.com/api/poi/categories"
```
