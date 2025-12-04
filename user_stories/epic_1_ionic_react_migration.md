# Epic 1: Migracja Frontendu na Ionic/React

**Cel:** Zastąpienie obecnego frontendu (Vanilla JS + Tailwind) nowoczesnym stackiem Ionic React dla lepszej wydajności, komponentów natywnych i łatwiejszego rozwoju.

**Priorytet:** 🔴 Wysoki

**Status:** ✅ Ukończony (4 grudnia 2025)

---

## US 1.1: Inicjalizacja projektu Ionic React ✅

**Jako** deweloper  
**Chcę** zainicjalizować nowy projekt Ionic React z TypeScript  
**Aby** mieć solidną podstawę pod dalszy rozwój

### Kryteria akceptacji:

- [x] Utworzony projekt `npx ionic start guidetrackee-app blank --type=react`
- [x] Skonfigurowany TypeScript
- [x] Zintegrowany Capacitor (istniejąca konfiguracja)
- [x] Przeniesione ustawienia z `capacitor.config.json`
- [x] Aplikacja uruchamia się na iOS i Android

### Zadania techniczne:

1. ✅ Inicjalizacja projektu Ionic React
2. ✅ Konfiguracja TypeScript strict mode
3. ✅ Przeniesienie capacitor.config.json
4. ✅ Konfiguracja iOS i Android platforms
5. ✅ Test uruchomienia na symulatorze

---

## US 1.2: Migracja komponentów UI ✅

**Jako** deweloper  
**Chcę** przepisać komponenty UI na komponenty Ionic  
**Aby** uzyskać natywny wygląd i zachowanie na każdej platformie

### Kryteria akceptacji:

- [x] Header → `IonHeader` + `IonToolbar`
- [x] Mapa → komponent React z OpenLayers
- [x] Panel waypointów → `IonList` + `IonItem` + `IonReorder`
- [x] Przyciski akcji → `IonFab` lub `IonButton`
- [x] Modale (eksport PDF, historia) → `IonModal`
- [x] Dark mode → Ionic theming (CSS variables)

### Komponenty do stworzenia:

1. ✅ `AppHeader` - nagłówek z logo i przełącznikiem motywu
2. ✅ `MapView` - wrapper na OpenLayers
3. ✅ `WaypointList` - lista waypointów z drag & drop
4. ✅ `WaypointItem` - pojedynczy waypoint
5. ✅ `ActionButtons` - FAB z akcjami (wyczyść, eksport)
6. ✅ `RouteInfo` - panel informacyjny o trasie
7. ✅ `ProfileSelector` - wybór profilu (foot/bicycle/car)

---

## US 1.3: Migracja logiki routingu ✅

**Jako** deweloper  
**Chcę** przenieść logikę komunikacji z OSRM do React hooks/services  
**Aby** zachować funkcjonalność routingu

### Kryteria akceptacji:

- [x] Custom hook `useRouting` do komunikacji z API
- [x] Obsługa wszystkich profili (foot, bicycle, car)
- [x] Zachowanie konfiguracji produkcyjnej (API key)
- [x] Error handling i loading states

### Struktura kodu:

```
src/
  hooks/
    useRouting.ts
    useWaypoints.ts
  services/
    osrm.service.ts
  types/
    route.types.ts
```

---

## US 1.4: Migracja funkcji eksportu i historii ✅

**Jako** deweloper  
**Chcę** przenieść funkcje eksportu PDF/GPX i historii tras  
**Aby** użytkownicy zachowali pełną funkcjonalność

### Kryteria akceptacji:

- [x] Eksport GeoJSON działa
- [x] Eksport PDF działa (pdfmake)
- [x] Historia tras z localStorage
- [x] Hooks dla eksportu i historii

### Implementacja:

1. ✅ `export.service.ts` - serwis eksportu (GeoJSON, PDF)
2. ✅ `useExport.ts` - hook eksportu z Web Share API
3. ✅ `useHistory.ts` - hook historii z localStorage

---

## Estymacja

| User Story | Story Points | Dni robocze | Status |
| ---------- | ------------ | ----------- | ------ |
| US 1.1     | 3            | 1           | ✅     |
| US 1.2     | 8            | 3           | ✅     |
| US 1.3     | 5            | 2           | ✅     |
| US 1.4     | 5            | 2           | ✅     |
| **Razem**  | **21**       | **8**       | **✅** |

---

## Definicja ukończenia (DoD)

- [x] Testy jednostkowe dla hooks i services (115 testów)
- [x] Lint przechodzi bez błędów
- [x] Build produkcyjny działa
- [ ] Kod przeszedł code review
- [ ] Aplikacja działa na iOS i Android
- [ ] Dark mode działa poprawnie
- [ ] Brak regresji w funkcjonalności
- [ ] Dokumentacja komponentów
