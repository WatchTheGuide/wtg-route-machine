# Epic 5: Gotowe Wycieczki (Curated Tours)

**Cel:** Umożliwić użytkownikom korzystanie z gotowych, kuratorowanych wycieczek po każdym mieście.

**Priorytet:** 🟡 Średni

**Zależności:** Epic 1, Epic 2, Epic 4 (POI)

---

## US 5.1: Baza gotowych wycieczek

**Jako** deweloper  
**Chcę** stworzyć bazę gotowych tras turystycznych  
**Aby** użytkownicy mogli z nich korzystać

### Kryteria akceptacji:

- [ ] Minimum 3 wycieczki na miasto (12 łącznie)
- [ ] Każda wycieczka: nazwa, opis, czas, dystans, trudność, lista waypointów
- [ ] Kategorie: "Klasyka miasta", "Ukryte perełki", "Architektura", "Natura"
- [ ] Powiązanie z POI (opcjonalnie)

### Struktura danych:

```typescript
interface Tour {
  id: string;
  cityId: string;
  name: string;
  description: string;
  category: 'classic' | 'hidden-gems' | 'architecture' | 'nature' | 'food';
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: number; // minuty
  estimatedDistance: number; // metry
  imageUrl?: string;
  waypoints: TourWaypoint[];
  tags: string[];
  rating?: number;
  reviewCount?: number;
}

interface TourWaypoint {
  coordinates: [number, number];
  name: string;
  description?: string;
  poiId?: string; // powiązanie z POI
  stopDuration?: number; // minuty na postój
}
```

### Przykładowe wycieczki dla Krakowa:

```json
[
  {
    "id": "krakow-royal-route",
    "cityId": "krakow",
    "name": "Trakt Królewski",
    "description": "Klasyczna trasa od Barbakanu do Wawelu, śladami królów polskich.",
    "category": "classic",
    "difficulty": "easy",
    "estimatedDuration": 120,
    "estimatedDistance": 2500,
    "waypoints": [
      { "coordinates": [19.9415, 50.0655], "name": "Barbakan" },
      { "coordinates": [19.9380, 50.0635], "name": "Brama Floriańska" },
      { "coordinates": [19.9373, 50.0619], "name": "Rynek Główny" },
      { "coordinates": [19.9375, 50.0615], "name": "Sukiennice" },
      { "coordinates": [19.9395, 50.0545], "name": "Wawel" }
    ],
    "tags": ["historia", "zabytki", "must-see"]
  },
  {
    "id": "krakow-kazimierz",
    "cityId": "krakow",
    "name": "Kazimierz - dzielnica legend",
    "description": "Spacer po dawnej dzielnicy żydowskiej, pełnej historii i klimatycznych uliczek.",
    "category": "hidden-gems",
    "difficulty": "easy",
    "estimatedDuration": 90,
    "estimatedDistance": 2000,
    "waypoints": [...]
  },
  {
    "id": "krakow-nowa-huta",
    "cityId": "krakow",
    "name": "Nowa Huta - socrealizm w praktyce",
    "description": "Odkryj unikalną architekturę socrealistycznego miasta idealnego.",
    "category": "architecture",
    "difficulty": "medium",
    "estimatedDuration": 150,
    "estimatedDistance": 4000,
    "waypoints": [...]
  }
]
```

---

## US 5.2: Przeglądanie wycieczek

**Jako** użytkownik  
**Chcę** przeglądać gotowe wycieczki dla wybranego miasta  
**Aby** wybrać interesującą mnie trasę

### Kryteria akceptacji:

- [ ] Lista wycieczek dla aktualnie wybranego miasta
- [ ] Filtrowanie po kategorii
- [ ] Filtrowanie po trudności
- [ ] Sortowanie: popularność, czas, dystans
- [ ] Karta wycieczki z miniaturą, nazwą, czasem, dystansem

### UI - Lista wycieczek:

```
┌─────────────────────────────────┐
│ 🗺️ Wycieczki - Kraków      [X] │
├─────────────────────────────────┤
│ Kategoria: [Wszystkie ▼]        │
│ Trudność:  [Wszystkie ▼]        │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ [📷]  Trakt Królewski       │ │
│ │       ⏱️ 2h  📏 2.5km  ⭐ 4.8│ │
│ │       🏷️ historia, must-see │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ [📷]  Kazimierz             │ │
│ │       ⏱️ 1.5h  📏 2km  ⭐ 4.6│ │
│ │       🏷️ klimat, kawiarnie  │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ [📷]  Nowa Huta             │ │
│ │       ⏱️ 2.5h  📏 4km  ⭐ 4.3│ │
│ │       🏷️ architektura       │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## US 5.3: Podgląd wycieczki

**Jako** użytkownik  
**Chcę** zobaczyć podgląd wycieczki na mapie przed jej wyborem  
**Aby** ocenić czy mi odpowiada

### Kryteria akceptacji:

- [ ] Modal ze szczegółami wycieczki
- [ ] Mapa z trasą i waypointami
- [ ] Lista przystanków z opisami
- [ ] Przycisk "Rozpocznij wycieczkę"
- [ ] Przycisk "Zamknij"

### UI - Szczegóły wycieczki:

```
┌─────────────────────────────────┐
│ [←]     Trakt Królewski     [X] │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │       [Mapa z trasą]        │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Klasyczna trasa od Barbakanu    │
│ do Wawelu, śladami królów...    │
│                                 │
│ ⏱️ 2h  📏 2.5km  🚶 łatwa       │
│                                 │
│ Przystanki:                     │
│ 1. 🏰 Barbakan                  │
│ 2. 🚪 Brama Floriańska          │
│ 3. 🏛️ Rynek Główny              │
│ 4. 🏪 Sukiennice                │
│ 5. 👑 Wawel                     │
│                                 │
│ ┌─────────────────────────────┐ │
│ │   🚀 Rozpocznij wycieczkę   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## US 5.4: Ładowanie wycieczki

**Jako** użytkownik  
**Chcę** załadować wybraną wycieczkę jako moją trasę  
**Aby** rozpocząć zwiedzanie

### Kryteria akceptacji:

- [ ] Kliknięcie "Rozpocznij" ładuje waypointy do trasy
- [ ] Trasa automatycznie przeliczana przez OSRM
- [ ] Modal zamykany po załadowaniu
- [ ] Toast z potwierdzeniem "Wycieczka załadowana"
- [ ] Jeśli istnieje trasa - pytanie o nadpisanie

---

## US 5.5: Modyfikacja załadowanej wycieczki

**Jako** użytkownik  
**Chcę** zmodyfikować załadowaną wycieczkę  
**Aby** dostosować ją do moich potrzeb

### Kryteria akceptacji:

- [ ] Po załadowaniu wycieczki można dodawać/usuwać waypointy
- [ ] Można zmieniać kolejność (drag & drop)
- [ ] Można dodać POI do trasy
- [ ] Zmodyfikowana trasa działa jak zwykła trasa (eksport, historia)

---

## US 5.6: Ocenianie wycieczek (opcjonalne)

**Jako** użytkownik  
**Chcę** ocenić ukończoną wycieczkę  
**Aby** pomóc innym użytkownikom

### Kryteria akceptacji:

- [ ] Po ukończeniu wycieczki - prompt o ocenę (1-5 gwiazdek)
- [ ] Ocena zapisywana lokalnie (v1) lub na serwerze (v2)
- [ ] Średnia ocen wyświetlana na liście wycieczek
- [ ] Liczba ocen wyświetlana

---

## Estymacja

| User Story | Story Points | Dni robocze |
| ---------- | ------------ | ----------- |
| US 5.1     | 5            | 2           |
| US 5.2     | 5            | 2           |
| US 5.3     | 5            | 2           |
| US 5.4     | 3            | 1           |
| US 5.5     | 2            | 0.5         |
| US 5.6     | 3            | 1           |
| **Razem**  | **23**       | **8.5**     |

---

## Proponowane wycieczki per miasto

### Kraków (3):

1. **Trakt Królewski** - Barbakan → Wawel (classic)
2. **Kazimierz** - dzielnica żydowska (hidden-gems)
3. **Nowa Huta** - architektura socrealistyczna (architecture)

### Warszawa (3):

1. **Trakt Królewski** - Łazienki → Stare Miasto (classic)
2. **Praga** - praski klimat (hidden-gems)
3. **Powiśle i bulwary** - nowoczesna Warszawa (nature)

### Wrocław (3):

1. **Ostrów Tumski** - najstarsza część miasta (classic)
2. **Krasnale wrocławskie** - polowanie na krasnale (hidden-gems)
3. **Hala Stulecia i okolice** - modernizm (architecture)

### Trójmiasto (3):

1. **Gdańsk - Droga Królewska** - Brama Wyżynna → Długi Targ (classic)
2. **Sopot** - molo i Monte Cassino (nature)
3. **Gdynia - modernizm** - Skwer Kościuszki → Kamienna Góra (architecture)

---

## Definicja ukończenia (DoD)

- [ ] 12 wycieczek (3 × 4 miasta) w bazie
- [ ] Lista i podgląd wycieczek działają
- [ ] Ładowanie wycieczki do trasy działa
- [ ] Modyfikacja załadowanej wycieczki działa
- [ ] Testy E2E dla flow wycieczki
- [ ] Dokumentacja formatu danych wycieczek
