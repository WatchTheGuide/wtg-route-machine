#!/bin/bash

# Skrypt do przetwarzania danych OSM dla OSRM
# Użycie: ./prepare-osrm.sh [profil]
# Przykład: ./prepare-osrm.sh car

set -e

PROFILE=${1:-car}
DATA_DIR="./osrm-data"
MAP_FILE="$DATA_DIR/map.osm.pbf"

if [ ! -f "$MAP_FILE" ]; then
    echo "Błąd: Plik mapy nie istnieje: $MAP_FILE"
    echo "Najpierw uruchom: ./scripts/download-map.sh"
    exit 1
fi

echo "Przetwarzanie mapy z profilem: $PROFILE"

# Extract
echo "Krok 1/3: Extract..."
docker run -t -v "$(pwd)/osrm-data:/data" ghcr.io/project-osrm/osrm-backend:latest \
    osrm-extract -p /opt/$PROFILE.lua /data/map.osm.pbf

# Partition (dla MLD)
echo "Krok 2/3: Partition..."
docker run -t -v "$(pwd)/osrm-data:/data" ghcr.io/project-osrm/osrm-backend:latest \
    osrm-partition /data/map.osrm

# Customize (dla MLD)
echo "Krok 3/3: Customize..."
docker run -t -v "$(pwd)/osrm-data:/data" ghcr.io/project-osrm/osrm-backend:latest \
    osrm-customize /data/map.osrm

echo "Przetwarzanie zakończone pomyślnie!"
echo "Możesz teraz uruchomić serwer OSRM: docker-compose up -d"
