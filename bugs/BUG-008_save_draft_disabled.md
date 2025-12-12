# BUG-008: Przycisk "Zapisz szkic" nie działa

## Informacje podstawowe

| Pole                | Wartość                   |
| ------------------- | ------------------------- |
| **ID**              | BUG-008                   |
| **Data zgłoszenia** | 12 grudnia 2025           |
| **Priorytet**       | 🔴 High                   |
| **Status**          | 🟢 Fixed                  |
| **Data naprawy**    | 12 grudnia 2025           |
| **Komponent**       | Admin Panel > Tour Editor |
| **Powiązane US**    | US 8.3: Tour Editor       |

## Opis problemu

Przycisk "Zapisz szkic" w Tour Editor jest widoczny, ale nie reaguje na kliknięcie. Użytkownik nie może zapisać szkicu wycieczki.

## Kroki do reprodukcji

1. Zaloguj się do panelu administracyjnego
2. Przejdź do Wycieczki > Utwórz nową
3. Formularz jest pusty (domyślne wartości)
4. Kliknij przycisk "Zapisz szkic"
5. **Oczekiwane:** Wycieczka zostaje zapisana jako szkic
6. **Aktualne:** Przycisk nie reaguje na kliknięcie (jest disabled)

## Analiza techniczna

### Root Cause

Przycisk "Zapisz szkic" ma warunek `disabled={!form.formState.isValid || isSaving}`.

Ponieważ formularz używa restrykcyjnego schematu walidacji Zod, a defaultValues są puste:

```typescript
// Schema wymaga:
name: min 5 znaków (PL i EN)
description: min 50 znaków (PL i EN)
cityId: niepusty string
category: niepusty string

// defaultValues:
name: { pl: '', en: '', ... }      // ❌ Puste = invalid
description: { pl: '', en: '', ... } // ❌ Puste = invalid
cityId: ''                          // ❌ Puste = invalid
category: ''                        // ❌ Puste = invalid
```

**Wynik:** `form.formState.isValid === false` → przycisk jest **zawsze disabled** dla nowej wycieczki.

### Lokalizacja kodu

- **Plik:** `admin/src/pages/TourEditorPage.tsx`
- **Linie:** 560-571 (przycisk Zapisz szkic)
- **Linie:** 97-117 (schema walidacji)
- **Linie:** 221-230 (defaultValues)

### Aktualny kod problemu

```tsx
// Linie 560-571
<Button
  variant="outline"
  onClick={() => form.handleSubmit((v) => onSubmit(v, false))()}
  disabled={!form.formState.isValid || isSaving}>
  {' '}
  // ← PROBLEM
  <Save className="h-4 w-4 mr-2" />
  {t('tourEditor.saveDraft')}
</Button>
```

### Logika biznesowa

| Akcja        | Oczekiwanie użytkownika    | Czy wymaga walidacji? |
| ------------ | -------------------------- | --------------------- |
| Zapisz szkic | Zapisz postęp pracy        | ❌ NIE                |
| Publikuj     | Opublikuj gotową wycieczkę | ✅ TAK                |

**Wniosek:** Szkic NIE powinien wymagać pełnej walidacji. Walidacja powinna być wymagana tylko przy publikacji.

## Proponowane rozwiązanie

**Zmienić logikę przycisku "Zapisz szkic":**

```tsx
// PRZED:
<Button
  variant="outline"
  onClick={() => form.handleSubmit((v) => onSubmit(v, false))()}
  disabled={!form.formState.isValid || isSaving}>  // ❌ Wymaga walidacji

// PO:
<Button
  variant="outline"
  onClick={async () => {
    const values = form.getValues();  // Pobierz wartości BEZ walidacji
    await onSubmit(values, false);    // Zapisz jako szkic
  }}
  disabled={isSaving}>  // ✅ Tylko sprawdzaj czy trwa zapis
```

**Zachować walidację dla przycisku "Publikuj":**

```tsx
<Button
  onClick={() => form.handleSubmit((v) => onSubmit(v, true))()}
  disabled={!form.formState.isValid || isSaving}>  // ✅ Wymaga walidacji przy publikacji
```

## Powiązane pliki

- [TourEditorPage.tsx](../admin/src/pages/TourEditorPage.tsx)

## Historia zmian

| Data       | Zmiana                                                          |
| ---------- | --------------------------------------------------------------- |
| 12.12.2025 | Utworzono bug report                                            |
| 12.12.2025 | ✅ Naprawiono - zmieniono logikę przycisku w liniach 590-603    |
