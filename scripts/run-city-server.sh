#!/bin/bash

# Skrypt do uruchamiania serwera OSRM dla konkretnego miasta
# Użycie: ./run-city-server.sh [city] [port]
# Przykład: ./run-city-server.sh krakow 5001

set -e

CITY=${1}
PORT=${2:-5001}
DATA_DIR="./osrm-data"
MAP_FILE="$DATA_DIR/${CITY}.osrm.fileIndex"

if [ -z "$CITY" ]; then
    echo "Użycie: ./run-city-server.sh [city] [port]"
    echo ""
    echo "Przykład: ./run-city-server.sh krakow 5001"
    exit 1
fi

if [ ! -f "$MAP_FILE" ]; then
    echo "Błąd: Przetworzone dane OSRM nie istnieją: $MAP_FILE"
    echo "Najpierw przetwórz dane: ./scripts/prepare-city-osrm.sh $CITY foot"
    exit 1
fi

echo "Uruchamianie serwera OSRM dla miasta: $CITY"
echo "Port: $PORT"
echo ""

# Zatrzymanie istniejącego kontenera jeśli działa
docker stop osrm-$CITY 2>/dev/null || true
docker rm osrm-$CITY 2>/dev/null || true

# Uruchomienie nowego kontenera
docker run -d \
    --name osrm-$CITY \
    -p $PORT:5000 \
    -v "$(pwd)/osrm-data:/data" \
    ghcr.io/project-osrm/osrm-backend:latest \
    osrm-routed --algorithm mld /data/${CITY}.osrm --max-table-size 10000

echo ""
echo "✓ Serwer OSRM uruchomiony dla miasta: $CITY"
echo "✓ Dostępny pod adresem: http://localhost:$PORT"
echo ""
echo "Sprawdź logi: docker logs -f osrm-$CITY"
echo "Zatrzymaj serwer: docker stop osrm-$CITY"
echo ""
echo "Test API:"
echo "  curl \"http://localhost:$PORT/nearest/v1/foot/19.9385,50.0647\""
