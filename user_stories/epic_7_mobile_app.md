# Epic 7: Aplikacja Mobilna WTG Route Machine

## Opis

Stworzenie natywnej aplikacji mobilnej React Native + Expo dla iOS i Android, umożliwiającej planowanie tras pieszych, odkrywanie punktów POI oraz nawigację turn-by-turn po miastach Polski.

## Technologie

- **Framework**: React Native + Expo SDK 54
- **Język**: TypeScript
- **UI**: React Native Paper 5.x (Material Design 3)
- **Mapy**: React Native Maps + Leaflet (WebView fallback)
- **Nawigacja**: Expo Router (file-based routing)
- **Stan**: Zustand + TanStack Query
- **Lokalizacja**: expo-location, expo-task-manager

## Kolory marki

- **Primary**: #ff6600 (pomarańczowy)
- **Secondary**: #454545 (ciemny szary)

---

## User Story 7.1: Podstawowa struktura aplikacji

### Opis

Jako programista chcę skonfigurować podstawową strukturę aplikacji, aby mieć solidny fundament do dalszego rozwoju.

### Kryteria akceptacji

- [ ] Expo SDK 54 z TypeScript
- [ ] React Native Paper skonfigurowany z kolorami marki
- [ ] Expo Router z nawigacją tab-based (4 zakładki)
- [ ] Podstawowy theme (light/dark mode)
- [ ] Struktura katalogów (components, hooks, services, stores, types)

### Zakładki

1. **Odkrywaj** (Explore) - mapa z POI
2. **Trasy** (Routes) - zapisane trasy
3. **Wycieczki** (Tours) - kuratorowane wycieczki
4. **Ustawienia** (Settings) - preferencje użytkownika

### Zadania

- [ ] Instalacja React Native Paper
- [ ] Instalacja Expo Router
- [ ] Konfiguracja theme z kolorami marki
- [ ] Utworzenie struktury katalogów
- [ ] Implementacja \_layout.tsx dla Stack i Tabs
- [ ] Podstawowe placeholder screens

---

## User Story 7.2: Komponent mapy

### Opis

Jako użytkownik chcę widzieć interaktywną mapę, aby móc przeglądać miasto i punkty POI.

### Kryteria akceptacji

- [ ] Mapa wyśrodkowana na wybranym mieście (domyślnie Kraków)
- [ ] Obsługa gestów (zoom, pan)
- [ ] Markery dla punktów POI
- [ ] Wyświetlanie trasy jako polyline
- [ ] Lokalizacja użytkownika (blue dot)
- [ ] Działa na iOS, Android i Web

### Warianty implementacji

1. **Native**: react-native-maps (Google Maps / Apple Maps)
2. **WebView**: Leaflet dla fallback i web

### Zadania

- [ ] Komponent MapView z react-native-maps
- [ ] Fallback LeafletMap dla web
- [ ] Hook useLocation do pobierania pozycji
- [ ] Komponenty MapMarker i MapRoute
- [ ] Obsługa onMapPress i onMarkerPress

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
  krakow: { name: 'Kraków', center: [50.0647, 19.9449], port: 5001 },
  warszawa: { name: 'Warszawa', center: [52.2297, 21.0122], port: 5002 },
  wroclaw: { name: 'Wrocław', center: [51.1079, 17.0385], port: 5003 },
  trojmiasto: { name: 'Trójmiasto', center: [54.352, 18.6466], port: 5004 },
};
```

### Zadania

- [ ] CitySelector component (modal lub bottom sheet)
- [ ] useCityStore (Zustand) do przechowywania wybranego miasta
- [ ] Integracja z MapView (zmiana centrum)
- [ ] Persystencja w AsyncStorage

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
- [ ] POIMarker component
- [ ] POICard component (bottom sheet)
- [ ] CategoryFilter component
- [ ] SearchBar component

---

## User Story 7.5: Planowanie trasy

### Opis

Jako użytkownik chcę zaplanować trasę między punktami, aby otrzymać optymalną ścieżkę pieszą.

### Kryteria akceptacji

- [ ] Dodawanie waypoints przez kliknięcie na mapie lub POI
- [ ] Lista waypoints z możliwością reorderowania (drag & drop)
- [ ] Obliczanie trasy przez OSRM API
- [ ] Wyświetlanie trasy na mapie jako polyline
- [ ] Informacje o dystansie i czasie
- [ ] Wybór profilu (pieszo, rower, auto)

### Zadania

- [ ] useWaypoints hook (zarządzanie punktami)
- [ ] useRouting hook (OSRM API)
- [ ] WaypointList component
- [ ] RouteInfo component (dystans, czas)
- [ ] ProfileSelector component
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
- [ ] useRouteStore (Zustand + AsyncStorage)
- [ ] SaveRouteModal component
- [ ] RouteList screen
- [ ] RouteDetails screen
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
- [ ] TourList screen
- [ ] TourCard component
- [ ] TourDetails screen
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
- [ ] Location tracking service
- [ ] Opcjonalnie: expo-speech dla TTS

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

- [ ] useSettingsStore (Zustand + AsyncStorage)
- [ ] Settings screen z sekcjami
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
- [ ] Network status monitoring
- [ ] Sync service
- [ ] OfflineIndicator component

---

## Kolejność implementacji

### Faza 1: Fundament (Stories 7.1-7.2)

1. ✅ Story 7.1: Podstawowa struktura
2. Story 7.2: Komponent mapy

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
npm start        # Expo DevTools
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Browser
```

### Struktura katalogów

```
mobile/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── explore.tsx
│   │   ├── routes.tsx
│   │   ├── tours.tsx
│   │   └── settings.tsx
│   ├── navigation/        # Navigation screens
│   ├── route-planner.tsx
│   └── _layout.tsx
├── src/
│   ├── components/        # Reusable components
│   │   ├── map/
│   │   ├── poi/
│   │   └── navigation/
│   ├── hooks/             # Custom hooks
│   ├── services/          # API services
│   ├── stores/            # Zustand stores
│   ├── types/             # TypeScript types
│   └── theme/             # Theme configuration
└── assets/                # Images, fonts
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
