# BUG-007: Przycisk usunięcia obrazu z selekcji nie działa

## Informacje podstawowe

| Pole                | Wartość                                         |
| ------------------- | ----------------------------------------------- |
| **ID**              | BUG-007                                         |
| **Data zgłoszenia** | 12 grudnia 2025                                 |
| **Priorytet**       | 🟡 Medium                                       |
| **Status**          | 🔵 Open                                         |
| **Komponent**       | Admin Panel > Tour Editor > Media > MediaPicker |
| **Powiązane US**    | US 8.10: Media Manager                          |

## Opis problemu

W MediaPicker (zakładka Media w Tour Editor) przycisk X do usunięcia obrazu z selekcji jest widoczny, ale nie reaguje na kliknięcie. Obraz pozostaje zaznaczony mimo próby usunięcia.

## Kroki do reprodukcji

1. Zaloguj się do panelu administracyjnego
2. Przejdź do Wycieczki > Utwórz nową
3. Przejdź do zakładki "Media"
4. Kliknij na obraz aby go zaznaczyć (pojawi się checkmark i przycisk X)
5. Kliknij przycisk X w prawym górnym rogu zaznaczonego obrazu
6. **Oczekiwane:** Obraz zostaje odznaczony
7. **Aktualne:** Nic się nie dzieje lub obraz zostaje ponownie zaznaczony/odznaczony przez Card onClick

## Analiza techniczna

### Root Cause

Przycisk X jest renderowany **wewnątrz** komponentu `<Card>` który ma własny `onClick={onSelect}`. Mimo użycia `e.stopPropagation()` i `e.preventDefault()`, event bubbling w React może powodować że:

1. Kliknięcie przycisku X wywołuje `handleRemoveClick` (usuwa obraz)
2. Event bubble'uje do `<Card>` i wywołuje `onSelect` (przełącza zaznaczenie)
3. Efekt netto: obraz zostaje odznaczony i natychmiast ponownie zaznaczony = brak widocznej zmiany

### Lokalizacja kodu

- **Plik:** `admin/src/components/media/MediaPicker.tsx`
- **Komponent:** `MediaPickerCard`
- **Linie:** 198-251

### Aktualny kod problemu

```tsx
<Card onClick={onSelect}>
  {' '}
  // ← onClick na Card
  <div className="aspect-square bg-muted relative">
    {selected && (
      <>
        <div className="pointer-events-none">
          {' '}
          // ← overlay
          <Check />
        </div>
        <button onClick={handleRemoveClick}>
          {' '}
          // ← przycisk X wewnątrz Card
          <X />
        </button>
      </>
    )}
  </div>
</Card>
```

## Proponowane rozwiązanie

**Przenieść przycisk X POZA strukturę `<Card>`:**

```tsx
function MediaPickerCard({ media, selected, onSelect, onRemove }) {
  return (
    <div className="relative">
      <Card onClick={onSelect}>
        {/* zawartość karty BEZ przycisku X */}
        {selected && (
          <div className="pointer-events-none">
            <Check />
          </div>
        )}
      </Card>

      {/* Przycisk X POZA Card - nie może być przechwycony */}
      {selected && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove?.();
          }}
          className="absolute top-1 right-1 z-20 ...">
          <X />
        </button>
      )}
    </div>
  );
}
```

## Powiązane pliki

- [MediaPicker.tsx](../admin/src/components/media/MediaPicker.tsx)
- [TourEditorPage.tsx](../admin/src/pages/TourEditorPage.tsx)

## Historia zmian

| Data       | Zmiana                                                  |
| ---------- | ------------------------------------------------------- |
| 12.12.2025 | Utworzono bug report                                    |
| 12.12.2025 | Pierwsza próba naprawy (pointer-events-none) - nieudana |
| 12.12.2025 | Druga próba (e.preventDefault + z-10) - nieudana        |
