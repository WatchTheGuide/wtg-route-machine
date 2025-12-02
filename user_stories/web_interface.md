# User Stories - WTG Route Machine Web Interface

## Epic 1: Podstawowa Nawigacja i Mapa

### US 1.1: Wyświetlanie Mapy

**Jako** użytkownik,
**Chcę** zobaczyć interaktywną mapę miasta po wejściu na stronę,
**Aby** móc zorientować się w terenie i rozpocząć planowanie trasy.

**Kryteria Akceptacji:**

- [ ] Mapa ładuje się z kafelkami OpenStreetMap.
- [ ] Domyślny widok jest ustawiony na Kraków (centrum).
- [ ] Dostępne są kontrolki zoom (+/-).
- [ ] Mapa jest responsywna i dostosowuje się do rozmiaru okna.

### US 1.2: Zmiana Miasta

**Jako** użytkownik,
**Chcę** móc wybrać inne miasto z listy (np. Warszawa, Wrocław),
**Aby** planować trasy w różnych lokalizacjach obsługiwanych przez system.

**Kryteria Akceptacji:**

- [ ] Dostępna jest lista rozwijana z obsługiwanymi miastami.
- [ ] Po wyborze miasta mapa centruje się na jego obszarze.
- [ ] Aplikacja przełącza się na odpowiedni port API OSRM dla wybranego miasta.
- [ ] Istniejąca trasa jest czyszczona przy zmianie miasta.

## Epic 2: Zarządzanie Punktami Trasy

### US 2.1: Dodawanie Punktów

**Jako** użytkownik,
**Chcę** dodawać punkty trasy klikając na mapę,
**Aby** wskazać miejsca, które chcę odwiedzić.

**Kryteria Akceptacji:**

- [ ] Kliknięcie na mapę dodaje nowy marker.
- [ ] Markery są numerowane kolejno (1, 2, 3...).
- [ ] Można dodać maksymalnie 10 punktów.
- [ ] Po dodaniu drugiego punktu automatycznie wyznaczana jest trasa.

### US 2.2: Przesuwanie Punktów (Drag & Drop)

**Jako** użytkownik,
**Chcę** móc przesuwać istniejące markery na mapie,
**Aby** precyzyjnie dostosować lokalizację punktów trasy.

**Kryteria Akceptacji:**

- [ ] Markery można chwycić i przeciągnąć myszką.
- [ ] Podczas przeciągania marker podąża za kursorem.
- [ ] Po upuszczeniu markera trasa jest automatycznie przeliczana.

### US 2.3: Usuwanie Punktów

**Jako** użytkownik,
**Chcę** móc usunąć wybrany punkt trasy,
**Aby** skorygować błędnie dodane miejsca lub zmienić plan wycieczki.

**Kryteria Akceptacji:**

- [ ] Kliknięcie prawym przyciskiem myszy (lub dedykowany przycisk) na markerze usuwa go.
- [ ] Po usunięciu punktu numeracja pozostałych markerów jest aktualizowana.
- [ ] Trasa jest przeliczana po usunięciu punktu.

### US 2.4: Czyszczenie Mapy

**Jako** użytkownik,
**Chcę** jednym przyciskiem usunąć wszystkie punkty i trasę,
**Aby** szybko rozpocząć planowanie nowej wycieczki od zera.

**Kryteria Akceptacji:**

- [ ] Dostępny jest przycisk "Wyczyść wszystko" (Clear All).
- [ ] Kliknięcie usuwa wszystkie markery i linię trasy z mapy.
- [ ] Panel informacji o trasie jest resetowany.

## Epic 3: Wyznaczanie i Prezentacja Trasy

### US 3.1: Obliczanie Trasy Pieszej

**Jako** użytkownik,
**Chcę**, aby system wyznaczył optymalną trasę pieszą między moimi punktami,
**Aby** wiedzieć, jak najszybciej dojść do celu.

**Kryteria Akceptacji:**

- [ ] Trasa jest wyznaczana automatycznie, gdy na mapie są co najmniej 2 punkty.
- [ ] Używany jest profil "foot" (pieszy) z lokalnego serwera OSRM.
- [ ] Trasa jest wizualizowana na mapie jako linia (polyline).

### US 3.2: Informacje o Trasie

**Jako** użytkownik,
**Chcę** widzieć całkowity dystans i szacowany czas przejścia,
**Aby** ocenić, czy trasa jest odpowiednia dla moich możliwości czasowych.

**Kryteria Akceptacji:**

- [ ] Wyświetlany jest całkowity dystans w kilometrach (np. 2.5 km).
- [ ] Wyświetlany jest szacowany czas w minutach/godzinach.
- [ ] Informacje aktualizują się po każdej zmianie trasy.

### US 3.3: Instrukcje Nawigacyjne

**Jako** użytkownik,
**Chcę** widzieć listę kroków nawigacyjnych (skręć w lewo, idź prosto),
**Aby** wiedzieć dokładnie, jak poruszać się w terenie.

**Kryteria Akceptacji:**

- [ ] Wyświetlana jest lista manewrów (turn-by-turn).
- [ ] Każdy krok zawiera instrukcję (np. "Skręć w prawo w ul. Grodzką") i dystans.
- [ ] Lista jest czytelna i przewijalna.

## Epic 4: Funkcje Dodatkowe

### US 4.1: Eksport do GeoJSON

**Jako** deweloper/zaawansowany użytkownik,
**Chcę** pobrać wyznaczoną trasę w formacie GeoJSON,
**Aby** móc ją wykorzystać w innych narzędziach GIS lub zapisać na dysku.

**Kryteria Akceptacji:**

- [ ] Dostępny jest przycisk "Eksportuj GeoJSON".
- [ ] Kliknięcie pobiera plik `.geojson` z geometrią trasy.
- [ ] Plik jest poprawnym formatem GeoJSON.

### US 4.2: Obsługa Błędów

**Jako** użytkownik,
**Chcę** otrzymywać jasne komunikaty, gdy coś pójdzie nie tak (np. brak połączenia z serwerem),
**Aby** wiedzieć, dlaczego trasa nie została wyznaczona.

**Kryteria Akceptacji:**

- [ ] Wyświetlany jest komunikat, gdy nie można połączyć się z serwerem OSRM.
- [ ] Wyświetlany jest komunikat, gdy nie można wyznaczyć trasy między punktami (np. brak drogi).
