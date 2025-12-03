# App Icons Guide

## Wymagane rozmiary ikon

Aplikacja wymaga ikon w następujących rozmiarach:

### Android

- 72x72 px
- 96x96 px
- 120x120 px
- 128x128 px
- 144x144 px
- 152x152 px
- 192x192 px
- 384x384 px
- 512x512 px

### iOS

- 120x120 px (iPhone 2x)
- 152x152 px (iPad 2x)
- 180x180 px (iPhone 3x)

## Generowanie ikon

### Opcja 1: Online Generator (Zalecane)

1. Przygotuj główną ikonę 1024x1024 px w formacie PNG
2. Użyj jednego z generatorów:
   - https://www.appicon.co/
   - https://apetools.webprofusion.com/app/#/tools/imagegorilla
   - https://icon.kitchen/

### Opcja 2: Ręcznie (ImageMagick)

Jeśli masz główną ikonę `icon-source.png` 1024x1024:

```bash
# Zainstaluj ImageMagick
brew install imagemagick

# Generuj wszystkie rozmiary
cd frontend/assets/icons

convert icon-source.png -resize 72x72 icon-72.png
convert icon-source.png -resize 96x96 icon-96.png
convert icon-source.png -resize 120x120 icon-120.png
convert icon-source.png -resize 128x128 icon-128.png
convert icon-source.png -resize 144x144 icon-144.png
convert icon-source.png -resize 152x152 icon-152.png
convert icon-source.png -resize 180x180 icon-180.png
convert icon-source.png -resize 192x192 icon-192.png
convert icon-source.png -resize 384x384 icon-384.png
convert icon-source.png -resize 512x512 icon-512.png
```

## Wytyczne projektowe

### Styl ikony

- **Tło**: Pomarańczowe (#ff6600) lub gradient pomarańczowy
- **Symbol**: Biały lub jasny, prosty i rozpoznawalny
- **Motyw**: Mapa, pin lokalizacji, kompas, trasa/ścieżka
- **Safe area**: Trzymaj główne elementy w środkowych 80% ikony

### Format

- **Typ pliku**: PNG z przezroczystością
- **Kolory**: RGB (nie CMYK)
- **Jakość**: Maksymalna rozdzielczość

### Przykładowe pomysły na ikonę:

1. Pin lokalizacji z literą "W" (WTG)
2. Mapa z linią trasy
3. Kompas ze strzałką na pomarańczowym tle
4. Sylwetka osoby idącej z GPS

## Po wygenerowaniu

1. Umieść wszystkie ikony w tym katalogu (`assets/icons/`)
2. Uruchom synchronizację:
   ```bash
   npm run sync
   ```
3. Ikony automatycznie zostaną skopiowane do projektów Android i iOS

## Weryfikacja

Sprawdź, czy ikony są widoczne:

- **Android**: `android/app/src/main/res/mipmap-*/`
- **iOS**: `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
