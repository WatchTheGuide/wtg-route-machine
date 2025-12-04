# GuideTrackee Routes - Ionic React Frontend

Mobile application for creating walking, cycling, and driving routes using OSRM routing engine.

## Tech Stack

- **Framework**: Ionic React 8
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite
- **Mobile**: Capacitor 7.4.4
- **Maps**: OpenLayers
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test.unit -- --run

# Build for production
npm run build

# Run on iOS
npx cap run ios

# Run on Android
npx cap run android
```

## Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── AppHeader/          # Header with logo and theme toggle
│   ├── MapView/            # OpenLayers map wrapper
│   ├── WaypointList/       # Waypoint list with drag & drop
│   ├── WaypointItem/       # Single waypoint display
│   ├── ActionButtons/      # FAB action buttons
│   ├── RouteInfo/          # Route distance/duration info
│   └── ProfileSelector/    # foot/bicycle/car selector
├── hooks/                   # Custom React hooks
│   ├── useRouting.ts       # Route calculation logic
│   ├── useWaypoints.ts     # Waypoint state management
│   ├── useExport.ts        # Export (GeoJSON, PDF, Share)
│   └── useHistory.ts       # Route history (localStorage)
├── services/               # API services
│   ├── osrm.service.ts     # OSRM API communication
│   └── export.service.ts   # Export functionality
├── types/                  # TypeScript types
│   └── route.types.ts      # Core type definitions
├── config/                 # Configuration
│   └── api.config.ts       # API endpoints
└── pages/                  # Page components
    └── Home.tsx            # Main page
```

## Core Types

```typescript
// Coordinate as [longitude, latitude] tuple
type Coordinate = [number, number];

// Waypoint with optional address
interface Waypoint {
  id: string;
  coordinate: Coordinate;
  address?: string;
}

// Calculated route
interface Route {
  coordinates: Coordinate[];
  distance: number; // meters
  duration: number; // seconds
  instructions?: NavigationInstruction[];
}

// Routing profiles
type RoutingProfile = 'foot' | 'bicycle' | 'car';
```

## Hooks Usage

### useWaypoints

```typescript
const {
  waypoints, // Current waypoints
  addWaypoint, // Add new waypoint (auto-geocodes)
  removeWaypoint, // Remove by ID
  reorderWaypoints, // Drag & drop reorder
  clearWaypoints, // Clear all
} = useWaypoints();

// Add waypoint with geocoding
await addWaypoint([19.9449, 50.0647]);
```

### useRouting

```typescript
const {
  route, // Current route
  isLoading, // Loading state
  error, // Error message
  profile, // Current profile
  city, // Current city
  calculateRoute, // Calculate route for waypoints
  clearRoute, // Clear route
  setProfile, // Change profile
  setCity, // Change city
} = useRouting();

// Calculate route
await calculateRoute(waypoints);
```

### useExport

```typescript
const {
  isExporting, // Export in progress
  error, // Export error
  exportGeoJSON, // Export as GeoJSON file
  exportPDF, // Export as PDF file
  shareRoute, // Share via Web Share API
} = useExport(route, waypoints, profile, city);

// Export to GeoJSON
await exportGeoJSON();
```

### useHistory

```typescript
const {
  routes, // Saved routes
  saveRoute, // Save current route
  loadRoute, // Load saved route
  deleteRoute, // Delete saved route
  clearHistory, // Clear all history
} = useHistory();

// Save route
saveRoute(route, waypoints, 'My Walking Tour');
```

## Available Cities

| City       | Center Coordinates |
| ---------- | ------------------ |
| Kraków     | [19.9449, 50.0647] |
| Warszawa   | [21.0122, 52.2297] |
| Wrocław    | [17.0385, 51.1079] |
| Trójmiasto | [18.6466, 54.3520] |

## API Configuration

OSRM API endpoint: `https://osrm.watchtheguide.com`

```typescript
// API URL pattern
const apiUrl = `${baseUrl}/route/v1/${profile}/${coordinates}`;
```

## Testing

```bash
# Run all tests
npm run test.unit -- --run

# Watch mode
npm run test.unit

# Coverage report
npm run test.unit -- --coverage

# Run specific test file
npm run test.unit -- --run src/hooks/useRouting.test.ts
```

### Test Coverage

| Category   | Tests   |
| ---------- | ------- |
| Components | 32      |
| Hooks      | 52      |
| Services   | 31      |
| **Total**  | **115** |

## Scripts

| Script              | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run build`     | Build for production     |
| `npm run preview`   | Preview production build |
| `npm run lint`      | Run ESLint               |
| `npm run test.unit` | Run unit tests           |
| `npm run test.e2e`  | Run E2E tests (Cypress)  |

## Capacitor Configuration

```typescript
// capacitor.config.ts
{
  appId: 'com.guidetrackee.routemachine',
  appName: 'GuideTrackee Routes',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
}
```

## Development Notes

1. **Coordinate Format**: Always use `[longitude, latitude]` order for OSRM compatibility
2. **Components**: Each component has its own folder with `.tsx`, `.css`, and `.test.tsx` files
3. **Hooks**: Business logic in hooks, components only for presentation
4. **Services**: Singleton pattern for API services
5. **Types**: All types in `src/types/` directory

## Migration Status (Epic 1)

- ✅ US 1.1 - Ionic React project initialization
- ✅ US 1.2 - UI components migration (7 components)
- ✅ US 1.3 - Routing logic migration (hooks & services)
- ✅ US 1.4 - Export & history functions

## License

MIT
