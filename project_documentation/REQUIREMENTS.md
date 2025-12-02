# Wymagania Projektu: WTG Route Machine (City Walking Tours)

## 1. Cel Projektu
Stworzenie lekkiej i wydajnej instancji silnika routingowego OSRM dedykowanej do **pieszych wycieczek po mieście**. System ma być zoptymalizowany pod kątem wdrożenia w chmurze AWS, minimalizując zużycie pamięci RAM poprzez pracę na wycinkach map (miasta/regiony turystyczne) zamiast pełnych map krajów.

## 2. Wymagania Funkcjonalne

### 2.1. Silnik Routingowy (OSRM)
- **Profil główny:** Pieszy (`foot`). Zoptymalizowany pod kątem chodników, ścieżek, przejść dla pieszych i atrakcji turystycznych.
- **Profile dodatkowe:** Rowerowy (`bicycle`) - opcjonalnie.
- **Algorytm:** MLD (Multi-Level Dijkstra) - zapewnia dobry balans między wydajnością a czasem pre-processingu.

### 2.2. API
- Standardowe endpointy OSRM: `/route`, `/table`, `/match`, `/nearest`.
- Zwracanie szczegółowych instrukcji nawigacyjnych dla pieszych.

### 2.3. Zarządzanie Mapami (Podział i Optymalizacja)
- **Strategia podziału:** Automatyczne wycinanie obszarów miast (Bounding Box lub Polygon) z większych plików regionalnych (np. województw).
- **Obsługiwane obszary (MVP):**
  - Kraków (z mapy Małopolski)
  - Warszawa (z mapy Mazowsza)
  - Trójmiasto (z mapy Pomorza)
  - Wrocław (z mapy Dolnego Śląska)
- **Narzędzia:** Wykorzystanie `osmium-tool` do ekstrakcji danych.

## 3. Wymagania Niefunkcjonalne
- **Niskie zużycie zasobów:** Instancja dla pojedynczego miasta powinna uruchamiać się na maszynach z **2GB RAM** (np. AWS t3.small).
- **Szybki start:** Czas uruchomienia kontenera z gotowym grafem poniżej 30 sekund.
- **Skalowalność:** Architektura bezstanowa, umożliwiająca łatwe skalowanie poziome na AWS (ECS/Fargate).

## 4. Wymagania Techniczne
- **Stack:** OSRM Backend (C++), Docker, Bash/Python (skrypty).
- **Narzędzia GIS:** `osmium-tool` do obróbki plików `.pbf`.
- **Chmura:** AWS (EC2 lub ECS).
- **Konteneryzacja:** Obrazy Docker zoptymalizowane pod kątem rozmiaru (multistage build).

## 5. Etapy Realizacji
1.  Konfiguracja środowiska i repozytorium (Zakończone).
2.  Opracowanie procesu wycinania map miast (sub-regions) przy użyciu `osmium`.
3.  Dostosowanie profilu `foot.lua` do specyfiki wycieczek miejskich (np. preferowanie parków, unikanie ruchliwych ulic).
4.  Konfiguracja CI/CD do budowania obrazów Docker z gotowymi danymi dla konkretnych miast.
5.  Wdrożenie testowe na AWS.
