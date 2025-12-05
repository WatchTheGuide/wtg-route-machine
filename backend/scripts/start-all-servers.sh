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

# Konfiguracja serwerów
CITIES="krakow warszawa wroclaw trojmiasto"
PROFILES="foot bicycle car"

# Funkcja do pobierania bazowego portu dla miasta
get_base_port() {
    case $1 in
        krakow) echo 5000 ;;
        warszawa) echo 5010 ;;
        wroclaw) echo 5020 ;;
        trojmiasto) echo 5030 ;;
    esac
}

# Funkcja do pobierania offsetu dla profilu
get_profile_offset() {
    case $1 in
        foot) echo 1 ;;
        bicycle) echo 2 ;;
        car) echo 3 ;;
    esac
}

echo "Uruchamianie 12 serwerów OSRM..."
echo ""

SUCCESS_COUNT=0
FAILED_COUNT=0
SKIPPED_COUNT=0

for city in $CITIES; do
    for profile in $PROFILES; do
        base_port=$(get_base_port "$city")
        offset=$(get_profile_offset "$profile")
        port=$((base_port + offset))
        
        echo "▶️  Uruchamianie: $city / $profile (port $port)"
        
        # Sprawdzenie czy dane istnieją
        if [ ! -f "$SCRIPT_DIR/../osrm-data/${city}-${profile}.osrm.fileIndex" ]; then
            echo "⚠️  Pominięto: brak danych dla $city/$profile"
            SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
            echo ""
            continue
        fi
        
        # Uruchomienie serwera
        if "$SCRIPT_DIR/run-city-server.sh" "$city" "$profile" "$port" > /dev/null 2>&1; then
            echo "✅ Uruchomiono: $city / $profile -> http://localhost:$port"
            SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
        else
            echo "❌ Błąd: nie udało się uruchomić $city / $profile"
            FAILED_COUNT=$((FAILED_COUNT + 1))
        fi
        
        echo ""
        sleep 1  # Krótka pauza między uruchomieniami
    done
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
