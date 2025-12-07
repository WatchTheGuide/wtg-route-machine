# Tours Server

Backend API for curated walking tours in Polish cities.

## Features

- RESTful API for tours data
- Multi-language support (PL, EN, DE, FR, UK)
- City-based tours organization
- Search functionality
- CORS enabled
- API key authentication (production)

## Endpoints

- `GET /api/tours/cities` - List cities with tour counts
- `GET /api/tours/:cityId` - Get all tours for a city
- `GET /api/tours/:cityId/:tourId` - Get tour details
- `GET /api/tours/:cityId/search?q=query` - Search tours

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm start

# Run tests
npm test
```

## Port

Development: `http://localhost:3002`

## Authentication

- **Development**: No API key required
- **Production**: X-API-Key header required

## Data Structure

Tours data is stored in JSON files per city:

- `src/data/tours/krakow.json`
- `src/data/tours/warszawa.json`
- `src/data/tours/wroclaw.json`
- `src/data/tours/trojmiasto.json`
