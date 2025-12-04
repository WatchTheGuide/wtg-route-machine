# Epic 3: Backend Multi-City

**Cel:** Rozszerzyć backend OSRM o obsługę wielu miast Polski.

**Priorytet:** 🔴 Wysoki

**Zależności:** Brak (może być realizowany równolegle z Epic 1)

---

## US 3.1: Pobranie i ekstrakcja danych dla nowych miast

**Jako** deweloper  
**Chcę** pobrać i przetworzyć dane OSM dla Warszawy, Wrocławia i Trójmiasta  
**Aby** mieć dane routingowe dla każdego miasta

### Kryteria akceptacji:

- [ ] Skrypt `download-map.sh` rozszerzony o nowe regiony
- [ ] Skrypt `extract-city.sh` z bbox dla każdego miasta
- [ ] Dane pobrane z Geofabrik dla: mazowieckie, dolnoslaskie, pomorskie
- [ ] Miasta wyekstrahowane z odpowiednimi granicami

### Miasta i ich bounding boxy:

| Miasto     | Region       | Bbox (minLon, minLat, maxLon, maxLat) |
| ---------- | ------------ | ------------------------------------- |
| Kraków     | małopolskie  | 19.80, 49.97, 20.15, 50.13            |
| Warszawa   | mazowieckie  | 20.85, 52.10, 21.25, 52.37            |
| Wrocław    | dolnośląskie | 16.85, 51.00, 17.20, 51.22            |
| Trójmiasto | pomorskie    | 18.35, 54.28, 18.85, 54.55            |

### Komendy:

```bash
# Pobieranie regionów
./scripts/download-map.sh mazowieckie
./scripts/download-map.sh dolnoslaskie
./scripts/download-map.sh pomorskie

# Ekstrakcja miast
./scripts/extract-city.sh mazowieckie warszawa
./scripts/extract-city.sh dolnoslaskie wroclaw
./scripts/extract-city.sh pomorskie trojmiasto
```

---

## US 3.2: Przetwarzanie danych OSRM dla każdego miasta

**Jako** deweloper  
**Chcę** przetworzyć dane OSRM dla każdego miasta i profilu  
**Aby** kontenery routingowe mogły obsługiwać zapytania

### Kryteria akceptacji:

- [ ] Dane przetworzone dla 4 miast × 3 profile = 12 zestawów danych
- [ ] Profile: foot, bicycle, car
- [ ] Pliki `.osrm.*` wygenerowane dla każdej kombinacji
- [ ] Dane zoptymalizowane pod kątem pamięci (MLD algorithm)

### Komendy:

```bash
# Dla każdego miasta
for city in krakow warszawa wroclaw trojmiasto; do
  for profile in foot bicycle car; do
    ./scripts/prepare-city-osrm.sh $city $profile
  done
done
```

### Szacowany czas przetwarzania:

- Kraków: ~15 min (już gotowy)
- Warszawa: ~25 min (większe miasto)
- Wrocław: ~15 min
- Trójmiasto: ~20 min

---

## US 3.3: Kontenery Docker dla każdego miasta

**Jako** deweloper  
**Chcę** uruchomić kontenery OSRM dla każdego miasta  
**Aby** zapewnić izolację i skalowalność

### Kryteria akceptacji:

- [ ] Docker Compose z 12 kontenerami (4 miasta × 3 profile)
- [ ] Nazewnictwo: `osrm-{miasto}-{profil}`
- [ ] Porty przydzielone systematycznie
- [ ] Health checks dla każdego kontenera
- [ ] Automatyczny restart przy awarii

### Mapowanie portów:

| Miasto     | Foot | Bicycle | Car  |
| ---------- | ---- | ------- | ---- |
| Kraków     | 5001 | 5002    | 5003 |
| Warszawa   | 5011 | 5012    | 5013 |
| Wrocław    | 5021 | 5022    | 5023 |
| Trójmiasto | 5031 | 5032    | 5033 |

### Docker Compose struktura:

```yaml
services:
  osrm-krakow-foot:
    image: ghcr.io/project-osrm/osrm-backend:latest
    ports:
      - '5001:5000'
    volumes:
      - ./osrm-data:/data
    command: osrm-routed /data/krakow-foot.osrm --max-table-size=1000

  osrm-warszawa-foot:
    image: ghcr.io/project-osrm/osrm-backend:latest
    ports:
      - '5011:5000'
    volumes:
      - ./osrm-data:/data
    command: osrm-routed /data/warszawa-foot.osrm --max-table-size=1000
  # ... pozostałe kontenery
```

---

## US 3.4: Nginx routing per miasto

**Jako** deweloper  
**Chcę** skonfigurować Nginx do routingu zapytań per miasto  
**Aby** frontend mógł wysyłać zapytania do jednego endpointu

### Kryteria akceptacji:

- [ ] Endpointy: `/api/{city}/{profile}/route/...`
- [ ] Np. `/api/warszawa/foot/route/v1/foot/...`
- [ ] Zachowane API key authentication
- [ ] Health check per miasto: `/health/{city}`
- [ ] Rate limiting per miasto

### Konfiguracja Nginx:

```nginx
# Upstreams per miasto
upstream osrm_krakow_foot { server localhost:5001; }
upstream osrm_krakow_bicycle { server localhost:5002; }
upstream osrm_krakow_car { server localhost:5003; }

upstream osrm_warszawa_foot { server localhost:5011; }
upstream osrm_warszawa_bicycle { server localhost:5012; }
upstream osrm_warszawa_car { server localhost:5013; }

# ... pozostałe upstreams

# Location blocks
location /api/krakow/foot/ {
    # API key validation
    if ($api_client_name = "unauthorized") {
        return 401 '{"error": "Unauthorized"}';
    }
    rewrite ^/api/krakow/foot/(.*)$ /$1 break;
    proxy_pass http://osrm_krakow_foot;
}

location /api/warszawa/foot/ {
    # ...
}
```

---

## US 3.5: Skrypty automatyzacji deploymentu

**Jako** deweloper  
**Chcę** mieć skrypty do automatycznego deploymentu nowych miast  
**Aby** łatwo dodawać kolejne miasta w przyszłości

### Kryteria akceptacji:

- [ ] Skrypt `deploy-city.sh {miasto} {region}` - pełny pipeline
- [ ] Skrypt `add-city-to-nginx.sh {miasto}` - aktualizacja Nginx
- [ ] Dokumentacja procesu dodawania nowego miasta
- [ ] Rollback w przypadku błędu

### Pipeline dla nowego miasta:

```bash
#!/bin/bash
# deploy-city.sh

CITY=$1
REGION=$2

echo "=== Deploying $CITY from $REGION ==="

# 1. Pobierz mapę regionu (jeśli nie istnieje)
./scripts/download-map.sh $REGION

# 2. Wyekstrahuj miasto
./scripts/extract-city.sh $REGION $CITY

# 3. Przetwórz dla każdego profilu
for profile in foot bicycle car; do
  ./scripts/prepare-city-osrm.sh $CITY $profile
done

# 4. Uruchom kontenery
./scripts/run-city-servers.sh $CITY

# 5. Zaktualizuj Nginx
./scripts/add-city-to-nginx.sh $CITY

# 6. Zweryfikuj
./scripts/verify-city.sh $CITY

echo "=== $CITY deployed successfully ==="
```

---

## Estymacja

| User Story | Story Points | Dni robocze |
| ---------- | ------------ | ----------- |
| US 3.1     | 3            | 1           |
| US 3.2     | 5            | 2           |
| US 3.3     | 5            | 1           |
| US 3.4     | 5            | 1           |
| US 3.5     | 3            | 1           |
| **Razem**  | **21**       | **6**       |

---

## Wymagania infrastrukturalne

### Pamięć RAM (szacunkowo):

- Każdy kontener OSRM: ~200-400 MB
- 12 kontenerów: ~3-5 GB RAM
- Zalecana instancja: t3.medium (4 GB) lub t3.large (8 GB)

### Dysk:

- Dane OSRM per miasto: ~200-500 MB
- 4 miasta × 3 profile: ~3-6 GB
- Mapy źródłowe (PBF): ~1-2 GB
- Razem: ~10 GB

---

## Definicja ukończenia (DoD)

- [ ] Wszystkie 12 kontenerów uruchomione i zdrowe
- [ ] API działa dla każdego miasta i profilu
- [ ] Testy integracyjne przechodzą
- [ ] Dokumentacja deploymentu
- [ ] Monitoring (health checks)
