# Epic 10: Secure API Gateway

## Przegląd

**Cel:** Zabezpieczenie dostępu do API OSRM przed nieautoryzowanym użyciem i atakami.

## User Stories

---

## US 10.1: Nginx Reverse Proxy Configuration

**Jako** Backend Developer  
**Chcę** skonfigurować Nginx jako punkt wejścia do systemu  
**Aby** ukryć bezpośredni dostęp do kontenerów OSRM i zarządzać ruchem.

### Kryteria akceptacji:

- [ ] Nginx nasłuchuje na portach 80 i 443.
- [ ] Ruch HTTP (80) jest automatycznie przekierowywany na HTTPS (443).
- [ ] Skonfigurowany routing: `/route/v1/foot` -> kontener `osrm-foot`, itd.
- [ ] Nagłówki bezpieczeństwa (HSTS, X-Frame-Options) są ustawione.

### Estymacja: 0.5 dnia

---

## US 10.2: API Key Authentication

**Jako** Product Owner  
**Chcę**, aby dostęp do API był możliwy tylko z ważnym kluczem API  
**Aby** kontrolować kto korzysta z usługi i zapobiegać nadużyciom.

### Kryteria akceptacji:

- [ ] Nginx weryfikuje obecność i poprawność nagłówka `X-API-Key`.
- [ ] Zapytania bez klucza lub z błędnym kluczem otrzymują kod 401 Unauthorized.
- [ ] Zdefiniowana lista ważnych kluczy (np. dla aplikacji mobilnej, dla dev).
- [ ] Możliwość łatwego dodawania/usuwania kluczy w konfiguracji.

### Estymacja: 0.5 dnia

---

## US 10.3: SSL/TLS Encryption

**Jako** Użytkownik  
**Chcę**, aby moje połączenie z serwerem było szyfrowane  
**Aby** zapewnić prywatność i bezpieczeństwo przesyłanych danych.

### Kryteria akceptacji:

- [ ] Wygenerowany darmowy certyfikat Let's Encrypt dla domeny API.
- [ ] Automatyczne odnawianie certyfikatu (cronjob/certbot).
- [ ] Konfiguracja Nginx używa silnych protokołów TLS (1.2/1.3).

### Estymacja: 0.5 dnia

---

## US 10.4: Rate Limiting

**Jako** Administrator  
**Chcę** ograniczyć liczbę zapytań z jednego adresu IP/Klucza  
**Aby** zabezpieczyć serwer przed atakami DDoS i przeciążeniem.

### Kryteria akceptacji:

- [ ] Skonfigurowany limit zapytań na sekundę (np. 10 req/s na IP).
- [ ] Przekroczenie limitu zwraca kod 429 Too Many Requests.

### Estymacja: 0.5 dnia

### Uwaga:

Rate limiting na poziomie aplikacji jest szczegółowo opisany w [Epic 13: API Rate Limiting](./epic_13_api_rate_limiting.md).

---

## Podsumowanie Epic 10

| US    | Nazwa                      | Status     | Estymacja |
| ----- | -------------------------- | ---------- | --------- |
| 10.1  | Nginx Reverse Proxy Config | 📋 Planned | 0.5 dnia  |
| 10.2  | API Key Authentication     | 📋 Planned | 0.5 dnia  |
| 10.3  | SSL/TLS Encryption         | 📋 Planned | 0.5 dnia  |
| 10.4  | Rate Limiting              | 📋 Planned | 0.5 dnia  |
| **Σ** |                            |            | **2 dni** |
