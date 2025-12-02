# Web Interface Requirements - WTG Route Machine

## 1. Cel

Stworzenie prostej, interaktywnej strony WWW do testowania i demonstracji funkcjonalności OSRM dla pieszych wycieczek po mieście. Strona ma służyć jako narzędzie deweloperskie i showcase dla lokalnych testów.

## 2. Technologie

### Frontend
- **Mapa**: OpenLayers 9.x - nowoczesna biblioteka mapowa z pełnym wsparciem dla OSM
- **Warstwa mapowa**: OpenStreetMap tiles (tile.openstreetmap.org)
- **Stylowanie**: Vanilla CSS (bez frameworków) - prostota i szybkość
- **JavaScript**: Vanilla JS (ES6+) - bez dodatkowych zależności
- **Build**: Brak - proste pliki HTML/CSS/JS gotowe do otwarcia w przeglądarce

### Backend Integration
- **OSRM API**: Bezpośrednie połączenie z lokalnym serwerem (localhost:5001)
- **CORS**: Serwer lokalny - brak problemów z CORS

## 3. Wymagania Funkcjonalne

### 3.1. Wyświetlanie Mapy
- Interaktywna mapa z OSM tiles
- Domyślny widok: Kraków (19.9385, 50.0647, zoom: 14)
- Kontrolki: zoom, pełny ekran, skala
- Responsive design - dostosowanie do różnych rozdzielczości

### 3.2. Dodawanie Punktów Trasy
- **Kliknięcie na mapę** dodaje punkt trasy (marker)
- **Minimum 2 punkty** do wyznaczenia trasy
- **Maksimum 10 punktów** (ograniczenie dla czytelności)
- **Numerowane markery** (1, 2, 3, ...) pokazujące kolejność
- **Drag & drop markerów** - możliwość przesuwania punktów
- **Usuwanie punktów** - kliknięcie prawym przyciskiem lub przycisk "X"

### 3.3. Wyznaczanie Trasy
- **Automatyczne przeliczanie** po dodaniu/przesunięciu/usunięciu punktu
- **Wyświetlanie trasy** na mapie (linia polilinearna)
- **Profil**: foot (pieszy) - zgodnie z celem projektu
- **Opcje**:
  - `overview=full` - pełna geometria trasy
  - `steps=true` - instrukcje nawigacyjne

### 3.4. Wyświetlanie Informacji o Trasie
- **Dystans całkowity** (w km)
- **Czas przejścia** (w minutach/godzinach)
- **Lista instrukcji nawigacyjnych** (turn-by-turn)
  - Nazwa ulicy
  - Kierunek (skręć w lewo/prawo, idź prosto)
  - Dystans do następnego manewru

### 3.5. Dodatkowe Funkcje
- **Wyczyść wszystko** - usuń wszystkie punkty i trasę
- **Eksport trasy** - pobierz jako GeoJSON
- **Zmiana miasta** - dropdown z wyborem (Kraków, Warszawa, Wrocław, Trójmiasto)
  - Automatyczna zmiana portu API (5001, 5002, 5003, 5004)
  - Automatyczne wyśrodkowanie mapy na wybrane miasto

## 4. Wymagania Niefunkcjonalne

### 4.1. Wydajność
- Czas ładowania strony: < 2s
- Czas odpowiedzi OSRM API: < 100ms (dla tras lokalnych)
- Płynne animacje i interakcje (60 FPS)

### 4.2. UX/UI
- Minimalistyczny, czysty interfejs
- Intuicyjna obsługa (brak instrukcji)
- Responsywność (desktop i tablet)
- Komunikaty o błędach (brak połączenia z API, za dużo punktów, etc.)

### 4.3. Kompatybilność
- Nowoczesne przeglądarki (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Brak wsparcia dla IE11

## 5. Struktura Projektu

```
web/
├── index.html              # Główna strona
├── css/
│   └── style.css          # Stylowanie
├── js/
│   ├── map.js             # Inicjalizacja mapy (OpenLayers)
│   ├── routing.js         # Komunikacja z OSRM API
│   └── ui.js              # Obsługa UI i interakcji
└── assets/
    └── markers/           # Ikony markerów (opcjonalnie)
```

## 6. Interfejs Użytkownika (Mockup)

```
+--------------------------------------------------+
|  [WTG Route Machine - City Walking Tours]        |
+--------------------------------------------------+
|                                                   |
|  [City: Kraków ▼]  [Clear All]  [Export GeoJSON] |
|                                                   |
|  +--------------------------------------------+   |
|  |                                            |   |
|  |           MAPA (OpenLayers + OSM)          |   |
|  |                                            |   |
|  |    Markers: 1, 2, 3 (draggable)           |   |
|  |    Route: polyline                         |   |
|  |                                            |   |
|  +--------------------------------------------+   |
|                                                   |
|  Route Info:                                     |
|  ┌──────────────────────────────────────────┐   |
|  │ Distance: 2.5 km                         │   |
|  │ Duration: 30 min                         │   |
|  │                                          │   |
|  │ Directions:                              │   |
|  │ 1. Head south on Sławkowska (50m)       │   |
|  │ 2. Turn right onto Grodzka (200m)       │   |
|  │ 3. Continue to Wawel Castle             │   |
|  └──────────────────────────────────────────┘   |
+--------------------------------------------------+
```

## 7. API Endpoints (OSRM)

### Route Service
```
GET http://localhost:{PORT}/route/v1/foot/{lon1},{lat1};{lon2},{lat2};...?overview=full&steps=true
```

**Response:**
```json
{
  "code": "Ok",
  "routes": [{
    "distance": 2500.5,
    "duration": 1800.2,
    "geometry": {...},
    "legs": [{
      "steps": [{
        "name": "Sławkowska",
        "maneuver": {...},
        "distance": 50.0
      }]
    }]
  }]
}
```

## 8. Walidacja i Testowanie

### Testy Manualne
1. Dodanie 2 punktów → wyświetlenie trasy
2. Dodanie 3+ punktów → aktualizacja trasy
3. Przesunięcie markera → przeliczenie trasy
4. Usunięcie punktu → aktualizacja trasy
5. Zmiana miasta → zmiana widoku i portu API
6. Eksport GeoJSON → poprawność pliku

### Scenariusze Testowe
- Trasa przez centrum Krakowa (Rynek → Wawel → Kazimierz)
- Trasa z wieloma punktami pośrednimi (>5)
- Brak połączenia z OSRM (serwer wyłączony)
- Punkty poza obszarem miasta (bbox)

## 9. Dokumentacja dla Użytkownika

W pliku `web/README.md`:
- Jak uruchomić (otwarcie `index.html` w przeglądarce)
- Jak używać (klikanie, przeciąganie markerów)
- Jak uruchomić serwer OSRM dla danego miasta
- Troubleshooting (CORS, brak połączenia)

## 10. Fazy Implementacji

### Faza 1: MVP (Minimum Viable Product)
- [ ] Wyświetlanie mapy OSM z OpenLayers
- [ ] Dodawanie punktów kliknięciem
- [ ] Wyznaczanie trasy (OSRM API)
- [ ] Wyświetlanie podstawowych informacji (dystans, czas)

### Faza 2: Interakcje
- [ ] Drag & drop markerów
- [ ] Usuwanie punktów
- [ ] Numerowane markery
- [ ] Przycisk "Clear All"

### Faza 3: Rozszerzenia
- [ ] Instrukcje nawigacyjne (turn-by-turn)
- [ ] Zmiana miasta (dropdown)
- [ ] Eksport GeoJSON
- [ ] Obsługa błędów i walidacja

## 11. Przyszłe Rozszerzenia (Nice-to-Have)

- Zapisywanie tras w localStorage
- Udostępnianie tras (URL z parametrami)
- Obliczanie wysokości trasy (elevation profile)
- Integracja z Mapbox dla lepszych stylów map
- PWA (Progressive Web App) - offline support
- Wyszukiwarka adresów (Nominatim)

## 12. Uwagi Techniczne

- **OpenLayers vs Leaflet**: OpenLayers wybrane ze względu na lepsze wsparcie dla złożonych operacji GIS i brak zewnętrznych zależności dla podstawowych funkcji
- **Brak node_modules**: Użycie CDN dla OpenLayers (jsDelivr lub unpkg)
- **Prostota**: Projekt ma być gotowy do uruchomienia "out of the box" bez instalacji npm/yarn
- **Lokalny development**: Nie wymaga serwera HTTP (file:// protocol OK), ale zalecany jest prosty serwer (np. `python -m http.server`)
