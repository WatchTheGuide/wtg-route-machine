# WTG API Server

Unified backend API server for WTG Route Machine combining POI, Tours, and Admin functionality.

## Features

- **POI API** - Points of Interest data for cities
- **Tours API** - Curated walking tours (public endpoints)
- **Admin API** - Authentication and tour management (protected)

## Tech Stack

- **Runtime:** Node.js 20+
- **Framework:** Express 4.18
- **Language:** TypeScript 5.3
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **Validation:** Zod
- **Rate Limiting:** express-rate-limit

## API Endpoints

### Public Endpoints

#### Health Check

```
GET /health
```

#### POI Endpoints (`/api/poi`)

```
GET /api/poi/cities          # List available cities
GET /api/poi/categories      # List POI categories
GET /api/poi/:cityId         # Get all POIs for a city
GET /api/poi/:cityId/search  # Search POIs (query: q, category, limit)
GET /api/poi/:cityId/near    # Get nearby POIs (query: lat, lon, radius)
GET /api/poi/:cityId/:poiId  # Get single POI details
```

#### Tours Endpoints (`/api/tours`)

```
GET /api/tours/cities           # List available cities with tour counts
GET /api/tours/:cityId          # Get all tours for a city
GET /api/tours/:cityId/search   # Search tours (query: q, category, featured)
GET /api/tours/:cityId/:tourId  # Get single tour details
```

### Admin Endpoints (Protected)

#### Auth (`/api/admin/auth`)

```
POST /api/admin/auth/login     # Login (email, password)
POST /api/admin/auth/logout    # Logout
POST /api/admin/auth/refresh   # Refresh access token
GET  /api/admin/auth/me        # Get current user profile
```

#### Tour Management (`/api/admin/tours`)

```
GET    /api/admin/tours              # List tours (with filters, pagination)
GET    /api/admin/tours/stats        # Tour statistics
GET    /api/admin/tours/cities       # Available cities for tour creation
GET    /api/admin/tours/:tourId      # Get tour details
POST   /api/admin/tours              # Create new tour
PUT    /api/admin/tours/:tourId      # Update tour
DELETE /api/admin/tours/:tourId      # Delete tour
DELETE /api/admin/tours/bulk-delete  # Delete multiple tours
POST   /api/admin/tours/:tourId/duplicate  # Duplicate a tour
POST   /api/admin/tours/:tourId/publish    # Publish tour
POST   /api/admin/tours/:tourId/archive    # Archive tour
```

## Development

### Installation

```bash
cd backend/api-server
npm install
```

### Run Development Server

```bash
npm run dev
```

Server starts on http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

### Type Checking

```bash
npm run typecheck
```

## Environment Variables

| Variable         | Default                | Description                          |
| ---------------- | ---------------------- | ------------------------------------ |
| `PORT`           | 3000                   | Server port                          |
| `NODE_ENV`       | development            | Environment (development/production) |
| `JWT_SECRET`     | development-secret-key | JWT signing secret                   |
| `JWT_EXPIRES_IN` | 1h                     | Access token expiration              |
| `CORS_ORIGIN`    | \*                     | CORS allowed origins                 |

## Default Admin User

For development, a default admin user is created:

- **Email:** admin@wtg.pl
- **Password:** admin123

⚠️ **Important:** Change these credentials in production!

## Rate Limiting

- **General:** 100 requests per 15 minutes
- **Auth endpoints:** 5 requests per 15 minutes

## Data Storage

Currently uses in-memory storage with JSON file initialization:

- POI data: `src/data/poi/*.json`
- Tours data: `src/data/tours/*.json`

For production, implement a database backend (PostgreSQL recommended).

## Project Structure

```
api-server/
├── src/
│   ├── config.ts           # Environment configuration
│   ├── app.ts              # Express app setup
│   ├── index.ts            # Entry point
│   ├── types/              # TypeScript type definitions
│   │   ├── poi.types.ts
│   │   ├── tours.types.ts
│   │   ├── auth.types.ts
│   │   └── common.types.ts
│   ├── services/           # Business logic
│   │   ├── poi.service.ts
│   │   ├── tours.service.ts
│   │   ├── auth.service.ts
│   │   └── admin.tours.service.ts
│   ├── routes/             # Express routes
│   │   ├── poi.routes.ts
│   │   ├── tours.routes.ts
│   │   ├── admin.auth.routes.ts
│   │   └── admin.tours.routes.ts
│   ├── middleware/         # Express middleware
│   │   └── auth.middleware.ts
│   └── data/               # JSON data files
│       ├── poi/
│       └── tours/
├── package.json
├── tsconfig.json
└── README.md
```

## Migration Notes

This server consolidates the previously separate servers:

- `poi-server` (port 4000) → now `/api/poi/*`
- `tours-server` (port 3002) → now `/api/tours/*`

Both old servers have been removed as of December 2024.
