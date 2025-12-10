# Epic 13: API Rate Limiting & Throttling

**Cel:** Implementacja zaawansowanych mechanizmów throttlingu dla wrażliwych endpointów API Server w celu ochrony przed nadużyciami i przeciążeniem.

**Priorytet:** 🔴 Wysoki

**Zależności:**

- Epic 5.1 (Backend API dla Wycieczek) ✅
- Epic 9-12 (Backend Deployment & Security) 📋

**Estymacja:** ~12.5h (1.5 dnia roboczego)

---

## Architektura

### Komponenty

- **Express Rate Limit Middleware** - `express-rate-limit` library
- **Config** - zmienne środowiskowe w `config.ts`
- **Middleware** - `rate-limit.middleware.ts`

### Poziomy Rate Limitingu

| Endpoint                    | Window | Max Requests | Limiter Type  |
| --------------------------- | ------ | ------------ | ------------- |
| `/api/*` (general)          | 15 min | 100/IP       | IP-based      |
| `/api/admin/auth/login`     | 15 min | 5/IP         | IP-based      |
| `/api/admin/tours/*` (CRUD) | 1 min  | 30/user      | User ID-based |

---

## US 13.1: Express Rate Limiting Middleware

**Jako** Backend Developer  
**Chcę** zaimplementować middleware do rate limitingu na poziomie Express  
**Aby** chronić API przed nadmiernym ruchem i atakami brute-force

### Kryteria akceptacji

- [ ] Zainstalowana biblioteka `express-rate-limit`.
- [ ] Utworzony plik `backend/api-server/src/middleware/rate-limit.middleware.ts`.
- [ ] Zaimplementowany ogólny rate limiter dla wszystkich endpointów:
  - **Window**: 15 minut (900 000 ms)
  - **Max requests**: 100 zapytań na IP
  - **Status code**: 429 Too Many Requests
  - **Message**: "Too many requests, please try again later."
- [ ] Rate limiter używa konfiguracji z `config.ts` (`rateLimitWindowMs`, `rateLimitMaxRequests`).
- [ ] Middleware eksportowany z `middleware/index.ts`.

### Implementacja

```typescript
// backend/api-server/src/middleware/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';

/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  message: 'Too many requests, please try again later.',
});
```

### Użycie w `app.ts`

```typescript
import { apiRateLimiter } from './middleware/rate-limit.middleware.js';

// Apply general rate limiting to all API routes
app.use('/api', apiRateLimiter);
```

---

## US 13.2: Stricter Throttling dla Auth Endpoints

**Jako** Security Engineer  
**Chcę** zastosować znacznie ostrzejsze limity dla endpointów uwierzytelniania  
**Aby** zapobiec atakom brute-force na hasła i chronić konta użytkowników

### Kryteria akceptacji

- [ ] Utworzony dedykowany rate limiter dla endpointów `/api/admin/auth/*`.
- [ ] Parametry auth rate limitera:
  - **Window**: 15 minut (900 000 ms)
  - **Max requests**: 5 prób logowania na IP
  - **Status code**: 429 Too Many Requests
  - **Message**: "Too many login attempts, please try again in 15 minutes."
- [ ] Rate limiter używa konfiguracji z `config.ts` (`authRateLimitWindowMs`, `authRateLimitMaxRequests`).
- [ ] Middleware zastosowany tylko do endpointu `/api/admin/auth/login`.

### Implementacja

```typescript
// backend/api-server/src/middleware/rate-limit.middleware.ts
export const authRateLimiter = rateLimit({
  windowMs: config.authRateLimitWindowMs,
  max: config.authRateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts, please try again in 15 minutes.',
  skipSuccessfulRequests: false, // Count all attempts (even successful)
});
```

### Użycie w `routes/admin.auth.routes.ts`

```typescript
import { authRateLimiter } from '../middleware/rate-limit.middleware.js';

// Apply stricter rate limiting to login endpoint
router.post('/login', authRateLimiter, async (req, res) => {
  // ... login logic
});
```

---

## US 13.3: Throttling dla Admin CRUD Operations

**Jako** System Administrator  
**Chcę** ograniczyć częstotliwość operacji CRUD w panelu admina  
**Aby** zapobiec przypadkowemu lub celowemu spamowaniu operacji tworzenia/usuwania/edycji

### Kryteria akceptacji

- [ ] Utworzony dedykowany rate limiter dla operacji admin CRUD.
- [ ] Parametry admin CRUD rate limitera:
  - **Window**: 1 minuta (60 000 ms)
  - **Max requests**: 30 operacji na użytkownika (po JWT token)
  - **Status code**: 429 Too Many Requests
  - **Message**: "Too many operations, please slow down."
- [ ] Rate limiter identyfikuje użytkownika po `req.user.id` (z JWT), nie po IP.
- [ ] Middleware zastosowany do wszystkich endpointów POST/PUT/DELETE w:
  - `/api/admin/tours/*` (create, update, delete, duplicate, publish, archive, bulk-delete)
  - `/api/admin/poi/*` (jeśli istnieje)

### Implementacja

```typescript
// backend/api-server/src/middleware/rate-limit.middleware.ts
export const adminCrudRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many operations, please slow down.',
  // Use user ID from JWT instead of IP
  keyGenerator: (req) => {
    return req.user?.id || req.ip; // Fallback to IP if no user
  },
  skip: (req) => req.method === 'GET', // Don't rate limit GET requests
});
```

### Użycie w `routes/admin.tours.routes.ts`

```typescript
import { adminCrudRateLimiter } from '../middleware/rate-limit.middleware.js';

// Apply CRUD rate limiting to all admin routes
router.use(adminCrudRateLimiter);

// ... existing routes (POST, PUT, DELETE)
```

---

## US 13.4: Configurable Rate Limits via Environment

**Jako** DevOps Engineer  
**Chcę** móc konfigurować limity rate limitingu przez zmienne środowiskowe  
**Aby** dostosować limity do warunków produkcyjnych bez zmiany kodu

### Kryteria akceptacji

- [ ] Wszystkie parametry rate limitingu wczytywane z `config.ts`.
- [ ] Dodane zmienne środowiskowe do `.env.example`:

  ```env
  # General API Rate Limiting
  RATE_LIMIT_WINDOW_MS=900000        # 15 minutes
  RATE_LIMIT_MAX_REQUESTS=100        # requests per window

  # Auth Rate Limiting (stricter)
  AUTH_RATE_LIMIT_WINDOW_MS=900000   # 15 minutes
  AUTH_RATE_LIMIT_MAX_REQUESTS=5     # login attempts per window

  # Admin CRUD Rate Limiting
  ADMIN_CRUD_RATE_LIMIT_WINDOW_MS=60000  # 1 minute
  ADMIN_CRUD_RATE_LIMIT_MAX_REQUESTS=30  # operations per window
  ```

- [ ] Dodane zmienne do `config.ts`:
  ```typescript
  export const config = {
    // ... existing config

    // Admin CRUD rate limiting
    adminCrudRateLimitWindowMs: parseInt(
      process.env.ADMIN_CRUD_RATE_LIMIT_WINDOW_MS || '60000',
      10
    ), // 1 minute
    adminCrudRateLimitMaxRequests: parseInt(
      process.env.ADMIN_CRUD_RATE_LIMIT_MAX_REQUESTS || '30',
      10
    ),
  } as const;
  ```
- [ ] Dokumentacja w `backend/api-server/README.md` opisująca zmienne środowiskowe.

---

## US 13.5: Rate Limit Response Headers

**Jako** Frontend Developer  
**Chcę** otrzymywać informacje o limitach w nagłówkach HTTP  
**Aby** móc wyświetlić użytkownikowi informacje o pozostałych próbach i czasie do resetu

### Kryteria akceptacji

- [ ] Wszystkie rate limitery zwracają standardowe nagłówki `RateLimit-*`:
  - `RateLimit-Limit`: maksymalna liczba zapytań
  - `RateLimit-Remaining`: pozostałe zapytania w oknie
  - `RateLimit-Reset`: timestamp UTC, kiedy okno się resetuje
- [ ] Włączone `standardHeaders: true` we wszystkich rate limiterach.
- [ ] Wyłączone legacy nagłówki `X-RateLimit-*` (`legacyHeaders: false`).

### Przykładowa odpowiedź 429

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
RateLimit-Limit: 5
RateLimit-Remaining: 0
RateLimit-Reset: 1702124400

{
  "error": "Too many login attempts, please try again in 15 minutes."
}
```

---

## US 13.6: Unit Tests dla Rate Limiting Middleware ✅

**Jako** QA Engineer  
**Chcę** mieć testy jednostkowe dla wszystkich rate limiterów  
**Aby** zapewnić poprawne działanie mechanizmów throttlingu

### Kryteria akceptacji

- [x] Utworzony plik `backend/api-server/src/middleware/rate-limit.middleware.test.ts`.
- [x] Testy sprawdzają:
  - ✅ Ogólny rate limiter pozwala na 100 zapytań w 15 minut
  - ✅ 101. zapytanie zwraca 429
  - ✅ Auth rate limiter pozwala na 5 prób logowania
  - ✅ 6. próba logowania zwraca 429
  - ✅ Admin CRUD rate limiter pozwala na 30 operacji w 1 minutę
  - ✅ Rate limitery zwracają poprawne nagłówki `RateLimit-*`
  - ✅ Reset okna po upływie czasu
- [x] Wszystkie testy przechodzą: `npm run test` (26/26 tests passing)

### Przykładowy test

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('Rate Limiting Middleware', () => {
  describe('Auth Rate Limiter', () => {
    it('should allow 5 login attempts', async () => {
      for (let i = 0; i < 5; i++) {
        const res = await request(app)
          .post('/api/admin/auth/login')
          .send({ email: 'test@test.com', password: 'wrong' });

        expect(res.status).not.toBe(429);
      }
    });

    it('should block 6th login attempt with 429', async () => {
      // Make 5 attempts
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/admin/auth/login')
          .send({ email: 'test@test.com', password: 'wrong' });
      }

      // 6th attempt should fail
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' });

      expect(res.status).toBe(429);
      expect(res.body.error).toContain('Too many login attempts');
    });

    it('should return RateLimit headers', async () => {
      const res = await request(app)
        .post('/api/admin/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' });

      expect(res.headers).toHaveProperty('ratelimit-limit');
      expect(res.headers).toHaveProperty('ratelimit-remaining');
      expect(res.headers).toHaveProperty('ratelimit-reset');
    });
  });
});
```

---

## US 13.7: Documentation & Monitoring

**Jako** Team Lead  
**Chcę** mieć dokumentację i monitoring rate limitingu  
**Aby** zespół rozumiał mechanizmy ochrony i mógł diagnozować problemy

### Kryteria akceptacji

- [ ] Zaktualizowany `backend/api-server/README.md` z sekcją "Rate Limiting":
  - Wyjaśnienie celów rate limitingu
  - Lista endpointów z przypisanymi limiterami
  - Przykłady konfiguracji przez zmienne środowiskowe
  - Jak obsługiwać 429 w kliencie
- [ ] Dodane logowanie zdarzeń 429 w middleware (z user ID, endpoint, timestamp).
- [ ] (Opcjonalnie) Integracja z Sentry/Datadog do alertowania o częstych przekroczeniach limitów.

### Przykład dokumentacji

```markdown
## Rate Limiting

API implementuje rate limiting na trzech poziomach:

| Endpoint                    | Window | Max Requests | Limiter Type  |
| --------------------------- | ------ | ------------ | ------------- |
| `/api/*` (general)          | 15 min | 100/IP       | IP-based      |
| `/api/admin/auth/login`     | 15 min | 5/IP         | IP-based      |
| `/api/admin/tours/*` (CRUD) | 1 min  | 30/user      | User ID-based |

### Client Handling

Gdy otrzymasz odpowiedź 429, sprawdź nagłówki:

\`\`\`javascript
if (response.status === 429) {
const resetTime = response.headers.get('RateLimit-Reset');
const resetDate = new Date(resetTime \* 1000);
console.log(\`Rate limited until \${resetDate.toISOString()}\`);
}
\`\`\`
```

---

## US 13.8: Production Deployment & Testing

**Jako** DevOps Engineer  
**Chcę** wdrożyć rate limiting na produkcji i zweryfikować jego działanie  
**Aby** zapewnić, że mechanizmy ochrony działają w rzeczywistym środowisku

### Kryteria akceptacji

- [ ] Rate limiting middleware zainstalowany i aktywny na serwerze produkcyjnym.
- [ ] Zmienne środowiskowe skonfigurowane odpowiednio do obciążenia produkcyjnego.
- [ ] Wykonane testy obciążeniowe (load testing) z narzędziem jak `k6` lub `ab`:
  - ✅ Ogólny rate limiter blokuje po 100 zapytaniach
  - ✅ Auth rate limiter blokuje po 5 próbach logowania
  - ✅ Admin CRUD rate limiter blokuje po 30 operacjach
- [ ] Monitoring potwierdza, że 429 są zwracane poprawnie.
- [ ] Aplikacja mobilna/webowa obsługuje odpowiedzi 429 gracefully (toast z komunikatem).

### Przykładowy test k6

```javascript
// load-test-auth.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,
  iterations: 10,
};

export default function () {
  const res = http.post('https://api.yourapp.com/api/admin/auth/login', {
    email: 'test@test.com',
    password: 'wrongpassword',
  });

  if (__ITER >= 5) {
    check(res, {
      'is rate limited after 5 attempts': (r) => r.status === 429,
    });
  } else {
    check(res, {
      'not rate limited before 5 attempts': (r) => r.status !== 429,
    });
  }
}
```

### Uruchomienie testu

```bash
k6 run load-test-auth.js
```

---

## Podsumowanie Implementacji

### Struktura plików

```
backend/api-server/src/
├── middleware/
│   ├── auth.middleware.ts                    # (existing) JWT verification
│   ├── rate-limit.middleware.ts              # ✨ NEW: Rate limiting
│   └── index.ts                              # (updated) Export rate limiters
├── routes/
│   ├── admin.auth.routes.ts                  # (updated) Apply authRateLimiter
│   ├── admin.tours.routes.ts                 # (updated) Apply adminCrudRateLimiter
│   └── ...
├── config.ts                                 # (updated) Add rate limit config
└── app.ts                                    # (updated) Apply apiRateLimiter
```

### Priorytet implementacji

1. **US 13.1** - Podstawowy rate limiter (ogólny) → 2h
2. **US 13.2** - Auth throttling (najwyższy priorytet security) → 1h
3. **US 13.3** - Admin CRUD throttling → 2h
4. **US 13.4** - Environment config → 1h
5. **US 13.5** - Response headers (już wbudowane) → 0.5h
6. **US 13.6** - Unit tests → 3h
7. **US 13.7** - Documentation → 1h
8. **US 13.8** - Production deployment & testing → 2h

**Łączny czas:** ~12.5h (1.5 dnia roboczego)

---

## Definition of Done

- [ ] Wszystkie 3 rate limitery zaimplementowane i działające
- [ ] Konfiguracja przez zmienne środowiskowe
- [ ] Testy jednostkowe przechodzą
- [ ] Dokumentacja zaktualizowana
- [ ] Testy obciążeniowe przeprowadzone na produkcji
- [ ] Frontend obsługuje odpowiedzi 429
- [ ] Code review completed
- [ ] Merged to main branch
