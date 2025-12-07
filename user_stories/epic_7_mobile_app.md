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

## User Story 7.6: Zapisywanie tras ✅

### Opis

Jako użytkownik chcę zapisywać swoje trasy, aby móc do nich wrócić później.

### Kryteria akceptacji

- [x] Zapisywanie trasy z nazwą i opisem
- [x] Lista zapisanych tras
- [x] Szczegóły trasy (mapa, waypoints, info)
- [x] Edycja nazwy/opisu trasy
- [x] Usuwanie tras
- [x] Oznaczanie ulubionych
- [x] Filtrowanie tras (wszystkie/ulubione)
- [x] Karta trasy roboczej (draft route)
- [x] Walidacja przed zapisaniem
- [x] Toast potwierdzenia akcji

### Zadania

- [x] Route model (TypeScript interface: `SavedRoute`)
- [x] useSavedRoutesStore (Zustand + Capacitor Preferences)
- [x] SaveRouteModal component z walidacją
- [x] RoutesPage screen z filtrowaniem
- [x] RouteDetailsModal component
- [x] SavedRouteCard component
- [x] DraftRouteCard component
- [x] Formatowanie dystansu i czasu (`format.ts`)
- [x] Tłumaczenia (PL, EN, DE, FR, UK)

### Zaimplementowane komponenty

#### SaveRouteModal

- Formularz z nazwą (wymagana, 3-50 znaków)
- Opis (opcjonalny, max 200 znaków)
- Podgląd statystyk (profil, waypoints, dystans, czas)
- Walidacja przed zapisaniem
- Toast potwierdzenia

#### DraftRouteCard

- Wyświetla trasę roboczą (niezapisaną)
- Statystyki: profil, liczba punktów, dystans, czas
- Akcje: kontynuuj edycję, zapisz, odrzuć
- Neutralny styl z subtelnym cieniem

#### RoutesPage

- Lista zapisanych tras
- Filtr: wszystkie / ulubione (ikona serca w nagłówku)
- Integracja z DraftRouteCard
- FAB do tworzenia nowej trasy
- Toast dla akcji (zapisano, usunięto, odrzucono)

#### SavedRouteCard

- Nazwa, opis, data utworzenia
- Ikona profilu (foot/bicycle/car)
- Statystyki: waypoints, dystans, czas
- Akcje: ulubione, edycja, usuwanie
- Swipe actions na iOS/Android

#### RouteDetailsModal

- Mapa z trasą i waypoints
- Lista waypoints z adresami
- Statystyki: dystans, czas, wzniesienia
- Eksport (przygotowane do US 7.10)

### Persystencja

- Capacitor Preferences do przechowywania tras
- Auto-save przy każdej zmianie
- Unikalne ID generowane przez `crypto.randomUUID()`

### UX Improvements

- Numerowane markery na mapie (1, 2, 3...)
- Kolorowe ikony waypoints (zielony start, pomarańczowe pośrednie, czerwony koniec)
- Przycisk "Zapisz trasę" w plannerze (disabled gdy brak trasy)
- Przycisk "Wróć" zamiast "Zamknij" w plannerze
- Ikony waypoints w liście (flag, radio button, location)

### Eksport trasy (przygotowane)

- GeoJSON export (częściowo zaimplementowany)
- GPX export (do implementacji w US 7.10)

---

## User Story 7.7: Kuratorowane wycieczki ✅

### Opis

Jako użytkownik chcę przeglądać gotowe wycieczki, aby odkrywać miasto według przygotowanych scenariuszy.

### Kryteria akceptacji

- [x] Lista wycieczek dla wybranego miasta
- [x] Kategorie wycieczek (historia, architektura)
- [x] Poziom trudności (łatwy, średni, trudny)
- [x] Czas trwania i dystans
- [x] Szczegóły wycieczki z listą POI
- [x] Rozpoczęcie nawigacji po wycieczce
- [x] Obrazy wycieczek z Unsplash
- [x] Filtrowanie po kategorii
- [x] Integracja z planowaniem trasy
- [x] Tłumaczenia (PL, EN, DE, FR, UK)

### Zadania

- [x] Tour model (TypeScript interface: `Tour`)
- [x] Tours Service (lokalne dane testowe)
- [x] ToursPage screen z filtrowaniem
- [x] TourCard component z obrazami
- [x] TourDetailsModal z mapą i listą POI
- [x] StartTour action (dodaje wszystkie POI jako waypoints)
- [x] Dane testowe: 8 wycieczek (2 na miasto × 4 miasta)
- [x] React Query hooks (useTours, useTour, useAllTours)
- [x] QueryClientProvider konfiguracja

### Zaimplementowane komponenty

#### TourCard

- Obraz wycieczki (full width, 200px height)
- Kategoria i poziom trudności (chipy)
- Nazwa i opis wycieczki
- Statystyki: dystans, czas, liczba przystanków
- Tłumaczenia nazw i opisów

#### TourDetailsModal

- Hero image (pełna szerokość)
- Toggleable mapa z trasą
- Numerowana lista POI
- Statystyki wycieczki
- Przycisk "Rozpocznij wycieczkę" (dodaje POI do planera)

#### ToursPage

- Filtrowanie po kategorii (wszystkie/historia/architektura)
- Lista kart wycieczek
- Loading/error/empty states
- Integracja z useCityStore

### Dane testowe

**Miasta:** Kraków, Warszawa, Wrocław, Trójmiasto

**Wycieczki na miasto:**

1. **Najważniejsze zabytki** (kategoria: historia, łatwy, ~3h, 5-5.5 km)
2. **Najważniejsze kościoły** (kategoria: architektura, średni, ~4h, 6-7 km)

**Obrazy:**

- Wszystkie wycieczki używają zweryfikowanych obrazów z Unsplash
- Zabytki: obraz Wawelu (photo-1578916171728)
- Kościoły: obraz gotyckiego kościoła (photo-1553913861)
- Parametry: `w=800&q=80&auto=format&fit=crop`

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

### Faza 3: Advanced Features (Stories 7.7-7.9) ✅ (1/3)

8. Story 7.7: Kuratorowane wycieczki ✅
9. Story 7.8: Nawigacja turn-by-turn
10. Story 7.9: Ustawienia

### Faza 4: Polish (Stories 7.10-7.12)

11. Story 7.10: Tryb offline
12. Story 7.11: Obsługa wielu języków (i18n) ✅
13. Story 7.12: Integracja z backend API tours

---

## User Story 7.12: Integracja z backend API tours

### Opis

Jako użytkownik chcę, aby dane kuratorowanych wycieczek były pobierane z backendu, aby treści były aktualne bez konieczności aktualizacji aplikacji.

### Zależności

- **Wymaga**: Epic 5.1 - Tours Backend API (US 5.1.1-5.1.7)
- **Bazuje na**: US 7.7 - Kuratorowane wycieczki (UI już zaimplementowane)

### Kryteria akceptacji

- [ ] Serwis `tours.service.ts` komunikuje się z backend API zamiast lokalnych danych
- [ ] Obsługa API key w produkcji (X-API-Key header)
- [ ] Brak wymogu API key w developmencie (localhost)
- [ ] Wszystkie endpointy tours zaimplementowane
- [ ] Loading states podczas pobierania danych
- [ ] Error handling z komunikatami użytkownikowi
- [ ] Cache danych z TanStack Query (stale time 5 min)
- [ ] Offline fallback do ostatnich załadowanych danych
- [ ] Migracja danych z `tours.ts` do backendu zakończona

### Endpointy API

#### 1. GET /api/tours/cities

Pobiera listę miast z liczbą dostępnych wycieczek.

**Response:**

```typescript
{
  cities: [
    { id: 'krakow', name: 'Kraków', toursCount: 2 },
    { id: 'warszawa', name: 'Warszawa', toursCount: 2 },
    { id: 'wroclaw', name: 'Wrocław', toursCount: 2 },
    { id: 'trojmiasto', name: 'Trójmiasto', toursCount: 2 }
  ]
}
```

#### 2. GET /api/tours/:cityId

Pobiera wszystkie wycieczki dla danego miasta.

**Przykład:** `GET /api/tours/krakow`

**Response:**

```typescript
{
  tours: [
    {
      id: 'krakow-old-town',
      cityId: 'krakow',
      name: { pl: 'Stare Miasto', en: 'Old Town', ... },
      description: { pl: 'Opis...', en: 'Description...', ... },
      category: 'cultural',
      difficulty: 'easy',
      distance: 3500,
      duration: 120,
      imageUrl: '/images/tours/krakow-old-town.jpg',
      pois: [...] // POI IDs
    },
    // ...more tours
  ]
}
```

#### 3. GET /api/tours/:cityId/:tourId

Pobiera szczegóły pojedynczej wycieczki.

**Przykład:** `GET /api/tours/krakow/krakow-old-town`

**Response:**

```typescript
{
  tour: {
    id: 'krakow-old-town',
    cityId: 'krakow',
    name: { pl: 'Stare Miasto', en: 'Old Town', ... },
    description: { pl: 'Opis...', en: 'Description...', ... },
    category: 'cultural',
    difficulty: 'easy',
    distance: 3500,
    duration: 120,
    imageUrl: '/images/tours/krakow-old-town.jpg',
    pois: [...] // Full POI objects
  }
}
```

#### 4. GET /api/tours/:cityId/search?q=query

Wyszukuje wycieczki po nazwie/opisie.

**Przykład:** `GET /api/tours/krakow/search?q=rynek`

**Response:**

```typescript
{
  tours: [
    // ...matching tours
  ],
  query: 'rynek',
  count: 2
}
```

### Konfiguracja środowiskowa

**Development (localhost):**

```typescript
// mobile/src/config/api.ts
export const API_CONFIG = {
  toursBaseUrl: 'http://localhost:3002/api/tours',
  requireApiKey: false,
};
```

**Production:**

```typescript
// mobile/src/config/api.ts (via env variables)
export const API_CONFIG = {
  toursBaseUrl: import.meta.env.VITE_TOURS_API_URL || 'https://api.wtg.pl/tours',
  apiKey: import.meta.env.VITE_API_KEY,
  requireApiKey: true,
};
```

### Implementacja serwisu

**Przed (hardcoded):**

```typescript
// mobile/src/services/tours.service.ts
import { TOURS } from '@/data/tours';

export class ToursService {
  async getToursByCity(cityId: string) {
    return TOURS.filter((t) => t.cityId === cityId);
  }
}
```

**Po (backend API):**

```typescript
// mobile/src/services/tours.service.ts
import { API_CONFIG } from '@/config/api';
import axios from 'axios';

export class ToursService {
  private client = axios.create({
    baseURL: API_CONFIG.toursBaseUrl,
    headers: API_CONFIG.requireApiKey
      ? { 'X-API-Key': API_CONFIG.apiKey }
      : {},
  });

  async getCities() {
    const { data } = await this.client.get('/cities');
    return data.cities;
  }

  async getToursByCity(cityId: string) {
    const { data } = await this.client.get(`/${cityId}`);
    return data.tours;
  }

  async getTourById(cityId: string, tourId: string) {
    const { data } = await this.client.get(`/${cityId}/${tourId}`);
    return data.tour;
  }

  async searchTours(cityId: string, query: string) {
    const { data } = await this.client.get(`/${cityId}/search`, {
      params: { q: query },
    });
    return data.tours;
  }
}
```

### React Query hooks

**Aktualizacja istniejących hooków:**

```typescript
// mobile/src/hooks/useTours.ts
import { useQuery } from '@tanstack/react-query';
import { toursService } from '@/services/tours.service';

export const useTours = (cityId: string) => {
  return useQuery({
    queryKey: ['tours', cityId],
    queryFn: () => toursService.getToursByCity(cityId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

export const useTour = (cityId: string, tourId: string) => {
  return useQuery({
    queryKey: ['tour', cityId, tourId],
    queryFn: () => toursService.getTourById(cityId, tourId),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
  });
};

export const useSearchTours = (cityId: string, query: string) => {
  return useQuery({
    queryKey: ['tours', cityId, 'search', query],
    queryFn: () => toursService.searchTours(cityId, query),
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search
  });
};
```

### Error handling

```typescript
// mobile/src/components/tours/ToursPage.tsx
const ToursPage: React.FC = () => {
  const { selectedCity } = useCityStore();
  const { data: tours, isLoading, error } = useTours(selectedCity);

  if (error) {
    return (
      <IonContent>
        <div className="error-container">
          <IonIcon icon={alertCircleOutline} />
          <p>{t('tours.error.loadFailed')}</p>
          <IonButton onClick={() => queryClient.invalidateQueries(['tours'])}>
            {t('common.retry')}
          </IonButton>
        </div>
      </IonContent>
    );
  }

  // ...rest of component
};
```

### Migracja danych

**Krok 1:** Przenieś `mobile/src/data/tours.ts` → backend

```bash
# Tours data to backend JSON files
mobile/src/data/tours.ts
  → backend/tours-server/src/data/tours/krakow.json
  → backend/tours-server/src/data/tours/warszawa.json
  → backend/tours-server/src/data/tours/wroclaw.json
  → backend/tours-server/src/data/tours/trojmiasto.json
```

**Krok 2:** Usuń lokalny plik

```bash
git rm mobile/src/data/tours.ts
```

**Krok 3:** Zaktualizuj testy (mockowanie API)

```typescript
// mobile/src/services/__tests__/tours.service.test.ts
import { vi } from 'vitest';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ToursService', () => {
  it('should fetch tours from API', async () => {
    mockedAxios.create.mockReturnValue({
      get: vi.fn().mockResolvedValue({
        data: { tours: [{ id: 'test', cityId: 'krakow' }] },
      }),
    } as any);

    const tours = await toursService.getToursByCity('krakow');
    expect(tours).toHaveLength(1);
  });
});
```

### Testy

**Unit tests:**

```bash
npm run test.unit src/services/tours.service.test.ts
npm run test.unit src/hooks/useTours.test.ts
```

**Integration tests:**

```bash
# Uruchom backend tours server
cd backend/tours-server
npm start

# Test endpointów
curl http://localhost:3002/api/tours/cities
curl http://localhost:3002/api/tours/krakow
curl http://localhost:3002/api/tours/krakow/krakow-old-town
```

**Manual testing:**

1. Backend działa na porcie 3002
2. Mobile app w development mode
3. Sprawdź loading states
4. Sprawdź error handling (wyłącz backend)
5. Sprawdź cache (network tab w DevTools)

### Konfiguracja Vite

**mobile/vite.config.ts:**

```typescript
export default defineConfig({
  // ...existing config
  server: {
    proxy: {
      '/api/tours': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
});
```

### Environment variables

**mobile/.env.development:**

```bash
VITE_TOURS_API_URL=http://localhost:3002/api/tours
VITE_API_KEY=
```

**mobile/.env.production:**

```bash
VITE_TOURS_API_URL=https://api.wtg.pl/tours
VITE_API_KEY=your-production-api-key
```

### Zadania

- [ ] Skonfigurować axios client z API key
- [ ] Zaimplementować wszystkie metody API w `tours.service.ts`
- [ ] Zaktualizować React Query hooks (`useTours`, `useTour`)
- [ ] Dodać error handling w `ToursPage.tsx`
- [ ] Dodać loading skeletons
- [ ] Skonfigurować Vite proxy dla /api/tours
- [ ] Dodać environment variables (.env.development, .env.production)
- [ ] Przenieść dane z `tours.ts` do backend JSON files
- [ ] Usunąć `mobile/src/data/tours.ts`
- [ ] Zaktualizować testy jednostkowe (mockowanie axios)
- [ ] Przetestować wszystkie endpointy API
- [ ] Przetestować offline fallback
- [ ] Zaktualizować dokumentację

### Definition of Done

- [ ] Backend Tours Server działa i odpowiada na wszystkie endpointy
- [ ] Mobile app pobiera dane z backend API
- [ ] API key wymagany tylko w produkcji
- [ ] Wszystkie 4 endpointy działają poprawnie
- [ ] Loading states wyświetlane podczas pobierania
- [ ] Error handling z komunikatami użytkownikowi
- [ ] Cache TanStack Query skonfigurowany (5 min stale time)
- [ ] Testy jednostkowe zaktualizowane i przechodzą
- [ ] Dane zmigrowane z `tours.ts` do backend
- [ ] Lokalny plik `tours.ts` usunięty
- [ ] Dokumentacja zaktualizowana

---

## Wymagania techniczne

### Backend API

- **POI Server**: `http://localhost:3001/api/pois`
- **Tours Server**: `http://localhost:3002/api/tours` (wymaga Epic 5.1)
- **OSRM Routing**: `http://localhost:500X/route/v1/{profile}/{coords}`
- **API Key**: Wymagany w produkcji (X-API-Key header), opcjonalny w development

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
