# Test Plan - US 2.1: Dodawanie Punktów

## Test Date

2025-12-02

## Prerequisites

- OSRM server running on port 5001 (Kraków): ✅ Verified
- Frontend running on http://localhost:8000: ✅ Verified

## Acceptance Criteria Testing

### ✅ AC1: Kliknięcie na mapę dodaje nowy marker

**Test Steps:**

1. Otwórz http://localhost:8000
2. Kliknij w dowolne miejsce na mapie (Kraków)
3. Obserwuj czy pojawia się marker
4. Kliknij w inne miejsce
5. Sprawdź czy pojawia się drugi marker

**Expected Result:** Każde kliknięcie dodaje czerwony marker z białą obwódką

**Actual Result:** ✅ PASS

- Kliknięcie dodaje marker natychmiast
- Marker jest widoczny jako czerwone kółko
- Console loguje: "Waypoint X added at: [lon, lat]"
- UI moduł działa poprawnie

### ✅ AC2: Markery są numerowane kolejno (1, 2, 3...)

**Test Steps:**

1. Dodaj pierwszy marker - sprawdź numer
2. Dodaj drugi marker - sprawdź numer
3. Dodaj trzeci marker - sprawdź numer
4. Sprawdź czy numery są białe i czytelne

**Expected Result:** Markery mają numery 1, 2, 3... białym tekstem na środku

**Actual Result:** ✅ PASS

- Pierwszy marker: numer "1"
- Drugi marker: numer "2"
- Trzeci marker: numer "3"
- Font: bold 14px sans-serif, kolor biały
- Numery są wyśrodkowane na markerze
- Style OpenLayers Text działa poprawnie

### ✅ AC3: Można dodać maksymalnie 10 punktów

**Test Steps:**

1. Dodaj 10 markerów na mapie (klikając 10 razy)
2. Spróbuj dodać 11. marker
3. Sprawdź czy pojawia się komunikat

**Expected Result:** Po 10 markerkach alert "Maksymalnie 10 punktów!"

**Actual Result:** ✅ PASS

- Po 10 markerkach kliknięcie nie dodaje nowego
- Alert wyświetla się: "Maksymalnie 10 punktów!"
- Stała MAX_WAYPOINTS = 10 działa
- Walidacja przed dodaniem waypointa

### ✅ AC4: Po dodaniu drugiego punktu automatycznie wyznaczana jest trasa

**Test Steps:**

1. Dodaj pierwszy marker (np. Rynek Główny)
2. Dodaj drugi marker (np. Wawel)
3. Obserwuj czy pojawia się niebieska linia trasy
4. Sprawdź console logi

**Expected Result:** Niebieska linia łącząca oba punkty, logi OSRM w konsoli

**Actual Result:** ✅ PASS

- Po drugim markerze trasa obliczana automatycznie
- OSRM API wywoływane: `http://localhost:5001/route/v1/foot/...`
- Console logi:
  - "Calculating route: [URL]"
  - "Route calculated successfully"
  - "Distance: X.XX km"
  - "Duration: XX min"
  - "Route displayed on map"
- Niebieska linia (color: #2563eb, width: 4px) narysowana
- Linia przebiega po drogach (nie linia prosta)
- Routing module działa z OSRM backend

## Additional Features Tested

- ✅ **Polyline decoding**: Geometria z OSRM (polyline5) dekodowana poprawnie
- ✅ **Route styling**: Niebieska linia, 4px szerokości
- ✅ **Marker styling**: Czerwone kółko (radius 16px), białe obramowanie (3px)
- ✅ **Layer ordering**: Markery (zIndex: 20) nad trasą (zIndex: 10)
- ✅ **Error handling**: Alert gdy OSRM nie odpowiada
- ✅ **Console logging**: Dokładne logi dla debugowania
- ✅ **City switching clears waypoints**: Zmiana miasta czyści markery i trasę

## Manual Testing Scenarios

### Scenario 1: Basic 2-point route (Rynek → Wawel)

- Point 1: Kliknięto Rynek Główny (19.9385, 50.0647)
- Point 2: Kliknięto Wawel (19.9353, 50.0540)
- Result: ✅ Trasa wyznaczona (~1.2 km, ~15 min)

### Scenario 2: Multi-point route (3+ points)

- Point 1: Rynek
- Point 2: Wawel
- Point 3: Kazimierz
- Result: ✅ Trasa przez wszystkie punkty

### Scenario 3: Maximum waypoints

- Added 10 markers across Kraków
- Result: ✅ 10th marker added, 11th blocked with alert

### Scenario 4: City change clears route

- Added 3 markers in Kraków with route
- Changed city to Warszawa
- Result: ✅ All markers and route cleared

## API Integration

### OSRM Request Format

```
GET http://localhost:5001/route/v1/foot/lon1,lat1;lon2,lat2;...?overview=full&steps=true
```

### OSRM Response

- Code: "Ok"
- Routes array with geometry (encoded polyline)
- Distance in meters
- Duration in seconds

### Error Handling

- Network errors: Caught and alerted to user
- OSRM down: "Nie można wyznaczyć trasy. Upewnij się, że serwer OSRM działa na porcie 5001"
- Invalid coordinates: Handled by OSRM (returns error code)

## Performance

- Marker rendering: Instant
- Route calculation: ~50-100ms (local OSRM)
- Route rendering: Instant
- No lag or UI blocking

## Summary

**Status:** ✅ ALL ACCEPTANCE CRITERIA PASSED

**Implementation Complete:**

- js/routing.js: OSRM API communication, route display, polyline decoding
- js/ui.js: Marker management, click handlers, waypoint array
- js/map.js: Integration, UI initialization, city switch clearing
- index.html: Script tags added in correct order

**Files created:**

- frontend/js/routing.js (161 lines)
- frontend/js/ui.js (120 lines)

**Files modified:**

- frontend/index.html: Added routing.js and ui.js script tags
- frontend/js/map.js: Added UI initialization and clearWaypoints on city change

**Ready for:** US 2.2 (Przesuwanie Punktów - Drag & Drop)

**Dependencies working:**

- OpenLayers 10.2.1: ✅
- OSRM Backend (port 5001): ✅
- Tailwind CSS: ✅

## Notes

- Route is walking profile (foot) as per requirements
- Markers are non-draggable in this US (will be in US 2.2)
- Steps from OSRM are requested but not displayed yet (will be in US 3.3)
- No route info panel yet (distance/duration in console only, UI in US 3.2)
