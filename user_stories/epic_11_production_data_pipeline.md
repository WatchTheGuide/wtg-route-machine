# Epic 11: Production Data Pipeline

## Przegląd

**Cel:** Automatyzacja procesu przygotowania danych mapowych dla środowiska produkcyjnego.

## User Stories

---

## US 11.1: Multi-Profile Data Processing

**Jako** Backend Developer  
**Chcę** mieć skrypt do generowania grafów OSRM dla wszystkich profili jednocześnie  
**Aby** skrócić czas wdrażania nowego miasta.

### Kryteria akceptacji:

- [ ] Skrypt `prepare-production.sh` przyjmujący nazwę miasta.
- [ ] Sekwencyjne lub równoległe (zależnie od RAM) przetwarzanie profili foot, bicycle, car.
- [ ] Weryfikacja poprawności wygenerowanych plików przed restartem usług.

### Estymacja: 1 dzień

---

## US 11.2: Zero-Downtime Data Updates (Opcjonalne)

**Jako** Użytkownik  
**Chcę**, aby aktualizacja map nie przerywała działania usługi  
**Aby** móc korzystać z nawigacji bez przerw.

### Kryteria akceptacji:

- [ ] Strategia Blue-Green deployment dla kontenerów OSRM lub przeładowanie danych.
- [ ] (MVP: Krótka przerwa techniczna w nocy jest akceptowalna).

### Estymacja: 1 dzień (opcjonalne)

---

## Podsumowanie Epic 11

| US    | Nazwa                         | Status      | Estymacja   |
| ----- | ----------------------------- | ----------- | ----------- |
| 11.1  | Multi-Profile Data Processing | 📋 Planned  | 1 dzień     |
| 11.2  | Zero-Downtime Data Updates    | 📋 Optional | 1 dzień     |
| **Σ** |                               |             | **1-2 dni** |
