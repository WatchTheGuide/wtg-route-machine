# Epic 4: Punkty Turystyczne (POI)

**Cel:** Dodać bazę punktów turystycznych dla każdego miasta, umożliwiając użytkownikom łatwe odkrywanie atrakcji.

**Priorytet:** 🟡 Średni

**Zależności:** Epic 1 (Migracja Ionic/React), Epic 2 (Multi-City Frontend)

---

## US 4.1: Baza POI per miasto

**Jako** deweloper  
**Chcę** stworzyć bazę punktów turystycznych dla każdego miasta  
**Aby** użytkownicy mogli je przeglądać i dodawać do tras

### Kryteria akceptacji:

- [ ] Plik JSON z POI dla każdego miasta
- [ ] Minimum 20 POI na miasto
- [ ] Kategorie: zabytki, muzea, parki, restauracje, viewpointy, kościoły
- [ ] Dla każdego POI: id, nazwa, opis, współrzędne, kategoria, zdjęcie (URL)

### Struktura danych:

```typescript
interface POI {
  id: string;
  cityId: string;
  name: string;
  description: string;
  coordinates: [number, number]; // [lng, lat]
  category:
    | 'landmark'
    | 'museum'
    | 'park'
    | 'restaurant'
    | 'viewpoint'
    | 'church';
  imageUrl?: string;
  rating?: number;
  estimatedTime?: number; // minuty na zwiedzanie
  openingHours?: string;
  website?: string;
}
```

### Przykładowe POI dla Krakowa:

```json
[
  {
    "id": "krakow-wawel",
    "cityId": "krakow",
    "name": "Zamek Królewski na Wawelu",
    "description": "Historyczna rezydencja królów polskich, symbol polskiej państwowości.",
    "coordinates": [19.9354, 50.054],
    "category": "landmark",
    "imageUrl": "https://...",
    "estimatedTime": 120,
    "website": "https://wawel.krakow.pl"
  },
  {
    "id": "krakow-rynek",
    "cityId": "krakow",
    "name": "Rynek Główny",
    "description": "Największy średniowieczny plac miejski w Europie.",
    "coordinates": [19.9373, 50.0619],
    "category": "landmark",
    "estimatedTime": 30
  }
]
```

---

## US 4.2: Wyświetlanie POI na mapie

**Jako** użytkownik  
**Chcę** widzieć punkty turystyczne na mapie  
**Aby** łatwiej planować trasę

### Kryteria akceptacji:

- [ ] Markery POI na mapie z ikonami kategorii
- [ ] Różne ikony dla różnych kategorii
- [ ] Filtrowanie POI po kategorii (toggle w UI)
- [ ] Cluster markers gdy wiele POI blisko siebie
- [ ] Popup z podstawowymi informacjami po kliknięciu

### Ikony kategorii:

| Kategoria  | Ikona (Lucide) | Kolor                  |
| ---------- | -------------- | ---------------------- |
| landmark   | `landmark`     | #FF6600 (pomarańczowy) |
| museum     | `building-2`   | #8B4513 (brązowy)      |
| park       | `trees`        | #228B22 (zielony)      |
| restaurant | `utensils`     | #DC143C (czerwony)     |
| viewpoint  | `eye`          | #4169E1 (niebieski)    |
| church     | `church`       | #9932CC (fioletowy)    |

### Komponenty:

1. `POIMarker` - marker na mapie
2. `POIPopup` - popup z informacjami
3. `POIFilter` - panel filtrowania kategorii

---

## US 4.3: Panel szczegółów POI

**Jako** użytkownik  
**Chcę** zobaczyć szczegółowe informacje o punkcie turystycznym  
**Aby** zdecydować czy chcę go odwiedzić

### Kryteria akceptacji:

- [ ] `IonModal` z pełnymi informacjami o POI
- [ ] Zdjęcie POI (jeśli dostępne)
- [ ] Nazwa, opis, kategoria
- [ ] Szacowany czas zwiedzania
- [ ] Godziny otwarcia (jeśli dostępne)
- [ ] Link do strony (jeśli dostępny)
- [ ] Przycisk "Dodaj do trasy"

### UI:

```
┌─────────────────────────────────┐
│ [X]                             │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │       [Zdjęcie POI]         │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ 🏛️ Zamek Królewski na Wawelu   │
│                                 │
│ Historyczna rezydencja królów   │
│ polskich, symbol polskiej       │
│ państwowości...                 │
│                                 │
│ ⏱️ ~120 min  🌐 wawel.krakow.pl │
│                                 │
│ ┌─────────────────────────────┐ │
│ │    ➕ Dodaj do trasy        │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

---

## US 4.4: Dodawanie POI do trasy

**Jako** użytkownik  
**Chcę** jednym kliknięciem dodać POI do mojej trasy  
**Aby** szybko tworzyć wycieczki

### Kryteria akceptacji:

- [ ] Przycisk "Dodaj do trasy" w popup i szczegółach POI
- [ ] POI dodawany jako nowy waypoint
- [ ] Automatyczne przeliczenie trasy
- [ ] Informacja zwrotna (toast) o dodaniu
- [ ] Opcja "Dodaj jako start" / "Dodaj jako cel" / "Dodaj jako punkt pośredni"

### Logika:

```typescript
function addPOIToRoute(poi: POI, position: 'start' | 'end' | 'intermediate') {
  const waypoint: Waypoint = {
    id: generateId(),
    coordinates: poi.coordinates,
    name: poi.name,
    poiId: poi.id,
  };

  switch (position) {
    case 'start':
      waypoints.unshift(waypoint);
      break;
    case 'end':
      waypoints.push(waypoint);
      break;
    case 'intermediate':
      // Dodaj przed ostatnim waypointem
      waypoints.splice(-1, 0, waypoint);
      break;
  }

  recalculateRoute();
}
```

---

## US 4.5: Wyszukiwanie POI

**Jako** użytkownik  
**Chcę** wyszukać POI po nazwie  
**Aby** szybko znaleźć konkretną atrakcję

### Kryteria akceptacji:

- [ ] Pole wyszukiwania w panelu POI
- [ ] Wyszukiwanie po nazwie (case-insensitive)
- [ ] Wyniki filtrowane w czasie rzeczywistym
- [ ] Kliknięcie wyniku centruje mapę na POI
- [ ] Pusta lista gdy brak wyników

---

## Estymacja

| User Story | Story Points | Dni robocze |
| ---------- | ------------ | ----------- |
| US 4.1     | 5            | 2           |
| US 4.2     | 5            | 2           |
| US 4.3     | 3            | 1           |
| US 4.4     | 3            | 1           |
| US 4.5     | 2            | 0.5         |
| **Razem**  | **18**       | **6.5**     |

---

## Źródła danych POI

1. **OpenStreetMap** - eksport POI z tagami tourism, historic, amenity
2. **Wikipedia** - opisy i zdjęcia
3. **Google Places API** - zdjęcia i godziny otwarcia (opcjonalnie)
4. **Manualne kuratorowanie** - weryfikacja i uzupełnienie

---

## Definicja ukończenia (DoD)

- [ ] Minimum 20 POI dla każdego z 4 miast
- [ ] POI wyświetlają się na mapie
- [ ] Filtrowanie po kategoriach działa
- [ ] Dodawanie POI do trasy działa
- [ ] Testy jednostkowe dla logiki POI
- [ ] Dokumentacja formatu danych POI
