#!/usr/bin/env bash

# Skrypt do pełnego deploymentu miasta
# Pobiera, ekstrahuje, przetwarza i uruchamia kontenery dla wybranego miasta
#
# Użycie: ./deploy-city.sh [miasto] [region]
# Przykład: ./deploy-city.sh warszawa mazowieckie
#
# Dostępne miasta i regiony:
#   krakow       malopolskie
#   warszawa     mazowieckie
#   wroclaw      dolnoslaskie
#   trojmiasto   pomorskie

set -e

CITY=$1
REGION=$2
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

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

# Walidacja argumentów
if [ -z "$CITY" ] || [ -z "$REGION" ]; then
    echo "Użycie: $0 [miasto] [region]"
    echo ""
    echo "Dostępne kombinacje miasto-region:"
    echo "  krakow       malopolskie"
    echo "  warszawa     mazowieckie"
    echo "  wroclaw      dolnoslaskie"
    echo "  trojmiasto   pomorskie"
    exit 1
fi

# Walidacja miasta
case $CITY in
    krakow|warszawa|wroclaw|trojmiasto)
        ;;
    *)
        log_error "Nieznane miasto: $CITY"
        echo "Dostępne miasta: krakow, warszawa, wroclaw, trojmiasto"
        exit 1
        ;;
esac

# Walidacja regionu
case $REGION in
    malopolskie|mazowieckie|dolnoslaskie|pomorskie)
        ;;
    *)
        log_error "Nieznany region: $REGION"
        echo "Dostępne regiony: malopolskie, mazowieckie, dolnoslaskie, pomorskie"
        exit 1
        ;;
esac

cd "$BACKEND_DIR"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  WTG Route Machine - Deployment: $CITY"
echo "═══════════════════════════════════════════════════════════"
echo ""

START_TIME=$(date +%s)

# ============================================
# Krok 1: Pobieranie mapy regionu
# ============================================
log_info "Krok 1/5: Pobieranie mapy regionu $REGION..."

MAP_FILE="./osrm-data/map-${REGION}.osm.pbf"
if [ -f "$MAP_FILE" ]; then
    log_warning "Mapa regionu już istnieje: $MAP_FILE"
    echo "         Pomiń pobieranie (użyj --force aby pobrać ponownie)"
else
    "$SCRIPT_DIR/download-map.sh" "$REGION"
    log_success "Mapa regionu pobrana"
fi

# ============================================
# Krok 2: Ekstrakcja miasta
# ============================================
log_info "Krok 2/5: Ekstrakcja mapy miasta $CITY..."

CITY_FILE="./osrm-data/${CITY}.osm.pbf"
if [ -f "$CITY_FILE" ]; then
    log_warning "Mapa miasta już istnieje: $CITY_FILE"
    echo "         Pomiń ekstrakcję (usuń plik aby wyekstrahować ponownie)"
else
    "$SCRIPT_DIR/extract-city.sh" "$REGION" "$CITY"
    log_success "Mapa miasta wyekstrahowana"
fi

# ============================================
# Krok 3: Przetwarzanie dla każdego profilu
# ============================================
log_info "Krok 3/5: Przetwarzanie danych OSRM dla wszystkich profili..."

for profile in foot bicycle car; do
    OSRM_FILE="./osrm-data/${CITY}-${profile}.osrm"
    if [ -f "$OSRM_FILE" ]; then
        log_warning "Dane OSRM dla $profile już istnieją"
    else
        log_info "Przetwarzanie profilu: $profile..."
        "$SCRIPT_DIR/prepare-city-osrm.sh" "$CITY" "$profile"
        log_success "Profil $profile przetworzony"
    fi
done

log_success "Wszystkie profile przetworzone"

# ============================================
# Krok 4: Uruchomienie kontenerów
# ============================================
log_info "Krok 4/5: Uruchamianie kontenerów Docker..."

# Określ porty dla miasta
case $CITY in
    krakow)
        FOOT_PORT=5001
        BICYCLE_PORT=5002
        CAR_PORT=5003
        ;;
    warszawa)
        FOOT_PORT=5011
        BICYCLE_PORT=5012
        CAR_PORT=5013
        ;;
    wroclaw)
        FOOT_PORT=5021
        BICYCLE_PORT=5022
        CAR_PORT=5023
        ;;
    trojmiasto)
        FOOT_PORT=5031
        BICYCLE_PORT=5032
        CAR_PORT=5033
        ;;
esac

# Uruchom kontenery
"$SCRIPT_DIR/run-city-server.sh" "$CITY" "foot" "$FOOT_PORT"
"$SCRIPT_DIR/run-city-server.sh" "$CITY" "bicycle" "$BICYCLE_PORT"
"$SCRIPT_DIR/run-city-server.sh" "$CITY" "car" "$CAR_PORT"

log_success "Wszystkie kontenery uruchomione"

# ============================================
# Krok 5: Weryfikacja
# ============================================
log_info "Krok 5/5: Weryfikacja deploymentu..."

sleep 5  # Poczekaj na uruchomienie kontenerów

VERIFICATION_FAILED=0

for port in $FOOT_PORT $BICYCLE_PORT $CAR_PORT; do
    if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
        log_success "Kontener na porcie $port odpowiada"
    else
        log_error "Kontener na porcie $port nie odpowiada!"
        VERIFICATION_FAILED=1
    fi
done

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo ""
echo "═══════════════════════════════════════════════════════════"

if [ $VERIFICATION_FAILED -eq 0 ]; then
    log_success "Deployment $CITY zakończony pomyślnie!"
    echo ""
    echo "  Czas trwania: ${DURATION} sekund"
    echo ""
    echo "  Dostępne endpointy:"
    echo "    - Foot:    http://localhost:$FOOT_PORT"
    echo "    - Bicycle: http://localhost:$BICYCLE_PORT"
    echo "    - Car:     http://localhost:$CAR_PORT"
    echo ""
    echo "  Przykładowe zapytanie:"
    echo "    curl \"http://localhost:$FOOT_PORT/nearest/v1/foot/19.9385,50.0647\""
else
    log_error "Deployment $CITY zakończony z błędami!"
    echo ""
    echo "  Sprawdź logi kontenerów:"
    echo "    docker logs osrm-${CITY}-foot"
    echo "    docker logs osrm-${CITY}-bicycle"
    echo "    docker logs osrm-${CITY}-car"
    exit 1
fi

echo "═══════════════════════════════════════════════════════════"
echo ""
