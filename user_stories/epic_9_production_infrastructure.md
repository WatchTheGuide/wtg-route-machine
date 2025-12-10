# Epic 9: Production Infrastructure Setup

## Przegląd

**Cel:** Przygotowanie środowiska serwerowego do stabilnego i bezpiecznego działania usług OSRM.

## User Stories

---

## US 9.1: Server Provisioning & Hardening

**Jako** DevOps Engineer  
**Chcę** skonfigurować serwer VPS/AWS z podstawowymi zabezpieczeniami  
**Aby** zapewnić bezpieczną bazę dla aplikacji.

### Kryteria akceptacji:

- [ ] System operacyjny (Ubuntu/Debian) zaktualizowany.
- [ ] Utworzony użytkownik bez uprawnień root do uruchamiania usług.
- [ ] Skonfigurowany firewall (UFW/Security Groups): otwarte tylko porty 22, 80, 443.
- [ ] Porty OSRM (5001-5003) zablokowane dla ruchu z zewnątrz.
- [ ] Skonfigurowany dostęp SSH tylko przez klucze (wyłączone logowanie hasłem).

### Estymacja: 0.5 dnia

---

## US 9.2: Container Orchestration Setup

**Jako** DevOps Engineer  
**Chcę** zainstalować i skonfigurować Docker oraz Docker Compose  
**Aby** móc łatwo zarządzać cyklem życia aplikacji.

### Kryteria akceptacji:

- [ ] Zainstalowany Docker Engine i Docker Compose plugin.
- [ ] Skonfigurowany log rotation dla kontenerów (aby nie zapchać dysku).
- [ ] Utworzona sieć dockerowa dla komunikacji między kontenerami.

### Estymacja: 0.5 dnia

---

## Podsumowanie Epic 9

| US    | Nazwa                           | Status     | Estymacja   |
| ----- | ------------------------------- | ---------- | ----------- |
| 9.1   | Server Provisioning & Hardening | 📋 Planned | 0.5 dnia    |
| 9.2   | Container Orchestration Setup   | 📋 Planned | 0.5 dnia    |
| **Σ** |                                 |            | **1 dzień** |
