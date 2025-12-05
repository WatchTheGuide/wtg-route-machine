# WTG POI Server

Points of Interest (POI) REST API server for the WTG Route Machine project.

## Overview

Express.js + TypeScript server providing curated POI data for Polish cities:

- **Kraków** - 20 POI
- **Warszawa** - 20 POI
- **Wrocław** - 20 POI
- **Trójmiasto** (Gdańsk, Sopot, Gdynia) - 20 POI

## Categories

| Category   | Icon | Color   |
| ---------- | ---- | ------- |
| landmark   | 🏛️   | #3B82F6 |
| museum     | 🏛️   | #8B5CF6 |
| park       | 🌳   | #22C55E |
| restaurant | 🍽️   | #EF4444 |
| viewpoint  | 👁️   | #F59E0B |
| church     | ⛪   | #6366F1 |

## API Endpoints

All endpoints require `X-API-Key` header when accessed through Nginx.

### Categories

```
GET /categories
```

### Cities

```
GET /cities
```

### City POI

```
GET /:cityId
```

Returns all POI for a city.

**Query parameters:**

- `category` - Filter by category (e.g., `?category=museum`)

### Single POI

```
GET /:cityId/:poiId
```

### Search

```
GET /:cityId/search?q=<query>
```

### Nearby POI

```
GET /:cityId/near?lon=<longitude>&lat=<latitude>&radius=<meters>
```

**Parameters:**

- `lon` - Longitude (required)
- `lat` - Latitude (required)
- `radius` - Search radius in meters (optional, default: 1000)

## Development

### Prerequisites

- Node.js 20 LTS
- npm

### Setup

```bash
cd backend/poi-server
npm install
```

### Run Development Server

```bash
npm run dev
```

Server starts at `http://localhost:4000`

### Build

```bash
npm run build
```

### Run Production

```bash
npm start
```

### Run Tests

```bash
npm test
```

## Docker

### Build Image

```bash
docker build -t wtg-poi-server .
```

### Run Container

```bash
docker run -d -p 4000:4000 --name wtg-poi-server wtg-poi-server
```

### Using Docker Compose

```bash
# Standalone
docker-compose up -d

# With OSRM (from backend directory)
docker-compose -f docker-compose.multi-city.yml up -d
```

## Integration with Nginx

POI server is accessible through Nginx at:

```
https://osrm.watchtheguide.com/api/poi/
```

Example requests:

```bash
# Get categories
curl -H "X-API-Key: YOUR_KEY" https://osrm.watchtheguide.com/api/poi/categories

# Get Kraków POI
curl -H "X-API-Key: YOUR_KEY" https://osrm.watchtheguide.com/api/poi/krakow

# Search for "Wawel"
curl -H "X-API-Key: YOUR_KEY" "https://osrm.watchtheguide.com/api/poi/krakow/search?q=wawel"

# Find POI near Rynek
curl -H "X-API-Key: YOUR_KEY" "https://osrm.watchtheguide.com/api/poi/krakow/near?lon=19.9373&lat=50.0619&radius=500"
```

## Health Check

```bash
curl http://localhost:4000/health
```

Response:

```json
{
  "status": "ok",
  "service": "poi-server",
  "version": "1.0.0"
}
```

## Project Structure

```
poi-server/
├── src/
│   ├── data/           # JSON POI data
│   │   ├── categories.json
│   │   ├── krakow.json
│   │   ├── warszawa.json
│   │   ├── wroclaw.json
│   │   └── trojmiasto.json
│   ├── routes/         # Express route handlers
│   ├── services/       # Business logic
│   ├── types/          # TypeScript interfaces
│   ├── app.ts          # Express configuration
│   └── index.ts        # Entry point
├── Dockerfile
├── docker-compose.yml
├── package.json
└── tsconfig.json
```

## Memory Usage

- Container limit: 128 MB
- Typical usage: ~50-70 MB

## License

MIT
