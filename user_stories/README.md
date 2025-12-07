# User Stories - GuideTrackee Routes

## Przegląd Epików

Ten katalog zawiera dokumentację user stories dla rozwoju aplikacji GuideTrackee Routes - aplikacji do pieszych wycieczek po miastach Polski.

## Lista Epików

| #   | Epic                                                                   | Priorytet | Status                    | Estymacja       |
| --- | ---------------------------------------------------------------------- | --------- | ------------------------- | --------------- |
| 1   | [Migracja Frontendu na Ionic/React](./epic_1_ionic_react_migration.md) | 🔴 Wysoki | ✅ Ukończony              | 8 dni           |
| 2   | [Obsługa Wielu Miast (Frontend)](./epic_2_multi_city_frontend.md)      | 🔴 Wysoki | 📋 Zaplanowany            | 3 dni           |
| 3   | [Backend Multi-City](./epic_3_backend_multi_city.md)                   | 🔴 Wysoki | ✅ Ukończony              | 6 dni           |
| 4   | [Punkty Turystyczne (POI)](./epic_4_points_of_interest.md)             | 🟡 Średni | 🟡 Backend ✅ Frontend 📋 | 4 dni (Backend) |
| 5   | [Gotowe Wycieczki](./epic_5_curated_tours.md)                          | 🟡 Średni | 🚧 W trakcie (Backend ✅) | 8.5 dni         |
| 6   | [Nawigacja Turn-by-Turn](./epic_6_turn_by_turn_navigation.md)          | 🟢 Niski  | 📋 Zaplanowany            | 12 dni          |
| 7   | [Aplikacja Mobilna](./epic_7_mobile_app.md)                            | 🔴 Wysoki | 🚧 W trakcie              | 15 dni          |
| 8   | [Panel Admin i Strona Projektu](./epic_8_admin_panel_and_website.md)   | 🟡 Średni | 📋 Zaplanowany            | 30 dni          |

**Łączna estymacja:** ~94.5 dni robocze

## Obsługiwane Miasta

| Miasto     | Region OSM   | Status    |
| ---------- | ------------ | --------- |
| Kraków     | małopolskie  | ✅ Gotowe |
| Warszawa   | mazowieckie  | ✅ Gotowe |
| Wrocław    | dolnośląskie | ✅ Gotowe |
| Trójmiasto | pomorskie    | ✅ Gotowe |

## Proponowana Kolejność Realizacji

### Faza 1: Fundament (2 tygodnie)

1. **Epic 1** - Migracja na Ionic/React (US 1.1 - 1.4)
2. **Epic 3** - Backend Multi-City (US 3.1 - 3.4) - równolegle

### Faza 2: Multi-City (1 tydzień)

1. **Epic 2** - Frontend Multi-City (US 2.1 - 2.4)
2. **Epic 3** - Skrypty automatyzacji (US 3.5)

### Faza 3: Treść (2 tygodnie)

1. **Epic 4** - POI (US 4.1 - 4.5)
2. **Epic 5** - Gotowe Wycieczki (US 5.1 - 5.5)

### Faza 4: Nawigacja (2 tygodnie) - opcjonalna

1. **Epic 6** - Nawigacja Turn-by-Turn (US 6.1 - 6.6)

### Faza 5: Web Admin Panel (6 tygodni)

1. **Epic 8** - Panel Administracyjny (US 8.1 - 8.11, 8.15 - 8.16)
2. **Epic 8** - Strona Projektu (US 8.12 - 8.13)
3. **Epic 8** - Blog (US 8.14) - opcjonalne

## Architektura Docelowa

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND                              │
│              (Ionic React + TypeScript)                  │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │  Mapa   │ │Waypoints│ │   POI   │ │  Tours  │        │
│  │OpenLayers│ │  List  │ │  Panel  │ │  Panel  │        │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    BACKEND                               │
│                    (Nginx)                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │              API Gateway                         │    │
│  │   /api/{city}/{profile}/route/...               │    │
│  │   SSL + API Key Auth + Rate Limiting            │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌───────────┐   ┌───────────┐   ┌───────────┐
    │  Kraków   │   │ Warszawa  │   │  Wrocław  │   ...
    │ foot/bike │   │ foot/bike │   │ foot/bike │
    │    /car   │   │    /car   │   │    /car   │
    └───────────┘   └───────────┘   └───────────┘
         OSRM            OSRM            OSRM
```

## Legenda Statusów

- 📋 Zaplanowany - do realizacji
- 🚧 W trakcie - aktualnie realizowany
- ✅ Ukończony - gotowe
- ⏸️ Wstrzymany - zależność od innego epiku

## Powiązane Dokumenty

- [Backend Deployment](./backend_deployment.md) - istniejąca dokumentacja deploymentu
- [Web Interface](./web_interface.md) - istniejąca dokumentacja interfejsu web
- [REQUIREMENTS.md](../project_documentation/REQUIREMENTS.md) - wymagania projektu
