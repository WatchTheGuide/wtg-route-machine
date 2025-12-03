#!/usr/bin/env bash

# Skrypt do generowania wszystkich danych testowych dla wszystkich miast i profili
# Użycie: ./generate-all-test-data.sh
# US 8.2: Route profile selection - przygotowanie danych dla wszystkich profili

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="$SCRIPT_DIR/../osrm-data"

echo "=========================================="
echo "WTG Route Machine - Test Data Generator"
echo "=========================================="
echo ""
echo "Ten skrypt wygeneruje dane testowe dla:"
echo "  - 4 miast (Kraków, Warszawa, Wrocław, Trójmiasto)"
echo "  - 3 profili (foot, bicycle, car)"
echo "  - 12 zestawów danych OSRM"
echo ""
echo "UWAGA: Ten proces może zająć 30-60 minut!"
echo ""

# Sprawdzenie czy osmium jest zainstalowane
if ! command -v osmium &> /dev/null; then
    echo "❌ Błąd: osmium-tool nie jest zainstalowany"
    echo ""
    echo "Instalacja:"
    echo "  macOS:   brew install osmium-tool"
    echo "  Ubuntu:  sudo apt-get install osmium-tool"
    exit 1
fi

# Sprawdzenie czy Docker działa
if ! docker ps &> /dev/null; then
    echo "❌ Błąd: Docker nie jest uruchomiony"
    echo "Uruchom Docker Desktop i spróbuj ponownie"
    exit 1
fi

echo "✓ Narzędzia są zainstalowane"
echo ""

# Definicje miast i ich regionów źródłowych
# Format: city:region
CITY_MAPPINGS=(
    "krakow:malopolskie"
    "warszawa:mazowieckie"
    "wroclaw:dolnoslaskie"
    "trojmiasto:pomorskie"
)

# Profile do wygenerowania
PROFILES=("foot" "bicycle" "car")

# Funkcja do pobierania mapy regionu jeśli nie istnieje
download_region_if_needed() {
    local region=$1
    local region_file="$DATA_DIR/map-${region}.osm.pbf"
    
    if [ ! -f "$region_file" ]; then
        echo "⬇️  Pobieranie mapy regionu: $region..."
        "$SCRIPT_DIR/download-map.sh" "$region"
    else
        echo "✓ Mapa regionu $region już istnieje"
    fi
}

# Funkcja do wycinania mapy miasta
extract_city_if_needed() {
    local region=$1
    local city=$2
    local city_file="$DATA_DIR/${city}.osm.pbf"
    
    if [ ! -f "$city_file" ]; then
        echo "✂️  Wycinanie mapy dla miasta: $city..."
        "$SCRIPT_DIR/extract-city.sh" "$region" "$city"
    else
        echo "✓ Mapa miasta $city już istnieje"
    fi
}

# Funkcja do przetwarzania danych OSRM
prepare_osrm_if_needed() {
    local city=$1
    local profile=$2
    local osrm_file="$DATA_DIR/${city}-${profile}.osrm"
    
    if [ ! -f "$osrm_file" ]; then
        echo "⚙️  Przetwarzanie OSRM: $city / $profile..."
        "$SCRIPT_DIR/prepare-city-osrm.sh" "$city" "$profile"
    else
        echo "✓ Dane OSRM $city/$profile już istnieją"
    fi
}

echo "=========================================="
echo "KROK 1: Pobieranie map regionalnych"
echo "=========================================="
echo ""

for mapping in "${CITY_MAPPINGS[@]}"; do
    city="${mapping%:*}"
    region="${mapping#*:}"
    echo "Miasto: $city (region: $region)"
    download_region_if_needed "$region"
    echo ""
done

echo "=========================================="
echo "KROK 2: Wycinanie map miast"
echo "=========================================="
echo ""

for mapping in "${CITY_MAPPINGS[@]}"; do
    city="${mapping%:*}"
    region="${mapping#*:}"
    echo "Wycinanie: $city z regionu $region"
    extract_city_if_needed "$region" "$city"
    echo ""
done

echo "=========================================="
echo "KROK 3: Przetwarzanie danych OSRM"
echo "=========================================="
echo ""

for mapping in "${CITY_MAPPINGS[@]}"; do
    city="${mapping%:*}"
    for profile in "${PROFILES[@]}"; do
        echo "Przetwarzanie: $city / $profile"
        prepare_osrm_if_needed "$city" "$profile"
        echo ""
    done
done

echo "=========================================="
echo "✅ GENEROWANIE ZAKOŃCZONE POMYŚLNIE!"
echo "=========================================="
echo ""
echo "Wygenerowano dane dla:"
for mapping in "${CITY_MAPPINGS[@]}"; do
    city="${mapping%:*}"
    echo "  📍 $city: foot, bicycle, car"
done
echo ""
echo "Następny krok: Uruchom serwery OSRM"
echo "  ./scripts/start-all-servers.sh"
echo ""
