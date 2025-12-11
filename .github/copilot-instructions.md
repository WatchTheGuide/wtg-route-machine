# GitHub Copilot Instructions for WTG Route Machine

You are working on **WTG Route Machine** - a lightweight OSRM (Open Source Routing Machine) instance optimized for city-based pedestrian routing, designed for AWS deployment.

## ⚠️ ZASADA DOMYŚLNA: SWARM MODE (Rój Agentów)

> **Każde zadanie implementacyjne MUSI być realizowane w trybie Swarm Mode** - z wykorzystaniem odpowiednich specjalistów jako subagentów (`runSubagent`).

**Wirtualny zespół specjalistów (subagenci):**

- 🔧 **Backend Developer** - Node.js, Express, TypeScript, Docker, OSRM, PostgreSQL
- 📱 **Mobile Developer** - Ionic React 8, Capacitor 6, Zustand, OpenLayers
- 🌐 **Web Application Specialist** - React, Vite, Tailwind, shadcn/ui, i18n
- 🧪 **QA Engineer** - Vitest, Cypress, TDD, testing
- 📚 **Documentation Specialist** - Epic updates, changelogs, API docs
- 🏗️ **Software Architect** - Code review, design patterns, security, performance

**Typowy podział pracy dla User Story:**

```
1. runSubagent("Architect: Design review", "Jako Software Architect...")
2. runSubagent("Backend Dev: API implementation", "Jako Backend Developer...")
3. runSubagent("Web Specialist: UI components", "Jako Web Specialist...")
4. runSubagent("QA Engineer: Unit tests", "Jako QA Engineer...")
5. runSubagent("Architect: Code review", "Jako Software Architect, przeprowadź code review...")
6. runSubagent("Doc Specialist: Update Epic", "Jako Documentation Specialist...")
```

**Dokumentacja zespołu:** [project_documentation/VIRTUAL_TEAM.md](../project_documentation/VIRTUAL_TEAM.md)

## Project Overview

- **Purpose**: City walking tour routing service
- **Tech Stack**:
  - **Backend**: OSRM Backend (C++/Docker), Bash scripts, osmium-tool
  - **Frontend**: Ionic React 8 + TypeScript + Capacitor 6 (mobile apps)
- **Profiles**: Pedestrian (`foot`), Bicycle (`bicycle`), Car (`car`)
- **Deployment**: AWS (EC2/ECS) with minimal resource footprint (2GB RAM target)

## Project Structure

```
wtg-route-machine/
├── backend/                    # OSRM routing backend
│   ├── docker/                 # Docker configurations
│   ├── nginx/                  # Nginx proxy config
│   ├── osrm-data/             # Processed OSRM data
│   ├── osrm-profiles/         # Routing profiles (foot, bicycle, car)
│   └── scripts/               # Backend management scripts
├── frontend/                   # Legacy frontend (Vanilla JS + Tailwind)
├── mobile/                     # Ionic React 8 + Capacitor 6 mobile app
│   ├── src/
│   │   ├── components/        # UI components (Ionic)
│   │   ├── hooks/             # React hooks (useTheme, useRouting, etc.)
│   │   ├── services/          # API services (osrmService, exportService)
│   │   ├── stores/            # Zustand stores (cityStore, settingsStore)
│   │   ├── types/             # TypeScript types
│   │   ├── pages/             # Page components (Explore, Routes, Tours, Settings)
│   │   └── theme/             # CSS variables, theme configuration
│   ├── ios/                   # iOS native project (Capacitor)
│   └── android/               # Android native project (Capacitor)
├── project_documentation/     # Architecture docs
└── user_stories/              # Epic & User Story definitions
```

## Development Workflow

### Branch Strategy

1. **Main Branch Protection**

   - Never commit directly to `main`
   - All changes must go through feature branches
   - Branch naming convention: `feature/description`, `fix/issue-name`, `refactor/component`

2. **Feature Branch Workflow**

   ```bash
   # Create feature branch
   git checkout -b feature/new-city-support

   # Work on changes
   # ... make changes ...

   # Before committing: test, lint, validate
   # Commit and push
   git add -A
   git commit -m "descriptive message"
   git push origin feature/new-city-support
   ```

3. **Branch Naming Examples**
   - `feature/add-poznan-city` - adding new city support
   - `feature/api-wrapper` - new API wrapper implementation
   - `fix/bbox-coordinates` - fixing bbox issues
   - `refactor/extract-script` - refactoring extraction logic
   - `docs/update-readme` - documentation updates

### Pre-Commit Checklist

Before committing ANY changes, ensure:

#### 1. Code Testing

```bash
# Test shell scripts syntax
bash -n scripts/*.sh

# Test Docker containers build/run
docker-compose config  # validate docker-compose.yml

# Test city extraction (if modified extract-city.sh)
./scripts/extract-city.sh malopolskie krakow

# Test OSRM processing (if modified prepare-city-osrm.sh)
./scripts/prepare-city-osrm.sh krakow foot

# Test server startup (if modified run-city-server.sh)
./scripts/run-city-server.sh krakow 5001
docker logs osrm-krakow
```

#### 2. Linting & Style

```bash
# Shell script linting (if shellcheck is available)
shellcheck scripts/*.sh

# Check for common issues:
# - Proper shebang (#!/usr/bin/env bash)
# - Proper error handling (set -e)
# - Quoted variables ("$VAR")
# - Exit codes validation
```

#### 3. Build Validation

```bash
# Ensure Docker images build successfully
docker pull ghcr.io/project-osrm/osrm-backend:latest

# Validate all scripts are executable
ls -la scripts/*.sh

# Check for broken symlinks or missing files
find . -type l -! -exec test -e {} \; -print
```

#### 4. Documentation

- Update README.md if adding new features
- Update REQUIREMENTS.md if changing architecture
- Add inline comments for complex logic
- Document new city bbox coordinates

#### 5. Frontend Testing (Ionic React)

```bash
cd mobile

# Run linting
npm run lint

# Run unit tests
npm run test.unit -- --run

# Build for production
npm run build

# Sync with native platforms
npx cap sync

# Run on iOS simulator
npx cap run ios

# Run on Android emulator
npx cap run android
```

### Commit Message Format

Use descriptive commit messages following this pattern:

```
<type>: <short summary>

<detailed description>

<impact/breaking changes if any>
```

**Types:**

- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `docs:` - Documentation changes
- `test:` - Test additions/changes
- `chore:` - Maintenance tasks

**Examples:**

```
feat: Add Poznań city support with bbox extraction

- Add Poznań to extract-city.sh case statement
- Define bbox coordinates: 16.8,52.3,17.0,52.5
- Update README with Poznań examples

fix: Correct Wrocław bbox coordinates

The previous coordinates were too narrow and excluded suburbs.
Expanded bbox from 16.8,51.0,17.2,51.25 to 16.7,50.95,17.3,51.3

refactor: Simplify extract-city.sh bbox definition

Replace associative arrays with case statement for better
shell compatibility (zsh/bash differences)
```

## Code Guidelines

### Shell Scripts

1. **Always use proper shebang**

   ```bash
   #!/usr/bin/env bash
   ```

2. **Enable strict mode**

   ```bash
   set -e  # Exit on error
   set -u  # Exit on undefined variable (when appropriate)
   ```

3. **Quote variables**

   ```bash
   # Good
   echo "Processing: $CITY"
   docker run -v "$(pwd)/osrm-data:/data" ...

   # Bad
   echo "Processing: $CITY"
   docker run -v $(pwd)/osrm-data:/data ...
   ```

4. **Validate inputs**

   ```bash
   if [ -z "$CITY" ]; then
       echo "Error: City parameter required"
       exit 1
   fi
   ```

5. **Provide helpful error messages**
   ```bash
   if [ ! -f "$MAP_FILE" ]; then
       echo "Error: Map file not found: $MAP_FILE"
       echo "Run: ./scripts/download-map.sh $REGION"
       exit 1
   fi
   ```

### Adding New Cities

When adding support for a new city:

1. **Find bounding box coordinates** at https://boundingbox.klokantech.com/
2. **Add to `extract-city.sh`** in the case statement
3. **Test extraction** with a small region first
4. **Verify bbox coverage** - ensure city center + suburbs included
5. **Update documentation** - add city to README.md

### Ionic React Mobile App Guidelines

The `mobile/` directory contains the mobile app built with Ionic React 8 + Capacitor 6.

#### Project Structure

```
mobile/src/
├── components/              # Reusable UI components
│   ├── map/
│   │   └── MapView.tsx     # OpenLayers map with waypoint markers
│   ├── poi/                # POI markers, cards (planned)
│   ├── route/
│   │   ├── WaypointList.tsx        # Reorderable waypoint list
│   │   ├── RouteInfo.tsx           # Route stats display
│   │   ├── ProfileSelector.tsx     # Foot/bicycle/car selector
│   │   ├── SaveRouteModal.tsx      # Save route dialog
│   │   ├── DraftRouteCard.tsx      # Unsaved route card
│   │   ├── SavedRouteCard.tsx      # Saved route card
│   │   └── RouteDetailsModal.tsx   # Route details view
│   └── common/             # Shared UI components
├── hooks/                   # Custom React hooks
│   ├── useTheme.ts         # Dark/light mode management ✅
│   ├── useRouting.ts       # Route calculation with OSRM ✅
│   ├── useWaypoints.ts     # Waypoint management ✅
│   ├── useGeolocation.ts   # User location tracking ✅
│   └── useMap.ts           # Map center/zoom control ✅
├── services/               # API services
│   ├── osrm.service.ts     # OSRM API communication ✅
│   └── export.service.ts   # GeoJSON/GPX export (partial)
├── stores/                 # Zustand stores (with Capacitor Preferences)
│   ├── cityStore.ts            # City selection, available cities ✅
│   ├── settingsStore.ts        # User preferences (theme, units, etc.) ✅
│   ├── routePlannerStore.ts    # Route planning state ✅
│   └── savedRoutesStore.ts     # Saved routes with persistence ✅
├── types/                  # TypeScript types
│   └── index.ts            # City, POI, Waypoint, Route, SavedRoute types
├── utils/                  # Utility functions
│   └── format.ts           # formatDistance, formatDuration, formatDate
├── pages/                  # Page components (tabs)
│   ├── ExplorePage.tsx         # Map with POI discovery
│   ├── RoutesPage.tsx          # Saved routes list ✅
│   ├── RoutePlannerPage.tsx    # Route planning modal ✅
│   ├── ToursPage.tsx           # Curated tours
│   └── SettingsPage.tsx        # User settings
└── theme/
    └── variables.css       # Brand colors, theme config
```

#### Key Patterns

1. **Coordinate Type**: Uses `[lon, lat]` tuple format for OSRM compatibility

   ```typescript
   type Coordinate = [number, number]; // [longitude, latitude]
   ```

2. **Hooks Pattern**: Business logic in custom hooks, components for UI only

   ```typescript
   // Waypoint management
   const { waypoints, addWaypoint, removeWaypoint, reorderWaypoints } =
     useWaypoints();

   // Route calculation
   const { route, calculateRoute, isCalculating, error } = useRouting();

   // User location
   const { position, getCurrentPosition, isLoading } = useGeolocation();

   // Map control
   const { center, zoom, flyTo } = useMap();
   ```

3. **Store Pattern**: Zustand stores with Capacitor Preferences persistence

   ```typescript
   // Route planner state (in-memory)
   const { waypoints, route, profile, addWaypoint, clearWaypoints } =
     useRoutePlannerStore();

   // Saved routes (persisted)
   const routes = useSavedRoutesStore(selectRoutes);
   const { saveRoute, toggleFavorite, deleteRoute } = useSavedRoutesStore();
   ```

4. **Service Pattern**: API calls in singleton services

   ```typescript
   import { osrmService } from '@/services/osrm.service';
   const route = await osrmService.calculateRoute(waypoints, 'foot');
   ```

5. **Testing**: Vitest + React Testing Library
   ```bash
   npm run test.unit -- --run           # Run all tests
   npm run test.unit -- --watch         # Watch mode
   npm run test.unit -- --coverage      # With coverage
   ```

#### Available Cities

```typescript
const CITIES = {
  krakow: { name: 'Kraków', center: [19.9449, 50.0647] },
  warszawa: { name: 'Warszawa', center: [21.0122, 52.2297] },
  wroclaw: { name: 'Wrocław', center: [17.0385, 51.1079] },
  trojmiasto: { name: 'Trójmiasto', center: [18.6466, 54.352] },
};
```

#### Implemented Features (US 7.6 Complete)

**Route Planning:**

- ✅ Interactive map with waypoint placement
- ✅ Reorderable waypoint list with drag & drop
- ✅ Profile selector (foot/bicycle/car)
- ✅ Real-time route calculation with OSRM
- ✅ Route info display (distance, duration)
- ✅ Numbered waypoint markers on map (green start, orange intermediate, red destination)

**Route Saving:**

- ✅ Save route with name and description
- ✅ Draft route card (unsaved routes)
- ✅ Saved routes list with filtering (all/favorites)
- ✅ Route details modal with map view
- ✅ Edit/delete/favorite actions
- ✅ Persistent storage with Capacitor Preferences

**UX Improvements:**

- ✅ Back button in planner (arrowBackOutline + text)
- ✅ Save button always visible (disabled when calculating)
- ✅ Toast notifications for all actions
- ✅ Dark mode support throughout
- ✅ Consistent ProfileSelector styling
- ✅ 5 language support (PL, EN, DE, FR, UK)

### Docker Best Practices

1. **Use specific image tags** when possible (not just `latest`)
2. **Volume mounts** should use absolute paths: `$(pwd)/osrm-data`
3. **Container naming** should be descriptive: `osrm-{city}`
4. **Port conflicts** - check before binding: `lsof -i :PORT`

### OSRM Profile Customization

If modifying Lua profiles (future):

1. **Test with small dataset** first
2. **Verify routing logic** with known routes
3. **Document profile changes** in comments
4. **Keep backup** of default profiles

## Testing Strategy

### Manual Testing Checklist

For each feature/fix, test:

1. **Happy Path**

   - Basic functionality works as expected
   - Script completes successfully

2. **Edge Cases**

   - Missing files/directories
   - Invalid parameters
   - Network failures (for downloads)

3. **Error Handling**
   - Proper error messages displayed
   - Script exits with non-zero code on failure
   - Resources cleaned up on error

### Integration Testing

For changes affecting multiple components:

```bash
# Full workflow test
./scripts/download-map.sh malopolskie
./scripts/extract-city.sh malopolskie krakow
./scripts/prepare-city-osrm.sh krakow foot
./scripts/run-city-server.sh krakow 5001

# API validation
curl "http://localhost:5001/nearest/v1/foot/19.9385,50.0647"

# Cleanup
docker stop osrm-krakow
docker rm osrm-krakow
```

## Common Pitfalls to Avoid

1. **Don't commit large data files**

   - `.osm.pbf` files should be in `.gitignore`
   - `.osrm.*` files should be in `.gitignore`

2. **Don't hardcode paths**

   - Use relative paths with `$(pwd)`
   - Make paths configurable via variables

3. **Don't assume shell type**

   - Test scripts in both bash and zsh
   - Avoid bash-specific features when possible

4. **Don't leave containers running**

   - Stop test containers after validation
   - Document cleanup steps

5. **Don't skip error handling**
   - Always check exit codes: `if [ $? -ne 0 ]; then`
   - Validate file existence before operations

## Backend API Server (Node.js/Express)

The `backend/api-server/` directory contains the REST API built with Node.js, Express, and TypeScript.

### Project Structure

```
backend/api-server/src/
├── middleware/              # Express middleware
│   ├── auth.middleware.ts           # JWT authentication
│   ├── rate-limit.middleware.ts     # Rate limiting (Epic 13)
│   └── index.ts                     # Barrel export
├── routes/                  # API route handlers
│   ├── admin.auth.routes.ts         # Auth endpoints
│   ├── admin.tours.routes.ts        # Tour CRUD
│   ├── poi.routes.ts                # POI endpoints
│   └── tours.routes.ts              # Public tour endpoints
├── services/                # Business logic
├── types/                   # TypeScript types
├── config.ts                # Environment configuration
└── app.ts                   # Express app setup
```

### Test-Driven Development (TDD) - DEFAULT APPROACH

**For all backend development, follow TDD methodology:**

1. **RED** - Write failing tests first

   ```bash
   # Create test file
   touch src/middleware/new-feature.middleware.test.ts

   # Write tests that define expected behavior
   # Run tests - they should FAIL
   npm test -- --run src/middleware/new-feature.middleware.test.ts
   ```

2. **GREEN** - Implement minimum code to pass tests

   ```bash
   # Create implementation
   touch src/middleware/new-feature.middleware.ts

   # Write code to make tests pass
   # Run tests - they should PASS
   npm test -- --run src/middleware/new-feature.middleware.test.ts
   ```

3. **REFACTOR** - Improve code quality
   ```bash
   # Refactor while keeping tests passing
   npm test -- --run src/middleware/new-feature.middleware.test.ts
   ```

### Testing Commands

```bash
cd backend/api-server

# Run all tests
npm test -- --run

# Run specific test file
npm test -- --run src/middleware/rate-limit.middleware.test.ts

# Run tests with coverage
npm test -- --run --coverage

# Run tests in watch mode (during development)
npm test -- --watch
```

### Test File Naming Convention

- Test files must be co-located with source files
- Naming pattern: `<name>.test.ts`
- Examples:
  - `src/middleware/auth.middleware.ts` → `src/middleware/auth.middleware.test.ts`
  - `src/services/tour.service.ts` → `src/services/tour.service.test.ts`

### Testing Guidelines

1. **Use isolated test apps** - Create fresh Express instances per test to avoid state leakage:

   ```typescript
   function createTestApp(config: TestConfig): Express {
     const app = express();
     // Configure app for specific test scenario
     return app;
   }
   ```

2. **Test structure** - Follow AAA pattern (Arrange, Act, Assert):

   ```typescript
   it('should return 429 when rate limit exceeded', async () => {
     // Arrange
     const testApp = createTestApp({ limit: 2 });

     // Act
     await request(testApp).get('/api/test');
     await request(testApp).get('/api/test');
     const response = await request(testApp).get('/api/test');

     // Assert
     expect(response.status).toBe(429);
   });
   ```

3. **Group tests by User Story** - Match Epic documentation:

   ```typescript
   describe('Rate Limiting Middleware (Epic 13)', () => {
     describe('US 13.1: General API Rate Limiter', () => {
       it('should allow requests within the limit', async () => {});
       it('should block requests exceeding limit with 429', async () => {});
     });
   });
   ```

4. **Mock external dependencies** - Use Vitest mocking:

   ```typescript
   vi.mock('../services/external.service.js', () => ({
     externalCall: vi.fn().mockResolvedValue({ data: 'mocked' }),
   }));
   ```

### API Development Workflow

1. **Document User Story** in `user_stories/` directory
2. **Write tests** that define acceptance criteria
3. **Run tests** - verify they fail (RED)
4. **Implement feature** with minimum code
5. **Run tests** - verify they pass (GREEN)
6. **Refactor** - improve code quality
7. **Update documentation** - mark User Story as complete
8. **Commit** with descriptive message

### Rate Limiting Configuration

Environment variables for rate limiting (Epic 13):

```env
# General API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000        # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100        # requests per window

# Auth Rate Limiting (stricter for login)
AUTH_RATE_LIMIT_WINDOW_MS=900000   # 15 minutes
AUTH_RATE_LIMIT_MAX_REQUESTS=5     # login attempts per window

# Admin CRUD Rate Limiting
ADMIN_CRUD_RATE_LIMIT_WINDOW_MS=60000  # 1 minute
ADMIN_CRUD_RATE_LIMIT_MAX_REQUESTS=30  # operations per window
```

## Resource Optimization

Keep in mind the AWS deployment target:

- **Target RAM**: 2GB (t3.small)
- **Data size**: Minimize city bbox to essential area
- **Processing time**: Keep under 5 minutes for city processing
- **Container startup**: Should be under 30 seconds

When making changes, consider impact on:

- Memory consumption
- Processing time
- Disk space usage
- API response times

## Getting Help

- **OSRM Documentation**: https://project-osrm.org/docs/
- **Osmium Tool**: https://osmcode.org/osmium-tool/
- **OpenStreetMap**: https://wiki.openstreetmap.org/
- **Geofabrik Downloads**: https://download.geofabrik.de/

## Summary

**Remember**: Quality > Speed

- Always test before committing
- Use feature branches
- Write descriptive commits
- Document your changes
- Think about resource constraints
