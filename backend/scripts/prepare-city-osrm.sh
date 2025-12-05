#!/bin/bash

# Skrypt do przetwarzania wyciętych map miast dla OSRM
# Użycie: ./prepare-city-osrm.sh [city] [profile]
# Przykład: ./prepare-city-osrm.sh krakow foot

set -e

CITY=${1}
PROFILE=${2:-foot}
DATA_DIR="./osrm-data"
MAP_FILE="$DATA_DIR/${CITY}.osm.pbf"
OUTPUT_BASE="${CITY}-${PROFILE}"  # e.g., krakow-foot

if [ -z "$CITY" ]; then
    echo "Użycie: ./prepare-city-osrm.sh [city] [profile]"
    echo ""
    echo "Przykład: ./prepare-city-osrm.sh krakow foot"
    exit 1
fi

if [ ! -f "$MAP_FILE" ]; then
    echo "Błąd: Plik mapy nie istnieje: $MAP_FILE"
    echo "Najpierw wytnij mapę miasta: ./scripts/extract-city.sh [region] $CITY"
    exit 1
fi

echo "Przetwarzanie mapy miasta: $CITY z profilem: $PROFILE"
echo "Algorytm: MLD (Multi-Level Dijkstra)"
echo ""

# Extract
echo "Krok 1/3: Extract..."
docker run -t -v "$(pwd)/osrm-data:/data" ghcr.io/project-osrm/osrm-backend:latest \
    osrm-extract -p /opt/$PROFILE.lua /data/${MAP_FILE##*/}

# Partition (MLD algorithm - step 1)
echo "Krok 2/3: Partition..."
docker run -t -v "$(pwd)/osrm-data:/data" ghcr.io/project-osrm/osrm-backend:latest \
    osrm-partition /data/${CITY}.osrm

# Customize (MLD algorithm - step 2)
echo "Krok 3/3: Customize..."
docker run -t -v "$(pwd)/osrm-data:/data" ghcr.io/project-osrm/osrm-backend:latest \
    osrm-customize /data/${CITY}.osrm

# Rename ALL extracted files to include profile suffix
echo "Renaming files to include profile suffix..."
for file in "$DATA_DIR/${CITY}.osrm".*; do
    if [ -f "$file" ]; then
        ext="${file#$DATA_DIR/${CITY}.}"
        mv "$file" "$DATA_DIR/${OUTPUT_BASE}.${ext}" 2>/dev/null || true
    fi
done

echo ""
echo "✓ Przetwarzanie zakończone pomyślnie!"
echo ""
echo "Pliki OSRM dla miasta $CITY (profil: $PROFILE) są gotowe."
echo "Uruchom serwer: ./scripts/run-city-server.sh $CITY $PROFILE"
