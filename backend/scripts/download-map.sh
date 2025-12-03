#!/bin/bash

# Skrypt do pobierania danych OSM z Geofabrik
# Użycie: ./download-map.sh [region]
# Przykład: ./download-map.sh poland

set -e

REGION=${1:-poland}
DATA_DIR="./osrm-data"
GEOFABRIK_URL="https://download.geofabrik.de/europe"
OUTPUT_FILE="$DATA_DIR/map-${REGION}.osm.pbf"

# Mapa regionów do plików
case $REGION in
  poland)
    MAP_FILE="poland-latest.osm.pbf"
    ;;
  malopolskie)
    MAP_FILE="poland/malopolskie-latest.osm.pbf"
    ;;
  mazowieckie)
    MAP_FILE="poland/mazowieckie-latest.osm.pbf"
    ;;
  dolnoslaskie)
    MAP_FILE="poland/dolnoslaskie-latest.osm.pbf"
    ;;
  pomorskie)
    MAP_FILE="poland/pomorskie-latest.osm.pbf"
    ;;
  europe)
    MAP_FILE="europe-latest.osm.pbf"
    GEOFABRIK_URL="https://download.geofabrik.de"
    ;;
  *)
    echo "Nieznany region: $REGION"
    echo "Dostępne regiony: poland, malopolskie, mazowieckie, dolnoslaskie, pomorskie, europe"
    exit 1
    ;;
esac

echo "Pobieranie mapy dla regionu: $REGION"
echo "URL: $GEOFABRIK_URL/$MAP_FILE"

# Utworzenie katalogu na dane
mkdir -p "$DATA_DIR"

# Pobranie pliku
wget -O "$OUTPUT_FILE" "$GEOFABRIK_URL/$MAP_FILE"

echo "Mapa pobrana pomyślnie do: $OUTPUT_FILE"
echo "Rozmiar pliku: $(du -h $OUTPUT_FILE | cut -f1)"
