#!/bin/bash

# Skrypt do pobierania danych OSM z Geofabrik
# Użycie: ./download-map.sh [region]
# Przykład: ./download-map.sh poland

set -e

REGION=${1:-poland}
DATA_DIR="./osrm-data"
GEOFABRIK_URL="https://download.geofabrik.de/europe"

# Mapa regionów do plików
case $REGION in
  poland)
    MAP_FILE="poland-latest.osm.pbf"
    ;;
  mazowieckie)
    MAP_FILE="poland/mazowieckie-latest.osm.pbf"
    GEOFABRIK_URL="https://download.geofabrik.de/europe"
    ;;
  europe)
    MAP_FILE="europe-latest.osm.pbf"
    GEOFABRIK_URL="https://download.geofabrik.de"
    ;;
  *)
    echo "Nieznany region: $REGION"
    echo "Dostępne regiony: poland, mazowieckie, europe"
    exit 1
    ;;
esac

echo "Pobieranie mapy dla regionu: $REGION"
echo "URL: $GEOFABRIK_URL/$MAP_FILE"

# Utworzenie katalogu na dane
mkdir -p "$DATA_DIR"

# Pobranie pliku
wget -O "$DATA_DIR/map.osm.pbf" "$GEOFABRIK_URL/$MAP_FILE"

echo "Mapa pobrana pomyślnie do: $DATA_DIR/map.osm.pbf"
echo "Rozmiar pliku: $(du -h $DATA_DIR/map.osm.pbf | cut -f1)"
