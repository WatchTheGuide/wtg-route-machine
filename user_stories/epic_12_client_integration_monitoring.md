# Epic 12: Client Integration & Monitoring

## Przegląd

**Cel:** Integracja klienta z zabezpieczonym API i monitorowanie stanu usług.

## User Stories

---

## US 12.1: Frontend API Key Integration

**Jako** Mobile Developer  
**Chcę** zaktualizować aplikację, aby wysyłała klucz API  
**Aby** móc łączyć się z zabezpieczonym serwerem produkcyjnym.

### Kryteria akceptacji:

- [ ] Kod klienta dodaje nagłówek `X-API-Key` do każdego zapytania fetch/XHR.
- [ ] Klucz API jest przechowywany w konfiguracji (environment variables), nie hardcodowany w środku funkcji.
- [ ] Obsługa błędu 401 (np. wylogowanie użytkownika lub komunikat o błędzie konfiguracji).

### Estymacja: 0.5 dnia

---

## US 12.2: Basic Monitoring

**Jako** Administrator  
**Chcę** wiedzieć, czy usługi działają poprawnie  
**Aby** móc szybko zareagować na awarię.

### Kryteria akceptacji:

- [ ] Skonfigurowany Uptime Robot (lub podobne) sprawdzający endpoint `/health` lub testową trasę.
- [ ] Dostęp do logów Nginx (access.log, error.log) w celu analizy ruchu.

### Estymacja: 0.5 dnia

---

## Podsumowanie Epic 12

| US    | Nazwa                        | Status     | Estymacja   |
| ----- | ---------------------------- | ---------- | ----------- |
| 12.1  | Frontend API Key Integration | 📋 Planned | 0.5 dnia    |
| 12.2  | Basic Monitoring             | 📋 Planned | 0.5 dnia    |
| **Σ** |                              |            | **1 dzień** |
