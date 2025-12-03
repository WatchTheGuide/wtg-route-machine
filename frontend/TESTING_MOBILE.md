# Testowanie aplikacji mobilnej - Quick Start

## 🤖 Android

### 1. Otwórz projekt w Android Studio

```bash
cd frontend
npm run open:android
```

### 2. Uruchom na emulatorze

1. W Android Studio kliknij **Device Manager** (ikona telefonu w prawym górnym rogu)
2. Utwórz nowy wirtualny device (np. Pixel 6, API 33)
3. Kliknij ▶ **Run 'app'**

### 3. Uruchom na fizycznym urządzeniu

1. Na telefonie: **Ustawienia → O telefonie → Informacje o oprogramowaniu**
2. Kliknij 7 razy **Numer kompilacji** (aktywacja trybu dewelopera)
3. **Ustawienia → Opcje programisty → Debugowanie USB** ✅
4. Podłącz telefon USB
5. Zaakceptuj "Zezwolić na debugowanie USB"
6. W Android Studio wybierz swoje urządzenie z listy
7. Kliknij ▶ **Run**

### Rozwiązywanie problemów

**Device not found:**

```bash
# macOS - zainstaluj Android Platform Tools
brew install android-platform-tools
adb devices
```

**App crashes on start:**

- Sprawdź logi w Android Studio: **Logcat** (dolny panel)
- Szukaj czerwonych błędów

---

## 🍎 iOS

### 1. Otwórz projekt w Xcode

```bash
cd frontend
npm run open:ios
```

### 2. Uruchom na symulatorze

1. W Xcode wybierz Scheme: **App**
2. Wybierz symulator z listy (np. iPhone 14)
3. Kliknij ▶ **Run** (lub Cmd+R)

### 3. Uruchom na fizycznym urządzeniu

⚠️ **Wymagane: Konto Apple Developer** (darmowe wystarczy do testów)

1. Podłącz iPhone/iPad do Mac (USB lub WiFi)
2. Na telefonie: **Ustawienia → Ogólne → VPN i zarządzanie urządzeniami**
3. W Xcode:
   - Wybierz projekt **App** w nawigatorze
   - Zakładka **Signing & Capabilities**
   - Wybierz swój **Team** (Apple ID)
4. Wybierz swoje urządzenie z listy
5. Kliknij ▶ **Run**

**Pierwszy raz:** Telefon wyświetli błąd "Untrusted Developer"

- Na telefonie: **Ustawienia → Ogólne → VPN i zarządzanie urządzeniami**
- Kliknij na swoją firmę/email
- **Ufaj "XXX"**

### Rozwiązywanie problemów

**Signing error:**

- Zmień Bundle Identifier na unikalny (np. `com.TwojeImie.wtg`)
- Signing → Automatically manage signing ✅

**Pod install failed:**

```bash
cd ios/App
pod deintegrate
pod install --repo-update
cd ../..
npm run sync:ios
```

---

## 🌐 Testowanie API

### Połączenie z lokalnym OSRM

⚠️ **Localhost nie działa na urządzeniu mobilnym!**

**Rozwiązanie 1: Użyj IP komputera**

1. Sprawdź swoje IP:

   ```bash
   # macOS/Linux
   ifconfig | grep "inet "
   # Szukaj czegoś jak: 192.168.1.100
   ```

2. Edytuj `frontend/js/routing.js`:

   ```javascript
   const OSRM_BASE_URL = 'http://192.168.1.100'; // Twoje IP
   ```

3. Przebuduj:
   ```bash
   npm run sync
   ```

**Rozwiązanie 2: Hostuj publicznie**

- Użyj ngrok: `ngrok http 5001`
- Zmień URL w `routing.js` na otrzymany adres ngrok

---

## 📱 Funkcje do przetestowania

### ✅ Geolokalizacja

- [ ] Aplikacja pyta o uprawnienia lokalizacji
- [ ] Pierwszy punkt dodany automatycznie (GPS)
- [ ] Mapa centruje się na lokalizacji użytkownika

### ✅ Mapa

- [ ] Dotyk/przeciąganie mapy działa płynnie
- [ ] Zoom (pinch) działa
- [ ] Przyciski zoom (+/-) działają

### ✅ Dodawanie punktów

- [ ] Dotknięcie mapy dodaje waypoint
- [ ] Marker pojawia się w odpowiednim miejscu
- [ ] Liczby na markerach są widoczne

### ✅ Routing

- [ ] Po dodaniu 2+ punktów pojawia się trasa
- [ ] Zmiana profilu (foot/bike/car) przelicza trasę
- [ ] Informacje o trasie wyświetlają się (dystans, czas)

### ✅ Sidebar

- [ ] Lista punktów jest przewijalna
- [ ] Drag & drop punktów działa
- [ ] Usuwanie punktu działa
- [ ] Instrukcje nawigacji są czytelne

### ✅ Wyszukiwanie

- [ ] Wyszukiwanie adresów działa
- [ ] Wyniki są czytelne
- [ ] Wybór wyniku dodaje punkt na mapie

### ✅ Dark mode

- [ ] Przełącznik w nagłówku działa
- [ ] Wszystkie elementy czytelne w dark mode
- [ ] Preferencja zapisuje się

### ✅ Eksport

- [ ] GeoJSON pobiera się poprawnie
- [ ] PDF generuje się i pobiera

---

## 🐛 Sprawdzanie logów

### Android

```bash
# Terminal
adb logcat | grep Capacitor

# Lub w Android Studio: View → Tool Windows → Logcat
```

### iOS

```bash
# Xcode: View → Debug Area → Show Debug Area
# Lub: Cmd+Shift+Y
```

---

## 📐 Safe Areas (Bezpieczne obszary)

### Czym są Safe Areas?

Na nowoczesnych urządzeniach mobilnych interfejs może nachodzić na:

- **iPhone:** Notch, Dynamic Island, zaokrąglone rogi
- **Android:** Hole-punch camera, przyciski nawigacji

Safe areas zapewniają, że ważna treść nie jest zasłonięta przez elementy systemowe.

### Implementacja w aplikacji

Aplikacja używa **CSS Environment Variables**:

```css
/* Automatyczne marginesy */
.safe-area-header {
  padding-top: calc(env(safe-area-inset-top) + 1rem);
}

.safe-area-footer {
  padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
}
```

### Testowanie Safe Areas

#### ✅ iPhone z notchem (iPhone X+)

- [ ] Nagłówek nie nachodzi na notch/Dynamic Island
- [ ] Przyciski i tekst widoczne poniżej wycięcia
- [ ] Stopka nad Home Indicator (biały pasek u dołu)

#### ✅ Android z nawigacją gestami

- [ ] Controls bar nie nachodzi na przyciski nawigacji
- [ ] Stopka nad paskiem gestów

#### ✅ Landscape (obrót urządzenia)

- [ ] Treść nie nachodzi na boki w poziomie
- [ ] Sidebar ma odpowiednie marginesy

### Wartości safe-area na urządzeniach

| Urządzenie    | Top  | Bottom | Left/Right |
| ------------- | ---- | ------ | ---------- |
| iPhone 14 Pro | 59px | 34px   | 0px        |
| iPhone SE     | 20px | 0px    | 0px        |
| Pixel 7 Pro   | 32px | 0px    | 0px        |

### Rozwiązywanie problemów

**Treść nachodzi na status bar:**

1. Sprawdź `viewport-fit=cover` w meta tag
2. Przebuduj: `npm run sync`
3. Usuń app z urządzenia i zainstaluj ponownie

**Safe areas nie działają:**

1. Upewnij się że `capacitor.config.json` ma `contentInset: "always"`
2. Sprawdź `StatusBar.setOverlaysWebView({ overlay: true })`

---

## 📊 Metryki wydajności

Sprawdź w ustawieniach dewelopera:

- **Android**: GPU rendering profile, Overdraw
- **iOS**: Instruments → Time Profiler

Dobra aplikacja:

- Płynne 60 FPS podczas przewijania
- Czas uruchomienia < 3s
- Responsywne gesty (< 100ms opóźnienia)

---

## 🚀 Gotowe do publikacji?

Jeśli wszystkie testy przeszły ✅, przejdź do:

**[MOBILE_BUILD.md](MOBILE_BUILD.md)** - Sekcja "Publikacja w Google Play / App Store"
