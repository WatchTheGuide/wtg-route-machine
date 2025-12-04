# Epic 2: Obsługa Wielu Miast (Frontend)

**Cel:** Rozszerzyć interfejs aplikacji o wsparcie dla wielu miast Polski z możliwością wyboru.

**Priorytet:** 🔴 Wysoki

**Zależności:** Epic 1 (Migracja Ionic/React), Epic 3 (Backend Multi-City)

---

## US 2.1: Wybór miasta w interfejsie

**Jako** użytkownik  
**Chcę** wybrać miasto, po którym chcę planować trasę  
**Aby** aplikacja automatycznie centrowała mapę i używała odpowiednich danych

### Kryteria akceptacji:

- [ ] Selektor miasta na ekranie głównym (`IonSelect` lub `IonActionSheet`)
- [ ] Obsługiwane miasta: Kraków, Warszawa, Wrocław, Trójmiasto
- [ ] Po wyborze mapa centruje się na wybranym mieście
- [ ] Wybór zapisywany w localStorage
- [ ] Domyślne miasto: Kraków (lub ostatnio wybrane)

### UI/UX:

- Selektor w headerze aplikacji
- Ikona miasta obok nazwy
- Animacja przejścia między miastami na mapie

---

## US 2.2: Konfiguracja granic miast

**Jako** deweloper  
**Chcę** zdefiniować granice (bounding box) dla każdego miasta  
**Aby** mapa i routing działały poprawnie w każdym z nich

### Kryteria akceptacji:

- [ ] Plik konfiguracyjny `cities.ts` z danymi miast
- [ ] Dla każdego miasta: nazwa, współrzędne środka, zoom, bbox
- [ ] Walidacja, czy waypoint mieści się w granicach miasta
- [ ] Ostrzeżenie gdy użytkownik dodaje punkt poza granicami

### Struktura danych:

```typescript
interface City {
  id: string;
  name: string;
  center: [number, number]; // [lng, lat]
  zoom: number;
  bbox: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  region: string; // region OSM do pobrania
}

const cities: City[] = [
  {
    id: 'krakow',
    name: 'Kraków',
    center: [19.945, 50.0647],
    zoom: 13,
    bbox: [19.8, 49.97, 20.15, 50.13],
    region: 'malopolskie',
  },
  {
    id: 'warszawa',
    name: 'Warszawa',
    center: [21.0122, 52.2297],
    zoom: 12,
    bbox: [20.85, 52.1, 21.25, 52.37],
    region: 'mazowieckie',
  },
  {
    id: 'wroclaw',
    name: 'Wrocław',
    center: [17.0385, 51.1079],
    zoom: 13,
    bbox: [16.85, 51.0, 17.2, 51.22],
    region: 'dolnoslaskie',
  },
  {
    id: 'trojmiasto',
    name: 'Trójmiasto',
    center: [18.55, 54.4],
    zoom: 11,
    bbox: [18.35, 54.28, 18.85, 54.55],
    region: 'pomorskie',
  },
];
```

---

## US 2.3: Dynamiczny routing per miasto

**Jako** użytkownik  
**Chcę** otrzymać trasę obliczoną na podstawie danych dla wybranego miasta  
**Aby** routing był dokładny i szybki

### Kryteria akceptacji:

- [ ] Frontend wysyła zapytania do odpowiedniego endpointu miasta
- [ ] URL pattern: `/api/{city}/{profile}/route/v1/{profile}/...`
- [ ] Fallback error gdy miasto nie jest dostępne
- [ ] Loading state podczas przełączania miast

### Zmiany w `osrmService.ts`:

```typescript
async function getRoute(
  city: string,
  profile: 'foot' | 'bicycle' | 'car',
  waypoints: Coordinate[]
): Promise<Route> {
  const url = `${BASE_URL}/${city}/${profile}/route/v1/${profile}/${coordinates}`;
  // ...
}
```

---

## US 2.4: Czyszczenie trasy przy zmianie miasta

**Jako** użytkownik  
**Chcę** być poinformowany o wyczyszczeniu trasy przy zmianie miasta  
**Aby** nie stracić przypadkowo zaplanowanej wycieczki

### Kryteria akceptacji:

- [ ] Dialog potwierdzenia przy zmianie miasta gdy są waypointy
- [ ] Opcja "Zmień miasto" i "Anuluj"
- [ ] Automatyczne czyszczenie waypointów po potwierdzeniu
- [ ] Brak dialogu gdy nie ma waypointów

---

## Estymacja

| User Story | Story Points | Dni robocze |
| ---------- | ------------ | ----------- |
| US 2.1     | 3            | 1           |
| US 2.2     | 2            | 0.5         |
| US 2.3     | 3            | 1           |
| US 2.4     | 2            | 0.5         |
| **Razem**  | **10**       | **3**       |

---

## Definicja ukończenia (DoD)

- [ ] Selektor miasta działa na iOS i Android
- [ ] Mapa płynnie przeskakuje między miastami
- [ ] Routing działa dla wszystkich miast
- [ ] Testy E2E dla zmiany miasta
- [ ] Dokumentacja konfiguracji miast
