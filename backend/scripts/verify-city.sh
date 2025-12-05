#!/usr/bin/env bash

# Skrypt weryfikacyjny dla deploymentu miasta
# Sprawdza czy wszystkie kontenery działają i odpowiadają na zapytania
#
# Użycie: ./verify-city.sh [miasto]
# Przykład: ./verify-city.sh krakow
#
# Bez argumentów sprawdza wszystkie miasta

set -e

CITY=$1

# Kolory dla outputu
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Helper function to get city coordinates
get_city_coords() {
    case "$1" in
        krakow) echo "19.9385,50.0647" ;;
        warszawa) echo "21.0122,52.2297" ;;
        wroclaw) echo "17.0385,51.1079" ;;
        trojmiasto) echo "18.6466,54.352" ;;
    esac
}

# Helper function to get city ports
get_city_ports() {
    case "$1" in
        krakow) echo "5001 5002 5003" ;;
        warszawa) echo "5011 5012 5013" ;;
        wroclaw) echo "5021 5022 5023" ;;
        trojmiasto) echo "5031 5032 5033" ;;
    esac
}

verify_city() {
    local city=$1
    local coords=$(get_city_coords "$city")
    local ports=$(get_city_ports "$city")
    local all_ok=true
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "Weryfikacja: $city"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    local port_arr=($ports)
    local profiles_arr=(foot bicycle car)
    
    for i in 0 1 2; do
        local port=${port_arr[$i]}
        local profile=${profiles_arr[$i]}
        local container="osrm-${city}-${profile}"
        
        echo -n "  $container (port $port): "
        
        # Sprawdź czy kontener działa
        if ! docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
            echo -e "${RED}kontener nie działa${NC}"
            all_ok=false
            continue
        fi
        
        # Sprawdź health endpoint
        if ! curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
            echo -e "${YELLOW}health check nieudany${NC}"
            all_ok=false
            continue
        fi
        
        # Sprawdź nearest endpoint z testowymi współrzędnymi
        local response=$(curl -s "http://localhost:$port/nearest/v1/$profile/$coords")
        if echo "$response" | grep -q '"code":"Ok"'; then
            echo -e "${GREEN}OK${NC}"
        else
            echo -e "${YELLOW}nearest query nieudany${NC}"
            all_ok=false
        fi
    done
    
    if $all_ok; then
        log_success "$city - wszystkie testy przeszły"
        return 0
    else
        log_error "$city - niektóre testy nie przeszły"
        return 1
    fi
}

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  WTG Route Machine - Weryfikacja Deploymentu                  ║"
echo "╚═══════════════════════════════════════════════════════════════╝"

FAILED=0

if [ -n "$CITY" ]; then
    # Weryfikuj jedno miasto
    if verify_city "$CITY"; then
        :
    else
        FAILED=1
    fi
else
    # Weryfikuj wszystkie miasta
    for city in krakow warszawa wroclaw trojmiasto; do
        if verify_city "$city"; then
            :
        else
            FAILED=1
        fi
    done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -eq 0 ]; then
    log_success "Wszystkie weryfikacje przeszły pomyślnie!"
else
    log_error "Niektóre weryfikacje nie przeszły"
    exit 1
fi

echo ""
