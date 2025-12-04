# Epic 6: Nawigacja Turn-by-Turn

**Cel:** Dodać podstawową nawigację głosową/wizualną po trasie, prowadzącą użytkownika krok po kroku.

**Priorytet:** 🟢 Niski (nice-to-have)

**Zależności:** Epic 1 (Migracja Ionic/React)

---

## US 6.1: Widok nawigacji

**Jako** użytkownik  
**Chcę** uruchomić tryb nawigacji po obliczonej trasie  
**Aby** być prowadzonym krok po kroku

### Kryteria akceptacji:

- [ ] Przycisk "Nawiguj" przy obliczonej trasie
- [ ] Widok pełnoekranowy z mapą i następną instrukcją
- [ ] Mapa obraca się zgodnie z kierunkiem ruchu (heading)
- [ ] Przycisk zamknięcia nawigacji
- [ ] Zachowanie ekranu włączonego (keep awake)

### UI - Widok nawigacji:

```
┌─────────────────────────────────┐
│ ┌─────────────────────────────┐ │
│ │         ↗️ 120m             │ │
│ │   Skręć w prawo w          │ │
│ │   ul. Floriańska           │ │
│ └─────────────────────────────┘ │
│                                 │
│                                 │
│                                 │
│         [MAPA 3D/2D]            │
│            z trasą              │
│         i pozycją GPS           │
│                                 │
│                                 │
│                                 │
├─────────────────────────────────┤
│ 📍 Rynek Główny     ⏱️ 5 min    │
│ 📏 450m pozostało               │
│                        [X Stop] │
└─────────────────────────────────┘
```

---

## US 6.2: Instrukcje nawigacyjne

**Jako** użytkownik  
**Chcę** widzieć instrukcje skrętu  
**Aby** nie zgubić się

### Kryteria akceptacji:

- [ ] Parsowanie `steps` z odpowiedzi OSRM (wymagane `steps=true`)
- [ ] Wyświetlanie bieżącej i następnej instrukcji
- [ ] Dystans do następnego manewru
- [ ] Ikony manewrów (prosto, lewo, prawo, ostro lewo/prawo, zawróć, cel)
- [ ] Nazwa ulicy po manewrze

### Mapowanie typów manewrów OSRM:

```typescript
const maneuverIcons: Record<string, string> = {
  'turn-left': '↰',
  'turn-right': '↱',
  'turn-slight-left': '↖',
  'turn-slight-right': '↗',
  'turn-sharp-left': '⤺',
  'turn-sharp-right': '⤻',
  straight: '↑',
  uturn: '↩',
  arrive: '🏁',
  depart: '🚀',
  roundabout: '🔄',
  'fork-left': '⤦',
  'fork-right': '⤧',
};
```

### Struktura instrukcji:

```typescript
interface NavigationInstruction {
  type: string;
  modifier?: string;
  name: string; // nazwa ulicy
  distance: number; // metry do manewru
  duration: number; // sekundy do manewru
  icon: string;
  text: string; // "Skręć w prawo w ul. Floriańska"
}
```

---

## US 6.3: Śledzenie pozycji GPS

**Jako** użytkownik  
**Chcę** widzieć moją aktualną pozycję na trasie  
**Aby** wiedzieć, gdzie jestem

### Kryteria akceptacji:

- [ ] Użycie `@capacitor/geolocation` do śledzenia pozycji
- [ ] Marker "Ty jesteś tutaj" na mapie (strzałka kierunkowa)
- [ ] Automatyczne przesuwanie mapy za użytkownikiem
- [ ] Aktualizacja pozycji co 1-3 sekundy
- [ ] Obsługa błędów GPS (brak sygnału)

### Konfiguracja Geolocation:

```typescript
import { Geolocation } from '@capacitor/geolocation';

const watchId = await Geolocation.watchPosition(
  {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  },
  (position, err) => {
    if (position) {
      updateUserPosition(position.coords);
    }
  }
);
```

---

## US 6.4: Aktualizacja instrukcji w czasie rzeczywistym

**Jako** użytkownik  
**Chcę** widzieć aktualizujące się instrukcje gdy się poruszam  
**Aby** zawsze wiedzieć co robić dalej

### Kryteria akceptacji:

- [ ] Dystans do manewru aktualizowany w czasie rzeczywistym
- [ ] Przejście do następnej instrukcji gdy manewr wykonany
- [ ] Powiadomienie 50m przed manewrem
- [ ] Powiadomienie przy dotarciu do waypointu
- [ ] Przeliczenie trasy gdy użytkownik zboczył (off-route)

### Logika detekcji off-route:

```typescript
function checkIfOffRoute(userPosition: Coordinate, route: Route): boolean {
  const closestPointOnRoute = findClosestPointOnRoute(userPosition, route);
  const distanceToRoute = calculateDistance(userPosition, closestPointOnRoute);

  // Jeśli > 50m od trasy, użytkownik zboczył
  return distanceToRoute > 50;
}

function handleOffRoute() {
  showToast('Zboczono z trasy. Przeliczam...');
  recalculateRoute(currentPosition, remainingWaypoints);
}
```

---

## US 6.5: Powiadomienia przy waypointach

**Jako** użytkownik  
**Chcę** otrzymać powiadomienie gdy docieram do waypointu  
**Aby** wiedzieć, że mogę się zatrzymać i zwiedzać

### Kryteria akceptacji:

- [ ] Wibracja telefonu przy dotarciu do waypointu
- [ ] Toast z nazwą waypointu
- [ ] Jeśli waypoint to POI - przycisk "Pokaż szczegóły"
- [ ] Automatyczne przejście do następnego segmentu trasy

### Próg dotarcia:

- Użytkownik uznawany za "przy waypoincie" gdy < 30m od niego

---

## US 6.6: Nawigacja głosowa (opcjonalne)

**Jako** użytkownik  
**Chcę** słyszeć instrukcje głosowe  
**Aby** nie patrzeć na telefon podczas spaceru

### Kryteria akceptacji:

- [ ] Użycie Web Speech API lub natywnego TTS
- [ ] Instrukcje odczytywane 100m i 20m przed manewrem
- [ ] Język polski
- [ ] Możliwość wyłączenia głosu
- [ ] Regulacja głośności

### Implementacja TTS:

```typescript
function speak(text: string) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pl-PL';
    utterance.rate = 1.0;
    speechSynthesis.speak(utterance);
  }
}

// Przykład użycia
speak('Za 100 metrów skręć w prawo w ulicę Floriańską');
```

---

## Estymacja

| User Story | Story Points | Dni robocze |
| ---------- | ------------ | ----------- |
| US 6.1     | 5            | 2           |
| US 6.2     | 5            | 2           |
| US 6.3     | 5            | 2           |
| US 6.4     | 8            | 3           |
| US 6.5     | 3            | 1           |
| US 6.6     | 5            | 2           |
| **Razem**  | **31**       | **12**      |

---

## Wymagania techniczne

### Uprawnienia:

- `NSLocationWhenInUseUsageDescription` (iOS)
- `NSLocationAlwaysUsageDescription` (iOS, opcjonalne)
- `ACCESS_FINE_LOCATION` (Android)
- `ACCESS_COARSE_LOCATION` (Android)

### Zużycie baterii:

- GPS w trybie wysokiej dokładności zużywa dużo baterii
- Rozważyć tryb oszczędzania energii (niższa częstotliwość aktualizacji)
- Ostrzeżenie dla użytkownika o zużyciu baterii

### Praca offline:

- Nawigacja wymaga połączenia (przeliczanie trasy)
- Rozważyć cache'owanie trasy do pracy offline (v2)

---

## Definicja ukończenia (DoD)

- [ ] Widok nawigacji działa na iOS i Android
- [ ] GPS tracking działa w tle
- [ ] Instrukcje aktualizują się poprawnie
- [ ] Detekcja off-route i przeliczanie działa
- [ ] Powiadomienia przy waypointach działają
- [ ] Testy na prawdziwym urządzeniu w terenie
- [ ] Dokumentacja użytkowania nawigacji
