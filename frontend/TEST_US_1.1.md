# Test Plan - US 1.1: Wyświetlanie Mapy

## Test Date
2025-12-02

## Acceptance Criteria Testing

### ✅ AC1: Mapa ładuje się z kafelkami OpenStreetMap
**Test Steps:**
1. Otwórz http://localhost:8000
2. Sprawdź czy mapa się wyświetla
3. Sprawdź czy kafelki OSM są widoczne

**Expected Result:** Mapa z kafelkami OpenStreetMap jest widoczna

**Actual Result:** ✅ PASS
- Mapa załadowała się poprawnie
- Kafelki OSM są widoczne
- Kontrolki mapy działają

### ✅ AC2: Domyślny widok jest ustawiony na Kraków (centrum)
**Test Steps:**
1. Po załadowaniu strony sprawdź centrum mapy
2. Zweryfikuj czy widoczny jest Rynek Główny w Krakowie

**Expected Result:** Mapa centruje się na współrzędnych Krakowa (19.9385, 50.0647)

**Actual Result:** ✅ PASS
- Mapa wyświetla centrum Krakowa
- Rynek Główny jest widoczny
- Współrzędne zgodne z wymaganiami

### ✅ AC3: Dostępne są kontrolki zoom (+/-)
**Test Steps:**
1. Sprawdź obecność przycisków zoom w lewym górnym rogu
2. Kliknij przycisk "+"
3. Kliknij przycisk "-"
4. Użyj scrolla myszy do zoomowania

**Expected Result:** Kontrolki zoom są widoczne i funkcjonalne

**Actual Result:** ✅ PASS
- Przyciski +/- są widoczne
- Zoom in działa poprawnie
- Zoom out działa poprawnie
- Scroll myszy również działa
- Dodatkowa kontrolka: Fullscreen
- Dodatkowa kontrolka: Scale line (skala)

### ✅ AC4: Mapa jest responsywna i dostosowuje się do rozmiaru okna
**Test Steps:**
1. Otwórz mapę w pełnym oknie
2. Zmień rozmiar okna przeglądarki (szerokość)
3. Zmień rozmiar okna przeglądarki (wysokość)
4. Przetestuj na mobile viewport (DevTools)

**Expected Result:** Mapa dostosowuje się do rozmiaru kontenera bez scrollbarów poziomych

**Actual Result:** ✅ PASS
- Mapa wypełnia cały kontener
- Responsywna szerokość działa
- Media queries dla mobile: 500px na małych ekranach, 400px na bardzo małych
- Brak scrollbarów poziomych
- Layout Tailwind CSS działa poprawnie

## Additional Features Implemented
- ✅ Kontrolka Fullscreen
- ✅ Kontrolka Scale Line (skala metryczna)
- ✅ Min/Max zoom (10-18)
- ✅ Tailwind CSS dla stylowania
- ✅ Responsywny header i footer
- ✅ Console logging dla debugowania

## Summary
**Status:** ✅ ALL ACCEPTANCE CRITERIA PASSED

**Implementation Complete:**
- index.html: Struktura HTML z Tailwind CSS i OpenLayers
- css/style.css: Responsywne style dla mapy
- js/map.js: Inicjalizacja mapy z kontrolkami

**Ready for:** US 1.2 (Zmiana Miasta)
