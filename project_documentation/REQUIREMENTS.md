# Wymagania Projektu: Własna Instancja OpenSourceRoutingMachine (OSRM) z API

## 1. Cel Projektu

Stworzenie i wdrożenie własnej instancji silnika routingowego OSRM (Open Source Routing Machine) wraz z dedykowanym API, umożliwiającym wyznaczanie tras, obliczanie macierzy odległości oraz dopasowywanie tras do sieci drogowej (map matching).

## 2. Wymagania Funkcjonalne

### 2.1. Silnik Routingowy (OSRM)

- **Obsługa profili:** Możliwość konfiguracji profili routingowych (samochód, rower, pieszy). Domyślnie: samochód (`car`).
- **Dane mapowe:** Obsługa importu danych z OpenStreetMap (pliki `.osm.pbf`).
- **Algorytm:** Wykorzystanie algorytmu MLD (Multi-Level Dijkstra) lub CH (Contraction Hierarchies) w zależności od potrzeb (szybkość vs elastyczność aktualizacji).

### 2.2. API (Interfejs Programistyczny)

- **Endpoint `/route`:** Wyznaczanie trasy między punktami (start, koniec, punkty pośrednie).
  - Zwracanie geometrii trasy (np. Polyline).
  - Zwracanie instrukcji nawigacyjnych.
- **Endpoint `/table`:** Obliczanie macierzy odległości i czasu przejazdu (Distance Matrix) dla zestawu punktów.
- **Endpoint `/match`:** Dopasowywanie surowych danych GPS do sieci drogowej (Map Matching).
- **Endpoint `/nearest`:** Znajdowanie najbliższego punktu na sieci drogowej względem podanej lokalizacji.
- **Format danych:** JSON.

### 2.3. Zarządzanie i Aktualizacja

- Skrypty do automatycznego pobierania i aktualizacji map (np. z Geofabrik).
- Proces przetwarzania danych (extract, partition, customize) zautomatyzowany (np. via Docker/skrypty shell).

## 3. Wymagania Niefunkcjonalne

- **Wydajność:** Czas odpowiedzi dla prostych zapytań routingowych poniżej 100ms.
- **Skalowalność:** Możliwość uruchomienia w kontenerze Docker.
- **Dostępność:** API dostępne przez HTTP.

## 4. Wymagania Techniczne

- **Język/Technologia:** C++ (OSRM backend), Node.js lub Python (opcjonalny wrapper API/proxy), Docker.
- **System operacyjny:** Linux (zalecany do produkcji), macOS/Windows (dev).
- **Konteneryzacja:** Docker i Docker Compose do łatwego wdrażania.

## 5. Etapy Realizacji (Roadmapa)

1.  Konfiguracja środowiska i repozytorium.
2.  Uruchomienie podstawowej instancji OSRM w Dockerze na przykładowych danych (np. Polska lub wybrane województwo).
3.  Opracowanie konfiguracji profili (lua).
4.  Implementacja/Konfiguracja API Gateway (jeśli wymagane dodatkowe zabezpieczenia lub logika).
5.  Testy wydajnościowe i funkcjonalne.
6.  Dokumentacja API i instrukcja wdrożenia.
