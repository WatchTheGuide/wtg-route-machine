#!/bin/bash

# Skrypt do uruchamiania serwera OSRM dla konkretnego miasta i profilu
# Użycie: ./run-city-server.sh [city] [profile] [port]
# Przykład: ./run-city-server.sh krakow foot 5001

set -e

CITY=${1}
PROFILE=${2:-foot}
PORT=${3:-5001}
DATA_DIR="./osrm-data"
OUTPUT_BASE="${CITY}-${PROFILE}"
MAP_FILE="$DATA_DIR/${OUTPUT_BASE}.osrm.fileIndex"
CONTAINER_NAME="osrm-${CITY}-${PROFILE}"

if [ -z "$CITY" ]; then
    echo "Użycie: ./run-city-server.sh [city] [profile] [port]"
    echo ""
    echo "Przykład: ./run-city-server.sh krakow foot 5001"
    echo "Profile: foot, bicycle, car"
    exit 1
fi

if [ ! -f "$MAP_FILE" ]; then
    echo "Błąd: Przetworzone dane OSRM nie istnieją: $MAP_FILE"
    echo "Najpierw przetwórz dane: ./scripts/prepare-city-osrm.sh $CITY $PROFILE"
    exit 1
fi

echo "Uruchamianie serwera OSRM"
echo "Miasto: $CITY"
echo "Profil: $PROFILE"
echo "Port: $PORT"
echo ""

# Zatrzymanie istniejącego kontenera jeśli działa
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

# Uruchomienie nowego kontenera
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:5000 \
    -v "$(pwd)/osrm-data:/data" \
    ghcr.io/project-osrm/osrm-backend:latest \
    osrm-routed /data/${OUTPUT_BASE}.osrm --max-table-size 10000

echo ""
echo "✓ Serwer OSRM uruchomiony: $CITY / $PROFILE"
echo "✓ Dostępny pod adresem: http://localhost:$PORT"
echo ""
echo "Sprawdź logi: docker logs -f $CONTAINER_NAME"
echo "Zatrzymaj serwer: docker stop $CONTAINER_NAME"
echo ""
echo "Test API:"
echo "  curl \"http://localhost:$PORT/nearest/v1/$PROFILE/19.9385,50.0647\""
