#!/usr/bin/env bash

# WTG Route Machine - Nginx Deployment Script
# Deploys Nginx configuration with SSL and API keys

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}WTG Route Machine - Nginx Setup${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}Please run with sudo${NC}"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONF="$SCRIPT_DIR/../nginx/osrm-api-multi-city.conf"
NGINX_SNIPPETS="$SCRIPT_DIR/../nginx/snippets"

echo -e "${YELLOW}[1/5] Checking prerequisites...${NC}"

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}Nginx not found. Installing...${NC}"
    apt update
    apt install -y nginx
fi

# Check if SSL certificates exist
if [ ! -f "/etc/letsencrypt/live/osrm.watchtheguide.com/fullchain.pem" ]; then
    echo -e "${RED}SSL certificates not found!${NC}"
    echo "Run: sudo certbot certonly --standalone -d osrm.watchtheguide.com --email your-email@example.com --agree-tos"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites OK${NC}"

echo -e "${YELLOW}[2/5] Backing up existing configuration...${NC}"
# Create backup directory
mkdir -p /etc/nginx/backups
if [ -f "/etc/nginx/sites-available/osrm-api.conf" ]; then
    cp /etc/nginx/sites-available/osrm-api.conf /etc/nginx/backups/osrm-api.conf.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✓ Backup created in /etc/nginx/backups/${NC}"
fi

echo -e "${YELLOW}[3/5] Deploying Nginx configuration...${NC}"

# Create snippets directory if it doesn't exist
mkdir -p /etc/nginx/snippets

# Deploy snippets
if [ -d "$NGINX_SNIPPETS" ]; then
    cp "$NGINX_SNIPPETS"/*.conf /etc/nginx/snippets/
    echo -e "${GREEN}✓ Nginx snippets deployed${NC}"
fi

cp "$NGINX_CONF" /etc/nginx/sites-available/osrm-api.conf

# Deploy API keys file if it doesn't exist (preserve existing keys)
if [ ! -f "/etc/nginx/api-keys.map" ]; then
    cp "$SCRIPT_DIR/../nginx/api-keys.map" /etc/nginx/api-keys.map
    echo -e "${GREEN}✓ API keys file created${NC}"
else
    echo -e "${GREEN}✓ Existing API keys preserved${NC}"
fi

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Enable site
ln -sf /etc/nginx/sites-available/osrm-api.conf /etc/nginx/sites-enabled/osrm-api.conf

echo -e "${GREEN}✓ Configuration deployed${NC}"

echo -e "${YELLOW}[4/5] Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Configuration valid${NC}"
else
    echo -e "${RED}Configuration invalid! Check the logs above.${NC}"
    exit 1
fi

echo -e "${YELLOW}[5/5] Restarting Nginx...${NC}"
systemctl restart nginx
systemctl enable nginx

echo -e "${GREEN}✓ Nginx restarted${NC}"

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}✓ Deployment complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${YELLOW}Available cities:${NC}"
echo "  - Kraków:     https://osrm.watchtheguide.com/api/krakow/{profile}/..."
echo "  - Warszawa:   https://osrm.watchtheguide.com/api/warszawa/{profile}/..."
echo "  - Wrocław:    https://osrm.watchtheguide.com/api/wroclaw/{profile}/..."
echo "  - Trójmiasto: https://osrm.watchtheguide.com/api/trojmiasto/{profile}/..."
echo ""
echo -e "${YELLOW}Available profiles: foot, bicycle, car${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Generate API keys (run: openssl rand -hex 32)"
echo "2. Add API keys to /etc/nginx/api-keys.map"
echo "3. Reload Nginx: sudo systemctl reload nginx"
echo ""
echo -e "${YELLOW}Test your API:${NC}"
echo "curl -H 'X-API-Key: YOUR_KEY' 'https://osrm.watchtheguide.com/api/krakow/foot/route/v1/foot/19.9385,50.0647;19.9450,50.0619'"
echo "curl -H 'X-API-Key: YOUR_KEY' 'https://osrm.watchtheguide.com/api/warszawa/bicycle/route/v1/bicycle/21.0122,52.2297;21.02,52.23'"
echo ""
echo -e "${YELLOW}Health check:${NC}"
echo "curl https://osrm.watchtheguide.com/health"
echo "curl https://osrm.watchtheguide.com/health/krakow"
