# BUG-002, BUG-003, BUG-004: Tour Editor Media Tab Issues

## Informacje podstawowe

| Pole                | Wartość                                |
| ------------------- | -------------------------------------- |
| **ID**              | BUG-002, BUG-003, BUG-004              |
| **Data zgłoszenia** | 12 grudnia 2025                        |
| **Data naprawy**    | 12 grudnia 2025                        |
| **Priorytet**       | 🔴 High (BUG-004), 🟡 Medium (002/003) |
| **Status**          | ✅ Fixed                               |
| **Komponent**       | Admin Panel > Tour Editor > Media Tab  |
| **Powiązane US**    | US 8.10: Media Manager                 |

---

## BUG-002: Brakuje tłumaczenia `tourEditor.media.images`

### Opis problemu

W zakładce Media w Tour Editor zamiast przetłumaczonego tekstu wyświetla się klucz i18n: `tourEditor.media.images`.

### Root Cause

Brakujący klucz `images` w sekcji `tourEditor.media` we wszystkich plikach locale (pl.ts, en.ts, de.ts, fr.ts, uk.ts).

### Naprawa

Dodano klucz `images` oraz `hint` do wszystkich 5 plików tłumaczeń:

- PL: `images: 'Obrazy'`, `hint: 'Wybierz obrazy z biblioteki mediów lub prześlij nowe.'`
- EN: `images: 'Images'`, `hint: 'Select images from the media library or upload new ones.'`
- DE: `images: 'Bilder'`, `hint: 'Wählen Sie Bilder aus der Medienbibliothek oder laden Sie neue hoch.'`
- FR: `images: 'Images'`, `hint: 'Sélectionnez des images de la médiathèque ou téléchargez-en de nouvelles.'`
- UK: `images: 'Зображення'`, `hint: 'Виберіть зображення з медіатеки або завантажте нові.'`

---

## BUG-003: Nie można dodawać istniejących obrazów

### Opis problemu

Użytkownik nie może wybrać/dodać obrazów z biblioteki mediów w zakładce Media w Tour Editor.

### Root Cause

Przyciski w komponencie `MediaPicker.tsx` nie miały atrybutu `type="button"`. Ponieważ MediaPicker jest zagnieżdżony w formularzu (`<form>`) w TourEditorPage, przyciski domyślnie działały jako `type="submit"`, co powodowało submit formularza zamiast oczekiwanej akcji.

### Naprawa

Dodano `type="button"` do wszystkich 3 przycisków w MediaPicker.tsx:

- Przycisk "Upload" (linia ~102)
- Przycisk "Clear" (linia ~115)
- Przycisk "uploadFirst" (linia ~136)

---

## BUG-004: Kliknięcie 'Prześlij swój pierwszy obraz' wylogowuje z aplikacji

### Opis problemu

Po kliknięciu przycisku "Prześlij swój pierwszy obraz" w empty state MediaPicker, użytkownik jest wylogowywany (przekierowanie do strony logowania).

### Root Cause

**Taka sama przyczyna jak BUG-003** - przycisk bez `type="button"` powodował submit formularza:

1. MediaPicker jest używany wewnątrz `<form>` w TourEditorPage (linia ~821)
2. Przycisk "uploadFirst" nie miał `type="button"`, więc domyślnie był `type="submit"`
3. Kliknięcie powodowało submit formularza bez `event.preventDefault()`
4. Przeglądarka wykonywała domyślną akcję: odświeżenie strony
5. Po odświeżeniu strony, stan autoryzacji (Zustand store) był tracony
6. Użytkownik widział to jako "wylogowanie"

### Naprawa

Dodano `type="button"` do przycisku "uploadFirst" (oraz pozostałych przycisków - patrz BUG-003).

---

## Pliki zmodyfikowane

| Plik                                         | Zmiana                                         |
| -------------------------------------------- | ---------------------------------------------- |
| `admin/src/components/media/MediaPicker.tsx` | Dodano `type="button"` do 3 przycisków         |
| `admin/src/i18n/locales/pl.ts`               | Dodano `images` i `hint` do `tourEditor.media` |
| `admin/src/i18n/locales/en.ts`               | Dodano `images` i `hint` do `tourEditor.media` |
| `admin/src/i18n/locales/de.ts`               | Dodano `images` i `hint` do `tourEditor.media` |
| `admin/src/i18n/locales/fr.ts`               | Dodano `images` i `hint` do `tourEditor.media` |
| `admin/src/i18n/locales/uk.ts`               | Dodano `images` i `hint` do `tourEditor.media` |

---

## Weryfikacja

### Testy jednostkowe

```
✅ 154/154 passed
```

### Testy E2E

```
✅ 44/44 passed
- MediaDetailsModal.cy.tsx: 6 tests
- MediaPage.cy.tsx: 16 tests
- MediaPicker.cy.tsx: 3 tests
- MediaUpload.cy.tsx: 19 tests
```

---

## Lekcje na przyszłość

1. **Zawsze dodawaj `type="button"` do przycisków w formularzach**, jeśli nie mają być przyciskami submit
2. **Sprawdzaj kompletność kluczy i18n** przy dodawaniu nowych funkcji
3. **Testuj komponenty zagnieżdżone w formularzach** pod kątem nieoczekiwanego submit behavior
