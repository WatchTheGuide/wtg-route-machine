# BUG-009: Znikające punkty trasy w kreatorze wycieczki

## Status

- **Status**: � Fixed
- **Priorytet**: 🔴 Critical
- **Data zgłoszenia**: 2025-12-12
- **Data naprawy**: 2025-12-12

## Opis problemu

W panelu administracyjnym, w kreatorze wycieczki (TourEditorPage), zakładka "Punkty trasy" - gdy użytkownik wybiera punkty na mapie, pojawiają się one na chwilę, a po około 1 sekundzie znikają z mapy i listy.

## Kroki reprodukcji

1. Otwórz panel administracyjny
2. Przejdź do tworzenia nowej wycieczki
3. Wybierz miasto (wymagane do aktywacji mapy)
4. Przejdź do zakładki "Punkty trasy"
5. Kliknij przycisk "+" (tryb dodawania punktów)
6. Kliknij na mapę aby dodać punkt
7. **Obserwuj**: Punkt pojawia się, ale po ~1 sekundzie znika

## Oczekiwane zachowanie

Punkty trasy powinny pozostać na mapie i liście do momentu ręcznego usunięcia przez użytkownika.

## Rzeczywiste zachowanie

Punkty znikają automatycznie po około 1 sekundzie od dodania.

## Analiza techniczna

### Lokalizacja błędu

- **Plik**: [admin/src/components/tours/MapEditor.tsx](../admin/src/components/tours/MapEditor.tsx#L165-L187) oraz [linia 299](../admin/src/components/tours/MapEditor.tsx#L299)
- **Komponent**: `MapEditor`
- **Funkcja**: `autoFillWaypointName`

### Root Cause

Problem ma dwa powiązane źródła:

#### 1. Stale Closure w `autoFillRef` (Główna przyczyna)

W linii 299-300 `autoFillRef` jest tworzony jako zwykły obiekt JavaScript wewnątrz `useEffect`:

```tsx
// Linia 299-300 - BŁĘDNY KOD
const autoFillRef = { current: autoFillWaypointName };
```

Ten obiekt jest tworzony **tylko raz** przy inicjalizacji mapy (useEffect z pustą tablicą zależności). Oznacza to, że `autoFillRef.current` zawsze wskazuje na **pierwotną wersję** funkcji `autoFillWaypointName` z momentu pierwszego renderowania - czyli z pustą listą `waypoints = []`.

#### 2. Stale Closure w `autoFillWaypointName` (Wtórna przyczyna)

Funkcja `autoFillWaypointName` (linie 165-187) używa `waypoints` z closures:

```tsx
const autoFillWaypointName = useCallback(
  async (waypointId: string, lat: number, lon: number) => {
    try {
      const result = await geocodingService.getAddressFromCoordinates(lat, lon);
      if (result) {
        // ⚠️ Używa starej wersji `waypoints` z closures!
        const updatedWaypoints = waypoints.map((wp) =>
          wp.id === waypointId
            ? {
                ...wp,
                name:
                  result.formattedAddress || result.displayName.split(',')[0],
              }
            : wp
        );
        onWaypointsChange(updatedWaypoints);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  },
  [waypoints, onWaypointsChange] // Zależności są poprawne, ale...
);
```

#### Sekwencja zdarzeń (Race Condition)

```
T+0ms:    Użytkownik klika na mapę
          ↓
T+1ms:    onWaypointsChangeRef.current([...currentWaypoints, newWaypoint])
          → tourWaypoints = [newWaypoint]
          ↓
T+2ms:    autoFillRef.current(waypointId, coords[1], coords[0])
          → Rozpoczyna async request do geocodingService
          → autoFillRef.current wskazuje na starą wersję funkcji
          → Ta stara funkcja ma waypoints = [] (pusta tablica!)
          ↓
T+~1000ms: Odpowiedź z geocodingService
           ↓
T+~1001ms: autoFillWaypointName wykonuje:
           updatedWaypoints = [].map((wp) => ...) // Pusta tablica!
           → [].map() zwraca []
           ↓
T+~1002ms: onWaypointsChange([])
           → tourWaypoints = []
           → Punkt ZNIKA!
```

### Kod problematyczny

```tsx
// MapEditor.tsx - linie 293-320
// Initialize map - uruchamiany TYLKO RAZ
useEffect(() => {
  if (!mapRef.current || mapInstanceRef.current) return;

  // ... inicjalizacja mapy ...

  // ❌ BŁĄD: Zwykły obiekt zamiast useRef
  // Ta wartość NIGDY się nie aktualizuje!
  const autoFillRef = { current: autoFillWaypointName };

  // Click handler for adding waypoints
  map.on('click', (event) => {
    if (!isAddingModeRef.current) return;

    const coords = toLonLat(event.coordinate);
    const currentWaypoints = waypointsRef.current;
    const waypointId = `wp-${Date.now()}`;
    const newWaypoint: Waypoint = {
      /* ... */
    };

    // ✅ To jest OK - używa ref która jest aktualizowana
    onWaypointsChangeRef.current([...currentWaypoints, newWaypoint]);
    setIsAddingMode(false);

    // ❌ BŁĄD: autoFillRef.current wskazuje na starą funkcję!
    autoFillRef.current(waypointId, coords[1], coords[0]);
  });

  mapInstanceRef.current = map;
  // ... cleanup ...
}, []); // ← Pusta tablica zależności - useEffect uruchamia się RAZ
```

## Proponowane rozwiązanie

### Opcja 1: Dodać ref dla autoFillWaypointName (Zalecane)

```tsx
// Dodaj nowy ref na poziomie komponentu (koło linii 127)
const autoFillWaypointNameRef = useRef(autoFillWaypointName);

// Dodaj useEffect do synchronizacji ref (koło linii 210)
useEffect(() => {
  autoFillWaypointNameRef.current = autoFillWaypointName;
}, [autoFillWaypointName]);

// W click handlerze mapy (linia 319) użyj ref:
// Zamień:
autoFillRef.current(waypointId, coords[1], coords[0]);
// Na:
autoFillWaypointNameRef.current(waypointId, coords[1], coords[0]);

// Usuń lokalną zmienną autoFillRef z useEffect (linia 299)
```

### Opcja 2: Użyć functional update w autoFillWaypointName

Zmień `autoFillWaypointName` aby pobierało aktualne waypoints przez callback:

```tsx
const autoFillWaypointName = useCallback(
  async (waypointId: string, lat: number, lon: number) => {
    try {
      const result = await geocodingService.getAddressFromCoordinates(lat, lon);
      if (result) {
        // Użyj waypointsRef.current zamiast waypoints z closures
        const currentWaypoints = waypointsRef.current;
        const updatedWaypoints = currentWaypoints.map((wp) =>
          wp.id === waypointId
            ? {
                ...wp,
                name:
                  result.formattedAddress || result.displayName.split(',')[0],
              }
            : wp
        );
        onWaypointsChangeRef.current(updatedWaypoints);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  },
  [] // Puste zależności - używa tylko refs
);
```

### Opcja 3 (Najprostsza): Wywołaj autoFill po setState

Przenieś wywołanie `autoFillWaypointName` do osobnego useEffect który reaguje na zmianę waypoints:

```tsx
// Nowy state do śledzenia ID waypointu do autofill
const [pendingAutoFillId, setPendingAutoFillId] = useState<{
  id: string;
  lat: number;
  lon: number;
} | null>(null);

// W click handlerze:
map.on('click', (event) => {
  // ... tworzenie newWaypoint ...
  onWaypointsChangeRef.current([...currentWaypoints, newWaypoint]);
  setIsAddingMode(false);
  // Zamiast bezpośredniego wywołania, ustaw pending
  setPendingAutoFillId({ id: waypointId, lat: coords[1], lon: coords[0] });
});

// Nowy useEffect który reaguje na pending
useEffect(() => {
  if (
    pendingAutoFillId &&
    waypoints.some((wp) => wp.id === pendingAutoFillId.id)
  ) {
    autoFillWaypointName(
      pendingAutoFillId.id,
      pendingAutoFillId.lat,
      pendingAutoFillId.lon
    );
    setPendingAutoFillId(null);
  }
}, [waypoints, pendingAutoFillId, autoFillWaypointName]);
```

## Powiązane pliki

- [admin/src/components/tours/MapEditor.tsx](../admin/src/components/tours/MapEditor.tsx) - główny plik z błędem
- [admin/src/pages/TourEditorPage.tsx](../admin/src/pages/TourEditorPage.tsx) - komponent nadrzędny
- [admin/src/components/tours/WaypointsList.tsx](../admin/src/components/tours/WaypointsList.tsx) - lista waypointów
- [admin/src/services/geocoding.service.ts](../admin/src/services/geocoding.service.ts) - serwis geocodingu

## Testy weryfikujące

1. Dodaj punkt na mapie - powinien pozostać widoczny
2. Dodaj kilka punktów po sobie - wszystkie powinny pozostać
3. Sprawdź czy nazwy są automatycznie wypełniane (reverse geocoding)
4. Przeciągnij punkt - powinien pozostać w nowej lokalizacji
5. Usuń punkt - tylko wybrany punkt powinien zniknąć

## Dodatkowe uwagi

Ten błąd jest klasycznym przykładem "stale closure" w React - jeden z najczęstszych błędów przy pracy z hooks i event listenerami. Pattern z `useRef` do synchronizacji wartości callbacks jest powszechnie używany ale łatwo o pomyłkę jak w tym przypadku.

Podobny pattern (poprawny) jest już użyty w tym samym pliku dla:

- `isAddingModeRef` (linia 190)
- `waypointsRef` (linia 191)
- `onWaypointsChangeRef` (linia 192)

Ale dla `autoFillWaypointName` użyto zwykłego obiektu `{ current: ... }` zamiast `useRef`, co spowodowało że wartość nigdy nie jest aktualizowana.
