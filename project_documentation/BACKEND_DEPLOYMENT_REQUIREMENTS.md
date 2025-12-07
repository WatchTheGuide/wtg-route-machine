# Backend Deployment & Security Plan

Dokument ten opisuje strategię wdrożenia backendu WTG Route Machine (OSRM) oraz zabezpieczenia go przed nieautoryzowanym dostępem za pomocą klucza API (API Key).

## 1. Architektura Wdrożenia

Backend składa się z:

1. **OSRM Server (EC2-1)**: Kontenery OSRM dla routingu (12 kontenerów: 4 miasta × 3 profile)
2. **API Server (EC2-2)**: Zunifikowany serwer API obsługujący:
   - `/api/poi/*` - Points of Interest
   - `/api/tours/*` - Curated Tours
   - `/api/admin/*` - Admin Panel API (chronione JWT)

```mermaid
graph LR
    Client[Mobile App / Web / Admin] -->|HTTPS| Nginx[Nginx Reverse Proxy]
    Nginx -->|/api/poi/*| API[API Server :3000]
    Nginx -->|/api/tours/*| API
    Nginx -->|/api/admin/*| API
    API -->|JWT Auth| Auth{Valid Token?}
    Auth -->|No| 401[401 Unauthorized]
    Auth -->|Yes| AdminRoutes[Admin Routes]
```

### Komponenty:

1.  **Nginx Reverse Proxy**:
    - Obsługa SSL/TLS (Let's Encrypt).
    - Routing zapytań do odpowiednich serwisów.
    - Rate limiting (zabezpieczenie przed DDoS).
    - CORS headers dla aplikacji mobilnej/webowej.
2.  **API Server (Unified)**:
    - Port 3000 (wewnętrzny).
    - Node.js + Express + TypeScript.
    - JWT authentication dla Admin API.
    - Zod validation dla request/response.
3.  **Kontenery OSRM** (na osobnym serwerze):
    - Izolowane instancje dla każdego miasta/profilu.
    - Dostępne tylko przez dedykowany serwer OSRM.

## 2. Wymagania Sprzętowe (AWS / VPS)

### EC2-1: OSRM Routing Server

- **CPU**: 2 vCPU (t3.large)
- **RAM**: 8GB (dla 12 kontenerów OSRM)
- **Disk**: 40GB SSD (mapy, pliki OSRM)
- **OS**: Ubuntu 22.04 LTS

### EC2-2: API Server

- **CPU**: 2 vCPU (t3.small)
- **RAM**: 2GB (Node.js API)
- **Disk**: 20GB SSD
- **OS**: Ubuntu 22.04 LTS

**Szacowany koszt miesięczny**: ~$75-80 (t3.large + t3.small)

## 3. Zabezpieczenie API

### OSRM API (osrm.watchtheguide.com)

Aplikacja mobilna wysyła klucz w nagłówku HTTP:
`X-API-Key: twoj-tajny-klucz-produkcyjny`

### Admin API (api.watchtheguide.com/api/admin/\*)

Chronione przez JWT (JSON Web Token):

- Login: `POST /api/admin/auth/login` (email + password)
- Token w nagłówku: `Authorization: Bearer <access_token>`
- Refresh token: `POST /api/admin/auth/refresh`

### Rate Limiting

- OSRM: 10 req/s per IP
- API: 100 req/15min (general), 5 req/15min (auth)

### Konfiguracja Nginx dla OSRM (Snippet)

```nginx
# Definicja kluczy API (można wydzielić do osobnego pliku)
map $http_x_api_key $api_client_name {
    default       "";
    "tajny-klucz-produkcyjny-123"  "mobile_app_v1";
    "klucz-deweloperski-456"       "dev_test";
}

server {
    listen 443 ssl;
    server_name api.wtg-routes.com;

    # SSL Config...

    location / {
        # Sprawdzenie czy klucz jest poprawny
        if ($api_client_name = "") {
            return 401 '{"code": "Unauthorized", "message": "Invalid or missing API Key"}';
        }

        # Routing do odpowiednich kontenerów
        # Foot Profile
        location /route/v1/foot {
            proxy_pass http://osrm-foot:5000;
            proxy_set_header Host $host;
        }

        # Bicycle Profile
        location /route/v1/bicycle {
            proxy_pass http://osrm-bicycle:5000;
            proxy_set_header Host $host;
        }

        # Car Profile
        location /route/v1/car {
            proxy_pass http://osrm-car:5000;
            proxy_set_header Host $host;
        }
    }
}
```

## 4. Procedura Wdrożenia (Deployment Steps)

### Krok 1: Przygotowanie Serwera

1.  Aktualizacja systemu: `apt update && apt upgrade -y`.
2.  Instalacja Dockera i Docker Compose.
3.  Konfiguracja Firewalla (UFW/Security Groups):
    - Allow: 22 (SSH), 80 (HTTP), 443 (HTTPS).
    - Deny: 5001-5003 (bezpośredni dostęp do OSRM zablokowany).

### Krok 2: Pobranie Kodu i Danych

1.  Sklonowanie repozytorium na serwerze.
2.  Pobranie mapy (np. Kraków):
    ```bash
    cd backend
    ./scripts/download-map.sh malopolskie
    ./scripts/extract-city.sh malopolskie krakow
    ```

### Krok 3: Przetwarzanie Danych (Build)

Uruchomienie przetwarzania dla wszystkich profili. To najbardziej obciążający etap.

```bash
# Przykład dla Krakowa
./scripts/prepare-city-osrm.sh krakow foot
./scripts/prepare-city-osrm.sh krakow bicycle
./scripts/prepare-city-osrm.sh krakow car
```

### Krok 4: Uruchomienie Usług

Użyjemy `docker-compose.prod.yml` (który trzeba utworzyć), który zawiera definicję Nginx oraz kontenerów OSRM.

```yaml
version: '3'
services:
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/certs:/etc/letsencrypt
    depends_on:
      - osrm-foot
      - osrm-bicycle
      - osrm-car

  osrm-foot:
    image: ghcr.io/project-osrm/osrm-backend:latest
    command: osrm-routed --algorithm mld /data/krakow-foot.osrm
    volumes:
      - ./osrm-data:/data
    restart: always

  # ... definicje dla bicycle i car
```

### Krok 5: SSL (HTTPS)

Użycie Certbot do wygenerowania darmowego certyfikatu SSL.

```bash
docker run -it --rm --name certbot \
  -v "/etc/letsencrypt:/etc/letsencrypt" \
  -v "/var/lib/letsencrypt:/var/lib/letsencrypt" \
  certbot/certbot certonly --standalone -d api.twoja-domena.com
```

## 5. Monitoring i Logi

- **Logi Nginx**: Kluczowe do monitorowania prób nieautoryzowanego dostępu.
- **Docker Stats**: Monitorowanie zużycia RAM przez kontenery OSRM.
- **Uptime Robot**: Zewnętrzny monitoring dostępności API.

## 6. Planowane Zadania (TODO)

1.  [x] Utworzyć zunifikowany API Server (`backend/api-server`)
2.  [x] Przygotować `docker-compose.multi-city.yml` z konfiguracją OSRM + API Server
3.  [x] Zaktualizować dokumentację AWS_INFRASTRUCTURE.md
4.  [ ] Wykupić domenę i skonfigurować rekordy DNS
5.  [ ] Wdrożyć na EC2-1 (OSRM) i EC2-2 (API)
6.  [ ] Skonfigurować SSL (Let's Encrypt)
7.  [ ] Zaktualizować `.env.production` w aplikacji mobilnej i admin panel
