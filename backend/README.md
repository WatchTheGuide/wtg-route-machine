# Backend - WTG Route Machine

Backend OSRM (Open Source Routing Machine) zoptymalizowany pod routing pieszy w miastach Polski.

## Struktura

```
backend/
├── docker/                 # Niestandardowe Dockerfile (opcjonalnie)
├── docker-compose.yml      # Konfiguracja Docker Compose
├── osrm-data/             # Dane map i przetworzone pliki OSRM
├── osrm-profiles/         # Profile routingu (foot, car, bike)
└── scripts/               # Skrypty automatyzacji
    ├── download-map.sh
    ├── extract-city.sh
    ├── prepare-city-osrm.sh
    ├── prepare-osrm.sh
    └── run-city-server.sh
```

## Wymagania

- Docker 20.10+
- Docker Compose 2.0+
- osmium-tool 1.18+ (dla ekstrakcji miast)
- ~2GB wolnej pamięci RAM (na miasto)
- ~500MB wolnego miejsca na dysku (na miasto)

## Quick Start

### 1. Pobierz mapę województwa

```bash
./scripts/download-map.sh malopolskie
```

### 2. Wyekstrahuj miasto

```bash
./scripts/extract-city.sh malopolskie krakow
```

### 3. Przygotuj dane OSRM

```bash
./scripts/prepare-city-osrm.sh krakow foot
```

### 4. Uruchom serwer

```bash
./scripts/run-city-server.sh krakow 5001
```

### 5. Testuj API

```bash
# Nearest point
curl "http://localhost:5001/nearest/v1/foot/19.9385,50.0647"

# Route
curl "http://localhost:5001/route/v1/foot/19.9450,50.0614;19.9385,50.0647?overview=full"
```

## Obsługiwane miasta

| Miasto     | Województwo  | Bbox                   | Port |
| ---------- | ------------ | ---------------------- | ---- |
| Kraków     | małopolskie  | 19.8,49.95,20.25,50.15 | 5001 |
| Warszawa   | mazowieckie  | 20.85,52.0,21.3,52.4   | 5002 |
| Wrocław    | dolnośląskie | 16.8,51.0,17.2,51.25   | 5003 |
| Trójmiasto | pomorskie    | 18.4,54.3,18.8,54.6    | 5004 |

## OSRM API

### Route Service

Wyznacza trasę między punktami.

**Endpoint:**

```
GET /route/v1/{profile}/{coordinates}?overview={overview}&steps={true|false}
```

**Przykład:**

```bash
curl "http://localhost:5001/route/v1/foot/19.9450,50.0614;19.9385,50.0647?overview=full&steps=true"
```

**Parametry:**

- `profile`: `foot` (pieszy), `car` (samochód), `bike` (rower)
- `coordinates`: lista współrzędnych `lon,lat;lon,lat;...`
- `overview`: `full` (pełna geometria), `simplified`, `false`
- `steps`: `true` (instrukcje nawigacyjne), `false`

**Response:**

```json
{
  "code": "Ok",
  "routes": [{
    "distance": 450.5,
    "duration": 324.4,
    "geometry": {...},
    "legs": [{
      "steps": [{
        "name": "Floriańska",
        "distance": 100.0,
        "duration": 72.0,
        "maneuver": {
          "type": "turn",
          "modifier": "left"
        }
      }]
    }]
  }]
}
```

### Nearest Service

Znajduje najbliższy punkt na sieci dróg.

**Endpoint:**

```
GET /nearest/v1/{profile}/{coordinate}
```

**Przykład:**

```bash
curl "http://localhost:5001/nearest/v1/foot/19.9385,50.0647"
```

## Zarządzanie kontenerami

### Lista uruchomionych serwerów

```bash
docker ps | grep osrm
```

### Zatrzymaj serwer

```bash
docker stop osrm-krakow
docker rm osrm-krakow
```

### Logi serwera

```bash
docker logs osrm-krakow
docker logs -f osrm-krakow  # follow mode
```

## Dodawanie nowego miasta

1. Znajdź bbox na https://boundingbox.klokantech.com/
2. Dodaj miasto do `scripts/extract-city.sh`:
   ```bash
   poznan)
       BBOX="16.8,52.3,17.0,52.5"
       ;;
   ```
3. Pobierz mapę województwa:
   ```bash
   ./scripts/download-map.sh wielkopolskie
   ```
4. Wyekstrahuj miasto:
   ```bash
   ./scripts/extract-city.sh wielkopolskie poznan
   ```
5. Przygotuj OSRM:
   ```bash
   ./scripts/prepare-city-osrm.sh poznan foot
   ```
6. Uruchom serwer:
   ```bash
   ./scripts/run-city-server.sh poznan 5005
   ```

## Optymalizacja

### Pamięć RAM

- **Full region** (np. Małopolskie): ~600MB
- **City extract** (np. Kraków): ~240MB
- **Redukcja**: ~60%

### Rozmiar danych

- **Full region**: ~105MB (.osm.pbf)
- **City extract**: ~20MB (.osm.pbf)
- **Redukcja**: ~81%

### Czas przetwarzania

- **Extract**: ~10s (osmium)
- **OSRM pipeline**: ~2-3min (miasto)

## Troubleshooting

### Kontener się nie uruchamia

```bash
# Sprawdź czy port jest wolny
lsof -i :5001

# Sprawdź czy pliki OSRM istnieją
ls -lh osrm-data/krakow.osrm*

# Sprawdź logi
docker logs osrm-krakow
```

### Brak trasy między punktami

- Sprawdź czy punkty są w bboxie miasta
- Sprawdź czy istnieje droga piesza między punktami
- Użyj `/nearest` endpoint do znalezienia najbliższego punktu na sieci

### osmium: command not found

```bash
# macOS
brew install osmium-tool

# Ubuntu/Debian
sudo apt-get install osmium-tool
```

## Deployment na AWS

Docelowe środowisko: **t3.small** (2 vCPU, 2GB RAM)

1. **EC2 Instance**: t3.small z Amazon Linux 2
2. **Docker**: Instalacja Docker i Docker Compose
3. **Security Group**: Otwórz porty 5001-5004
4. **Persistent Storage**: EBS volume dla `osrm-data/`
5. **Multiple Cities**: Uruchom kilka kontenerów na różnych portach

Szczegóły: Zobacz `../project_documentation/REQUIREMENTS.md`

## Dokumentacja

- **OSRM**: https://project-osrm.org/docs/
- **Osmium**: https://osmcode.org/osmium-tool/
- **Geofabrik**: https://download.geofabrik.de/
