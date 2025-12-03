#!/usr/bin/env bash

# Skrypt do uruchamiania wszystkich serwerów OSRM
# US 8.2: Route profile selection - uruchomienie serwerów dla wszystkich profili

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================="
echo "WTG Route Machine - Start All Servers"
echo "=========================================="
echo ""

# Definicje portów zgodnie z konfiguracją frontend (map.js)
# Kraków: 5001 (foot), 5002 (bicycle), 5003 (car)
# Warszawa: 5004 (foot), 5005 (bicycle), 5006 (car)
# Wrocław: 5007 (foot), 5008 (bicycle), 5009 (car)
# Trójmiasto: 5010 (foot), 5011 (bicycle), 5012 (car)

declare -A SERVER_CONFIG=(
    ["krakow-foot"]=5001
    ["krakow-bicycle"]=5002
    ["krakow-car"]=5003
    ["warszawa-foot"]=5004
    ["warszawa-bicycle"]=5005
    ["warszawa-car"]=5006
    ["wroclaw-foot"]=5007
    ["wroclaw-bicycle"]=5008
    ["wroclaw-car"]=5009
    ["trojmiasto-foot"]=5010
    ["trojmiasto-bicycle"]=5011
    ["trojmiasto-car"]=5012
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
