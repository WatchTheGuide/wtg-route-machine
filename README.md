# WTG Route Machine

Własna instancja OpenSourceRoutingMachine (OSRM) z API do wyznaczania tras.

## Wymagania

- Docker i Docker Compose
- wget (do pobierania map)
- Min. 4GB RAM (zależnie od rozmiaru mapy)
- Min. 10GB wolnego miejsca na dysku

## Szybki Start

### 1. Pobierz dane mapy

```bash
./scripts/download-map.sh poland
```

Dostępne regiony: `poland`, `mazowieckie`, `europe`

### 2. Przetwórz dane dla OSRM

```bash
./scripts/prepare-osrm.sh car
```

Dostępne profile: `car`, `bike`, `foot`

### 3. Uruchom serwer OSRM

```bash
docker-compose up -d
```

Serwer będzie dostępny pod adresem: `http://localhost:5000`

### 4. Testowanie API

**Przykład: Wyznaczanie trasy**

```bash
curl "http://localhost:5000/route/v1/driving/21.0122,52.2297;16.9252,52.4064?overview=full&steps=true"
```

**Przykład: Macierz odległości**

```bash
curl "http://localhost:5000/table/v1/driving/21.0122,52.2297;16.9252,52.4064;18.6466,54.3520"
```

**Przykład: Najbliższy punkt na drodze**

```bash
curl "http://localhost:5000/nearest/v1/driving/21.0122,52.2297"
```

## Struktura Projektu

```
wtg-route-machine/
├── docker-compose.yml          # Konfiguracja Docker Compose
├── osrm-data/                  # Dane map OSM i przetworzone pliki OSRM
├── osrm-profiles/              # Własne profile routingowe (opcjonalnie)
├── scripts/
│   ├── download-map.sh         # Skrypt do pobierania map
│   └── prepare-osrm.sh         # Skrypt do przetwarzania danych
└── project_documentation/
    └── REQUIREMENTS.md         # Wymagania projektu
```

## Zarządzanie

**Sprawdzenie statusu:**

```bash
docker-compose ps
```

**Logi serwera:**

```bash
docker-compose logs -f osrm-backend
```

**Zatrzymanie serwera:**

```bash
docker-compose down
```

**Restart serwera:**

```bash
docker-compose restart
```

## Aktualizacja Danych

Aby zaktualizować dane mapy:

1. Zatrzymaj serwer: `docker-compose down`
2. Pobierz nową mapę: `./scripts/download-map.sh poland`
3. Przetwórz dane: `./scripts/prepare-osrm.sh car`
4. Uruchom serwer: `docker-compose up -d`

## Dokumentacja API

Pełna dokumentacja OSRM API: https://project-osrm.org/docs/v5.24.0/api/

## Troubleshooting

**Problem: Brak pliku map.osrm**

- Rozwiązanie: Uruchom `./scripts/prepare-osrm.sh car`

**Problem: Kontener się nie uruchamia**

- Sprawdź logi: `docker-compose logs osrm-backend`
- Sprawdź czy dane są przetworzone: `ls -lh osrm-data/`

**Problem: Błąd pamięci podczas przetwarzania**

- Zwiększ pamięć dla Docker Desktop (min. 4GB)
- Użyj mniejszego regionu mapy

## Licencja

Projekt wykorzystuje OSRM (Open Source Routing Machine) na licencji BSD.
