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
NGINX_CONF="$SCRIPT_DIR/../nginx/osrm-api.conf"

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
if [ -f "/etc/nginx/sites-enabled/osrm-api.conf" ]; then
    cp /etc/nginx/sites-enabled/osrm-api.conf /etc/nginx/sites-enabled/osrm-api.conf.backup.$(date +%Y%m%d_%H%M%S)
    echo -e "${GREEN}✓ Backup created${NC}"
fi

echo -e "${YELLOW}[3/5] Deploying Nginx configuration...${NC}"
cp "$NGINX_CONF" /etc/nginx/sites-available/osrm-api.conf

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Enable site
ln -sf /etc/nginx/sites-available/osrm-api.conf /etc/nginx/sites-enabled/osrm-api.conf

echo -e "${GREEN}✓ Configuration deployed${NC}"

echo -e "${YELLOW}[4/5] Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✓ Configuration valid${NC}"
else
    echo -e "${RED}Configuration invalid! Restoring backup...${NC}"
    if [ -f "/etc/nginx/sites-enabled/osrm-api.conf.backup.$(date +%Y%m%d)_"* ]; then
        cp /etc/nginx/sites-enabled/osrm-api.conf.backup.* /etc/nginx/sites-enabled/osrm-api.conf
    fi
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
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Generate API keys (run: openssl rand -hex 32)"
echo "2. Add API keys to /etc/nginx/sites-available/osrm-api.conf"
echo "3. Reload Nginx: sudo systemctl reload nginx"
echo ""
echo -e "${YELLOW}Test your API:${NC}"
echo "curl -H 'X-API-Key: dev-test-key-12345' 'https://osrm.watchtheguide.com/api/foot/route/v1/foot/19.9385,50.0647;19.9450,50.0619?overview=false'"
echo ""
echo -e "${YELLOW}Health check:${NC}"
echo "curl https://osrm.watchtheguide.com/health"
