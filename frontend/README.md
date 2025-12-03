# Frontend - WTG Route Machine

Interfejs webowy do testowania i demonstracji funkcjonalności routingu pieszego OSRM.

## Struktura

```
frontend/
├── index.html              # Główna strona aplikacji
├── css/
│   └── style.css          # Dodatkowe style (Tailwind przez CDN)
├── js/
│   ├── map.js             # Inicjalizacja mapy OpenLayers
│   ├── routing.js         # Komunikacja z OSRM API
│   └── ui.js              # Obsługa interfejsu użytkownika
└── assets/
    └── markers/           # Ikony markerów (opcjonalnie)
```

## Technologie

- **Mapa**: OpenLayers 9.x (via CDN)
- **Stylowanie**: Tailwind CSS (via CDN)
- **JavaScript**: Vanilla JS (ES6+)
- **Warstwa mapowa**: OpenStreetMap tiles

## Jak uruchomić

### Metoda 1: Bezpośrednio w przeglądarce

Otwórz `index.html` w przeglądarce:

```bash
open frontend/index.html
```

### Metoda 2: Prosty serwer HTTP (zalecane)

```bash
# Python 3
cd frontend
python3 -m http.server 8000

# Lub Python 2
python -m SimpleHTTPServer 8000
```

Następnie otwórz: http://localhost:8000

## Konfiguracja

### Porty OSRM dla miast

Aplikacja łączy się z lokalnymi serwerami OSRM:

- **Kraków**: `http://localhost:5001`
- **Warszawa**: `http://localhost:5002`
- **Wrocław**: `http://localhost:5003`
- **Trójmiasto**: `http://localhost:5004`

Upewnij się, że odpowiedni serwer OSRM jest uruchomiony dla wybranego miasta:

```bash
cd ../backend
./scripts/run-city-server.sh krakow 5001
```

## Funkcjonalności

- ✅ Interaktywna mapa z OpenStreetMap
- ✅ Dodawanie punktów trasy kliknięciem
- ✅ Przesuwanie markerów (drag & drop)
- ✅ Automatyczne wyznaczanie tras pieszych
- ✅ Wyświetlanie dystansu i czasu
- ✅ Instrukcje nawigacyjne (turn-by-turn)
- ✅ Zmiana miasta (dropdown)
- ✅ Eksport trasy do GeoJSON
- ✅ Responsywny design

## Troubleshooting

### Trasa się nie wyświetla

1. Sprawdź, czy serwer OSRM jest uruchomiony:

   ```bash
   docker ps | grep osrm
   ```

2. Sprawdź połączenie z API:
   ```bash
   curl "http://localhost:5001/nearest/v1/foot/19.9385,50.0647"
   ```

### Problemy z CORS

Nie powinny wystąpić przy lokalnym developmencie, ale jeśli pojawią się:

- Użyj prostego serwera HTTP (nie otwieraj `index.html` bezpośrednio)
- Upewnij się, że OSRM działa na `localhost`, nie `127.0.0.1`

## 📱 Wersja mobilna (Android & iOS)

Aplikacja może być opublikowana w **Google Play** i **Apple App Store** dzięki Capacitor.

### Szybki start mobilny

```bash
# Instalacja zależności
npm install

# Budowanie aplikacji webowej
npm run build

# Synchronizacja z platformami
npm run sync

# Otwórz w Android Studio lub Xcode
npm run open:android
npm run open:ios
```

### Pełna dokumentacja buildu

Zobacz szczegółową instrukcję: **[MOBILE_BUILD.md](./MOBILE_BUILD.md)**

Zawiera:

- Wymagania dla Android i iOS
- Generowanie kluczy podpisujących
- Konfiguracja App Store i Google Play
- Instrukcje publikacji
- Rozwiązywanie problemów

## Rozwój

Wszystkie User Stories znajdują się w `../user_stories/web_interface.md`.

Implementacja podzielona na fazy:

1. **MVP**: Mapa + routing + podstawowe info
2. **Interakcje**: Drag & drop, usuwanie punktów
3. **Rozszerzenia**: Turn-by-turn, zmiana miasta, eksport
4. **Mobile**: Capacitor + publikacja w sklepach

## Dokumentacja API

Zobacz: `../backend/README.md` - sekcja OSRM API
