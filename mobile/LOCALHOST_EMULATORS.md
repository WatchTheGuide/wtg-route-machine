# Łączenie z localhost w emulatorach/symulatorach

## Problem

Aplikacje mobilne uruchomione w emulatorach/symulatorach nie mogą bezpośrednio łączyć się z `localhost` Twojego komputera, ponieważ `localhost` dla nich oznacza **ich własne urządzenie**.

## Automatyczne rozwiązanie ✅ (zaimplementowane)

Aplikacja automatycznie wykrywa platformę i używa odpowiedniego URL:

```typescript
// mobile/src/config/api.ts
import { Capacitor } from '@capacitor/core';

function getLocalhostUrl(port: number): string {
  const platform = Capacitor.getPlatform();

  if (platform === 'android') {
    return `http://10.0.2.2:${port}`; // Android Emulator special IP
  }

  return `http://localhost:${port}`; // iOS Simulator & Web
}
```

### Jak to działa:

| Platforma              | URL                       | Wyjaśnienie                                          |
| ---------------------- | ------------------------- | ---------------------------------------------------- |
| **iOS Simulator**      | `http://localhost:5001`   | Simulator dzieli sieć z macOS, `localhost` działa ✅ |
| **Android Emulator**   | `http://10.0.2.2:5001`    | `10.0.2.2` to specjalne IP wskazujące na hosta ✅    |
| **Web (przegladarka)** | `http://localhost:5001`   | Standardowy localhost ✅                             |
| **iOS Device**         | `http://192.168.x.x:5001` | Wymaga prawdziwego IP (patrz niżej)                  |
| **Android Device**     | `http://192.168.x.x:5001` | Wymaga prawdziwego IP (patrz niżej)                  |

## Alternatywne rozwiązania

### Opcja 1: Użyj IP komputera w sieci lokalnej (dla fizycznych urządzeń)

#### Krok 1: Znajdź IP swojego Maca

```bash
# macOS
ipconfig getifaddr en0  # WiFi
# lub
ifconfig | grep "inet " | grep -v 127.0.0.1

# Przykład: 192.168.1.100
```

#### Krok 2: Zaktualizuj .env.development

```env
# mobile/.env.development
VITE_TOURS_API_URL=http://192.168.1.100:3002/api/tours
VITE_OSRM_API_URL=http://192.168.1.100:5001
VITE_POIS_API_URL=http://192.168.1.100:3001/api/pois
```

#### Krok 3: Rebuild aplikacji

```bash
npm run build
npx cap sync
```

**Kiedy używać:**

- ✅ Testowanie na **fizycznym urządzeniu iOS/Android**
- ✅ Urządzenie i komputer w tej samej sieci WiFi
- ❌ Nie działa w emulatorach (emulator nie widzi sieci lokalnej)

---

### Opcja 2: Tunel z ngrok (dla zdalnego testowania)

#### Krok 1: Zainstaluj ngrok

```bash
brew install ngrok
```

#### Krok 2: Uruchom tunel

```bash
# Tours API
ngrok http 3002

# OSRM
ngrok http 5001
```

Otrzymasz publiczny URL, np.: `https://abc123.ngrok.io`

#### Krok 3: Zaktualizuj .env.development

```env
VITE_TOURS_API_URL=https://abc123.ngrok.io/api/tours
VITE_OSRM_API_URL=https://def456.ngrok.io
```

**Kiedy używać:**

- ✅ Testowanie na fizycznych urządzeniach **poza siecią lokalną**
- ✅ Współpraca z testerami (wyślij im URL)
- ✅ HTTPS wymagane (np. geolocation API)
- ❌ Wymaga aktywnego połączenia internetowego
- ❌ Darmowa wersja ma limity

---

### Opcja 3: Reverse proxy (nginx/Caddy)

Skonfiguruj reverse proxy na Macu, który przekierowuje ruch z jednego portu.

#### nginx configuration:

```nginx
server {
    listen 8080;

    location /api/tours {
        proxy_pass http://localhost:3002/api/tours;
    }

    location /osrm {
        proxy_pass http://localhost:5001;
    }
}
```

**Kiedy używać:**

- ✅ Potrzebujesz jednego endpoint dla wielu serwisów
- ✅ Chcesz dodać HTTPS lokalnie
- ❌ Więcej konfiguracji

---

## Testowanie połączenia

### Z emulatora/symulatora:

```typescript
// W DevTools aplikacji (Safari/Chrome DevTools)
fetch('http://10.0.2.2:3002/api/tours/cities')
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

### Z terminala (symuluj request emulatora):

```bash
# iOS Simulator
curl http://localhost:3002/api/tours/cities

# Android Emulator (z adb shell)
adb shell
curl http://10.0.2.2:3002/api/tours/cities
```

---

## Debugowanie problemów

### Problem: "Network request failed"

**Sprawdź:**

1. Czy serwer backend działa?

   ```bash
   docker ps | grep tours-server
   curl http://localhost:3002/api/tours/cities
   ```

2. Czy firewall nie blokuje połączeń?

   ```bash
   # macOS - sprawdź Firewall settings
   # System Preferences > Security & Privacy > Firewall
   ```

3. Czy używasz prawidłowego IP?
   ```typescript
   // Dodaj logging w api.ts
   console.log('API Base URL:', API_CONFIG.toursBaseUrl);
   ```

### Problem: "CORS Error"

Backend musi zezwalać na requesty z różnych origin:

```typescript
// backend/tours-server/src/app.ts
app.use(
  cors({
    origin: '*', // Development - zezwól na wszystkie
    credentials: true,
  })
);
```

### Problem: Android Emulator - "Failed to connect to /10.0.2.2:3002"

**Rozwiązanie:**

1. Upewnij się, że serwer nasłuchuje na `0.0.0.0`, nie tylko `localhost`:

   ```bash
   # W docker-compose.yml lub przy uruchamianiu serwera
   HOST=0.0.0.0 npm start
   ```

2. Sprawdź czy port forwarding działa:
   ```bash
   adb forward tcp:3002 tcp:3002
   ```

---

## Dla produkcji

W produkcji używaj prawdziwych URL-i:

```env
# mobile/.env.production
VITE_TOURS_API_URL=https://api.watchtheguide.com/tours
VITE_OSRM_API_URL=https://routing.watchtheguide.com
VITE_API_KEY=your-production-api-key
VITE_REQUIRE_API_KEY=true
```

---

## Podsumowanie

✅ **Aktualnie zaimplementowane:**

- Automatyczna detekcja platformy (iOS/Android/Web)
- `10.0.2.2` dla Android Emulator
- `localhost` dla iOS Simulator i Web

✅ **Najlepsze praktyki:**

- Development: Używaj automatycznej detekcji (już działa)
- Testing na urządzeniach: Użyj IP sieci lokalnej (192.168.x.x)
- Production: Użyj publicznych URL-i w .env.production

✅ **Testowanie:**

```bash
# iOS Simulator
npx cap run ios

# Android Emulator
npx cap run android

# Web (dev)
npm run dev
```

Wszystko powinno działać out-of-the-box! 🚀
