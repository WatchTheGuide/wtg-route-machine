#!/usr/bin/env bash

# WTG Route Machine - API Key Generator
# Generates secure random API keys for client authentication

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}WTG Route Machine - API Key Generator${NC}"
echo ""

if [ -z "$1" ]; then
    echo "Usage: $0 <client-name>"
    echo ""
    echo "Examples:"
    echo "  $0 wtg-web-app"
    echo "  $0 wtg-mobile-app"
    echo "  $0 development"
    exit 1
fi

CLIENT_NAME="$1"
API_KEY=$(openssl rand -hex 32)

echo -e "${YELLOW}Generated API Key for: ${CLIENT_NAME}${NC}"
echo ""
echo -e "${GREEN}API Key:${NC} $API_KEY"
echo ""
echo -e "${YELLOW}Add this line to /etc/nginx/api-keys.map:${NC}"
echo "\"$API_KEY\" \"$CLIENT_NAME\";"
echo ""
echo -e "${YELLOW}After adding, reload Nginx:${NC}"
echo "sudo systemctl reload nginx"
echo ""
echo -e "${YELLOW}Test the API key:${NC}"
echo "curl -H 'X-API-Key: $API_KEY' 'https://osrm.watchtheguide.com/api/foot/route/v1/foot/19.9385,50.0647;19.9450,50.0619?overview=false'"
