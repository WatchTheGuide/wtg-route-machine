# Epic 8: Panel Administracyjny i Strona Projektu

**Cel:** Stworzyć panel administracyjny do zarządzania kuratorowanymi wycieczkami oraz publiczną stronę projektu z informacjami o aplikacji.

**Priorytet:** 🟡 Średni

**Zależności:** Epic 5 (Curated Tours - backend API)

**Stack Technologiczny:**

- **Frontend Framework:** Vite + React 18 + TypeScript
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **Routing:** React Router v6
- **State Management:** TanStack Query + Zustand
- **Forms:** React Hook Form + Zod validation
- **Maps:** OpenLayers (spójność z mobile app)
- **Styling:** Tailwind CSS + CSS Variables
- **Build:** Vite
- **Deployment:** Netlify / Vercel (static hosting)

---

## US 8.1: Projekt i struktura Admin Panel

**Jako** deweloper  
**Chcę** stworzyć fundament aplikacji webowej z Vite + React + shadcn/ui  
**Aby** mieć solidną bazę do budowy panelu administracyjnego

### Kryteria akceptacji:

- [x] Inicjalizacja projektu: `npm create vite@latest admin -- --template react-ts`
- [x] Instalacja i konfiguracja Tailwind CSS
- [x] Instalacja i konfiguracja shadcn/ui CLI
- [x] Struktura folderów zgodna z best practices:
  ```
  admin/
  ├── src/
  │   ├── components/
  │   │   ├── ui/              # shadcn components
  │   │   ├── landing/         # Landing page components
  │   │   ├── tours/           # Tour-specific components
  │   │   └── common/          # Shared components
  │   ├── pages/               # Page components
  │   │   └── LandingPage.tsx
  │   ├── hooks/               # Custom hooks
  │   ├── services/            # API services
  │   ├── stores/              # Zustand stores
  │   ├── types/               # TypeScript types
  │   ├── lib/                 # Utilities (cn, format helpers)
  │   └── App.tsx
  ├── public/
  │   └── icon.png             # App icon
  └── package.json
  ```
- [x] Konfiguracja path aliases (`@/` dla src)
- [x] ESLint setup
- [x] Landing page z Navbar, Hero, Features, Cities, About, Footer

### Estymacja: 0.5 dnia ✅ COMPLETED

---

## US 8.2: Autentykacja i autoryzacja

**Jako** administrator  
**Chcę** bezpiecznie logować się do panelu  
**Aby** tylko uprawnione osoby mogły zarządzać wycieczkami

### Kryteria akceptacji:

- [x] Strona logowania z formularzem (email + hasło)
- [ ] Integracja z backend auth API (do stworzenia)
- [x] JWT token storage (localStorage + httpOnly cookies)
- [x] Protected routes z React Router
- [x] Auto-logout po wygaśnięciu tokenu
- [x] "Remember me" checkbox
- [ ] Password reset flow (email link)
- [x] Role-based access control (admin, editor, viewer)

### Komponenty shadcn/ui:

- `Button`, `Input`, `Label`, `Card`, `Alert`

### Estymacja: 2 dni ✅ COMPLETED (mock auth, pending real API)

---

## US 8.3: Dashboard - przegląd statystyk

**Jako** administrator  
**Chcę** widzieć dashboard z kluczowymi metrykami  
**Aby** monitorować stan wycieczek i aktywność użytkowników

### Kryteria akceptacji:

- [x] Karty z podsumowaniem:
  - Liczba wycieczek (total, per city)
  - Liczba POI (total, per city)
  - Najpopularniejsze wycieczki (top 5)
  - Ostatnio dodane wycieczki (last 10)
- [x] Wykres liniowy: dodane wycieczki w czasie (Recharts)
- [x] Tabela "Recent activity" z timeline zmian
- [x] Quick actions: "Add new tour", "Manage POIs", "View reports"
- [x] City selector dropdown (filtrowanie statystyk)

### Komponenty shadcn/ui:

- `Card`, `Badge`, `Table`, `Select`, `Tabs`

### Estymacja: 1.5 dnia ✅ COMPLETED (mock data, pending real API)

---

## US 8.4: Lista wycieczek (Tours List)

**Jako** administrator  
**Chcę** przeglądać listę wszystkich wycieczek  
**Aby** łatwo znaleźć i edytować konkretną wycieczkę

### Kryteria akceptacji:

- [x] Tabela z kolumnami:
  - ~~Thumbnail (miniatura mapy)~~ (do dodania w przyszłości)
  - Nazwa wycieczki
  - Miasto
  - Kategoria
  - Trudność
  - Liczba POI
  - Status (draft/published/archived)
  - Wyświetlenia (views)
  - Akcje (Edit, Delete, Duplicate, Preview)
- [x] Filtry:
  - Miasto (dropdown)
  - Kategoria (dropdown)
  - Status (draft/published/archived)
  - Trudność (easy/medium/hard)
  - Sortowanie (nazwa, data utworzenia, wyświetlenia, POI count)
- [x] Wyszukiwarka pełnotekstowa (nazwa, miasto, kategoria)
- [x] Paginacja (10/25/50/100 wyników na stronę)
- [x] Bulk actions: Delete selected, Publish selected, Export to JSON
- [x] "Add New Tour" button
- [x] Przycisk "Clear filters" gdy aktywne filtry
- [x] Dialog potwierdzenia usunięcia (AlertDialog)
- [x] Export do JSON (pojedyncze lub zaznaczone)
- [x] Pełna internacjonalizacja (i18n)

### Komponenty shadcn/ui:

- `Table`, `Input` (search), `Select`, `Checkbox`, `Button`, `DropdownMenu`, `Badge`, `Card`, `AlertDialog`

### Estymacja: 2 dni ✅ COMPLETED (mock data, pending real API)

---

## US 8.5: Edytor wycieczek (Tour Editor) - podstawy

**Jako** administrator  
**Chcę** tworzyć i edytować wycieczki za pomocą formularza  
**Aby** dodawać nowe trasy turystyczne

### Kryteria akceptacji:

- [x] Formularz z sekcjami (Tabs):
  - **Basic Info**: Nazwa, opis (textarea), miasto (select), kategoria, trudność
  - **Media**: Upload zdjęcia głównego (drag & drop placeholder) - UI gotowe, upload do implementacji
  - **Details**: Szacowany czas (slider), tagi (input z chips)
  - **Waypoints**: Lista punktów (JSON textarea - US 8.6 doda wizualny edytor)
  - **Settings**: Status (draft/published/archived), featured tour (switch)
- [x] Walidacja formularza (React Hook Form + Zod):
  - Nazwa: min 5 znaków, max 100
  - Opis: min 50 znaków, max 2000
  - Miasto: wymagane
  - Kategoria: wymagane
  - Współrzędne: valid JSON format
- [x] Live preview w bocznym panelu (miniatura mapy placeholder + stats)
- [x] Auto-save draft (co 30 sekund)
- [x] Przyciski: Save Draft, Publish, Preview (edit mode), Delete (edit mode)
- [x] Success/error toast notifications (Sonner)
- [x] Unsaved changes warning (AlertDialog przed opuszczeniem strony)
- [x] Routing: `/admin/tours/new` (nowa) i `/admin/tours/:id/edit` (edycja)
- [x] Tłumaczenia dla 5 języków (PL, EN, DE, FR, UK)
- [x] Powiązanie z listą wycieczek (przyciski Add Tour, Edit)

### Komponenty shadcn/ui:

- `Form`, `Input`, `Textarea`, `Select`, `Tabs`, `Button`, `Switch`, `Label`, `Card`, `Badge`, `Separator`, `AlertDialog`, `Sonner` (toast)

### Estymacja: 3 dni ✅ COMPLETED (mock data, pending real API)

---

## US 8.6: Edytor wycieczek - interaktywna mapa

**Jako** administrator  
**Chcę** dodawać waypoints wizualnie na mapie  
**Aby** szybko i precyzyjnie planować trasę wycieczki

### Kryteria akceptacji:

- [x] Integracja OpenLayers w edytorze (split view: form + map)
- [x] Kliknięcie na mapie dodaje nowy waypoint
- [x] Waypoints jako markery z numerami (1, 2, 3...)
- [x] Drag & drop markerów do zmiany pozycji
- [x] Linia łącząca waypoints (preview trasy)
- [x] Lista waypoints synchronizowana z mapą:
  - [x] Edycja nazwy dla każdego punktu
  - [x] Pole "Description" (optional)
  - [x] Pole "Stop duration" (minuty)
  - [x] Przycisk "Delete waypoint"
  - [x] Przyciski up/down do zmiany kolejności
- [ ] Geocoding: wyszukiwanie adresu → współrzędne
- [ ] Reverse geocoding: współrzędne → nazwa ulicy (autofill name)
- [x] Przycisk "Calculate route with OSRM" - UI gotowe, placeholder dla API
- [x] Przycisk "Import from GeoJSON"
- [x] Przycisk "Export to GeoJSON"
- [x] Map layers: Streets (default), Satellite, Terrain
- [x] Zoom controls (+, -, fit to waypoints)
- [x] Synchronizacja zaznaczenia między mapą a listą
- [x] Tłumaczenia dla 5 języków (PL, EN, DE, FR, UK)
- [x] Dropdown menu "Akcje" w WaypointsList (Calculate route, Import, Export)

### Komponenty shadcn/ui:

- `Card`, `Button`, `Input`, `Textarea`, `Separator`, `Select`, `Label`, `DropdownMenu`

### Estymacja: 4 dni ✅ PARTIALLY COMPLETED (geocoding pending)

---

## US 8.6.1: Geocoding i Reverse Geocoding

**Jako** administrator  
**Chcę** wyszukiwać adresy i automatycznie uzupełniać nazwy punktów  
**Aby** szybko dodawać waypoints bez ręcznego wpisywania współrzędnych

### Kryteria akceptacji:

- [ ] **Geocoding (Address Search)**:

  - [ ] Pole wyszukiwania adresu w edytorze mapy
  - [ ] Autouzupełnianie podczas wpisywania (debounce 300ms)
  - [ ] Lista sugestii z nazwą i adresem
  - [ ] Kliknięcie sugestii:
    - Centruje mapę na lokalizacji
    - Opcjonalnie dodaje waypoint
  - [ ] Obsługa Nominatim OpenStreetMap API (darmowe)
  - [ ] Ograniczenie do wybranego miasta/bounding box

- [ ] **Reverse Geocoding (Coordinate to Address)**:

  - [ ] Po dodaniu waypointa na mapie → automatyczne pobranie nazwy ulicy
  - [ ] Autouzupełnianie pola "Name" waypointa z adresu
  - [ ] Formatowanie: "ul. {street} {number}" lub "{POI name}"
  - [ ] Obsługa błędów (brak wyników, limit API)

- [ ] **Konfiguracja**:

  - [ ] Fallback na alternatywne API (np. Photon)
  - [ ] Rate limiting (max 1 request/s dla Nominatim)
  - [ ] Cache wyników (localStorage lub IndexedDB)

- [ ] **UX**:
  - [ ] Loading spinner podczas wyszukiwania
  - [ ] Clear button w polu wyszukiwania
  - [ ] Komunikat "Brak wyników" gdy nic nie znaleziono
  - [ ] Tłumaczenia dla 5 języków

### Komponenty shadcn/ui:

- `Command` (combobox z autouzupełnianiem), `Input`, `Button`, `Popover`

### API:

- Nominatim: `https://nominatim.openstreetmap.org/search`
- Photon (fallback): `https://photon.komoot.io/api/`

### Estymacja: 1.5 dnia

---

## US 8.7: Zarządzanie POI (Points of Interest)

**Jako** administrator  
**Chcę** powiązać wycieczki z istniejącymi POI  
**Aby** użytkownicy widzieli ciekawe miejsca na trasie

### Kryteria akceptacji:

- [ ] Zakładka "POI" w edytorze wycieczki
- [ ] Mapa pokazuje wszystkie POI w mieście (różne ikony per kategoria)
- [ ] Kliknięcie na POI dodaje go do wycieczki
- [ ] Lista powiązanych POI w bocznym panelu:
  - Drag & drop do zmiany kolejności
  - Przycisk "Remove from tour"
  - Link "Edit POI details" (otwiera POI editor)
- [ ] Filtrowanie POI na mapie (kategorie, dystans od trasy)
- [ ] "Suggest POI" button - AI/heurystyka proponuje POI na trasie
- [ ] Wyświetlanie dystansu POI od najbliższego waypointa

### Estymacja: 2 dni

---

## US 8.8: POI Manager (osobna strona)

**Jako** administrator  
**Chcę** zarządzać wszystkimi POI w jednym miejscu  
**Aby** utrzymać spójną bazę punktów turystycznych

### Kryteria akceptacji:

- [ ] Strona `/admin/poi` z listą wszystkich POI
- [ ] Tabela podobna do Tours List:
  - Nazwa, miasto, kategoria, typ, współrzędne
  - Akcje: Edit, Delete, View on map
- [ ] Filtry: miasto, kategoria, źródło (manual/overpass)
- [ ] Formularz dodawania/edycji POI:
  - Nazwa (multi-language: pl, en, de, fr, uk)
  - Opis (multi-language)
  - Kategoria (heritage, nature, culture, food, etc.)
  - Typ (museum, restaurant, monument, etc.)
  - Współrzędne (lat/lon)
  - Tagi (array)
  - Zdjęcia (upload)
  - External links (Wikipedia, OpenStreetMap, etc.)
- [ ] Import POI from Overpass API (search in bbox)
- [ ] Bulk import from CSV/JSON

### Komponenty shadcn/ui:

- `Table`, `Dialog`, `Form`, `Tabs`, `Badge`, `Command` (search)

### Estymacja: 3 dni

---

## US 8.9: Multi-language content editor

**Jako** administrator  
**Chcę** zarządzać tłumaczeniami nazw i opisów  
**Aby** aplikacja wspierała wiele języków

### Kryteria akceptacji:

- [ ] Language tabs w formularzu (PL, EN, DE, FR, UK)
- [ ] Pola tekstowe dla każdego języka:
  - Tour name (LocalizedString)
  - Tour description (LocalizedString)
  - POI name (LocalizedString)
  - POI description (LocalizedString)
- [ ] Wskaźnik kompletności tłumaczeń (progress bar per language)
- [ ] "Copy from Polish" button (base language)
- [ ] Integracja z Google Translate API (suggestion mode)
- [ ] Walidacja: przynajmniej PL i EN wymagane

### Estymacja: 1.5 dnia

---

## US 8.10: Media Manager

**Jako** administrator  
**Chcę** zarządzać zdjęciami i multimediami  
**Aby** wycieczki miały atrakcyjne wizualizacje

### Kryteria akceptacji:

- [ ] Upload zdjęć (drag & drop, multi-select)
- [ ] Image optimization (resize, compress) przed zapisem
- [ ] Galeria mediów (grid view)
- [ ] Metadata: title, alt text, tags, upload date
- [ ] Wyszukiwarka po tagach
- [ ] Crop tool (select area)
- [ ] Image editor: rotate, flip, brightness, contrast
- [ ] Storage: lokalne pliki lub S3/Cloudinary integration
- [ ] CDN URLs dla obrazków

### Komponenty shadcn/ui:

- `Dialog`, `Card`, `Button`, `Input`, `Slider`, `AspectRatio`

### Estymacja: 2.5 dnia

---

## US 8.11: Preview & Testing Mode

**Jako** administrator  
**Chcę** testować wycieczki przed publikacją  
**Aby** upewnić się, że wszystko działa poprawnie

### Kryteria akceptacji:

- [ ] Przycisk "Preview" w edytorze (otwiera w nowej karcie)
- [ ] Preview pokazuje wycieczkę jak w aplikacji mobilnej (responsive view)
- [ ] Symulacja mobile UI (device frames: iPhone, Android)
- [ ] Test routing: OSRM API calculate dla całej trasy
- [ ] Raport problemów:
  - Brakujące tłumaczenia
  - Nieoptymalne waypoints (zbyt blisko siebie)
  - POI bez zdjęć
  - Długość opisu (za krótki/za długi)
- [ ] QR code generator (link do wycieczki w mobile app)

### Estymacja: 1.5 dnia

---

## US 8.12: Strona projektu - Landing Page

**Jako** potencjalny użytkownik  
**Chcę** dowiedzieć się o projekcie i pobrać aplikację  
**Aby** zacząć korzystać z kuratorowanych wycieczek

### Kryteria akceptacji:

- [ ] Hero section:
  - Nagłówek: "Odkryj polskie miasta na nowo"
  - Opis: krótkie intro (2-3 zdania)
  - CTA buttons: "Pobierz na iOS", "Pobierz na Android", "Zobacz demo"
  - Hero image/video: screenshot aplikacji lub animacja
- [ ] Features section (karty z ikonami):
  - 🗺️ Kuratorowane wycieczki
  - 📍 Punkty turystyczne
  - 🚶 Routing pieszy/rowerowy/samochodowy
  - 🌐 5 języków (PL, EN, DE, FR, UK)
  - 📱 Offline mode (future)
  - 🎨 Dostosowane do każdego miasta
- [ ] Cities section:
  - Siatka kart miast (Kraków, Warszawa, Wrocław, Trójmiasto)
  - Miniatura mapy + liczba wycieczek
- [ ] Tours showcase:
  - Slider z przykładowymi wycieczkami (top 6)
  - Karty z: zdjęcie, nazwa, miasto, dystans, czas
- [ ] How it works (3 kroki):
  - Wybierz miasto i wycieczkę
  - Podążaj za trasą na mapie
  - Odkryj ciekawe miejsca
- [ ] Screenshots section:
  - Device frames z ekranami aplikacji
  - Galeria z lightbox
- [ ] Download section:
  - App Store badge
  - Google Play badge
  - QR codes
- [ ] Footer:
  - Logo + tagline
  - Linki: O projekcie, Kontakt, Polityka prywatności, Regulamin
  - Social media links
  - Copyright

### Komponenty shadcn/ui:

- `Button`, `Card`, `Badge`, `Carousel`, `Dialog` (lightbox)

### Estymacja: 2 dni

---

## US 8.13: Strona projektu - O projekcie

**Jako** odwiedzający  
**Chcę** poznać szczegóły projektu i zespół  
**Aby** dowiedzieć się więcej o WTG Route Machine

### Kryteria akceptacji:

- [ ] Sekcja "About":
  - Historia projektu
  - Misja i wizja
  - Dlaczego stworzyliśmy aplikację
- [ ] Tech stack section:
  - Ikony technologii (React, OSRM, OpenStreetMap, Ionic, etc.)
  - Opis architektury (diagram)
- [ ] Open source section:
  - Link do GitHub repo
  - Contribution guidelines
  - License (MIT/Apache)
- [ ] Roadmap:
  - Timeline z planowanymi funkcjami
  - Epic 6-10 z opisami
- [ ] Contact section:
  - Formularz kontaktowy (name, email, message)
  - Email: info@watchtheguide.com
  - Social media

### Estymacja: 1 dzień

---

## US 8.14: Blog/News section (opcjonalne)

**Jako** administrator  
**Chcę** publikować aktualności i artykuły  
**Aby** informować użytkowników o nowościach

### Kryteria akceptacji:

- [ ] CMS do zarządzania postami (MDX support)
- [ ] Lista artykułów z preview
- [ ] Single post view (Markdown rendering)
- [ ] Kategorie: Updates, Tutorials, City Guides
- [ ] Tags
- [ ] SEO metadata (title, description, OG image)
- [ ] RSS feed

### Estymacja: 2 dni (opcjonalne - może być w przyszłości)

---

## US 8.15: Analytics & Monitoring

**Jako** administrator  
**Chcę** monitorować korzystanie z wycieczek  
**Aby** poprawiać jakość i popularyzować lepsze trasy

### Kryteria akceptacji:

- [ ] Integracja Google Analytics / Plausible (privacy-focused)
- [ ] Custom events tracking:
  - Tour views
  - Tour starts
  - Tour completions
  - POI clicks
- [ ] Dashboard analytics w admin panel:
  - Top tours (wyświetlenia, starts, completions)
  - User engagement metrics
  - Geographic distribution (które miasta popularne)
- [ ] Error monitoring: Sentry integration
- [ ] API usage monitoring (OSRM requests per city)

### Estymacja: 1.5 dnia

---

## US 8.16: Deployment & CI/CD

**Jako** deweloper  
**Chcę** automatycznie deployować admin panel i stronę projektu  
**Aby** zmiany trafiały do produkcji szybko i bezpiecznie

### Kryteria akceptacji:

- [ ] GitHub Actions workflow:
  - Build na pull request (verify)
  - Deploy to staging on merge to `develop`
  - Deploy to production on merge to `main`
- [ ] Vite build optimization:
  - Code splitting
  - Tree shaking
  - Asset optimization
- [ ] Hosting:
  - **Admin Panel**: Vercel/Netlify + basic auth (password protect)
  - **Website**: Vercel/Netlify (public)
- [ ] Custom domains:
  - admin.watchtheguide.com
  - www.watchtheguide.com
- [ ] Environment variables management
- [ ] Rollback strategy

### Estymacja: 1 dzień

---

## US 8.17: Integracja Admin Panel z Backend API

**Jako** administrator  
**Chcę** aby panel administracyjny komunikował się z prawdziwym backend API  
**Aby** móc tworzyć, edytować i usuwać wycieczki z trwałym zapisem w bazie danych

### Zależności:
- Epic 5.1 (Tours Backend) - rozszerzenie o CRUD operations
- US 8.2 (Autentykacja) - JWT token handling
- US 8.4 (Lista wycieczek) - podmiana mock data
- US 8.5 (Edytor wycieczek) - podmiana mock data

### Kryteria akceptacji:

#### Backend (tours-server) - rozszerzenie:

- [ ] **Auth Endpoints**:
  - [ ] `POST /api/admin/auth/login` - logowanie (email + hasło)
  - [ ] `POST /api/admin/auth/logout` - wylogowanie (invalidate token)
  - [ ] `POST /api/admin/auth/refresh` - odświeżenie tokenu
  - [ ] `GET /api/admin/auth/me` - dane zalogowanego użytkownika
  - [ ] JWT token z expiration (1h access, 7d refresh)
  - [ ] Bcrypt password hashing
  - [ ] Rate limiting na auth endpoints

- [ ] **Tours CRUD Endpoints**:
  - [ ] `POST /api/admin/tours` - tworzenie nowej wycieczki
  - [ ] `PUT /api/admin/tours/:id` - aktualizacja wycieczki
  - [ ] `DELETE /api/admin/tours/:id` - usuwanie wycieczki
  - [ ] `POST /api/admin/tours/:id/duplicate` - duplikowanie wycieczki
  - [ ] `POST /api/admin/tours/:id/publish` - publikacja (draft → published)
  - [ ] `POST /api/admin/tours/bulk-delete` - masowe usuwanie

- [ ] **Middleware**:
  - [ ] `authMiddleware` - weryfikacja JWT token
  - [ ] `roleMiddleware` - sprawdzanie uprawnień (admin/editor)
  - [ ] Error handling z proper HTTP status codes

- [ ] **Baza danych**:
  - [ ] Tabela `users` (id, email, password_hash, role, created_at)
  - [ ] Tabela `refresh_tokens` (id, user_id, token, expires_at)
  - [ ] Migracje SQLite/PostgreSQL

#### Frontend (admin) - integracja:

- [ ] **Services**:
  - [ ] `authService.ts` - login, logout, refresh, getCurrentUser
  - [ ] `toursService.ts` - CRUD operations (create, update, delete, duplicate)
  - [ ] `apiClient.ts` - axios/fetch wrapper z interceptors

- [ ] **Token Management**:
  - [ ] Przechowywanie access token (memory) i refresh token (httpOnly cookie lub localStorage)
  - [ ] Auto-refresh przed wygaśnięciem
  - [ ] Logout przy 401 Unauthorized

- [ ] **Podmiana mock data**:
  - [ ] `ToursPage.tsx` - pobieranie listy z API
  - [ ] `TourEditorPage.tsx` - zapis/aktualizacja przez API
  - [ ] `DashboardPage.tsx` - statystyki z API
  - [ ] Loading states i error handling

- [ ] **TanStack Query integration**:
  - [ ] `useQuery` dla pobierania danych
  - [ ] `useMutation` dla operacji CRUD
  - [ ] Optimistic updates
  - [ ] Cache invalidation

### Struktura plików:

```
backend/tours-server/
├── src/
│   ├── middleware/
│   │   ├── auth.middleware.ts      # JWT verification
│   │   └── role.middleware.ts      # Role-based access
│   ├── routes/
│   │   ├── admin.auth.routes.ts    # Auth endpoints
│   │   └── admin.tours.routes.ts   # CRUD endpoints
│   ├── services/
│   │   ├── auth.service.ts         # Auth business logic
│   │   └── user.service.ts         # User management
│   └── db/
│       └── migrations/
│           └── 001_add_users.sql

admin/src/
├── services/
│   ├── api.client.ts               # HTTP client with interceptors
│   ├── auth.service.ts             # Auth API calls
│   └── tours.service.ts            # Tours CRUD API calls
├── hooks/
│   ├── useAuth.ts                  # Auth state hook
│   └── useTours.ts                 # Tours query hooks
└── stores/
    └── authStore.ts                # Zustand auth state
```

### Przykład API Response:

```json
// POST /api/admin/auth/login
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "1",
    "email": "admin@wtg.pl",
    "role": "admin"
  },
  "expiresIn": 3600
}

// POST /api/admin/tours
{
  "id": "tour-123",
  "name": { "pl": "Droga Królewska", "en": "Royal Road" },
  "cityId": "krakow",
  "status": "draft",
  "createdAt": "2024-12-07T10:00:00Z",
  "updatedAt": "2024-12-07T10:00:00Z"
}
```

### Komponenty shadcn/ui:

- Existing components + `Skeleton` (loading states)

### Estymacja: 4-5 dni

### Fazy implementacji:

1. **Faza 1 (1.5 dnia)**: Backend Auth (login, JWT, middleware)
2. **Faza 2 (1.5 dnia)**: Backend Tours CRUD (POST, PUT, DELETE)
3. **Faza 3 (1 dzień)**: Frontend services i token management
4. **Faza 4 (1 dzień)**: Podmiana mock data, TanStack Query, testy

---

## Estymacje Podsumowanie

| User Story | Estymacja |
| ---------- | --------- |
| US 8.1     | 0.5 dnia  |
| US 8.2     | 2 dni     |
| US 8.3     | 1.5 dnia  |
| US 8.4     | 2 dni     |
| US 8.5     | 3 dni     |
| US 8.6     | 4 dni     |
| US 8.7     | 2 dni     |
| US 8.8     | 3 dni     |
| US 8.9     | 1.5 dnia  |
| US 8.10    | 2.5 dnia  |
| US 8.11    | 1.5 dnia  |
| US 8.12    | 2 dni     |
| US 8.13    | 1 dzień   |
| US 8.14    | 2 dni     |
| US 8.15    | 1.5 dnia  |
| US 8.16    | 1 dzień   |
| US 8.17    | 4.5 dnia  |

**Łączna estymacja:** ~34.5 dni robocze (~7 tygodni)

**MVP (bez US 8.14):** ~32.5 dni robocze

---

## Propozycje dodatkowych funkcjonalności

### 1. **Export/Import System**

- Export wycieczek do różnych formatów (GPX, KML, GeoJSON)
- Bulk import z CSV
- Share tours between cities (template system)

### 2. **Version Control dla wycieczek**

- Historia zmian (audit log)
- Revert do poprzedniej wersji
- Compare versions (diff view)

### 3. **Collaboration Features**

- Multi-user support (roles: admin, editor, contributor)
- Comments on tours (internal review)
- Approval workflow (draft → review → published)

### 4. **AI-Powered Features**

- Auto-generate tour descriptions (GPT-4)
- Suggest optimal waypoint order
- POI recommendation based on tour theme
- Auto-tagging tours and POI

### 5. **User Feedback Integration**

- Ratings & reviews from mobile app
- Display average rating w admin panel
- Flag inappropriate content

### 6. **Performance Optimization**

- Virtual scrolling dla długich list
- Lazy loading images
- Progressive Web App (PWA) dla admin panel
- Service worker caching

### 7. **Advanced Filtering**

- Save custom filters (presets)
- Smart search (fuzzy matching)
- Elasticsearch integration (full-text search)

### 8. **Notifications System**

- Email notifications (nowa wycieczka, comments)
- In-app notifications (toast + notification center)
- Webhook support (Slack/Discord integration)

---

## Kolejność realizacji (rekomendowana)

### Faza 1: MVP Admin Panel (2 tygodnie)

1. US 8.1 - Projekt i struktura
2. US 8.2 - Autentykacja
3. US 8.4 - Lista wycieczek
4. US 8.5 - Edytor wycieczek (basic)

### Faza 2: Advanced Editor (1.5 tygodnia)

5. US 8.6 - Edytor z mapą
6. US 8.7 - Zarządzanie POI w edytorze

### Faza 3: POI Management (1 tydzień)

7. US 8.8 - POI Manager
8. US 8.9 - Multi-language

### Faza 4: Media & Testing (1 tydzień)

9. US 8.10 - Media Manager
10. US 8.11 - Preview & Testing

### Faza 5: Public Website (1 tydzień)

11. US 8.12 - Landing Page
12. US 8.13 - About Page

### Faza 6: Monitoring & Deploy (0.5 tygodnia)

13. US 8.3 - Dashboard
14. US 8.15 - Analytics
15. US 8.16 - CI/CD

### Faza 7: Opcjonalne (future)

16. US 8.14 - Blog/News

---

## Design System & UI Guidelines

### Paleta kolorów (spójność z mobile app)

```css
:root {
  --primary: #ff6600; /* Brand orange */
  --primary-foreground: #ffffff;

  --secondary: #f5f5f5;
  --secondary-foreground: #1a1a1a;

  --accent: #0066cc;
  --accent-foreground: #ffffff;

  --destructive: #dc2626;
  --destructive-foreground: #ffffff;

  --border: #e5e7eb;
  --input: #e5e7eb;
  --ring: #ff6600;

  --background: #ffffff;
  --foreground: #1a1a1a;

  --muted: #f3f4f6;
  --muted-foreground: #6b7280;
}

.dark {
  --background: #1a1a1a;
  --foreground: #ffffff;
  /* ... */
}
```

### Typography

- **Headings:** Inter / Roboto / System Font Stack
- **Body:** -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Monospace:** "Fira Code", "Courier New", monospace

### Icons

- **Library:** Lucide React (spójność z shadcn/ui)
- **Map icons:** Custom SVG (POI categories)

### Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px', // Mobile
  md: '768px', // Tablet
  lg: '1024px', // Desktop
  xl: '1280px', // Large desktop
  '2xl': '1536px', // Extra large
};
```

---

## API Requirements (Backend - US 8.x Backend)

Potrzebne nowe endpointy:

### Auth API

```
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
POST   /api/admin/auth/refresh
POST   /api/admin/auth/reset-password
GET    /api/admin/auth/me
```

### Tours CRUD API

```
GET    /api/admin/tours
GET    /api/admin/tours/:id
POST   /api/admin/tours
PUT    /api/admin/tours/:id
DELETE /api/admin/tours/:id
POST   /api/admin/tours/:id/duplicate
POST   /api/admin/tours/bulk-delete
POST   /api/admin/tours/:id/publish
```

### POI CRUD API

```
GET    /api/admin/poi
GET    /api/admin/poi/:id
POST   /api/admin/poi
PUT    /api/admin/poi/:id
DELETE /api/admin/poi/:id
POST   /api/admin/poi/import/overpass
POST   /api/admin/poi/import/csv
```

### Media API

```
POST   /api/admin/media/upload
GET    /api/admin/media
DELETE /api/admin/media/:id
PUT    /api/admin/media/:id (metadata update)
```

### Analytics API

```
GET    /api/admin/analytics/dashboard
GET    /api/admin/analytics/tours/:id
GET    /api/admin/analytics/top-tours
```

### Validation API

```
POST   /api/admin/tours/:id/validate
POST   /api/admin/tours/:id/calculate-route
```

---

## Technologie - uzasadnienie wyborów

### Vite

- ⚡ Szybki dev server (ESM)
- 🔨 Optymalizacja bundle size
- 🔧 Hot Module Replacement (HMR)

### shadcn/ui

- ♿ Accessibility-first (Radix UI)
- 🎨 Customizable (Tailwind)
- 📦 Copy-paste components (no npm bloat)
- 🌗 Dark mode support built-in

### TanStack Query

- 🔄 Auto refetch, cache, stale data handling
- 🚀 Optimistic updates
- 📊 DevTools

### React Hook Form + Zod

- ⚡ Performance (uncontrolled components)
- ✅ Type-safe validation
- 🎯 Minimal re-renders

### OpenLayers

- 🗺️ Spójność z mobile app
- 🔧 Pełna kontrola nad mapą
- 📍 Custom markers, interactions

---

## Podsumowanie

Epic 8 dostarcza:

- ✅ Panel administracyjny do zarządzania wycieczkami
- ✅ Multi-language content editor
- ✅ Interaktywny edytor map z OSRM routing
- ✅ POI management system
- ✅ Media manager
- ✅ Publiczną stronę projektu (landing + about)
- ✅ Analytics & monitoring
- ✅ CI/CD automation

**Stack:** Vite + React 18 + TypeScript + shadcn/ui + TanStack Query + OpenLayers

**Estymacja:** ~30 dni robocze (6 tygodni)

**MVP:** US 8.1-8.8 + 8.12-8.13 + 8.16 = ~20 dni (4 tygodnie)
