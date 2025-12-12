# UX Design: US 8.16 Tour Media Integration

**Autor:** UI/UX Designer (Copilot Agent)  
**Data:** 12 grudnia 2025  
**Status:** 📝 Design Ready for Review

---

## 1. Problem Statement

### Zidentyfikowane problemy UX:

| #   | Problem                          | Severity    | Root Cause                                 |
| --- | -------------------------------- | ----------- | ------------------------------------------ |
| 1   | Przycisk ❌ nie działa           | 🔴 Critical | Event bubbling - X wewnątrz Card z onClick |
| 2   | Brak sekcji "wybrane"            | 🟠 High     | Płaski grid, brak wizualnej separacji      |
| 3   | Brak oznaczenia głównego zdjęcia | 🟠 High     | Funkcjonalność nie zaimplementowana        |
| 4   | Brak możliwości reorderingu      | 🟡 Medium   | Drag & drop nieobecny                      |
| 5   | Nieintuicyjny UX selekcji        | 🟡 Medium   | Kliknięcie = toggle, chaos mentalny        |

---

## 2. Proponowana Architektura UI

### 2.1 Layout - Dwie Sekcje

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Tab: Media                                                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ SELECTED MEDIA SECTION                                          │   │
│  │ (góra - zwinięta/rozwinięta w zależności od stanu)              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ MEDIA LIBRARY BROWSER                                           │   │
│  │ (dół - zawsze widoczna biblioteka)                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ASCII Wireframes

### 3.1 Stan Pusty (Empty State)

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📷 Wybrane zdjęcia (0/10)                                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│            ┌───────────────────────────────────────────┐                │
│            │                                           │                │
│            │        📷  Brak wybranych zdjęć           │                │
│            │                                           │                │
│            │    Kliknij na zdjęcie w bibliotece        │                │
│            │    poniżej, aby je dodać                  │                │
│            │                                           │                │
│            └───────────────────────────────────────────┘                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
│                                                                         │
│  📚 Biblioteka mediów                    🔍 [Szukaj po nazwie...]       │
├─────────────────────────────────────────────────────────────────────────┤
│  [Wszystkie ▼]              [⬆️ Upload nowy]                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │          │ │          │ │          │ │          │ │          │      │
│  │  img01   │ │  img02   │ │  img03   │ │  img04   │ │  img05   │      │
│  │          │ │          │ │          │ │          │ │          │      │
│  │    [+]   │ │    [+]   │ │    [+]   │ │    [+]   │ │    [+]   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │          │ │          │ │          │ │          │ │          │      │
│  │  img06   │ │  img07   │ │  img08   │ │  img09   │ │  img10   │      │
│  │          │ │          │ │          │ │          │ │          │      │
│  │    [+]   │ │    [+]   │ │    [+]   │ │    [+]   │ │    [+]   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                                         │
│                         [Załaduj więcej ▼]                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Stan z Wybranymi Obrazami

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📷 Wybrane zdjęcia (3/10)                        [Wyczyść wszystkie]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────┐ ┌────────────────┐ ┌────────────────┐               │
│  │ ⭐ ≡ ≡ ≡       │ │    ≡ ≡ ≡      │ │    ≡ ≡ ≡      │               │
│  │                │ │                │ │                │               │
│  │                │ │                │ │                │               │
│  │   Sukiennice   │ │  Rynek Główny  │ │   Wawel        │               │
│  │                │ │                │ │                │               │
│  │                │ │                │ │                │               │
│  │  [⭐] [🗑️]      │ │  [☆] [🗑️]      │ │  [☆] [🗑️]      │               │
│  └────────────────┘ └────────────────┘ └────────────────┘               │
│         │                    │                  │                       │
│         └────────────────────┼──────────────────┘                       │
│              DRAG & DROP     │     REORDER                              │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │ 💡 Przeciągnij karty aby zmienić kolejność. ⭐ = zdjęcie główne │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
│                                                                         │
│  📚 Biblioteka mediów                    🔍 [Szukaj po nazwie...]       │
├─────────────────────────────────────────────────────────────────────────┤
│  [Wszystkie ▼]              [⬆️ Upload nowy]                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ ✓ CHOSEN │ │          │ │ ✓ CHOSEN │ │          │ │ ✓ CHOSEN │      │
│  │  ~~~~~~  │ │  img02   │ │  ~~~~~~  │ │  img04   │ │  ~~~~~~  │      │
│  │  (dim)   │ │          │ │  (dim)   │ │          │ │  (dim)   │      │
│  │          │ │    [+]   │ │          │ │    [+]   │ │          │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │          │ │          │ │          │ │          │ │          │      │
│  │  img06   │ │  img07   │ │  img08   │ │  img09   │ │  img10   │      │
│  │          │ │          │ │          │ │          │ │          │      │
│  │    [+]   │ │    [+]   │ │    [+]   │ │    [+]   │ │    [+]   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Hover States

#### 3.3.1 Hover na obrazie w bibliotece (niewybrane)

```
┌──────────────┐
│              │
│   img01      │
│              │
│  ┌────────┐  │ ← overlay pojawia się
│  │  [+]   │  │   na hover
│  │ Dodaj  │  │
│  └────────┘  │
└──────────────┘
     │
     ▼
┌──────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │  ← subtle dark overlay
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
│  ╔════════╗  │
│  ║ + DODAJ║  │  ← centered button
│  ╚════════╝  │
└──────────────┘
```

#### 3.3.2 Hover na obrazie w bibliotece (już wybrane)

```
┌──────────────┐
│ ✓ WYBRANE    │ ← permanent badge
│ ▒▒▒▒▒▒▒▒▒▒▒▒ │ ← dimmed/muted
│ ▒▒(image)▒▒▒ │
│ ▒▒▒▒▒▒▒▒▒▒▒▒ │
│              │
└──────────────┘
     │
     ▼ hover
┌──────────────┐
│ ✓ WYBRANE    │
│ ▒▒▒▒▒▒▒▒▒▒▒▒ │
│ "Już dodane" │ ← tooltip
│ ▒▒▒▒▒▒▒▒▒▒▒▒ │
│ cursor: not-allowed
└──────────────┘
```

#### 3.3.3 Hover na wybranym obrazie (sekcja Selected)

```
┌────────────────────┐
│ ⭐ ≡ ≡ ≡           │ ← drag handle widoczny
│                    │
│    Sukiennice      │
│                    │
│ ┌────┐    ┌────┐   │ ← action buttons
│ │ ⭐ │    │ 🗑️  │   │   always visible
│ │set │    │del │   │
│ │main│    │    │   │
│ └────┘    └────┘   │
└────────────────────┘
     │
     ▼ hover na 🗑️
┌────────────────────┐
│ ⭐ ≡ ≡ ≡           │
│                    │
│    Sukiennice      │
│                    │
│ ┌────┐    ┌─────┐  │
│ │ ⭐ │    │ 🗑️   │  │ ← RED background
│ │    │    │USUŃ │  │   on hover
│ │    │    │     │  │
│ └────┘    └─────┘  │
└────────────────────┘
```

### 3.4 Drag & Drop w trakcie

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📷 Wybrane zdjęcia (3/10)                        [Wyczyść wszystkie]   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌────────────────┐     ┌────────────────┐ ┌────────────────┐           │
│  │ ⭐              │     │                │ │                │           │
│  │                │ ╔══╗│                │ │                │           │
│  │   Sukiennice   │ ║▓▓║│  Rynek Główny  │ │   Wawel        │           │
│  │                │ ║▓▓║│                │ │                │           │
│  │                │ ╚══╝│                │ │                │           │
│  │  [⭐] [🗑️]      │ │◀──│  [☆] [🗑️]      │ │  [☆] [🗑️]      │           │
│  └────────────────┘ │  │└────────────────┘ └────────────────┘           │
│                     │  │     │                                          │
│  ╔════════════════╗ │  │     │                                          │
│  ║   Wawel       ▓║─┘  │     │ ← drop indicator                         │
│  ║   (dragging)  ▓║     ▼     │                                          │
│  ╚════════════════╝  ┌───┐                                              │
│                      │   │  ← visual drop zone                          │
│                      └───┘                                              │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Structure

### 4.1 Hierarchia Komponentów

```
TourEditorPage
└── FormField (name="mediaIds")
    └── TourMediaPicker (nowy komponent-wrapper)
        │
        ├── SelectedMediaSection
        │   ├── SectionHeader (tytuł + "Wyczyść wszystkie")
        │   ├── EmptyState (gdy brak wybranych)
        │   └── DragDropContext (dnd-kit lub react-beautiful-dnd)
        │       └── SelectedMediaCard[] (map)
        │           ├── DragHandle (≡≡≡ ikona)
        │           ├── MediaThumbnail
        │           ├── MediaTitle
        │           ├── SetPrimaryButton (⭐/☆)
        │           └── RemoveButton (🗑️) ← POZA strukturą Card!
        │
        ├── Separator
        │
        └── MediaLibraryBrowser
            ├── BrowserHeader
            │   ├── SearchInput (🔍)
            │   ├── FilterDropdown ([Wszystkie ▼])
            │   └── UploadButton ([⬆️ Upload])
            │
            ├── MediaGrid (infinite scroll lub pagination)
            │   └── LibraryMediaCard[] (map)
            │       ├── MediaThumbnail
            │       ├── SelectedBadge (✓ gdy wybrane)
            │       └── AddButton ([+]) ← tylko gdy niewybrane
            │
            └── LoadMoreButton / InfiniteScrollTrigger
```

### 4.2 Nowe Komponenty do Utworzenia

| Komponent              | Ścieżka                                     | Opis                             |
| ---------------------- | ------------------------------------------- | -------------------------------- |
| `TourMediaPicker`      | `components/media/TourMediaPicker.tsx`      | Wrapper łączący obie sekcje      |
| `SelectedMediaSection` | `components/media/SelectedMediaSection.tsx` | Górna sekcja z wybranymi         |
| `SelectedMediaCard`    | `components/media/SelectedMediaCard.tsx`    | Karta wybranego obrazu z akcjami |
| `MediaLibraryBrowser`  | `components/media/MediaLibraryBrowser.tsx`  | Dolna sekcja browsera            |
| `LibraryMediaCard`     | `components/media/LibraryMediaCard.tsx`     | Karta obrazu w bibliotece        |

### 4.3 Modyfikacja istniejącego MediaPicker

Istniejący `MediaPicker.tsx` należy **zachować** dla innych kontekstów (POI), ale Tour Editor powinien używać nowego `TourMediaPicker`.

---

## 5. Lista Interakcji

### 5.1 Selected Media Section

| Akcja     | Element                      | Efekt                     | Feedback                                                 |
| --------- | ---------------------------- | ------------------------- | -------------------------------------------------------- |
| **Click** | Przycisk ⭐ (Set as Primary) | Ustawia obraz jako główny | Toast: "Ustawiono jako zdjęcie główne"                   |
| **Click** | Przycisk 🗑️ (Remove)         | Usuwa z selekcji          | Toast: "Usunięto z wycieczki", obraz wraca do biblioteki |
| **Drag**  | Drag Handle (≡≡≡)            | Rozpoczyna drag           | Card unosi się, cień, placeholder                        |
| **Drop**  | Między kartami               | Zmienia kolejność         | Animacja reorder                                         |
| **Click** | "Wyczyść wszystkie"          | Usuwa wszystkie           | Confirm dialog → Toast: "Usunięto wszystkie"             |
| **Hover** | Cała karta                   | Podświetlenie             | Subtle border change                                     |

### 5.2 Media Library Browser

| Akcja      | Element                | Efekt                | Feedback                                              |
| ---------- | ---------------------- | -------------------- | ----------------------------------------------------- |
| **Click**  | Przycisk [+] na karcie | Dodaje do selekcji   | Toast: "Dodano do wycieczki", karta zostaje oznaczona |
| **Click**  | Karta (już wybrana)    | Nic                  | Cursor: not-allowed, tooltip "Już wybrane"            |
| **Type**   | Search input           | Filtruje wyniki      | Debounce 300ms, skeleton loading                      |
| **Click**  | Upload button          | Otwiera modal upload | MediaUpload modal                                     |
| **Scroll** | Koniec listy           | Ładuje więcej        | Infinite scroll lub "Load more"                       |

### 5.3 Keyboard Navigation

| Klawisz     | Kontekst             | Akcja                                |
| ----------- | -------------------- | ------------------------------------ |
| `Tab`       | Global               | Przechodzi między focusable elements |
| `Enter`     | Na karcie biblioteki | Dodaje do selekcji                   |
| `Delete`    | Na wybranej karcie   | Usuwa z selekcji                     |
| `Space`     | Na przycisku ⭐      | Toggle primary                       |
| `Escape`    | Podczas drag         | Anuluje drag                         |
| `Arrow ←/→` | Na wybranych         | Nawigacja między kartami             |

---

## 6. State Management

### 6.1 Props Interface

```typescript
interface TourMediaPickerProps {
  // Controlled state
  selectedIds: string[];
  primaryId?: string;
  onSelectionChange: (ids: string[]) => void;
  onPrimaryChange: (id: string | undefined) => void;

  // Config
  maxItems?: number; // default: 10
  contextType: 'tour';
  contextId?: string; // tour ID (for edit mode)

  // Optional
  className?: string;
}
```

### 6.2 Internal State

```typescript
// SelectedMediaSection
interface SelectedMediaState {
  items: SelectedMediaItem[];
  isDragging: boolean;
  draggedId: string | null;
}

interface SelectedMediaItem {
  id: string;
  media: MediaItem;
  isPrimary: boolean;
  order: number;
}

// MediaLibraryBrowser
interface LibraryState {
  search: string;
  filter: 'all' | 'unused' | 'mine';
  page: number;
  isLoading: boolean;
}
```

---

## 7. Visual Design Specs

### 7.1 Color Tokens (shadcn/ui compatible)

```css
/* Selected Media Section */
--selected-section-bg: hsl(var(--card));
--selected-card-border: hsl(var(--border));
--selected-card-border-hover: hsl(var(--primary));
--primary-indicator: hsl(var(--chart-4)); /* gold/yellow */
--remove-button-bg: hsl(var(--destructive));
--remove-button-hover: hsl(var(--destructive) / 0.9);

/* Library Browser */
--library-selected-overlay: hsl(var(--primary) / 0.1);
--library-selected-badge-bg: hsl(var(--primary));
--library-add-button-bg: hsl(var(--primary));
--library-disabled-opacity: 0.5;

/* Drag & Drop */
--drag-placeholder-bg: hsl(var(--muted));
--drag-placeholder-border: hsl(var(--primary) / 0.5);
--dragging-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
```

### 7.2 Spacing & Sizing

```css
/* Selected Section */
--selected-card-size: 160px;
--selected-card-gap: 16px;
--selected-section-padding: 16px;
--action-button-size: 32px;

/* Library Grid */
--library-card-min-width: 120px;
--library-card-gap: 12px;
--library-grid-columns: repeat(auto-fill, minmax(120px, 1fr));

/* Responsive */
@media (max-width: 640px) {
  --selected-card-size: 120px;
  --library-card-min-width: 100px;
}
```

### 7.3 Icons (lucide-react)

| Użycie                | Ikona            | Import                              |
| --------------------- | ---------------- | ----------------------------------- |
| Primary star (filled) | `Star` with fill | `<Star className="fill-current" />` |
| Primary star (empty)  | `Star`           | `<Star />`                          |
| Remove/Delete         | `Trash2`         | `<Trash2 />`                        |
| Add                   | `Plus`           | `<Plus />`                          |
| Drag handle           | `GripVertical`   | `<GripVertical />`                  |
| Search                | `Search`         | `<Search />`                        |
| Upload                | `Upload`         | `<Upload />`                        |
| Check (selected)      | `Check`          | `<Check />`                         |
| Image placeholder     | `ImageIcon`      | `<ImageIcon />`                     |

---

## 8. Accessibility (A11y)

### 8.1 ARIA Labels

```tsx
// SelectedMediaCard
<button aria-label={t('media.setAsPrimary', { name: media.title })} />
<button aria-label={t('media.removeFromTour', { name: media.title })} />

// LibraryMediaCard
<button aria-label={t('media.addToTour', { name: media.title })} />

// Drag & Drop
<div
  role="listbox"
  aria-label={t('media.selectedImages')}
  aria-describedby="dnd-instructions"
/>
<span id="dnd-instructions" className="sr-only">
  {t('media.dndInstructions')}
</span>
```

### 8.2 Focus Management

```typescript
// Po usunięciu obrazu - focus na następny
const handleRemove = (index: number) => {
  removeMedia(id);
  const nextFocusIndex = Math.min(index, selectedIds.length - 2);
  focusCardAt(nextFocusIndex);
};

// Po dodaniu - focus na nowo dodany
const handleAdd = (id: string) => {
  addMedia(id);
  focusLastSelectedCard();
};
```

### 8.3 Screen Reader Announcements

```tsx
// Live region for status updates
<div role="status" aria-live="polite" className="sr-only">
  {announcement}
</div>

// Announcements:
// - "Dodano [nazwa] do wycieczki. Wybrano 3 z 10 zdjęć."
// - "Usunięto [nazwa] z wycieczki. Wybrano 2 z 10 zdjęć."
// - "[nazwa] ustawiono jako zdjęcie główne."
// - "Przeniesiono [nazwa] z pozycji 3 na pozycję 1."
```

---

## 9. Animations & Transitions

### 9.1 CSS Transitions

```css
/* Card hover */
.selected-card {
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.selected-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--dragging-shadow);
}

/* Remove button hover */
.remove-button {
  transition: background-color 0.15s ease, transform 0.1s ease;
}
.remove-button:hover {
  transform: scale(1.1);
}

/* Add button appear */
.add-button {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.library-card:hover .add-button {
  opacity: 1;
  transform: scale(1);
}
```

### 9.2 Drag Animation (dnd-kit)

```typescript
// Smooth reorder animation
const sortingStrategy = rectSortingStrategy;

// Drop animation
const dropAnimation = {
  duration: 250,
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
};
```

---

## 10. Error States

### 10.1 Empty Library

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📚 Biblioteka mediów                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                        ┌─────────────────────┐                          │
│                        │                     │                          │
│                        │    📷  Brak zdjęć   │                          │
│                        │   w bibliotece      │                          │
│                        │                     │                          │
│                        │  [⬆️ Prześlij zdjęcie]                          │
│                        │                     │                          │
│                        │    lub              │                          │
│                        │  [→ Zarządzaj mediami]                          │
│                        │                     │                          │
│                        └─────────────────────┘                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Network Error

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📚 Biblioteka mediów                                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│          ┌─────────────────────────────────────────┐                    │
│          │  ⚠️  Nie udało się załadować mediów     │                    │
│          │                                         │                    │
│          │  Sprawdź połączenie internetowe         │                    │
│          │                                         │                    │
│          │            [🔄 Spróbuj ponownie]         │                    │
│          └─────────────────────────────────────────┘                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Max Limit Reached

```
┌─────────────────────────────────────────────────────────────────────────┐
│  📷 Wybrane zdjęcia (10/10)                       [Wyczyść wszystkie]   │
├─────────────────────────────────────────────────────────────────────────┤
│  ⚠️ Osiągnięto limit 10 zdjęć. Usuń jedno aby dodać nowe.               │
├─────────────────────────────────────────────────────────────────────────┤
│  ... cards ...                                                          │
└─────────────────────────────────────────────────────────────────────────┘
│                                                                         │
│  📚 Biblioteka mediów  (dodawanie wyłączone)                            │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌──────────┐    ← wszystkie karty           │
│  │          │ │          │ │          │      z opacity: 0.5             │
│  │  (muted) │ │  (muted) │ │  (muted) │      cursor: not-allowed        │
│  │          │ │          │ │          │                                  │
│  └──────────┘ └──────────┘ └──────────┘                                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Responsive Behavior

### 11.1 Desktop (> 1024px)

- Selected: 4-5 cards per row
- Library: 5-6 cards per row
- Side-by-side layout possible

### 11.2 Tablet (640px - 1024px)

- Selected: 3-4 cards per row
- Library: 4-5 cards per row
- Stacked layout

### 11.3 Mobile (< 640px)

- Selected: 2 cards per row
- Library: 2-3 cards per row
- Smaller card sizes
- Touch-friendly button sizes (min 44x44px)

```css
/* Responsive grid */
.selected-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--selected-card-size), 1fr)
  );
  gap: var(--selected-card-gap);
}

.library-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(var(--library-card-min-width), 1fr)
  );
  gap: var(--library-card-gap);
}
```

---

## 12. Implementation Recommendations

### 12.1 Dla Web Specialist

#### Priorytet 1: Fix Remove Button (BUG-007) ✅ CRITICAL

```tsx
// SelectedMediaCard.tsx - przycisk POZA Card
export function SelectedMediaCard({
  media,
  isPrimary,
  onRemove,
  onSetPrimary,
}) {
  return (
    <div className="relative group">
      {' '}
      {/* Wrapper */}
      <Card className="...">
        {/* Zawartość karty BEZ przycisków akcji */}
        <DragHandle />
        <MediaThumbnail src={media.thumbnailUrl} />
        <MediaTitle>{media.title}</MediaTitle>
      </Card>
      {/* Przyciski POZA Card - zero event bubbling */}
      <div className="absolute bottom-2 left-2 right-2 flex justify-between">
        <Button
          variant={isPrimary ? 'default' : 'outline'}
          size="icon"
          onClick={onSetPrimary}>
          <Star className={isPrimary ? 'fill-current' : ''} />
        </Button>

        <Button variant="destructive" size="icon" onClick={onRemove}>
          <Trash2 />
        </Button>
      </div>
    </div>
  );
}
```

#### Priorytet 2: Separation of Concerns

Rozdziel monolityczny `MediaPicker.tsx` na:

1. `TourMediaPicker.tsx` - orchestrator dla Tour Editor
2. `SelectedMediaSection.tsx` - górna sekcja
3. `MediaLibraryBrowser.tsx` - dolna sekcja (reusable)

#### Priorytet 3: Drag & Drop

Użyj `@dnd-kit/core` + `@dnd-kit/sortable`:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

#### Priorytet 4: Primary Image Logic

```typescript
// Hook do zarządzania primary
function usePrimaryImage(selectedIds: string[], primaryId?: string) {
  // Auto-set first image as primary if none set
  useEffect(() => {
    if (selectedIds.length > 0 && !primaryId) {
      onPrimaryChange(selectedIds[0]);
    }
    // Clear primary if removed from selection
    if (primaryId && !selectedIds.includes(primaryId)) {
      onPrimaryChange(selectedIds[0] || undefined);
    }
  }, [selectedIds, primaryId]);
}
```

### 12.2 Sugerowana kolejność implementacji

1. **Day 1:** Create component structure, fix BUG-007
2. **Day 2:** Implement SelectedMediaSection with reorder
3. **Day 3:** Implement MediaLibraryBrowser with search/filter
4. **Day 4:** Integration, primary image logic, tests
5. **Day 5:** Polish, accessibility, E2E tests

### 12.3 Testing Checklist

```markdown
- [ ] Add image from library → appears in selected
- [ ] Remove image → returns to library (not dimmed)
- [ ] Set as primary → star filled, only one primary
- [ ] Drag reorder → order persists
- [ ] Search → filters library
- [ ] Max limit → cannot add more
- [ ] Empty state → proper message
- [ ] Keyboard navigation → all actions accessible
- [ ] Screen reader → proper announcements
```

---

## 13. Data Test IDs

```tsx
// For Cypress E2E tests
data-testid="tour-media-picker"
data-testid="selected-media-section"
data-testid="selected-media-card-{id}"
data-testid="selected-media-remove-{id}"
data-testid="selected-media-primary-{id}"
data-testid="selected-media-drag-handle-{id}"
data-testid="media-library-browser"
data-testid="media-library-search"
data-testid="media-library-upload"
data-testid="library-media-card-{id}"
data-testid="library-media-add-{id}"
data-testid="clear-all-button"
data-testid="empty-state-selected"
data-testid="empty-state-library"
```

---

## 14. i18n Keys

```typescript
// pl.ts additions
mediaPicker: {
  selectedTitle: 'Wybrane zdjęcia',
  selectedCount: '({{count}}/{{max}})',
  clearAll: 'Wyczyść wszystkie',
  emptySelected: 'Brak wybranych zdjęć',
  emptySelectedHint: 'Kliknij na zdjęcie w bibliotece poniżej, aby je dodać',
  libraryTitle: 'Biblioteka mediów',
  searchPlaceholder: 'Szukaj po nazwie...',
  filterAll: 'Wszystkie',
  filterUnused: 'Nieprzypisane',
  filterMine: 'Moje',
  addToTour: 'Dodaj do wycieczki',
  removeFromTour: 'Usuń z wycieczki',
  setAsPrimary: 'Ustaw jako główne',
  isPrimary: 'Zdjęcie główne',
  alreadySelected: 'Już wybrane',
  maxLimitReached: 'Osiągnięto limit {{max}} zdjęć',
  dndHint: 'Przeciągnij karty aby zmienić kolejność',
  dndInstructions: 'Użyj klawiszy strzałek aby przenosić elementy',

  // Toasts
  toasts: {
    added: 'Dodano "{{name}}" do wycieczki',
    removed: 'Usunięto "{{name}}" z wycieczki',
    clearedAll: 'Usunięto wszystkie zdjęcia',
    setPrimary: 'Ustawiono "{{name}}" jako zdjęcie główne',
    reordered: 'Zmieniono kolejność zdjęć',
  },
}
```

---

## 15. Approval Checklist

| Aspekt                  | Status | Uwagi                          |
| ----------------------- | ------ | ------------------------------ |
| Wireframes kompletne    | ✅     | Wszystkie stany udokumentowane |
| Interakcje zdefiniowane | ✅     | Click, hover, drag, keyboard   |
| Struktura komponentów   | ✅     | 5 nowych komponentów           |
| Accessibility           | ✅     | ARIA, focus, announcements     |
| Responsive              | ✅     | Mobile, tablet, desktop        |
| Error states            | ✅     | Empty, network, limit          |
| Implementation guide    | ✅     | Priorytety, kod examples       |
| i18n                    | ✅     | Klucze zdefiniowane            |
| Testing                 | ✅     | data-testid, checklist         |

---

**Następny krok:** Przekaż ten dokument Web Application Specialist do implementacji.

---

_Document version: 1.0_  
_Last updated: 12 grudnia 2025_
