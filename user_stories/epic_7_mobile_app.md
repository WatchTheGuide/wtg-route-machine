# Epic 7: Aplikacja Mobilna WTG Route Machine

## Opis

Stworzenie hybrydowej aplikacji mobilnej Ionic + Capacitor dla iOS, Android i Web, umożliwiającej planowanie tras pieszych, odkrywanie punktów POI oraz nawigację turn-by-turn po miastach Polski.

## Technologie

- **Framework**: Ionic 8 + React 18
- **Native**: Capacitor 6
- **Język**: TypeScript
- **UI**: Ionic Components (iOS/Material Design)
- **Mapy**: OpenLayers 10.x
- **Routing**: React Router 6
- **Stan**: Zustand + TanStack Query
- **Storage**: Capacitor Preferences

## Kolory marki

- **Primary**: #ff6600 (pomarańczowy)
- **Secondary**: #454545 (ciemny szary)

---

## User Story 7.1: Podstawowa struktura aplikacji ✅

### Opis

Jako programista chcę skonfigurować podstawową strukturę aplikacji Ionic/Capacitor, aby mieć solidny fundament do dalszego rozwoju.

### Kryteria akceptacji

- [x] Ionic 8 + React 18 + TypeScript
- [x] Capacitor 6 skonfigurowany dla iOS i Android
- [x] Theme z kolorami marki (#ff6600, #454545)
- [x] Nawigacja tab-based (4 zakładki)
- [x] Struktura katalogów (components, hooks, services, stores, types)
- [x] Działa na iOS, Android i Web
- [x] Przełączanie motywu ciemnego/jasnego
- [x] Safe area poprawnie obsługiwane na iOS i Android

### Zakładki

1. **Odkrywaj** (Explore) - mapa z POI
2. **Trasy** (Routes) - zapisane trasy
3. **Wycieczki** (Tours) - kuratorowane wycieczki
4. **Ustawienia** (Settings) - preferencje użytkownika

### Zaimplementowane

- **Stores**: `cityStore.ts`, `settingsStore.ts` (Zustand + persist)
- **Types**: `City`, `POI`, `Waypoint`, `Route`, `RoutingProfile`
- **Hooks**: `useTheme.ts` (motyw ciemny/jasny)
- **Pages**: `ExplorePage`, `RoutesPage`, `ToursPage`, `SettingsPage`
- **Testy**: 42 testy jednostkowe (Vitest)
- **Native**: StatusBar plugin dla iOS/Android

### Struktura katalogów

```
mobile/
├── src/
│   ├── pages/              # Strony aplikacji
│   │   ├── ExplorePage.tsx
│   │   ├── RoutesPage.tsx
│   │   ├── ToursPage.tsx
│   │   └── SettingsPage.tsx
│   ├── components/         # Reusable components
│   │   ├── map/
│   │   ├── poi/
│   │   ├── route/
│   │   └── common/
│   ├── hooks/              # Custom hooks
│   ├── services/           # API services
│   ├── stores/             # Zustand stores
│   ├── types/              # TypeScript types
│   └── theme/              # CSS variables, theme
├── ios/                    # iOS native project
├── android/                # Android native project
└── capacitor.config.ts
```

---

## User Story 7.2: Komponent mapy OpenLayers

### Opis

Jako użytkownik chcę widzieć interaktywną mapę OpenLayers, aby móc przeglądać miasto i punkty POI.

### Kryteria akceptacji

- [ ] Mapa OpenLayers wyśrodkowana na wybranym mieście (domyślnie Kraków)
- [ ] Obsługa gestów (zoom, pan) na touch i desktop
- [ ] Markery dla punktów POI
- [ ] Wyświetlanie trasy jako LineString
- [ ] Lokalizacja użytkownika (blue dot)
- [ ] Działa na iOS, Android i Web

### Warstwy mapy

1. **Base**: OpenStreetMap tiles
2. **POI**: Vector layer z markerami
3. **Route**: Vector layer z trasą
4. **User**: Pozycja użytkownika

### Zadania

- [ ] Komponent MapView z OpenLayers
- [ ] Hook useMap do zarządzania mapą
- [ ] Hook useGeolocation (Capacitor Geolocation)
- [ ] POI markers layer
- [ ] Route line layer
- [ ] Obsługa kliknięć na mapę i markery

---

## User Story 7.3: Wybór miasta

### Opis

Jako użytkownik chcę móc wybrać miasto, aby przeglądać POI i planować trasy w danej lokalizacji.

### Kryteria akceptacji

- [ ] Lista dostępnych miast (Kraków, Warszawa, Wrocław, Trójmiasto)
- [ ] Przełączanie miasta zmienia centrum mapy
- [ ] Zapisywanie ostatnio wybranego miasta
- [ ] Dynamiczne ładowanie POI dla wybranego miasta

### Miasta i centra

```typescript
const CITIES = {
  krakow: { name: 'Kraków', center: [19.9449, 50.0647], port: 5001 },
  warszawa: { name: 'Warszawa', center: [21.0122, 52.2297], port: 5002 },
  wroclaw: { name: 'Wrocław', center: [17.0385, 51.1079], port: 5003 },
  trojmiasto: { name: 'Trójmiasto', center: [18.6466, 54.352], port: 5004 },
};
```

### Zadania

- [ ] CitySelector component (IonModal lub IonActionSheet)
- [ ] useCityStore (Zustand) do przechowywania wybranego miasta
- [ ] Integracja z MapView (zmiana centrum)
- [ ] Persystencja w Capacitor Preferences

---

## User Story 7.4: Wyświetlanie POI na mapie

### Opis

Jako użytkownik chcę widzieć punkty POI na mapie, aby odkrywać interesujące miejsca w mieście.

### Kryteria akceptacji

- [ ] Pobieranie POI z API backendu
- [ ] Markery POI na mapie z różnymi ikonami wg kategorii
- [ ] Kliknięcie na marker pokazuje kartę POI
- [ ] Filtrowanie POI po kategoriach
- [ ] Wyszukiwanie POI po nazwie

### Kategorie POI

- Zabytki (landmark)
- Muzea (museum)
- Parki (park)
- Restauracje (restaurant)
- Kawiarnie (cafe)
- Hotele (hotel)

### Zadania

- [ ] POI Service (API client)
- [ ] usePOI hook z TanStack Query
- [ ] POI markers na OpenLayers
- [ ] POICard component (IonModal)
- [ ] CategoryFilter component (IonChip)
- [ ] SearchBar component (IonSearchbar)

---

## User Story 7.5: Planowanie trasy

### Opis

Jako użytkownik chcę zaplanować trasę między punktami, aby otrzymać optymalną ścieżkę pieszą.

### Kryteria akceptacji

- [ ] Dodawanie waypoints przez kliknięcie na mapie lub POI
- [ ] Lista waypoints z możliwością reorderowania (IonReorder)
- [ ] Obliczanie trasy przez OSRM API
- [ ] Wyświetlanie trasy na mapie jako LineString
- [ ] Informacje o dystansie i czasie
- [ ] Wybór profilu (pieszo, rower, auto)

### Zadania

- [ ] useWaypoints hook (zarządzanie punktami)
- [ ] useRouting hook (OSRM API)
- [ ] WaypointList component (IonList + IonReorder)
- [ ] RouteInfo component (dystans, czas)
- [ ] ProfileSelector component (IonSegment)
- [ ] OSRM Service

---

## User Story 7.6: Zapisywanie tras

### Opis

Jako użytkownik chcę zapisywać swoje trasy, aby móc do nich wrócić później.

### Kryteria akceptacji

- [ ] Zapisywanie trasy z nazwą i opisem
- [ ] Lista zapisanych tras
- [ ] Szczegóły trasy (mapa, waypoints, info)
- [ ] Edycja nazwy/opisu trasy
- [ ] Usuwanie tras
- [ ] Oznaczanie ulubionych

### Zadania

- [ ] Route model (TypeScript interface)
- [ ] useRouteStore (Zustand + Capacitor Preferences)
- [ ] SaveRouteModal component
- [ ] RoutesPage screen
- [ ] RouteDetails modal
- [ ] Eksport trasy (GeoJSON, GPX)

---

## User Story 7.7: Kuratorowane wycieczki

### Opis

Jako użytkownik chcę przeglądać gotowe wycieczki, aby odkrywać miasto według przygotowanych scenariuszy.

### Kryteria akceptacji

- [ ] Lista wycieczek dla wybranego miasta
- [ ] Kategorie wycieczek (historia, sztuka, jedzenie, etc.)
- [ ] Poziom trudności (łatwy, średni, trudny)
- [ ] Czas trwania i dystans
- [ ] Szczegóły wycieczki z listą POI
- [ ] Rozpoczęcie nawigacji po wycieczce

### Zadania

- [ ] Tour model (interface)
- [ ] Tours Service (API lub lokalne JSON)
- [ ] ToursPage screen
- [ ] TourCard component
- [ ] TourDetails modal
- [ ] StartTour action

---

## User Story 7.8: Nawigacja turn-by-turn

### Opis

Jako użytkownik chcę otrzymywać instrukcje nawigacyjne, aby łatwo dotrzeć do celu.

### Kryteria akceptacji

- [ ] Lista kroków nawigacji z instrukcjami
- [ ] Bieżący krok wyróżniony
- [ ] Dystans do następnego zakrętu
- [ ] Automatyczne przełączanie kroków na podstawie lokalizacji
- [ ] Powiadomienia głosowe (opcjonalne)
- [ ] Tryb pełnoekranowy nawigacji

### Zadania

- [ ] useNavigation hook
- [ ] NavigationPanel component
- [ ] NavigationStep component
- [ ] StepInstructions parser (OSRM -> polski)
- [ ] Location tracking (Capacitor Geolocation watch)
- [ ] Opcjonalnie: Capacitor Text-to-Speech

---

## User Story 7.9: Ustawienia użytkownika

### Opis

Jako użytkownik chcę dostosować aplikację do swoich preferencji.

### Kryteria akceptacji

- [ ] Wybór domyślnego miasta
- [ ] Motyw (jasny/ciemny/systemowy)
- [ ] Jednostki (km/mile)
- [ ] Domyślny profil trasowania
- [ ] Powiadomienia nawigacyjne (włącz/wyłącz)
- [ ] Wersja aplikacji i informacje

### Zadania

- [ ] useSettingsStore (Zustand + Capacitor Preferences)
- [ ] SettingsPage screen z IonList
- [ ] ThemeToggle component
- [ ] UnitSelector component
- [ ] About section

---

## User Story 7.10: Tryb offline

### Opis

Jako użytkownik chcę korzystać z aplikacji offline, aby móc nawigować bez internetu.

### Kryteria akceptacji

- [ ] Cache zapisanych tras
- [ ] Cache ulubionych POI
- [ ] Wskaźnik trybu offline
- [ ] Synchronizacja po powrocie online
- [ ] Opcjonalne: offline mapy (tiles)

### Zadania

- [ ] Offline storage strategy
- [ ] Network status monitoring (Capacitor Network)
- [ ] Sync service
- [ ] OfflineIndicator component

---

## Kolejność implementacji

### Faza 1: Fundament (Stories 7.1-7.2)

1. Story 7.1: Podstawowa struktura Ionic/Capacitor
2. Story 7.2: Komponent mapy OpenLayers

### Faza 2: Core Features (Stories 7.3-7.6)

3. Story 7.3: Wybór miasta
4. Story 7.4: POI na mapie
5. Story 7.5: Planowanie trasy
6. Story 7.6: Zapisywanie tras

### Faza 3: Advanced Features (Stories 7.7-7.9)

7. Story 7.7: Kuratorowane wycieczki
8. Story 7.8: Nawigacja turn-by-turn
9. Story 7.9: Ustawienia

### Faza 4: Polish (Story 7.10)

10. Story 7.10: Tryb offline

---

## Wymagania techniczne

### Backend API

- POI Server: `http://localhost:3001/api/pois`
- OSRM Routing: `http://localhost:500X/route/v1/{profile}/{coords}`

### Środowisko deweloperskie

```bash
cd mobile
npm start        # Ionic Dev Server
npm run build    # Production build

# Capacitor
npx cap add ios
npx cap add android
npx cap run ios
npx cap run android
npx cap sync
```

---

## Definition of Done

Każda User Story jest ukończona gdy:

- [ ] Kod napisany w TypeScript bez błędów
- [ ] Komponenty działają na iOS, Android i Web
- [ ] Testy jednostkowe napisane (jeśli dotyczy)
- [ ] Dokumentacja zaktualizowana
- [ ] Code review przeszedł
- [ ] Merge do main branch
