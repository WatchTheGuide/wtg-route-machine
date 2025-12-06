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

## User Story 7.2: Komponent mapy OpenLayers ✅

### Opis

Jako użytkownik chcę widzieć interaktywną mapę OpenLayers, aby móc przeglądać miasto i punkty POI.

### Kryteria akceptacji

- [x] Mapa OpenLayers wyśrodkowana na wybranym mieście (domyślnie Kraków)
- [x] Obsługa gestów (zoom, pan) na touch i desktop
- [x] Markery dla punktów POI
- [x] Wyświetlanie trasy jako LineString
- [x] Lokalizacja użytkownika (blue dot)
- [x] Działa na iOS, Android i Web

### Warstwy mapy

1. **Base**: OpenStreetMap tiles
2. **POI**: Vector layer z markerami
3. **Route**: Vector layer z trasą
4. **User**: Pozycja użytkownika

### Zaimplementowane

- **MapView**: Komponent OpenLayers z 4 warstwami
- **useMap**: Hook do zarządzania centrum i zoomem
- **useGeolocation**: Hook Capacitor Geolocation
- Kontrolki zoom przesunięte pod header Ionic

---

## User Story 7.3: Wybór miasta ✅

### Opis

Jako użytkownik chcę móc wybrać miasto, aby przeglądać POI i planować trasy w danej lokalizacji.

### Kryteria akceptacji

- [x] Lista dostępnych miast (Kraków, Warszawa, Wrocław, Trójmiasto)
- [x] Przełączanie miasta zmienia centrum mapy
- [x] Zapisywanie ostatnio wybranego miasta
- [ ] Dynamiczne ładowanie POI dla wybranego miasta (Story 7.4)

### Miasta i centra

```typescript
const CITIES = {
  krakow: {
    name: 'Kraków',
    center: [19.9449, 50.0647],
    ports: { foot: 5001, bicycle: 5002, car: 5003 },
  },
  warszawa: {
    name: 'Warszawa',
    center: [21.0122, 52.2297],
    ports: { foot: 5011, bicycle: 5012, car: 5013 },
  },
  wroclaw: {
    name: 'Wrocław',
    center: [17.0385, 51.1079],
    ports: { foot: 5021, bicycle: 5022, car: 5023 },
  },
  trojmiasto: {
    name: 'Trójmiasto',
    center: [18.6466, 54.352],
    ports: { foot: 5031, bicycle: 5032, car: 5033 },
  },
};
```

### Zaimplementowane

- **CitySelector**: Komponent z IonActionSheet
- **cityStore**: Zustand z persystencją Capacitor Preferences
- Integracja z MapView (flyTo przy zmianie miasta)

---

## User Story 7.4: Wyświetlanie POI na mapie ✅

### Opis

Jako użytkownik chcę widzieć punkty POI na mapie, aby odkrywać interesujące miejsca w mieście.

### Kryteria akceptacji

- [x] Pobieranie POI z API backendu
- [x] Markery POI na mapie z różnymi ikonami wg kategorii
- [x] Kliknięcie na marker pokazuje kartę POI
- [x] Filtrowanie POI po kategoriach
- [ ] Wyszukiwanie POI po nazwie (do implementacji)

### Kategorie POI

- Zabytki (landmark)
- Muzea (museum)
- Parki (park)
- Restauracje (restaurant)
- Kawiarnie (cafe)
- Hotele (hotel)

### Zaimplementowane

- **poiService**: API client (fetchPOIs, fetchPOI, searchPOIs, fetchCategories)
- **usePOI**: Hook z TanStack Query (cache 5 min)
- **POICard**: Modal z detalami POI (breakpoints)
- **CategoryFilter**: Chipy kategorii (scroll poziomy)

---

## User Story 7.5: Planowanie trasy ✅

### Opis

Jako użytkownik chcę zaplanować trasę między punktami, aby otrzymać optymalną ścieżkę pieszą.

### Kryteria akceptacji

- [x] Dodawanie waypoints przez kliknięcie na mapie
- [x] Lista waypoints z możliwością reorderowania (IonReorder)
- [x] Obliczanie trasy przez OSRM API
- [x] Wyświetlanie trasy na mapie jako LineString
- [x] Informacje o dystansie i czasie
- [x] Wybór profilu (pieszo, rower, auto)

### Zaimplementowane

- **useWaypoints**: Hook zarządzania punktami (add/remove/reorder)
- **useRouting**: Hook obliczania trasy przez OSRM
- **osrmService**: Klient OSRM API z polskimi instrukcjami
- **WaypointList**: Lista z drag-and-drop (IonReorder)
- **RouteInfo**: Dystans i czas trasy
- **ProfileSelector**: Wybór profilu (IonSegment)
- **RoutePlannerPage**: Pełnoekranowy modal planowania

---

## User Story 7.5.1: Integracja POI z planowaniem trasy ✅

### Opis

Jako użytkownik chcę dodawać POI do trasy z zakładki Odkrywaj, aby łatwo planować trasy przez interesujące miejsca.

### Kryteria akceptacji

- [x] Globalny store dla planowania trasy (routePlannerStore)
- [x] Przycisk "Dodaj do trasy" na POICard dodaje POI jako waypoint
- [x] Przycisk "Dodaj i przejdź do trasy" - dodaje i otwiera planer
- [x] Przycisk "Dodaj do trasy" - dodaje i pozwala dodać więcej POI
- [x] Modal planowania otwiera się z dodanym POI
- [x] Mapa nie znika po zamknięciu modalu planowania
- [x] Wskaźnik badge na zakładce Trasy (liczba waypoints)
- [x] Zmiana profilu przelicza trasę automatycznie
- [x] Każdy profil używa odpowiedniego portu OSRM

### Zaimplementowane

- **routePlannerStore**: Globalny stan Zustand (waypoints, route, profile, isPlannerOpen)
- **useWaypoints**: Refaktoryzacja na wrapper routePlannerStore
- **useRouting**: Refaktoryzacja - używa globalnego store dla profilu i trasy
- **useTabNavigation**: Hook programowego przełączania zakładek
- **POICard**: Dwa przyciski - "Dodaj do trasy" i "Dodaj i przejdź do trasy"
- **App.tsx**: Badge z liczbą waypoints na zakładce Trasy
- **City.ports**: Struktura portów per profil (foot/bicycle/car)

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

## User Story 7.11: Obsługa wielu języków (i18n) ✅

### Opis

Jako użytkownik chcę korzystać z aplikacji w swoim języku, aby lepiej rozumieć interfejs i instrukcje nawigacyjne.

### Kryteria akceptacji

- [x] Obsługa 5 języków: polski, niemiecki, angielski, francuski, ukraiński
- [x] Automatyczne wykrywanie języka urządzenia
- [x] Możliwość ręcznej zmiany języka w ustawieniach
- [x] Zapisywanie preferencji językowej
- [x] Tłumaczenie interfejsu użytkownika
- [x] Tłumaczenie instrukcji nawigacyjnych
- [x] Tłumaczenie komunikatów błędów i toastów

### Języki

| Kod | Język      | Status      |
| --- | ---------- | ----------- |
| pl  | Polski     | ✅ Domyślny |
| en  | English    | ✅ Gotowe   |
| de  | Deutsch    | ✅ Gotowe   |
| fr  | Français   | ✅ Gotowe   |
| uk  | Українська | ✅ Gotowe   |

### Zaimplementowane

- **Pakiety**: react-i18next, i18next, i18next-browser-languagedetector
- **Konfiguracja**: `src/i18n/index.ts` z automatycznym wykrywaniem języka
- **Tłumaczenia**: `src/i18n/locales/{pl,en,de,fr,uk}.ts`
- **LanguageSelector**: Komponent z ActionSheet i flagami emoji
- **Przetłumaczono**: Zakładki, strony, komponenty, POI, nawigację, błędy
- **Testy**: i18n zainicjalizowany w setupTests.ts, 119 testów przechodzi

### Struktura plików tłumaczeń

```
mobile/src/i18n/
├── index.ts           # Konfiguracja i18next
└── locales/
    ├── pl.ts          # Polski (domyślny)
    ├── en.ts          # English
    ├── de.ts          # Deutsch
    ├── fr.ts          # Français
    └── uk.ts          # Українська
```

---

## Kolejność implementacji

### Faza 1: Fundament (Stories 7.1-7.2) ✅

1. Story 7.1: Podstawowa struktura Ionic/Capacitor ✅
2. Story 7.2: Komponent mapy OpenLayers ✅

### Faza 2: Core Features (Stories 7.3-7.6)

3. Story 7.3: Wybór miasta ✅
4. Story 7.4: POI na mapie ✅
5. Story 7.5: Planowanie trasy ✅
6. Story 7.5.1: Integracja POI z planowaniem trasy ✅
7. Story 7.6: Zapisywanie tras

### Faza 3: Advanced Features (Stories 7.7-7.9)

8. Story 7.7: Kuratorowane wycieczki
9. Story 7.8: Nawigacja turn-by-turn
10. Story 7.9: Ustawienia

### Faza 4: Polish (Stories 7.10-7.11)

11. Story 7.10: Tryb offline
12. Story 7.11: Obsługa wielu języków (i18n) ✅

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
