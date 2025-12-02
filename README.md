# WTG Route Machine - City Walking Tours

Lekka i wydajna instancja OpenSourceRoutingMachine (OSRM) dedykowana do **pieszych wycieczek po mieście**. System zoptymalizowany pod kątem wdrożenia w chmurze AWS poprzez pracę na wycinkach map (miasta) zamiast pełnych map krajów.

## Wymagania

- Docker i Docker Compose
- wget (do pobierania map)
- osmium-tool (do wycinania map miast)
  - macOS: `brew install osmium-tool`
  - Ubuntu: `sudo apt-get install osmium-tool`
- Min. 2GB RAM (dla pojedynczego miasta)
- Min. 5GB wolnego miejsca na dysku

## Szybki Start - Praca z Miastami

### 1. Pobierz mapę województwa

```bash
./scripts/download-map.sh malopolskie
```

Dostępne regiony: `poland`, `malopolskie`, `europe`

### 2. Wytnij mapę miasta

```bash
./scripts/extract-city.sh malopolskie krakow
```

Dostępne miasta:
- `krakow` (z małopolskiego)
- `warszawa` (z mazowieckiego)
- `trojmiasto` (z pomorskiego)
- `wroclaw` (z dolnośląskiego)

### 3. Przetwórz dane dla OSRM

```bash
./scripts/prepare-city-osrm.sh krakow foot
```

Profile: `foot` (domyślny), `bicycle`, `car`

### 4. Uruchom serwer dla miasta

```bash
./scripts/run-city-server.sh krakow 5001
```

Serwer będzie dostępny pod adresem: `http://localhost:5001`

### 5. Testowanie API

**Przykład: Najbliższy punkt (Rynek Główny w Krakowie)**
```bash
curl "http://localhost:5001/nearest/v1/foot/19.9385,50.0647"
```

**Przykład: Trasa piesza (Rynek → Wawel)**
```bash
curl "http://localhost:5001/route/v1/foot/19.9385,50.0647;19.9353,50.0540?overview=full&steps=true"
```

**Przykład: Macierz odległości (Rynek, Wawel, AGH)**
```bash
curl "http://localhost:5001/table/v1/foot/19.9385,50.0647;19.9353,50.0540;19.9133,50.0664"
```

## Struktura Projektu

```
wtg-route-machine/
├── docker-compose.yml          # Konfiguracja Docker Compose (legacy)
├── osrm-data/                  # Dane map OSM i przetworzone pliki OSRM
│   ├── map.osm.pbf            # Pełna mapa województwa
│   ├── krakow.osm.pbf         # Wycięta mapa miasta
│   └── krakow.osrm.*          # Przetworzone dane OSRM
├── osrm-profiles/              # Własne profile routingowe (opcjonalnie)
├── scripts/
│   ├── download-map.sh         # Pobieranie map województw
│   ├── extract-city.sh         # Wycinanie map miast
│   ├── prepare-city-osrm.sh    # Przetwarzanie danych miasta
│   └── run-city-server.sh      # Uruchamianie serwera dla miasta
└── project_documentation/
    └── REQUIREMENTS.md         # Wymagania projektu
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

```bash
# Kraków na porcie 5001
./scripts/run-city-server.sh krakow 5001

# Warszawa na porcie 5002
./scripts/run-city-server.sh warszawa 5002

# Wrocław na porcie 5003
./scripts/run-city-server.sh wroclaw 5003
```

## Oszczędność Zasobów

Porównanie rozmiaru danych (przykład: Kraków vs Małopolska):

| Metryka | Całe Województwo | Tylko Kraków | Oszczędność |
|---------|------------------|--------------|-------------|
| Plik źródłowy (.pbf) | 193 MB | 36 MB | **-81%** |
| Przetworzone dane OSRM | ~500 MB | ~180 MB | **-64%** |
| RAM (peak podczas przetwarzania) | 619 MB | 240 MB | **-61%** |
| Liczba węzłów | 3,770,974 | 683,281 | **-82%** |

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
- Rozwiązanie: `./scripts/download-map.sh [region]`

**Problem: Brak wyciętej mapy miasta**
- Rozwiązanie: `./scripts/extract-city.sh [region] [city]`

**Problem: Port już zajęty**
- Rozwiązanie: Użyj innego portu, np. `./scripts/run-city-server.sh krakow 5002`

**Problem: Błąd pamięci podczas przetwarzania**
- Zwiększ pamięć dla Docker Desktop (min. 4GB)
- Użyj mniejszego obszaru miasta (zmodyfikuj bbox w `extract-city.sh`)

## Dodawanie Nowych Miast

Aby dodać nowe miasto, edytuj plik `scripts/extract-city.sh` i dodaj nowy wpis w sekcji `case`:

```bash
    poznan)
        BBOX="16.8,52.3,17.0,52.5"  # Poznań z okolicami
        ;;
```

Współrzędne bbox można znaleźć na: https://boundingbox.klokantech.com/

## Licencja

Projekt wykorzystuje OSRM (Open Source Routing Machine) na licencji BSD.
