# Backend Deployment & Security User Stories

Ten dokument definiuje wymagania i zadania związane z wdrożeniem produkcyjnym backendu OSRM oraz jego zabezpieczeniem.

## Epic 9: Production Infrastructure Setup

**Cel:** Przygotowanie środowiska serwerowego do stabilnego i bezpiecznego działania usług OSRM.

### US 9.1: Server Provisioning & Hardening

**Jako** DevOps Engineer
**Chcę** skonfigurować serwer VPS/AWS z podstawowymi zabezpieczeniami
**Aby** zapewnić bezpieczną bazę dla aplikacji.

**Kryteria akceptacji:**

- [ ] System operacyjny (Ubuntu/Debian) zaktualizowany.
- [ ] Utworzony użytkownik bez uprawnień root do uruchamiania usług.
- [ ] Skonfigurowany firewall (UFW/Security Groups): otwarte tylko porty 22, 80, 443.
- [ ] Porty OSRM (5001-5003) zablokowane dla ruchu z zewnątrz.
- [ ] Skonfigurowany dostęp SSH tylko przez klucze (wyłączone logowanie hasłem).

### US 9.2: Container Orchestration Setup

**Jako** DevOps Engineer
**Chcę** zainstalować i skonfigurować Docker oraz Docker Compose
**Aby** móc łatwo zarządzać cyklem życia aplikacji.

**Kryteria akceptacji:**

- [ ] Zainstalowany Docker Engine i Docker Compose plugin.
- [ ] Skonfigurowany log rotation dla kontenerów (aby nie zapchać dysku).
- [ ] Utworzona sieć dockerowa dla komunikacji między kontenerami.

## Epic 10: Secure API Gateway

**Cel:** Zabezpieczenie dostępu do API OSRM przed nieautoryzowanym użyciem i atakami.

### US 10.1: Nginx Reverse Proxy Configuration

**Jako** Backend Developer
**Chcę** skonfigurować Nginx jako punkt wejścia do systemu
**Aby** ukryć bezpośredni dostęp do kontenerów OSRM i zarządzać ruchem.

**Kryteria akceptacji:**

- [ ] Nginx nasłuchuje na portach 80 i 443.
- [ ] Ruch HTTP (80) jest automatycznie przekierowywany na HTTPS (443).
- [ ] Skonfigurowany routing: `/route/v1/foot` -> kontener `osrm-foot`, itd.
- [ ] Nagłówki bezpieczeństwa (HSTS, X-Frame-Options) są ustawione.

### US 10.2: API Key Authentication

**Jako** Product Owner
**Chcę**, aby dostęp do API był możliwy tylko z ważnym kluczem API
**Aby** kontrolować kto korzysta z usługi i zapobiegać nadużyciom.

**Kryteria akceptacji:**

- [ ] Nginx weryfikuje obecność i poprawność nagłówka `X-API-Key`.
- [ ] Zapytania bez klucza lub z błędnym kluczem otrzymują kod 401 Unauthorized.
- [ ] Zdefiniowana lista ważnych kluczy (np. dla aplikacji mobilnej, dla dev).
- [ ] Możliwość łatwego dodawania/usuwania kluczy w konfiguracji.

### US 10.3: SSL/TLS Encryption

**Jako** Użytkownik
**Chcę**, aby moje połączenie z serwerem było szyfrowane
**Aby** zapewnić prywatność i bezpieczeństwo przesyłanych danych.

**Kryteria akceptacji:**

- [ ] Wygenerowany darmowy certyfikat Let's Encrypt dla domeny API.
- [ ] Automatyczne odnawianie certyfikatu (cronjob/certbot).
- [ ] Konfiguracja Nginx używa silnych protokołów TLS (1.2/1.3).

### US 10.4: Rate Limiting

**Jako** Administrator
**Chcę** ograniczyć liczbę zapytań z jednego adresu IP/Klucza
**Aby** zabezpieczyć serwer przed atakami DDoS i przeciążeniem.

**Kryteria akceptacji:**

- [ ] Skonfigurowany limit zapytań na sekundę (np. 10 req/s na IP).
- [ ] Przekroczenie limitu zwraca kod 429 Too Many Requests.

## Epic 11: Production Data Pipeline

**Cel:** Automatyzacja procesu przygotowania danych mapowych dla środowiska produkcyjnego.

### US 11.1: Multi-Profile Data Processing

**Jako** Backend Developer
**Chcę** mieć skrypt do generowania grafów OSRM dla wszystkich profili jednocześnie
**Aby** skrócić czas wdrażania nowego miasta.

**Kryteria akceptacji:**

- [ ] Skrypt `prepare-production.sh` przyjmujący nazwę miasta.
- [ ] Sekwencyjne lub równoległe (zależnie od RAM) przetwarzanie profili foot, bicycle, car.
- [ ] Weryfikacja poprawności wygenerowanych plików przed restartem usług.

### US 11.2: Zero-Downtime Data Updates (Opcjonalne)

**Jako** Użytkownik
**Chcę**, aby aktualizacja map nie przerywała działania usługi
**Aby** móc korzystać z nawigacji bez przerw.

**Kryteria akceptacji:**

- [ ] Strategia Blue-Green deployment dla kontenerów OSRM lub przeładowanie danych.
- [ ] (MVP: Krótka przerwa techniczna w nocy jest akceptowalna).

## Epic 12: Client Integration & Monitoring

**Cel:** Integracja klienta z zabezpieczonym API i monitorowanie stanu usług.

### US 12.1: Frontend API Key Integration

**Jako** Mobile Developer
**Chcę** zaktualizować aplikację, aby wysyłała klucz API
**Aby** móc łączyć się z zabezpieczonym serwerem produkcyjnym.

**Kryteria akceptacji:**

- [ ] Kod klienta dodaje nagłówek `X-API-Key` do każdego zapytania fetch/XHR.
- [ ] Klucz API jest przechowywany w konfiguracji (environment variables), nie hardcodowany w środku funkcji.
- [ ] Obsługa błędu 401 (np. wylogowanie użytkownika lub komunikat o błędzie konfiguracji).

### US 12.2: Basic Monitoring

**Jako** Administrator
**Chcę** wiedzieć, czy usługi działają poprawnie
**Aby** móc szybko zareagować na awarię.

**Kryteria akceptacji:**

- [ ] Skonfigurowany Uptime Robot (lub podobne) sprawdzający endpoint `/health` lub testową trasę.
- [ ] Dostęp do logów Nginx (access.log, error.log) w celu analizy ruchu.
