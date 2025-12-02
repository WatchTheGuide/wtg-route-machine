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

## Epic 5: Geokodowanie i Informacje o Lokalizacji

### US 5.1: Wyświetlanie Adresu dla Waypointa

**Jako** użytkownik,
**Chcę** widzieć adres (lub nazwę miejsca) dla każdego dodanego punktu,
**Aby** łatwiej identyfikować wybrane lokalizacje i upewnić się, że są poprawne.

**Kryteria Akceptacji:**

- [ ] Po dodaniu punktu system wykonuje reverse geocoding (współrzędne → adres).
- [ ] Wyświetlany jest adres lub nazwa miejsca obok markera lub w panelu bocznym.
- [ ] Jeśli reverse geocoding się nie powiedzie, wyświetlane są same współrzędne.
- [ ] Adresy aktualizują się po przesunięciu markera (drag & drop).

### US 5.2: Lista Waypointów z Adresami

**Jako** użytkownik,
**Chcę** widzieć listę wszystkich punktów trasy wraz z ich adresami,
**Aby** mieć przegląd całej planowanej trasy w jednym miejscu.

**Kryteria Akceptacji:**

- [ ] Dostępny jest panel z listą wszystkich waypointów.
- [ ] Każdy wpis zawiera numer, adres/nazwę miejsca i współrzędne.
- [ ] Lista aktualizuje się automatycznie przy dodaniu, usunięciu lub przesunięciu punktu.
- [ ] Kliknięcie na wpis w liście podświetla odpowiedni marker na mapie.

### US 5.3: Wyszukiwanie Miejsca

**Jako** użytkownik,
**Chcę** móc wyszukać miejsce po nazwie lub adresie,
**Aby** szybko dodać punkt bez klikania na mapę.

**Kryteria Akceptacji:**

- [x] Dostępne jest pole wyszukiwania (search bar).
- [x] Po wpisaniu zapytania wyświetlają się sugestie (autocomplete).
- [x] Wybór sugestii dodaje marker w odpowiedniej lokalizacji.
- [x] Mapa automatycznie centruje się na wybranym miejscu.

### US 5.4: Automatyczne Wyznaczanie Trasy dla Punktów z Wyszukiwarki

**Jako** użytkownik,
**Chcę** aby po wybraniu miejsca z wyszukiwarki trasa była automatycznie przeliczana,
**Aby** nie musieć ręcznie uruchamiać wyznaczania trasy.

**Kryteria Akceptacji:**

- [ ] Po wybraniu miejsca z wyszukiwarki i dodaniu go jako waypoint, trasa jest automatycznie przeliczana (jeśli są co najmniej 2 punkty).
- [ ] Proces wyznaczania trasy jest identyczny jak przy dodawaniu punktu przez kliknięcie na mapę.
- [ ] Panel informacji o trasie i instrukcje nawigacji są automatycznie aktualizowane.
- [ ] Przycisk eksportu jest aktywowany po pomyślnym wyznaczeniu trasy.

## Epic 6: Udoskonalenia Layoutu i UX

### US 6.1: Sidebar z Instrukcjami Nawigacji

**Jako** użytkownik,
**Chcę** mieć instrukcje nawigacji w sidebarze, który mogę otwierać i zamykać,
**Aby** mieć więcej miejsca na mapę i lepszą kontrolę nad interfejsem.

**Kryteria Akceptacji:**

- [x] Instrukcje nawigacji, informacje o trasie i przycisk eksportu są umieszczone w sidebarze po prawej stronie.
- [x] Sidebar można otworzyć/zamknąć za pomocą przycisku toggle.
- [x] Sidebar domyślnie jest zamknięty i otwiera się automatycznie po wyznaczeniu trasy.
- [x] Animacja otwarcia/zamknięcia jest płynna.
- [x] Na urządzeniach mobilnych sidebar zajmuje całą szerokość i wysuwa się z prawej strony.

### US 6.2: Ikony Lucide w Interfejsie

**Jako** użytkownik,
**Chcę** widzieć czytelne ikony przy przyciskach i instrukcjach,
**Aby** łatwiej rozpoznawać funkcje i kierunki nawigacji.

**Kryteria Akceptacji:**

- [x] Wszystkie przyciski mają odpowiednie ikony z biblioteki Lucide.
- [x] Instrukcje nawigacji mają ikony kierunku (strzałki, skręty).
- [x] Ikony są spójne kolorystycznie z resztą interfejsu.
- [x] Przycisk Clear All ma ikonę trash-2.
- [x] Przycisk Export ma ikonę download.
- [x] Search bar ma ikonę search.

### US 6.3: Responsywny Search Bar

**Jako** użytkownik,
**Chcę** aby pole wyszukiwania zajmowało całą dostępną szerokość w kontrolkach,
**Aby** wygodniej wpisywać zapytania.

**Kryteria Akceptacji:**

- [x] Search bar rozciąga się na pozostałą przestrzeń w pasku kontrolek (flex-1).
- [x] Na małych ekranach przyciski pokazują tylko ikony (hidden sm:inline).
- [x] Przyciski są odpowiednio rozmieszczone bez nakładania się elementów.

## Epic 7: Zaawansowane Zarządzanie Punktami

### US 7.1: Zmiana Kolejności Punktów

**Jako** użytkownik,
**Chcę** móc zmieniać kolejność punktów poprzez przesuwanie ich na liście,
**Aby** dostosować trasę bez usuwania i dodawania punktów od nowa.

**Kryteria Akceptacji:**

- [ ] Każdy punkt na liście ma przyciski "w górę" i "w dół" do zmiany kolejności.
- [ ] Kliknięcie strzałki "w górę" zamienia punkt z poprzednim.
- [ ] Kliknięcie strzałki "w dół" zamienia punkt z następnym.
- [ ] Pierwszy punkt nie ma strzałki "w górę", ostatni nie ma strzałki "w dół".
- [ ] Po zmianie kolejności trasa jest automatycznie przeliczana.
- [ ] Numery punktów na mapie i w tooltip'ach są automatycznie aktualizowane.

### US 7.2: Usuwanie Punktów z Listy

**Jako** użytkownik,
**Chcę** móc usunąć konkretny punkt klikając przycisk na liście,
**Aby** szybko modyfikować trasę bez szukania punktu na mapie.

**Kryteria Akceptacji:**

- [ ] Każdy punkt na liście ma przycisk "usuń" (ikona kosza).
- [ ] Kliknięcie przycisku usuwa punkt z mapy i listy.
- [ ] Pozostałe punkty są automatycznie przenumerowane.
- [ ] Trasa jest automatycznie przeliczana po usunięciu punktu.
- [ ] Jeśli zostaje mniej niż 2 punkty, trasa znika.
- [ ] Tooltip adresu usuniętego punktu jest usuwany z mapy.

## Epic 8: Geolokalizacja i Routing Profile

### US 8.1: Automatyczny Punkt Startowy GPS

**Jako** użytkownik,
**Chcę** aby moja aktualna pozycja GPS była automatycznie ustawiona jako pierwszy punkt trasy,
**Aby** szybko rozpocząć planowanie trasy z mojej obecnej lokalizacji.

**Kryteria Akceptacji:**

- [ ] Przy pierwszym załadowaniu strony aplikacja prosi o dostęp do geolokalizacji.
- [ ] Po uzyskaniu zgody pierwszy punkt (Start) jest automatycznie ustawiany na aktualnej pozycji GPS.
- [ ] Na mapie pojawia się marker z numerem "1" w lokalizacji GPS użytkownika.
- [ ] Mapa automatycznie centruje się na pozycji GPS użytkownika.
- [ ] Poziom zoom jest ustawiany na odpowiedni dla widoku miejskiego (np. zoom 15).
- [ ] W liście punktów wyświetla się adres odwrotnie geokodowany dla pozycji GPS.
- [ ] Jeśli użytkownik odmówi dostępu do GPS, aplikacja działa normalnie bez punktu startowego.
- [ ] Użytkownik może w każdej chwili usunąć lub przesunąć punkt startowy GPS.
- [ ] Po usunięciu punktu GPS użytkownik może dodać nowy punkt manualnie.

**Warunki Brzegowe:**

- Jeśli geolokalizacja nie jest dostępna w przeglądarce, wyświetl komunikat.
- Jeśli pozycja GPS jest poza obsługiwanym miastem, wyświetl ostrzeżenie.
- Timeout na uzyskanie pozycji GPS: 10 sekund.

### US 8.2: Wybór Profilu Trasowania (Pieszy/Rower/Auto)

**Jako** użytkownik,
**Chcę** móc wybrać tryb podróży (pieszo, rowerem, samochodem),
**Aby** uzyskać trasę dostosowaną do mojego środka transportu.

**Kryteria Akceptacji:**

- [ ] Widoczne są trzy przyciski wyboru profilu: "Pieszo", "Rower", "Auto".
- [ ] Domyślnie wybrany jest profil "Pieszo".
- [ ] Przyciski są wyraźnie oznaczone ikonami (pieszy, rower, samochód).
- [ ] Aktywny profil ma podświetlony przycisk (kolor pomarańczowy #ff6600).
- [ ] Po zmianie profilu trasa jest automatycznie przeliczana.
- [ ] Czas i dystans trasy są aktualizowane zgodnie z wybranym profilem.
- [ ] Instrukcje nawigacji są dostosowane do profilu (np. "ścieżka rowerowa", "autostrada").
- [ ] Wybór profilu jest zapamiętywany w localStorage.
- [ ] Po eksporcie do PDF/GeoJSON w pliku znajduje się informacja o użytym profilu.

**Warunki Brzegowe:**

- Jeśli dla wybranego miasta nie ma danych dla profilu "Rower" lub "Auto", wyświetl komunikat.
- Zmiana profilu na niedostępny powoduje wyświetlenie alertu i powrót do profilu "Pieszo".

**Uwagi Techniczne:**

- Backend OSRM wymaga przygotowania danych dla każdego profilu:
  - `foot` (profil pieszy) - już dostępny
  - `bicycle` (profil rowerowy) - wymaga przygotowania
  - `car` (profil samochodowy) - wymaga przygotowania
- Skrypty backend wymagają rozszerzenia:
  - `prepare-city-osrm.sh` musi obsługiwać parametr profilu
  - `run-city-server.sh` musi uruchamiać kontenery dla każdego profilu na osobnych portach
- Mapowanie portów OSRM:
  - Kraków Foot: 5001 (istniejący)
  - Kraków Bicycle: 5002 (nowy)
  - Kraków Car: 5003 (nowy)
  - Warszawa Foot: 5004
  - Warszawa Bicycle: 5005
  - Warszawa Car: 5006
  - (itd. dla innych miast)
- Aplikacja frontend musi dynamicznie wybierać port na podstawie miasta + profilu.
