# AWS Infrastructure Architecture - WTG Route Machine

## Obecna konfiguracja DNS w Route 53

✅ Domena dostępna: **`osrm.watchtheguide.com`**

---

## Proponowana architektura (2-serwerowa, optymalizacja kosztów + wydajność)

### 🎯 Cel: Maksymalna wydajność routingu OSRM przy optymalnych kosztach

```
┌─────────────────────────────────────────────────────────────────┐
│                    AWS Route 53 DNS                              │
│                                                                   │
│  osrm.watchtheguide.com        → EC2-1 (OSRM - 12 kontenerów)   │
│  api.watchtheguide.com         → EC2-2 (Tours + POI + Nginx)    │
│  www.watchtheguide.com         → Vercel/Netlify (Static)        │
│  admin.watchtheguide.com       → Vercel (Admin Panel)           │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  EC2-1: OSRM Routing Server (t3.large - 8GB RAM)                │
│  osrm.watchtheguide.com (Elastic IP)                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Nginx Reverse Proxy (Port 443 HTTPS)              │        │
│  │  - SSL Certificate (Let's Encrypt)                 │        │
│  │  - API Key validation                              │        │
│  │  - Rate limiting (10 req/s per IP)                 │        │
│  │  - CORS headers                                    │        │
│  └─────────────────────────────────────────────────────┘        │
│                             │                                    │
│    ┌────────────────────────┴───────────────────────┐          │
│    │                                                  │          │
│  ┌─▼───────────────┐  ┌───────────────┐  ┌─────────▼──────┐   │
│  │ Kraków (3)      │  │ Warszawa (3)  │  │ Wrocław (3)    │   │
│  │ :5001 foot      │  │ :5011 foot    │  │ :5021 foot     │   │
│  │ :5002 bicycle   │  │ :5012 bicycle │  │ :5022 bicycle  │   │
│  │ :5003 car       │  │ :5013 car     │  │ :5023 car      │   │
│  └─────────────────┘  └───────────────┘  └────────────────┘   │
│                                                                   │
│  ┌─────────────────┐                                            │
│  │ Trójmiasto (3)  │                                            │
│  │ :5031 foot      │    Total: 12 OSRM containers              │
│  │ :5032 bicycle   │    Memory: ~6GB used                      │
│  │ :5033 car       │    CPU: ~4 vCPU utilized                  │
│  └─────────────────┘                                            │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  EC2-2: API Server (t3.small - 2GB RAM)                         │
│  api.watchtheguide.com (Elastic IP)                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Nginx Reverse Proxy (Port 443 HTTPS)              │        │
│  │  - SSL Certificate (Let's Encrypt)                 │        │
│  │  - API Key validation                              │        │
│  │  - CORS headers                                    │        │
│  └─────────────────────────────────────────────────────┘        │
│                             │                                    │
│                    ┌────────▼────────┐                          │
│                    │  Unified API    │                          │
│                    │  Server (3000)  │                          │
│                    │                  │                          │
│                    │  - /api/poi/*   │  ← Points of Interest   │
│                    │  - /api/tours/* │  ← Curated Tours        │
│                    │  - /api/admin/* │  ← Admin Panel API      │
│                    │                  │                          │
│                    │  Node.js        │                          │
│                    │  Express + TS   │                          │
│                    │  JWT Auth       │                          │
│                    └─────────────────┘                          │
│                                                                   │
│  Optional: PostgreSQL (if needed for user data)                 │
│  Optional: Redis (for caching tours/POI)                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Static Hosting (Vercel/Netlify - $0/month for hobby)          │
│                                                                   │
│  www.watchtheguide.com        → Landing Page + Website          │
│  admin.watchtheguide.com      → Admin Panel (password protected)│
└─────────────────────────────────────────────────────────────────┘
```

---

## Konfiguracja DNS w AWS Route 53

### Records do utworzenia:

| Record Name               | Type      | Value                           | TTL | Purpose                 |
| ------------------------- | --------- | ------------------------------- | --- | ----------------------- |
| `osrm.watchtheguide.com`  | **A**     | `Elastic IP EC2-1`              | 300 | OSRM Routing Server     |
| `api.watchtheguide.com`   | **A**     | `Elastic IP EC2-2`              | 300 | Tours + POI API         |
| `www.watchtheguide.com`   | **CNAME** | `cname.vercel-dns.com`          | 300 | Public Website (Vercel) |
| `admin.watchtheguide.com` | **CNAME** | `cname.vercel-dns.com`          | 300 | Admin Panel (Vercel)    |
| `watchtheguide.com`       | **A**     | `Alias → www.watchtheguide.com` | 300 | Redirect to www         |

### Health Checks (optional but recommended):

- **OSRM Health Check**: `https://osrm.watchtheguide.com/health`
- **API Health Check**: `https://api.watchtheguide.com/health`
- Route 53 może automatycznie failover do backup serwera (future)

---

## EC2-1: OSRM Routing Server (Wysoka wydajność)

### Instance Type: **t3.large**

- **vCPU**: 2 vCPU (Burstable)
- **RAM**: 8GB (wystarczy dla 12 kontenerów OSRM)
- **Storage**: 40GB SSD (gp3)
- **Network**: Enhanced Networking (10 Gbps)
- **Cost**: ~$60/month (Reserved Instance: ~$35/month)

### Dlaczego t3.large?

- ✅ 8GB RAM = ~512MB per OSRM container × 12
- ✅ Burst credits dla traffic peaks
- ✅ Dedicated routing - zero interference z API

### Security Group Rules:

```hcl
# Inbound
- Port 443 (HTTPS) from 0.0.0.0/0  # Public HTTPS access
- Port 80 (HTTP) from 0.0.0.0/0    # Let's Encrypt validation + HTTP→HTTPS redirect
- Port 22 (SSH) from YOUR_IP/32    # SSH access (restricted to your IP)

# Outbound
- All traffic to 0.0.0.0/0          # Updates, Docker pulls
```

### Docker Compose Setup:

```yaml
# /opt/wtg-route-machine/docker-compose.yml
version: '3.8'

services:
  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: nginx-osrm
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx/osrm-multi-city.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/api-keys.map:/etc/nginx/api-keys.map
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - osrm-network
    restart: unless-stopped

  # 12 OSRM containers (4 cities × 3 profiles)
  # Kraków
  osrm-krakow-foot:
    image: ghcr.io/project-osrm/osrm-backend:latest
    container_name: osrm-krakow-foot
    volumes:
      - ./osrm-data:/data:ro
    command: osrm-routed --algorithm mld /data/krakow-foot.osrm --max-table-size 10000
    networks:
      - osrm-network
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M

  # ... (pozostałe 11 kontenerów)

networks:
  osrm-network:
    driver: bridge
```

### Nginx Configuration (`osrm-multi-city.conf`):

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=osrm_limit:10m rate=10r/s;

# API Key validation
map $http_x_api_key $api_client_name {
    default "unauthorized";
    include /etc/nginx/api-keys.map;
}

server {
    listen 80;
    server_name osrm.watchtheguide.com;

    # Let's Encrypt ACME challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # Redirect HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name osrm.watchtheguide.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/osrm.watchtheguide.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/osrm.watchtheguide.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    # CORS Headers (allow mobile app)
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, OPTIONS" always;
    add_header Access-Control-Allow-Headers "X-API-Key, Content-Type" always;

    # Handle OPTIONS preflight
    if ($request_method = 'OPTIONS') {
        return 204;
    }

    # API Key validation
    if ($api_client_name = "unauthorized") {
        return 401 '{"code": "Unauthorized", "message": "Invalid or missing X-API-Key header"}';
    }

    # Rate limiting
    limit_req zone=osrm_limit burst=20 nodelay;

    # Health check (no auth required)
    location /health {
        access_log off;
        return 200 '{"status": "ok", "service": "osrm-routing"}';
        add_header Content-Type application/json;
    }

    # Kraków Routes
    location ~ ^/krakow/foot/(.*)$ {
        proxy_pass http://osrm-krakow-foot:5000/$1$is_args$args;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location ~ ^/krakow/bicycle/(.*)$ {
        proxy_pass http://osrm-krakow-bicycle:5000/$1$is_args$args;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location ~ ^/krakow/car/(.*)$ {
        proxy_pass http://osrm-krakow-car:5000/$1$is_args$args;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Warszawa Routes
    location ~ ^/warszawa/foot/(.*)$ {
        proxy_pass http://osrm-warszawa-foot:5000/$1$is_args$args;
        proxy_set_header Host $host;
    }

    # ... (similar for Wrocław, Trójmiasto)

    # Legacy support (default to Kraków)
    location ~ ^/route/v1/foot/(.*)$ {
        proxy_pass http://osrm-krakow-foot:5000/route/v1/foot/$1$is_args$args;
    }
}
```

### API Keys Configuration (`api-keys.map`):

```nginx
# Production mobile app
"prod-mobile-key-abc123xyz789" "mobile_app_v1";

# Development/testing
"dev-test-key-456def" "development";

# Admin panel
"admin-panel-key-789ghi" "admin_panel";

# Future: user-specific keys
# "user-123-key" "user_123";
```

---

## EC2-2: API Server (Tours + POI)

### Instance Type: **t3.small**

- **vCPU**: 2 vCPU
- **RAM**: 2GB (wystarczy dla Node.js API)
- **Storage**: 20GB SSD (gp3)
- **Cost**: ~$15/month (Reserved: ~$10/month)

### Dlaczego oddzielny serwer?

- ✅ Izolacja: OSRM routing nie wpływa na API
- ✅ Skalowalność: można upgradować tylko OSRM serwer
- ✅ Bezpieczeństwo: różne API keys, różne security groups
- ✅ Koszt: małe API nie potrzebuje dużego serwera

### Security Group Rules:

```hcl
# Inbound
- Port 443 (HTTPS) from 0.0.0.0/0
- Port 80 (HTTP) from 0.0.0.0/0
- Port 22 (SSH) from YOUR_IP/32

# Outbound
- All traffic
```

### Docker Compose Setup:

```yaml
# /opt/wtg-api/docker-compose.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: nginx-api
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx/api.conf:/etc/nginx/conf.d/default.conf
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - api-network
    restart: unless-stopped

  api-server:
    build: ./api-server
    container_name: wtg-api-server
    environment:
      - NODE_ENV=production
      - PORT=3000
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRES_IN=1h
      - CORS_ORIGIN=*
    volumes:
      - ./api-server/src/data:/app/src/data:ro
    networks:
      - api-network
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'wget', '--spider', '-q', 'http://localhost:3000/health']
      interval: 30s
      timeout: 10s
      retries: 3

networks:
  api-network:
    driver: bridge
```

### Nginx Configuration (`api.conf`):

```nginx
upstream api_backend {
    server api-server:3000;
}

server {
    listen 80;
    server_name api.watchtheguide.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.watchtheguide.com;

    ssl_certificate /etc/letsencrypt/live/api.watchtheguide.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.watchtheguide.com/privkey.pem;

    # CORS
    add_header Access-Control-Allow-Origin "*" always;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Content-Type, Authorization, X-API-Key" always;

    # Handle OPTIONS preflight
    if ($request_method = 'OPTIONS') {
        return 204;
    }

    # POI API (public)
    location /api/poi/ {
        proxy_pass http://api_backend/api/poi/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Tours API (public)
    location /api/tours/ {
        proxy_pass http://api_backend/api/tours/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Admin API (protected - requires JWT)
    location /api/admin/ {
        proxy_pass http://api_backend/api/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://api_backend/health;
    }
}
```

---

## Konfiguracja SSL Certificates (Let's Encrypt)

### Instalacja Certbot na obu serwerach:

```bash
# EC2-1 (OSRM)
sudo certbot --nginx -d osrm.watchtheguide.com

# EC2-2 (API)
sudo certbot --nginx -d api.watchtheguide.com

# Auto-renewal (cron job already configured by certbot)
sudo certbot renew --dry-run
```

---

## Mobile App Configuration

### Update `.env.production`:

```env
# mobile/.env.production
VITE_TOURS_API_URL=https://api.watchtheguide.com/api/tours
VITE_POIS_API_URL=https://api.watchtheguide.com/api/poi
VITE_OSRM_API_URL=https://osrm.watchtheguide.com
VITE_API_KEY=prod-mobile-key-abc123xyz789
VITE_REQUIRE_API_KEY=true
```

### Admin Panel Configuration:

```env
# admin/.env.production
VITE_API_URL=https://api.watchtheguide.com
```

### URL Format dla OSRM:

```typescript
// mobile/src/services/osrm.service.ts
const url = `${baseUrl}/{city}/{profile}/route/v1/{profile}/{coordinates}`;

// Przykład:
// https://osrm.watchtheguide.com/krakow/foot/route/v1/foot/19.9449,50.0647;19.9385,50.0647
```

---

## Deployment Checklist

### EC2-1 (OSRM Server):

- [ ] Launch t3.large instance (Ubuntu 22.04 LTS)
- [ ] Allocate Elastic IP
- [ ] Configure Security Group (ports 80, 443, 22)
- [ ] Point DNS: `osrm.watchtheguide.com` → Elastic IP
- [ ] Install Docker + Docker Compose
- [ ] Clone repo: `git clone https://github.com/WatchTheGuide/wtg-route-machine`
- [ ] Prepare OSRM data files (12 cities × profiles)
- [ ] Configure nginx with API keys
- [ ] Setup Let's Encrypt SSL: `certbot --nginx -d osrm.watchtheguide.com`
- [ ] Start services: `docker-compose up -d`
- [ ] Test routing: `curl https://osrm.watchtheguide.com/krakow/foot/route/v1/foot/...`
- [ ] Setup CloudWatch monitoring (CPU, RAM, Network)
- [ ] Configure auto-restart on failure

### EC2-2 (API Server):

- [ ] Launch t3.small instance (Ubuntu 22.04 LTS)
- [ ] Allocate Elastic IP
- [ ] Configure Security Group
- [ ] Point DNS: `api.watchtheguide.com` → Elastic IP
- [ ] Install Docker + Docker Compose
- [ ] Clone repo
- [ ] Set environment variables (JWT_SECRET)
- [ ] Build api-server: `docker build -t wtg-api-server ./api-server`
- [ ] Setup Let's Encrypt SSL: `certbot --nginx -d api.watchtheguide.com`
- [ ] Start services: `docker-compose up -d`
- [ ] Test API endpoints:
  - `curl https://api.watchtheguide.com/health`
  - `curl https://api.watchtheguide.com/api/poi/cities`
  - `curl https://api.watchtheguide.com/api/tours/cities`
- [ ] Setup CloudWatch monitoring

### Route 53:

- [ ] Create A record: `osrm.watchtheguide.com` → EC2-1 Elastic IP
- [ ] Create A record: `api.watchtheguide.com` → EC2-2 Elastic IP
- [ ] Create CNAME: `www.watchtheguide.com` → Vercel
- [ ] Create CNAME: `admin.watchtheguide.com` → Vercel
- [ ] (Optional) Health checks for automatic failover

---

## Monitoring & Maintenance

### CloudWatch Alarms:

```yaml
OSRM Server (EC2-1):
  - CPU > 80% for 5 minutes → Email alert
  - Memory > 90% → Email alert
  - Network In > 1GB/hour → Notify (potential DDoS)
  - Status Check Failed → Auto-restart

API Server (EC2-2):
  - CPU > 70% for 5 minutes → Email alert
  - HTTP 5xx errors > 10/minute → Email alert
```

### Backup Strategy:

```bash
# OSRM data files (one-time, can regenerate)
aws s3 sync /opt/wtg-route-machine/osrm-data/ s3://wtg-osrm-backup/

# API data (important - tour content)
aws s3 sync /opt/wtg-api/api-server/src/data/ s3://wtg-api-backup/ --exclude "*.log"

# Automated daily backup (cron)
0 2 * * * /usr/local/bin/backup-api-data.sh
```

---

## Cost Estimation (Monthly)

| Resource      | Type                  | Cost (On-Demand) | Cost (Reserved 1yr) |
| ------------- | --------------------- | ---------------- | ------------------- |
| EC2-1 (OSRM)  | t3.large              | ~$60             | ~$35                |
| EC2-2 (API)   | t3.small              | ~$15             | ~$10                |
| Elastic IP    | 2×                    | $0 (attached)    | $0                  |
| EBS Storage   | 60GB gp3              | ~$6              | ~$6                 |
| Data Transfer | ~100GB/month          | ~$9              | ~$9                 |
| Route 53      | Hosted Zone + Queries | ~$1              | ~$1                 |
| **Total**     |                       | **~$91/month**   | **~$61/month**      |

**Savings with Reserved Instances:** ~$30/month (~33%)

### Alternative: Spot Instances (nie rekomendowane dla produkcji)

- EC2-1: ~$18/month (70% cheaper, ale może zostać terminated)
- Tylko dla dev/staging environment

---

## Alternatywne opcje (jeśli budget jest problemem)

### Opcja 1: Single server (kompromis)

- **t3.xlarge** (16GB RAM) - $120/month
- Wszystko na jednej instancji (OSRM + API)
- Prostsze, ale mniej skalowalne

### Opcja 2: Lightsail (AWS managed)

- **Lightsail 8GB** - $40/month (fixed price)
- Tylko OSRM, API na Vercel Serverless Functions
- Ograniczenia: 3TB transfer limit

### Opcja 3: Hetzner Cloud (cheaper, EU)

- **CX31** (8GB RAM) - €11.90/month (~$13)
- **CX21** (4GB RAM) - €5.99/month (~$6.50)
- Total: ~$20/month (66% cheaper niż AWS!)
- Minusy: brak integracji z AWS ekosystemem

---

## Rekomendacja 🎯

**Dla startu (MVP):**

1. ✅ **EC2-1** (t3.large): OSRM routing - **$60/month**
2. ✅ **EC2-2** (t3.small): Tours API - **$15/month**
3. ✅ **Vercel Free**: Website + Admin Panel - **$0/month**
4. **Total: ~$75-90/month**

**Po osiągnięciu 1000+ użytkowników:**

- Upgrade EC2-1 do t3.xlarge (16GB) - większy cache OSRM
- Add CloudFront CDN dla static assets
- Add RDS PostgreSQL dla user data
- Reserved Instances - oszczędzaj 30%

**Długoterminowo (scale):**

- Auto Scaling Group dla OSRM (multiple instances)
- Application Load Balancer
- ElastiCache Redis dla tours/POI caching
- Multi-region deployment (EU + US)

---

## Następne kroki

1. [ ] Zakup/konfiguracja domeny `watchtheguide.com` w Route 53
2. [ ] Launch EC2-1 (OSRM) z Elastic IP
3. [ ] Konfiguracja DNS rekordów
4. [ ] Deploy OSRM containers + Nginx
5. [ ] Setup SSL certificates
6. [ ] Launch EC2-2 (API)
7. [ ] Deploy api-server (unified POI + Tours + Admin)
8. [ ] Update mobile app `.env.production`
9. [ ] Testing end-to-end
10. [ ] Deploy website do Vercel
11. [ ] Monitoring setup (CloudWatch)
12. [ ] Backup automation

Czy chcesz, żebym pomógł z którymś z tych kroków? Mogę:

- Wygenerować Terraform config dla całej infrastruktury
- Stworzyć deployment scripts (Ansible/Bash)
- Przygotować monitoring dashboards (CloudWatch/Grafana)
