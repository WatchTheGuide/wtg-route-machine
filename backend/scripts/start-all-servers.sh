#!/usr/bin/env bash

# Skrypt do uruchamiania wszystkich serwerów OSRM
# Obsługuje 4 miasta × 3 profile = 12 kontenerów
#
# Mapowanie portów:
#   Kraków:     5001 (foot), 5002 (bicycle), 5003 (car)
#   Warszawa:   5011 (foot), 5012 (bicycle), 5013 (car)
#   Wrocław:    5021 (foot), 5022 (bicycle), 5023 (car)
#   Trójmiasto: 5031 (foot), 5032 (bicycle), 5033 (car)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "WTG Route Machine - Start All Servers"
echo "=========================================="
echo ""

# Nowe mapowanie portów - systematyczne (miasto_base + profile_offset)
# Miasto:       Kraków=5000, Warszawa=5010, Wrocław=5020, Trójmiasto=5030
# Profil:       foot=1, bicycle=2, car=3
declare -A SERVER_CONFIG=(
    ["krakow-foot"]=5001
    ["krakow-bicycle"]=5002
    ["krakow-car"]=5003
    ["warszawa-foot"]=5011
    ["warszawa-bicycle"]=5012
    ["warszawa-car"]=5013
    ["wroclaw-foot"]=5021
    ["wroclaw-bicycle"]=5022
    ["wroclaw-car"]=5023
    ["trojmiasto-foot"]=5031
    ["trojmiasto-bicycle"]=5032
    ["trojmiasto-car"]=5033
)

echo "Uruchamianie 12 serwerów OSRM..."
echo ""

SUCCESS_COUNT=0
FAILED_COUNT=0
SKIPPED_COUNT=0

for key in "${!SERVER_CONFIG[@]}"; do
    IFS='-' read -r city profile <<< "$key"
    port="${SERVER_CONFIG[$key]}"
    
    echo "▶️  Uruchamianie: $city / $profile (port $port)"
    
    # Sprawdzenie czy dane istnieją
    if [ ! -f "$SCRIPT_DIR/../osrm-data/${city}-${profile}.osrm.fileIndex" ]; then
        echo "⚠️  Pominięto: brak danych dla $city/$profile"
        ((SKIPPED_COUNT++))
        echo ""
        continue
    fi
    
    # Uruchomienie serwera
    if "$SCRIPT_DIR/run-city-server.sh" "$city" "$profile" "$port" > /dev/null 2>&1; then
        echo "✅ Uruchomiono: $city / $profile -> http://localhost:$port"
        ((SUCCESS_COUNT++))
    else
        echo "❌ Błąd: nie udało się uruchomić $city / $profile"
        ((FAILED_COUNT++))
    fi
    
    echo ""
    sleep 1  # Krótka pauza między uruchomieniami
done

echo "=========================================="
echo "PODSUMOWANIE"
echo "=========================================="
echo "✅ Uruchomione:  $SUCCESS_COUNT"
echo "❌ Błędy:        $FAILED_COUNT"
echo "⚠️  Pominięte:    $SKIPPED_COUNT"
echo ""

if [ $SUCCESS_COUNT -gt 0 ]; then
    echo "Sprawdź status wszystkich kontenerów:"
    echo "  docker ps --filter \"name=osrm\""
    echo ""
    echo "Zatrzymaj wszystkie serwery:"
    echo "  docker stop \$(docker ps -q --filter \"name=osrm\")"
    echo ""
fi

if [ $SKIPPED_COUNT -gt 0 ]; then
    echo "⚠️  Aby wygenerować brakujące dane, uruchom:"
    echo "  ./scripts/generate-all-test-data.sh"
    echo ""
fi
