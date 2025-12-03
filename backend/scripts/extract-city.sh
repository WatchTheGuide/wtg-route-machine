#!/usr/bin/env bash

# Skrypt do wycinania map miast z większych plików regionalnych
# Wymaga: osmium-tool (brew install osmium-tool lub apt-get install osmium-tool)
# Użycie: ./extract-city.sh [region] [city]
# Przykład: ./extract-city.sh malopolskie krakow

set -e

REGION=${1}
CITY=${2}
DATA_DIR="./osrm-data"
INPUT_FILE="$DATA_DIR/map-${REGION}.osm.pbf"
OUTPUT_FILE="$DATA_DIR/${CITY}.osm.pbf"

if [ -z "$REGION" ] || [ -z "$CITY" ]; then
    echo "Użycie: ./extract-city.sh [region] [city]"
    echo ""
    echo "Dostępne regiony i miasta:"
    echo "  malopolskie krakow"
    echo "  mazowieckie warszawa"
    echo "  pomorskie trojmiasto"
    echo "  dolnoslaskie wroclaw"
    exit 1
fi

# Sprawdzenie czy osmium jest zainstalowane
if ! command -v osmium &> /dev/null; then
    echo "Błąd: osmium-tool nie jest zainstalowany"
    echo ""
    echo "Instalacja:"
    echo "  macOS:   brew install osmium-tool"
    echo "  Ubuntu:  sudo apt-get install osmium-tool"
    exit 1
fi

# Sprawdzenie czy plik źródłowy istnieje
if [ ! -f "$INPUT_FILE" ]; then
    echo "Błąd: Plik źródłowy nie istnieje: $INPUT_FILE"
    echo "Najpierw pobierz mapę regionu: ./scripts/download-map.sh $REGION"
    exit 1
fi

# Pobranie bbox dla wybranego miasta (case statement zamiast associative array)
case $CITY in
    krakow)
        BBOX="19.8,49.95,20.2,50.15"  # Kraków z okolicami
        ;;
    warszawa)
        BBOX="20.85,52.05,21.3,52.4"  # Warszawa z okolicami
        ;;
    trojmiasto)
        BBOX="18.4,54.25,18.8,54.6"   # Gdańsk, Sopot, Gdynia
        ;;
    wroclaw)
        BBOX="16.8,51.0,17.2,51.25"   # Wrocław z okolicami
        ;;
    *)
        echo "Błąd: Nieznane miasto: $CITY"
        echo "Dostępne miasta: krakow, warszawa, trojmiasto, wroclaw"
        exit 1
        ;;
esac

echo "Wycinanie mapy dla miasta: $CITY"
echo "Region źródłowy: $REGION"
echo "Bounding Box: $BBOX"
echo "Plik wejściowy: $INPUT_FILE"
echo "Plik wyjściowy: $OUTPUT_FILE"
echo ""

# Wycinanie fragmentu mapy używając osmium
osmium extract \
    --bbox $BBOX \
    --strategy simple \
    --output $OUTPUT_FILE \
    $INPUT_FILE

echo ""
echo "✓ Mapa dla $CITY została wycięta pomyślnie!"
echo "Rozmiar pliku: $(du -h $OUTPUT_FILE | cut -f1)"
echo ""
echo "Następny krok: Przetwórz dane dla OSRM"
echo "  ./scripts/prepare-city-osrm.sh $CITY foot"
