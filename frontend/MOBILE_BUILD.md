# WTG Route Machine - Mobile Build Guide

Instrukcja budowania i publikowania aplikacji mobilnej w sklepach Google Play i Apple App Store.

## 📱 Wymagania

### Android

- **Android Studio** (najnowsza wersja)
- **Java Development Kit (JDK)** 17 lub nowszy
- **Android SDK** API 33 lub nowszy
- Konto **Google Play Developer** ($25 jednorazowa opłata)

### iOS

- **macOS** (wymagane do budowania aplikacji iOS)
- **Xcode** 14 lub nowszy
- **CocoaPods** (`sudo gem install cocoapods`)
- Konto **Apple Developer** ($99/rok)
- Certyfikaty i profile provisioningowe

## 🚀 Pierwsze kroki

### 1. Instalacja zależności

```bash
cd frontend
npm install
```

### 2. Budowanie aplikacji webowej

```bash
npm run build
```

To polecenie kopiuje wszystkie pliki HTML/CSS/JS do katalogu `www/`.

### 3. Synchronizacja z platformami natywnymi

```bash
# Synchronizuj obie platformy
npm run sync

# Lub osobno:
npm run sync:android
npm run sync:ios
```

## 🤖 Android - Kompilacja i Publikacja

### Otwórz projekt w Android Studio

```bash
npm run open:android
```

### Konfiguracja

1. **Zmień nazwę pakietu** (jeśli potrzeba):

   - Edytuj `android/app/build.gradle`
   - Znajdź `applicationId "com.wtg.routemachine"`
   - Zmień na swoją unikalną nazwę pakietu

2. **Ustaw wersję aplikacji**:

   ```gradle
   versionCode 1
   versionName "1.0.0"
   ```

3. **Ikona aplikacji**:

   - Umieść ikony w `android/app/src/main/res/mipmap-*/`
   - Użyj Android Asset Studio: https://romannurik.github.io/AndroidAssetStudio/

4. **Uprawnienia** (już skonfigurowane w `AndroidManifest.xml`):
   - `ACCESS_FINE_LOCATION` - dla GPS
   - `ACCESS_COARSE_LOCATION` - dla GPS
   - `INTERNET` - dla API OSRM i Nominatim

### Generowanie klucza podpisującego

```bash
cd android
keytool -genkey -v -keystore wtg-release-key.keystore -alias wtg-key -keyalg RSA -keysize 2048 -validity 10000
```

**Zapisz hasło i alias!** Będziesz ich potrzebować.

### Konfiguracja podpisywania

Utwórz plik `android/key.properties`:

```properties
storePassword=twoje_haslo
keyPassword=twoje_haslo_klucza
keyAlias=wtg-key
storeFile=wtg-release-key.keystore
```

Edytuj `android/app/build.gradle` i dodaj przed blokiem `android`:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
```

W bloku `android` dodaj:

```gradle
signingConfigs {
    release {
        keyAlias keystoreProperties['keyAlias']
        keyPassword keystoreProperties['keyPassword']
        storeFile file(keystoreProperties['storeFile'])
        storePassword keystoreProperties['storePassword']
    }
}
buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### Budowanie APK/AAB

```bash
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB (wymagane dla Google Play)
```

Pliki znajdziesz w:

- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### Publikacja w Google Play

1. Zaloguj się do [Google Play Console](https://play.google.com/console/)
2. Utwórz nową aplikację
3. Wypełnij informacje o aplikacji:
   - Tytuł: "WTG Route Machine"
   - Krótki opis (80 znaków)
   - Pełny opis (4000 znaków)
   - Zrzuty ekranu (min. 2)
   - Ikona 512x512 px
4. Prześlij AAB (`app-release.aab`)
5. Wypełnij kwestionariusz treści
6. Ustaw cenę (darmowa/płatna)
7. Wybierz kraje dystrybucji
8. Wyślij do przeglądu (2-7 dni)

## 🍎 iOS - Kompilacja i Publikacja

### Otwórz projekt w Xcode

```bash
npm run open:ios
```

### Konfiguracja

1. **Bundle Identifier**:

   - Wybierz projekt w Xcode
   - Zakładka "Signing & Capabilities"
   - Zmień Bundle Identifier na `com.twoja-firma.wtg`

2. **Zespół deweloperski**:

   - Wybierz swój Apple Developer Team
   - Xcode automatycznie skonfiguruje certyfikaty

3. **Wersja aplikacji**:

   - Version: 1.0.0
   - Build: 1

4. **Ikona aplikacji**:

   - Umieść ikony w `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Użyj narzędzia: https://www.appicon.co/

5. **Uprawnienia** (już skonfigurowane w `Info.plist`):
   - `NSLocationWhenInUseUsageDescription` - "Używamy lokalizacji do wyznaczania tras pieszych"

### Budowanie i archiwizacja

1. W Xcode wybierz:

   - Scheme: "App"
   - Destination: "Any iOS Device (arm64)"

2. Menu: **Product → Archive**

3. Po zakończeniu archiwizacji otwórz **Organizer**

4. Wybierz archiwum i kliknij **Distribute App**

5. Wybierz metodę dystrybucji:
   - **App Store Connect** - dla publikacji w App Store
   - **Ad Hoc** - dla testowania na urządzeniach
   - **Development** - dla wewnętrznych testów

### Publikacja w App Store

1. Zaloguj się do [App Store Connect](https://appstoreconnect.apple.com/)
2. Utwórz nową aplikację
3. Wypełnij informacje:
   - Nazwa: "WTG Route Machine"
   - Podstawowy język: Polski
   - Bundle ID: wybierz z listy
   - SKU: unikalna wartość (np. `wtg-route-001`)
4. Dodaj metadane:
   - Opis aplikacji
   - Słowa kluczowe
   - URL wsparcia
   - URL polityki prywatności
5. Zrzuty ekranu (wszystkie rozmiary iPhone):
   - 6.7" (iPhone 14 Pro Max)
   - 6.5" (iPhone 11 Pro Max)
   - 5.5" (iPhone 8 Plus)
6. Prześlij build z Xcode Organizer lub Transporter
7. Wybierz build w App Store Connect
8. Wyślij do przeglądu (2-5 dni)

## 🔄 Aktualizacje aplikacji

### Aktualizacja kodu

1. Wprowadź zmiany w plikach HTML/CSS/JS
2. Zbuduj i synchronizuj:
   ```bash
   npm run sync
   ```

### Nowa wersja w sklepach

**Android:**

1. Zwiększ `versionCode` i `versionName` w `build.gradle`
2. Zbuduj nowy AAB
3. Prześlij do Google Play Console
4. Dodaj opis zmian (Release Notes)

**iOS:**

1. Zwiększ Build number w Xcode
2. Opcjonalnie zwiększ Version (jeśli duża aktualizacja)
3. Archive i Distribute
4. Dodaj opis zmian w App Store Connect

## 📝 Konfiguracja aplikacji

### Zmiana adresu serwera OSRM

Jeśli używasz własnego serwera OSRM (nie localhost), edytuj:

`www/js/routing.js` - zmień URL serwera:

```javascript
const OSRM_BASE_URL = 'https://twoj-serwer.com';
```

Zbuduj i zsynchronizuj ponownie.

### Dostosowanie kolorów i brandingu

1. **Kolory w aplikacji**: `www/index.html` - zakładka `<script>` z Tailwind config
2. **Splash screen**: `capacitor.config.json` - sekcja `SplashScreen`
3. **Ikona**: Zamień w `android/app/src/main/res/` i `ios/App/App/Assets.xcassets/`

## 🧪 Testowanie

### Android

```bash
# Uruchom na emulatorze/urządzeniu
npm run run:android

# Lub ręcznie w Android Studio
npm run open:android
# Następnie kliknij Run (▶)
```

### iOS

```bash
# Uruchom na symulatorze/urządzeniu
npm run run:ios

# Lub ręcznie w Xcode
npm run open:ios
# Następnie kliknij Run (▶)
```

## 🐛 Rozwiązywanie problemów

### Android: Gradle build failed

```bash
cd android
./gradlew clean
cd ..
npm run sync:android
```

### iOS: Pod install failed

```bash
cd ios/App
pod deintegrate
pod install
cd ../..
npm run sync:ios
```

### Aplikacja nie łączy się z OSRM

- **Localhost nie działa** na urządzeniu mobilnym
- Użyj adresu IP komputera: `http://192.168.1.X:5001`
- Lub hostuj OSRM na publicznym serwerze

### Geolokalizacja nie działa

- Sprawdź uprawnienia w ustawieniach urządzenia
- Android: Manifest ma `ACCESS_FINE_LOCATION`
- iOS: Info.plist ma `NSLocationWhenInUseUsageDescription`

## 📚 Dodatkowe zasoby

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/studio/publish)
- [iOS Developer Guide](https://developer.apple.com/app-store/submissions/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)

## 📧 Wsparcie

Pytania? Otwórz issue na GitHubie lub skontaktuj się z zespołem WTG.
