# Epic 1: Migracja Frontendu na Ionic/React

**Cel:** Zastąpienie obecnego frontendu (Vanilla JS + Tailwind) nowoczesnym stackiem Ionic React dla lepszej wydajności, komponentów natywnych i łatwiejszego rozwoju.

**Priorytet:** 🔴 Wysoki

---

## US 1.1: Inicjalizacja projektu Ionic React

**Jako** deweloper  
**Chcę** zainicjalizować nowy projekt Ionic React z TypeScript  
**Aby** mieć solidną podstawę pod dalszy rozwój

### Kryteria akceptacji:

- [ ] Utworzony projekt `npx ionic start guidetrackee-app blank --type=react`
- [ ] Skonfigurowany TypeScript
- [ ] Zintegrowany Capacitor (istniejąca konfiguracja)
- [ ] Przeniesione ustawienia z `capacitor.config.json`
- [ ] Aplikacja uruchamia się na iOS i Android

### Zadania techniczne:

1. Inicjalizacja projektu Ionic React
2. Konfiguracja TypeScript strict mode
3. Przeniesienie capacitor.config.json
4. Konfiguracja iOS i Android platforms
5. Test uruchomienia na symulatorze

---

## US 1.2: Migracja komponentów UI

**Jako** deweloper  
**Chcę** przepisać komponenty UI na komponenty Ionic  
**Aby** uzyskać natywny wygląd i zachowanie na każdej platformie

### Kryteria akceptacji:

- [ ] Header → `IonHeader` + `IonToolbar`
- [ ] Mapa → komponent React z OpenLayers
- [ ] Panel waypointów → `IonList` + `IonItem` + `IonReorder`
- [ ] Przyciski akcji → `IonFab` lub `IonButton`
- [ ] Modale (eksport PDF, historia) → `IonModal`
- [ ] Dark mode → Ionic theming (CSS variables)

### Komponenty do stworzenia:

1. `AppHeader` - nagłówek z logo i przełącznikiem motywu
2. `MapView` - wrapper na OpenLayers
3. `WaypointList` - lista waypointów z drag & drop
4. `WaypointItem` - pojedynczy waypoint
5. `ActionButtons` - FAB z akcjami (wyczyść, eksport)
6. `RouteInfo` - panel informacyjny o trasie
7. `ProfileSelector` - wybór profilu (foot/bicycle/car)

---

## US 1.3: Migracja logiki routingu

**Jako** deweloper  
**Chcę** przenieść logikę komunikacji z OSRM do React hooks/services  
**Aby** zachować funkcjonalność routingu

### Kryteria akceptacji:

- [ ] Custom hook `useRouting` do komunikacji z API
- [ ] Obsługa wszystkich profili (foot, bicycle, car)
- [ ] Zachowanie konfiguracji produkcyjnej (API key)
- [ ] Error handling i loading states

### Struktura kodu:

```
src/
  hooks/
    useRouting.ts
    useGeolocation.ts
  services/
    osrmService.ts
    configService.ts
  types/
    route.types.ts
    waypoint.types.ts
```

---

## US 1.4: Migracja funkcji eksportu i historii

**Jako** deweloper  
**Chcę** przenieść funkcje eksportu PDF/GPX i historii tras  
**Aby** użytkownicy zachowali pełną funkcjonalność

### Kryteria akceptacji:

- [ ] Eksport PDF działa jak wcześniej
- [ ] Eksport GPX działa jak wcześniej
- [ ] Historia tras z localStorage
- [ ] UI dla historii w `IonModal`

### Komponenty:

1. `ExportModal` - modal z opcjami eksportu
2. `HistoryModal` - modal z historią tras
3. `HistoryItem` - pojedyncza trasa w historii

---

## Estymacja

| User Story | Story Points | Dni robocze |
| ---------- | ------------ | ----------- |
| US 1.1     | 3            | 1           |
| US 1.2     | 8            | 3           |
| US 1.3     | 5            | 2           |
| US 1.4     | 5            | 2           |
| **Razem**  | **21**       | **8**       |

---

## Definicja ukończenia (DoD)

- [ ] Kod przeszedł code review
- [ ] Testy jednostkowe dla hooks i services
- [ ] Aplikacja działa na iOS i Android
- [ ] Dark mode działa poprawnie
- [ ] Brak regresji w funkcjonalności
- [ ] Dokumentacja komponentów
