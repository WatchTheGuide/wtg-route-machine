#!/usr/bin/env bash

# Skrypt do deploymentu wszystkich obsługiwanych miast
# Uruchamia deploy-city.sh dla każdego miasta
#
# Użycie: ./deploy-all-cities.sh
#
# Obsługiwane miasta:
#   - Kraków (małopolskie)
#   - Warszawa (mazowieckie)
#   - Wrocław (dolnośląskie)
#   - Trójmiasto (pomorskie)

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  WTG Route Machine - Deploy All Cities                        ║"
echo "║  Kraków • Warszawa • Wrocław • Trójmiasto                     ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

START_TIME=$(date +%s)

# Mapa miasto -> region
declare -A CITY_REGIONS
CITY_REGIONS[krakow]="malopolskie"
CITY_REGIONS[warszawa]="mazowieckie"
CITY_REGIONS[wroclaw]="dolnoslaskie"
CITY_REGIONS[trojmiasto]="pomorskie"

FAILED_CITIES=()
SUCCESSFUL_CITIES=()

for city in krakow warszawa wroclaw trojmiasto; do
    region=${CITY_REGIONS[$city]}
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    log_info "Deploying: $city ($region)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if "$SCRIPT_DIR/deploy-city.sh" "$city" "$region"; then
        SUCCESSFUL_CITIES+=("$city")
        log_success "$city deployed successfully"
    else
        FAILED_CITIES+=("$city")
        log_error "$city deployment failed"
    fi
done

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
DURATION_MIN=$((DURATION / 60))
DURATION_SEC=$((DURATION % 60))

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║  DEPLOYMENT SUMMARY                                           ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
echo "  Czas trwania: ${DURATION_MIN}m ${DURATION_SEC}s"
echo ""
echo "  Pomyślne (${#SUCCESSFUL_CITIES[@]}/4):"
for city in "${SUCCESSFUL_CITIES[@]}"; do
    echo "    ✓ $city"
done
echo ""

if [ ${#FAILED_CITIES[@]} -gt 0 ]; then
    echo "  Nieudane (${#FAILED_CITIES[@]}/4):"
    for city in "${FAILED_CITIES[@]}"; do
        echo "    ✗ $city"
    done
    echo ""
    log_error "Niektóre miasta nie zostały wdrożone poprawnie"
    exit 1
else
    log_success "Wszystkie miasta wdrożone pomyślnie!"
fi

echo ""
echo "  Porty kontenerów:"
echo "    Kraków:     5001 (foot), 5002 (bicycle), 5003 (car)"
echo "    Warszawa:   5011 (foot), 5012 (bicycle), 5013 (car)"
echo "    Wrocław:    5021 (foot), 5022 (bicycle), 5023 (car)"
echo "    Trójmiasto: 5031 (foot), 5032 (bicycle), 5033 (car)"
echo ""
echo "  Następne kroki:"
echo "    1. Zaktualizuj konfigurację Nginx"
echo "    2. Zrestartuj Nginx: sudo systemctl reload nginx"
echo "    3. Przetestuj API: curl https://osrm.watchtheguide.com/health"
echo ""
