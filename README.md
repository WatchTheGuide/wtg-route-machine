# WTG Route Machine - City Walking Tours

Lekka i wydajna instancja OpenSourceRoutingMachine (OSRM) dedykowana do **pieszych wycieczek po mieście**. System zoptymalizowany pod kątem wdrożenia w chmurze AWS poprzez pracę na wycinkach map (miasta) zamiast pełnych map krajów.

## Architektura Projektu

Projekt składa się z dwóch głównych części:

### 🖥️ Backend (`backend/`)

Serwer OSRM z infrastrukturą Docker, skryptami automatyzacji i danymi map.

**Główne komponenty:**

- Docker/Docker Compose dla OSRM
- Skrypty bash do zarządzania mapami i serwerami
- Profile routingu (foot, car, bike)
- Dane map OSM i przetworzone pliki OSRM

**Zobacz:** [`backend/README.md`](backend/README.md)

### 🌐 Frontend (`frontend/`)

Interfejs webowy do testowania i demonstracji routingu.

**Główne komponenty:**

- OpenLayers 9.x - interaktywna mapa
- Tailwind CSS - stylowanie
- Vanilla JS - routing i UI
- OpenStreetMap tiles

**Zobacz:** [`frontend/README.md`](frontend/README.md)

## Wymagania

### Backend

- Docker i Docker Compose
- wget (do pobierania map)
- osmium-tool (do wycinania map miast)
  - macOS: `brew install osmium-tool`
  - Ubuntu: `sudo apt-get install osmium-tool`
- Min. 2GB RAM (dla pojedynczego miasta)
- Min. 5GB wolnego miejsca na dysku

### Frontend

- Nowoczesna przeglądarka (Chrome 90+, Firefox 88+, Safari 14+)
- Python 3 (opcjonalnie, dla serwera HTTP)

## Szybki Start

### Backend - Uruchomienie Serwera OSRM

#### 1. Pobierz mapę województwa

```bash
cd backend
./scripts/download-map.sh malopolskie
```

Dostępne regiony: `poland`, `malopolskie`, `mazowieckie`, `pomorskie`, `dolnoslaskie`, `europe`

#### 2. Wytnij mapę miasta

```bash
./scripts/extract-city.sh malopolskie krakow
```

Dostępne miasta:

- `krakow` (z małopolskiego)
- `warszawa` (z mazowieckiego)
- `trojmiasto` (z pomorskiego)
- `wroclaw` (z dolnośląskiego)

#### 3. Przetwórz dane dla OSRM

```bash
./scripts/prepare-city-osrm.sh krakow foot
```

Profile: `foot` (domyślny), `bicycle`, `car`

#### 4. Uruchom serwer dla miasta

```bash
./scripts/run-city-server.sh krakow 5001
```

Serwer będzie dostępny pod adresem: `http://localhost:5001`

#### 5. Testowanie API

**Przykład: Najbliższy punkt (Rynek Główny w Krakowie)**

```bash
curl "http://localhost:5001/nearest/v1/foot/19.9385,50.0647"
```

**Przykład: Trasa piesza (Rynek → Wawel)**

```bash
curl "http://localhost:5001/route/v1/foot/19.9385,50.0647;19.9353,50.0540?overview=full&steps=true"
```

### Frontend - Uruchomienie Interfejsu Webowego

#### 1. Upewnij się, że backend działa

```bash
# Sprawdź czy serwer OSRM jest uruchomiony
docker ps | grep osrm-krakow
```

#### 2. Otwórz interfejs webowy

**Metoda A: Bezpośrednio w przeglądarce**

```bash
open frontend/index.html
```

**Metoda B: Prosty serwer HTTP (zalecane)**

```bash
cd frontend
python3 -m http.server 8000
# Otwórz: http://localhost:8000
```

#### 3. Testuj funkcjonalności

- Klikaj na mapę, aby dodać punkty trasy
- Przeciągaj markery, aby zmienić lokalizacje
- Wybierz różne miasta z dropdown
- Eksportuj trasę do GeoJSON

## Struktura Projektu

```
wtg-route-machine/
├── backend/                    # Backend OSRM
│   ├── docker/                # Niestandardowe Dockerfile
│   ├── docker-compose.yml     # Konfiguracja Docker
│   ├── osrm-data/            # Dane map i pliki OSRM
│   ├── osrm-profiles/        # Profile routingu
│   ├── scripts/              # Skrypty automatyzacji
│   └── README.md             # Dokumentacja backend
├── frontend/                  # Interfejs webowy
│   ├── css/                  # Style
│   ├── js/                   # JavaScript (map, routing, ui)
│   ├── assets/               # Zasoby (markery, ikony)
│   ├── index.html            # Główna strona
│   └── README.md             # Dokumentacja frontend
├── project_documentation/     # Dokumentacja projektu
│   ├── REQUIREMENTS.md       # Wymagania projektu
│   └── WEB_REQUIREMENTS.md   # Wymagania frontend
├── user_stories/             # User stories
│   └── web_interface.md      # Stories dla interfejsu web
└── .github/
    └── copilot-instructions.md  # Wytyczne dla developerów
```

## Zarządzanie Serwerami Miast

**Sprawdzenie działających serwerów:**

```bash
docker ps | grep osrm
```

**Logi serwera:**

```bash
docker logs -f osrm-krakow
```

**Zatrzymanie serwera:**

```bash
docker stop osrm-krakow
```

**Usunięcie kontenera:**

```bash
docker rm osrm-krakow
```

## Workflow dla Wielu Miast

Możesz uruchomić wiele serwerów jednocześnie dla różnych miast:

Możesz uruchomić wiele serwerów jednocześnie dla różnych miast:

```bash
cd backend

# Kraków na porcie 5001
./scripts/run-city-server.sh krakow 5001

# Warszawa na porcie 5002
./scripts/run-city-server.sh warszawa 5002

# Wrocław na porcie 5003
./scripts/run-city-server.sh wroclaw 5003
```

## Oszczędność Zasobów

Porównanie rozmiaru danych (przykład: Kraków vs Małopolska):

| Metryka                          | Całe Województwo | Tylko Kraków | Oszczędność |
| -------------------------------- | ---------------- | ------------ | ----------- |
| Plik źródłowy (.pbf)             | 193 MB           | 36 MB        | **-81%**    |
| Przetworzone dane OSRM           | ~500 MB          | ~180 MB      | **-64%**    |
| RAM (peak podczas przetwarzania) | 619 MB           | 240 MB       | **-61%**    |
| Liczba węzłów                    | 3,770,974        | 683,281      | **-82%**    |

## Dokumentacja API

Pełna dokumentacja OSRM API: https://project-osrm.org/docs/v5.24.0/api/

### Główne Endpointy

- `/route/v1/{profile}/{coordinates}` - Wyznaczanie trasy
- `/table/v1/{profile}/{coordinates}` - Macierz odległości
- `/match/v1/{profile}/{coordinates}` - Map matching (dopasowanie GPS do drogi)
- `/nearest/v1/{profile}/{coordinates}` - Najbliższy punkt na sieci drogowej

## Troubleshooting

**Problem: osmium-tool nie jest zainstalowany**

- Rozwiązanie:
  - macOS: `brew install osmium-tool`
  - Ubuntu: `sudo apt-get install osmium-tool`

**Problem: Brak pliku map.osm.pbf**

- Rozwiązanie: `cd backend && ./scripts/download-map.sh [region]`

**Problem: Brak wyciętej mapy miasta**

- Rozwiązanie: `cd backend && ./scripts/extract-city.sh [region] [city]`

**Problem: Port już zajęty**

- Rozwiązanie: Użyj innego portu, np. `cd backend && ./scripts/run-city-server.sh krakow 5002`

**Problem: Błąd pamięci podczas przetwarzania**

- Zwiększ pamięć dla Docker Desktop (min. 4GB)
- Użyj mniejszego obszaru miasta (zmodyfikuj bbox w `extract-city.sh`)

## Dodawanie Nowych Miast

Aby dodać nowe miasto, edytuj plik `backend/scripts/extract-city.sh` i dodaj nowy wpis w sekcji `case`:

```bash
    poznan)
        BBOX="16.8,52.3,17.0,52.5"  # Poznań z okolicami
        ;;
```

Współrzędne bbox można znaleźć na: https://boundingbox.klokantech.com/

## Więcej Informacji

- **Backend**: Zobacz [`backend/README.md`](backend/README.md) - dokumentacja OSRM, API, deployment
- **Frontend**: Zobacz [`frontend/README.md`](frontend/README.md) - dokumentacja interfejsu webowego
- **Wymagania**: Zobacz [`project_documentation/REQUIREMENTS.md`](project_documentation/REQUIREMENTS.md)
- **User Stories**: Zobacz [`user_stories/web_interface.md`](user_stories/web_interface.md)

## Licencja

Projekt wykorzystuje OSRM (Open Source Routing Machine) na licencji BSD.
