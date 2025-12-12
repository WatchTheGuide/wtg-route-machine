# BUG-010: Infinite loop przy wyborze POI - Maximum update depth exceeded

## Status

- **Status**: 🟢 Fixed
- **Priorytet**: 🔴 Critical
- **Data zgłoszenia**: 2025-12-12
- **Data naprawy**: 2025-12-12

## Opis problemu

W kreatorze wycieczki, po wybraniu POI z listy lub mapy, aplikacja "znika" z ekranu (biały ekran). W konsoli pojawia się błąd:

```
Maximum update depth exceeded. This can happen when a component repeatedly
calls setState inside componentWillUpdate or componentDidUpdate.
React limits the number of nested updates to prevent infinite loops.
```

## Kroki reprodukcji

1. Otwórz panel administracyjny
2. Przejdź do Wycieczki → Utwórz nową
3. Wybierz miasto (np. Kraków)
4. Przejdź do zakładki "POI"
5. Kliknij na dowolny POI na mapie lub liście
6. **Aplikacja crashuje z białym ekranem**

## Oczekiwane zachowanie

POI powinien zostać dodany do listy wybranych bez żadnych błędów. Mapa i lista powinny zaktualizować się płynnie.

## Rzeczywiste zachowanie

Aplikacja wchodzi w nieskończoną pętlę aktualizacji i React zatrzymuje ją po przekroczeniu limitu.

## Analiza techniczna

### Lokalizacja błędu

- **Plik**: `admin/src/components/tours/TourPOISelector.tsx`
- **Linie**: 381-402 (useEffect aktualizujący markery POI)
- **Funkcja**: `isPOISelected` w dependencies useEffect

### Root Cause

**Niestabilna referencja funkcji callback w dependencies useEffect**

#### Łańcuch powodujący infinite loop:

```
1. Użytkownik klika POI
   ↓
2. togglePOISelection(poi) → onSelectedPOIsChange([...selectedPOIs, poi])
   ↓
3. TourEditorPage: setSelectedPOIs(pois) → nowy obiekt tablicy
   ↓
4. TourPOISelector re-render z nowym selectedPOIs
   ↓
5. isPOISelected (useCallback z [selectedPOIs]) tworzy NOWĄ REFERENCJĘ
   ↓
6. useEffect wykrywa zmianę isPOISelected w dependencies
   ↓
7. useEffect wykonuje się → aktualizuje markery
   ↓
8. Jeśli cokolwiek w tym procesie triggeruje re-render...
   ↓
9. POWRÓT DO KROKU 5 → Infinite loop!
```

### Kod problematyczny

```tsx
// Linia 164-168 - funkcja z niestabilną referencją
const isPOISelected = useCallback(
  (poiId: string) => {
    return selectedPOIs.some((p) => p.id === poiId);
  },
  [selectedPOIs] // ← Nowa referencja przy każdej zmianie selectedPOIs
);

// Linia 381-402 - useEffect z isPOISelected w dependencies
useEffect(() => {
  // ...
  filteredPOIs.forEach((poi) => {
    const isSelected = isPOISelected(poi.id); // ← Używa funkcji
    // ...
  });
}, [filteredPOIs, selectedPOIs, hoveredPOIId, isPOISelected, createPOIStyle]);
//                                            ^^^^^^^^^^^^^^ ← PROBLEM!
```

## Rozwiązanie

Usunięcie `isPOISelected` z dependencies useEffect i użycie inline sprawdzenia z `Set` dla wydajności:

```tsx
// Update POI markers on map
useEffect(() => {
  if (!poiLayerRef.current) return;

  const source = poiLayerRef.current.getSource();
  if (!source) return;

  source.clear();

  // ✅ Create a Set of selected POI IDs for efficient lookup
  const selectedPOIIds = new Set(selectedPOIs.map((p) => p.id));

  // Add all POI markers
  filteredPOIs.forEach((poi) => {
    const isSelected = selectedPOIIds.has(poi.id); // ✅ Inline check
    const isHovered = hoveredPOIId === poi.id;

    const feature = new Feature({
      geometry: new Point(fromLonLat(poi.coordinates)),
      poiId: poi.id,
    });

    feature.setStyle(createPOIStyle(poi, isSelected, isHovered));
    source.addFeature(feature);
  });
}, [filteredPOIs, selectedPOIs, hoveredPOIId, createPOIStyle]); // ✅ Bez isPOISelected
```

### Dlaczego to działa:

1. `selectedPOIs` jest już w dependencies - useEffect reaguje na zmiany
2. `Set` tworzony wewnątrz useEffect - nie wpływa na dependencies
3. Inline sprawdzenie `selectedPOIIds.has(poi.id)` jest stabilne
4. Brak funkcji callback w dependencies = brak problemu z referencjami

## Powiązane pliki

- `admin/src/components/tours/TourPOISelector.tsx` - główny plik z błędem
- `admin/src/pages/TourEditorPage.tsx` - strona używająca TourPOISelector

## Testy weryfikujące

1. Otwórz kreator wycieczki → POI
2. Kliknij kilka POI na mapie
3. **Weryfikacja**: POI są dodawane bez crashu
4. Sprawdź że można usuwać POI z listy
5. Sprawdź że hover nad POI działa płynnie

## Dodatkowe uwagi

To jest klasyczny błąd React związany z funkcjami callback w dependencies useEffect. Zasada ogólna:

**❌ Unikaj:** Funkcji callback z niestabilnymi zależnościami w dependencies useEffect
**✅ Preferuj:** Inline logikę lub `useMemo` dla stabilnych wartości pochodnych

Ten sam wzorzec był przyczyną BUG-009 (stale closure w MapEditor).
