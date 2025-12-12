# BUG-001: Media Library - Obrazy nie ładują się (stuck loader)

## Informacje podstawowe

| Pole                | Wartość                     |
| ------------------- | --------------------------- |
| **ID**              | BUG-001                     |
| **Data zgłoszenia** | 12 grudnia 2025             |
| **Data naprawy**    | 12 grudnia 2025             |
| **Priorytet**       | 🔴 High                     |
| **Status**          | ✅ Fixed                    |
| **Komponent**       | Admin Panel > Media Library |
| **Powiązane US**    | US 8.10: Media Manager      |

## Opis problemu

W Bibliotece Mediów (`/admin/media`) obrazy nie są wyświetlane. Zamiast miniatury obrazu wyświetla się nieskończony loader (spinner). Metadane obrazu (tytuł, tagi, wymiary, rozmiar) są poprawnie wyświetlane.

## Kroki do reprodukcji

1. Zaloguj się do panelu administracyjnego
2. Przejdź do Biblioteka Mediów (`/admin/media`)
3. Obserwuj karty mediów

## Oczekiwane zachowanie

- Miniatura obrazu powinna się załadować i wyświetlić
- Po załadowaniu loader powinien zniknąć

## Aktualne zachowanie

- Loader (spinner) wyświetla się w nieskończoność
- Obraz nigdy się nie ładuje
- Metadane (tytuł: "Trees", tagi: landmark, trees, wymiary: 800×600, rozmiar: 202.4 KB) są poprawnie wyświetlane

## Screenshot

> **Uwaga:** Screenshot błędu dostępny w załączniku do zgłoszenia (plik: `bug-001-screenshot.png`)

**Opis screenshota:**

- Widoczna karta mediów z tytułem "Trees"
- Zamiast miniatury obrazu wyświetla się pomarańczowy spinner (loader)
- Tagi: `landmark`, `trees`, `+1`
- Wymiary: 800 × 600
- Rozmiar: 202.4 KB
- Przycisk menu (⋮) widoczny w prawym górnym rogu karty

## Analiza techniczna

### Potencjalne przyczyny

1. **Nieprawidłowy URL thumbnailUrl** - URL do miniatury może być niepoprawny lub względny zamiast bezwzględny
2. **CORS issue** - Serwer może blokować requesty do obrazów z innej domeny
3. **Brak pliku** - Plik miniatury może nie istnieć na serwerze
4. **Backend nie działa** - API server może nie serwować plików statycznych
5. **onLoad event nie jest wyzwalany** - Problem z detekcją załadowania obrazu

### Komponenty do sprawdzenia

- `admin/src/components/media/MediaCard.tsx` - komponent karty mediów
- `admin/src/pages/MediaPage.tsx` - strona biblioteki mediów
- `backend/api-server/src/routes/media.routes.ts` - endpoint serwujący obrazy
- Konfiguracja static files w Express

### Logi do sprawdzenia

```bash
# Backend logs
cd backend/api-server && npm run dev

# Network tab w DevTools
# Sprawdzić czy request do thumbnailUrl zwraca 200/404/CORS error
```

## Środowisko

- **Przeglądarka**: [do uzupełnienia]
- **System**: macOS
- **Wersja Node**: v24.0.1
- **Backend URL**: http://localhost:3000
- **Frontend URL**: http://localhost:5174

## Rozwiązanie

### 🔍 Analiza Software Architect (12.12.2025)

#### GŁÓWNA PRZYCZYNA BŁĘDU (ROOT CAUSE)

**Problem: Względne URL-e zamiast bezwzględnych**

Backend zwraca `thumbnailUrl` jako **ścieżkę względną** (np. `/uploads/thumbnails/abc123-thumb.jpg`), podczas gdy frontend używa jej bezpośrednio w tagu `<img>` bez dodania bazy URL serwera API.

**Przepływ danych:**

1. **Backend** (`media.service.ts:49-51`):

   ```typescript
   thumbnailUrl: `/uploads/thumbnails/${filename.replace(
     /\.([^.]+)$/,
     '-thumb.$1'
   )}`;
   ```

   Zwraca: `/uploads/thumbnails/abc123-thumb.jpg` (ścieżka względna)

2. **Frontend** (`MediaCard.tsx:56`):

   ```tsx
   <img src={media.thumbnailUrl} ... />
   ```

   Przeglądarka interpretuje to jako: `http://localhost:5174/uploads/thumbnails/abc123-thumb.jpg`

3. **Rzeczywista lokalizacja obrazu**:
   `http://localhost:3000/uploads/thumbnails/abc123-thumb.jpg`

**Rezultat:** Przeglądarka próbuje załadować obraz z frontendu Vite (port 5174) zamiast z backendu Express (port 3000). Request zwraca 404, event `onLoad` nigdy się nie wyzwala, spinner kręci się w nieskończoność.

#### DLACZEGO METADANE DZIAŁAJĄ

Metadane (tytuł, tagi, wymiary, rozmiar) są pobierane z API `/api/admin/media` jako JSON - ten endpoint działa poprawnie. Problem dotyczy tylko URL-i do plików statycznych, które są ścieżkami względnymi.

#### ANALIZA KODU

| Plik                                               | Lokalizacja | Problem                                                       |
| -------------------------------------------------- | ----------- | ------------------------------------------------------------- |
| `backend/api-server/src/services/media.service.ts` | L48-51      | Zapisuje względne URL-e do bazy danych                        |
| `admin/src/components/media/MediaCard.tsx`         | L56         | Używa `thumbnailUrl` bez bazy URL                             |
| `admin/src/components/media/MediaCard.tsx`         | L52-55      | Brak obsługi `onError` - spinner nigdy nie znika przy błędzie |

---

### 📋 PLIKI WYMAGAJĄCE MODYFIKACJI

#### Opcja A: Napraw w Frontend (REKOMENDOWANE)

| Plik                                       | Zmiana                                        |
| ------------------------------------------ | --------------------------------------------- |
| `admin/src/components/media/MediaCard.tsx` | Dodaj `API_BASE_URL` prefix do `thumbnailUrl` |
| `admin/src/components/media/MediaCard.tsx` | Dodaj `onError` handler dla graceful fallback |

#### Opcja B: Napraw w Backend (ALTERNATYWNA)

| Plik                                               | Zmiana                                     |
| -------------------------------------------------- | ------------------------------------------ |
| `backend/api-server/src/services/media.service.ts` | Zwracaj pełne URL-e z konfiguracją serwera |
| `backend/api-server/src/config/media.config.ts`    | Dodaj `baseUrl` do konfiguracji            |

---

### 🔧 KONKRETNE ZMIANY DO WPROWADZENIA

#### Rekomendacja dla Web Specialist (Frontend Fix):

**1. `admin/src/components/media/MediaCard.tsx`:**

```tsx
// Dodaj import
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// W komponencie, dodaj state dla błędu
const [imageError, setImageError] = useState(false);

// Zmień src obrazu
<img
  src={`${API_BASE_URL}${media.thumbnailUrl}`}
  alt={media.altText || media.title || media.originalName}
  className={...}
  onLoad={() => setImageLoaded(true)}
  onError={() => {
    setImageError(true);
    setImageLoaded(true); // Ukryj spinner
  }}
/>

// Dodaj fallback UI dla błędów
{imageError && (
  <div className="absolute inset-0 flex items-center justify-center bg-muted">
    <ImageOff className="h-8 w-8 text-muted-foreground" />
  </div>
)}
```

**2. Dodaj helper function (opcjonalnie):**

Utwórz `admin/src/lib/media-url.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export function getMediaUrl(path: string): string {
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
}
```

---

### 📝 REKOMENDACJE

#### Dla Backend Developer:

1. **Rozważ zwracanie pełnych URL-i** w `formatMediaObject()` - dodaj bazę URL serwera
2. **Alternatywnie:** Utrzymaj obecne podejście (względne ścieżki), ale udokumentuj, że frontend musi dodać prefix

#### Dla Web Specialist:

1. **Napraw MediaCard.tsx** - dodaj `API_BASE_URL` prefix
2. **Dodaj onError handler** - zapobiegaj stuck loaderom
3. **Utwórz helper `getMediaUrl()`** - reużywalne w całej aplikacji
4. **Dodaj testy** - sprawdź przypadki błędów ładowania obrazów

#### Dla QA Engineer:

1. **Testy E2E:** Zweryfikuj, że obrazy ładują się poprawnie
2. **Testy jednostkowe:** Sprawdź helper `getMediaUrl()` z różnymi inputami
3. **Edge cases:** Przetestuj fallback UI przy błędach sieciowych

---

### ✅ WALIDACJA PO NAPRAWIE

```bash
# 1. Uruchom backend
cd backend/api-server && npm run dev

# 2. Uruchom frontend
cd admin && npm run dev

# 3. Sprawdź w DevTools > Network
# - Request do thumbnailUrl powinien iść na localhost:3000
# - Status 200, Content-Type: image/jpeg

# 4. Sprawdź w UI
# - Miniatura powinna się wyświetlić
# - Spinner powinien zniknąć
```

---

**Status:** ✅ Fixed (12.12.2025)

---

## ✅ Implementacja naprawy (Web Application Specialist, 12.12.2025)

### Wprowadzone zmiany:

#### 1. `admin/src/lib/utils.ts`

Dodano helper function `getMediaUrl()`:

```typescript
export function getMediaUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${baseUrl}${path}`;
}
```

#### 2. `admin/src/components/media/MediaCard.tsx`

- Import `getMediaUrl` z `@/lib/utils`
- Dodano state `imageError` dla obsługi błędów ładowania
- Użyto `getMediaUrl(media.thumbnailUrl)` zamiast `media.thumbnailUrl`
- Dodano `onError` handler który ustawia fallback i ukrywa loader
- Dodano placeholder UI z ikoną obrazka gdy wystąpi błąd ładowania

#### 3. `admin/src/components/media/MediaDetailsModal.tsx`

- Import `getMediaUrl` z `@/lib/utils`
- Użyto `getMediaUrl(media.url)` dla pełnowymiarowego obrazu

#### 4. `admin/src/components/media/MediaPicker.tsx`

- Import `getMediaUrl` z `@/lib/utils`
- Użyto `getMediaUrl(media.thumbnailUrl)` w komponencie `MediaPickerCard`

### Testowanie:

```bash
# 1. Uruchom backend
cd backend/api-server && npm run dev

# 2. Uruchom frontend
cd admin && npm run dev

# 3. Otwórz http://localhost:5174/admin/media
# 4. Obrazy powinny się ładować poprawnie
```

## Powiązane pliki

- [MediaCard.tsx](../admin/src/components/media/MediaCard.tsx)
- [MediaPage.tsx](../admin/src/pages/MediaPage.tsx)
- [admin.media.routes.ts](../backend/api-server/src/routes/admin.media.routes.ts)
- [media.service.ts (frontend)](../admin/src/services/media.service.ts)
- [media.service.ts (backend)](../backend/api-server/src/services/media.service.ts)
- [media.config.ts](../backend/api-server/src/config/media.config.ts)
