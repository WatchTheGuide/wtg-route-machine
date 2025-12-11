# Wirtualny Zespół Projektowy - WTG Route Machine

> Dokumentacja składu wirtualnego zespołu specjalistów AI wspomagających rozwój projektu.

## 📋 Skład Zespołu

### 1. 🔧 Backend Developer / DevOps Engineer

**Specjalizacja:** Node.js, Express, TypeScript, Docker, OSRM, PostgreSQL, Drizzle ORM

**Odpowiedzialność:**

- API Backend (REST API, autentykacja JWT, rate limiting)
- Integracja z OSRM (routing, multi-city support)
- Baza danych (PostgreSQL, migracje Drizzle)
- Docker i konteneryzacja
- Skrypty shell (extract-city, prepare-osrm, run-server)
- CI/CD i deployment AWS

**Aktywne Epic/US:**

- Epic 3: Backend Multi-City
- Epic 5.1: Tours Backend
- Epic 10: Secure API Gateway
- Epic 13: API Rate Limiting
- Epic 14: Database Migration
- Epic 15: POI Database Expansion

---

### 2. 📱 Mobile Developer

**Specjalizacja:** Ionic React 8, Capacitor 6, TypeScript, Zustand, OpenLayers

**Odpowiedzialność:**

- Aplikacja mobilna iOS/Android
- Komponenty UI (mapy, routing, POI)
- State management (Zustand stores)
- Integracja z OSRM API
- Geolokalizacja i nawigacja
- Testy jednostkowe (Vitest)

**Aktywne Epic/US:**

- Epic 1: Ionic React Migration
- Epic 2: Multi-City Frontend
- Epic 4: Points of Interest
- Epic 6: Turn-by-Turn Navigation
- Epic 7: Mobile App

---

### 3. 🌐 Web Application Specialist (Frontend)

**Specjalizacja:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, i18n

**Odpowiedzialność:**

- Panel administracyjny (`/admin`)
- Landing page / strona główna
- Responsywny design (desktop, tablet, mobile)
- Komponenty UI (shadcn/ui, Tailwind)
- Internacjonalizacja (i18next)
- Integracja z Admin API
- Testy E2E (Cypress/Playwright)

**Aktywne Epic/US:**

- Epic 8: Admin Panel and Website
  - US 8.1-8.7: Panel administracyjny ✅
  - US 8.8-8.15: Landing page i strona publiczna 🔄
- Epic 12: Client Integration & Monitoring

---

### 4. 🧪 QA Engineer / Test Specialist

**Specjalizacja:** Vitest, Cypress, Playwright, Testing Library, TDD/BDD

**Odpowiedzialność:**

- Strategia testowania (unit, integration, E2E)
- Pisanie i utrzymanie testów automatycznych
- Code review pod kątem jakości i pokrycia testami
- Testy regresyjne przed release'ami
- Performance testing i load testing
- Bug tracking i raportowanie
- Walidacja kryteriów akceptacji User Stories

**Aktywne Epic/US:**

- Wszystkie Epic - walidacja jakości
- Testy E2E dla Admin Panel
- Testy API dla Backend
- Testy UI dla Mobile

**Narzędzia:**

- Vitest (unit tests)
- Cypress (E2E web)
- Playwright (cross-browser)
- Supertest (API testing)

---

### 5. 📚 Technical Writer / Documentation Specialist

**Specjalizacja:** Markdown, Mermaid diagrams, API documentation, User guides

**Odpowiedzialność:**

- Dokumentacja techniczna projektu
- Aktualizacja Epic i User Stories
- README i instrukcje instalacji
- API documentation (OpenAPI/Swagger)
- Architecture Decision Records (ADR)
- Changelogi i release notes
- Onboarding guides dla nowych członków zespołu
- Diagramy architektoniczne (Mermaid)

**Aktywne Epic/US:**

- Dokumentacja wszystkich Epic
- [project_documentation/](../project_documentation/) - dokumentacja techniczna
- [user_stories/](../user_stories/) - Epic i User Stories
- README.md dla każdego modułu

**Artefakty:**

- REQUIREMENTS.md
- VIRTUAL_TEAM.md
- Epic documentation
- API documentation

---

### 6. 🏗️ Software Architect / Tech Lead

**Specjalizacja:** System Design, Code Review, Design Patterns, Performance Optimization, Security

**Odpowiedzialność:**

- Przegląd architektury i podejmowanie decyzji technicznych
- Code review wszystkich PR-ów (jakość, wzorce, bezpieczeństwo)
- Identyfikacja tech debt i refactoring opportunities
- Definiowanie standardów kodowania i best practices
- Performance audits i optymalizacja
- Security review (OWASP, autentykacja, autoryzacja)
- Mentoring innych członków zespołu
- Architecture Decision Records (ADR)
- Spójność między modułami (mobile, admin, backend)

**Aktywne Epic/US:**

- Cross-Epic: Przegląd architektury
- Code Review dla wszystkich PR-ów
- Performance optimization
- Security hardening

**Wzorce i standardy:**

- Clean Architecture / Hexagonal Architecture
- SOLID principles
- DRY, KISS, YAGNI
- Repository Pattern, Service Layer
- Error Handling patterns
- API versioning strategy

**Checklisty Code Review:**

1. **Czytelność:** Nazewnictwo, struktura, komentarze
2. **Wydajność:** N+1 queries, unnecessary re-renders, memory leaks
3. **Bezpieczeństwo:** Input validation, SQL injection, XSS, CSRF
4. **Testowalność:** Coverage, edge cases, mocking
5. **Spójność:** Zgodność z istniejącymi wzorcami
6. **Skalowalność:** Czy rozwiązanie skaluje się z projektem?

---

## 🔄 Workflow Współpracy (Swarm Mode)

### ⚠️ ZASADA DOMYŚLNA: ZAWSZE SWARM MODE

> **Każde zadanie powinno być realizowane w trybie Swarm Mode** - z wykorzystaniem odpowiednich specjalistów jako subagentów. Nie pracujemy sekwencyjnie jako jeden agent!

**Kiedy używać Swarm Mode:**

- ✅ Implementacja User Story (zawsze!)
- ✅ Zadania dotyczące wielu modułów (backend + frontend)
- ✅ Nowe funkcjonalności wymagające testów
- ✅ Zmiany wymagające aktualizacji dokumentacji

**Jak aktywować subagentów:**

```
runSubagent({
  description: "Backend: POI API endpoints",
  prompt: "Jako Backend Developer, zaimplementuj..."
})
```

**Typowy podział dla User Story:**

1. 🏗️ **Architect** → Analiza wymagań, design review
2. 🔧 **Backend Dev** → API routes, services, database
3. 🌐 **Web Specialist** → UI components, i18n, hooks
4. 🧪 **QA Engineer** → Unit tests, integration tests
5. 🏗️ **Architect** → Code review, security check
6. 📚 **Doc Specialist** → Epic update, changelog

### Model Roju Agentów

Zespół pracuje w trybie **Swarm Mode** - każdy specjalista może być aktywowany w zależności od potrzeb zadania:

```
┌─────────────────────────────────────────────────────────────┐
│                    USER REQUEST                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              🏗️ SOFTWARE ARCHITECT                          │
│  → Analiza wymagań i design review                          │
│  → Określenie wymaganych specjalistów                       │
│  → Podział na podzadania                                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
    ┌─────────────────┼─────────────────┬─────────────────┐
    ▼                 ▼                 ▼                 ▼
┌─────────┐     ┌─────────┐       ┌─────────┐       ┌─────────┐
│ Backend │     │ Mobile  │       │   Web   │       │   QA    │
│   Dev   │     │   Dev   │       │  Spec.  │       │  Spec.  │
└────┬────┘     └────┬────┘       └────┬────┘       └────┬────┘
     │               │                 │                 │
     └───────────────┴────────┬────────┴─────────────────┘
                              │
                              ▼
               ┌──────────────────────────┐
               │   🏗️ SOFTWARE ARCHITECT  │
               │      (Code Review)       │
               └────────────┬─────────────┘
                            │
                            ▼
               ┌──────────────────────────┐
               │  📚 Documentation Spec.  │
               └────────────┬─────────────┘
                            │
                            ▼
               ┌──────────────────────────┐
               │      ✅ DELIVERABLE      │
               └──────────────────────────┘
```

### Przekazywanie zadań między specjalistami

| Etap               | Odpowiedzialny     | Output                  |
| ------------------ | ------------------ | ----------------------- |
| 1. Analiza wymagań | Architect          | Design doc, ADR         |
| 2. Planowanie      | Doc Specialist     | User Story z kryteriami |
| 3. Implementacja   | Backend/Mobile/Web | Kod + unit tests        |
| 4. Code Review     | Architect          | Feedback, suggestions   |
| 5. Testy E2E       | QA Engineer        | Test report             |
| 6. Dokumentacja    | Doc Specialist     | Aktualizacja docs       |
| 7. Final Review    | Architect          | Approval, merge         |

### Wspólne standardy:

- **Git Flow:** Feature branches, PR-based workflow
- **Testing:** TDD dla backend, unit tests dla frontend/mobile
- **Dokumentacja:** Aktualizacja Epic/US po zakończeniu zadania
- **Code Style:** ESLint, Prettier, TypeScript strict mode
- **Definition of Done:** Kod + Testy + Dokumentacja

---

## 📊 Status Projektów

| Obszar       | Specjalista    | Aktualny Epic   | Status         |
| ------------ | -------------- | --------------- | -------------- |
| Backend      | Backend Dev    | Epic 15 (POI)   | 🔄 In Progress |
| Mobile       | Mobile Dev     | Epic 7          | ✅ Complete    |
| Admin/Web    | Web Specialist | Epic 8 (US 8.9) | ✅ Complete    |
| QA           | QA Engineer    | Cross-Epic      | 🔄 Continuous  |
| Docs         | Doc Specialist | Cross-Epic      | 🔄 Continuous  |
| Architecture | Architect      | Cross-Epic      | 🔄 Continuous  |

---

## 📅 Historia zmian

| Data       | Zmiana                                        |
| ---------- | --------------------------------------------- |
| 2025-12-11 | Dodano Software Architect / Tech Lead         |
| 2025-12-11 | Dodano QA Engineer i Documentation Specialist |
| 2025-12-11 | Wprowadzono Swarm Mode workflow               |
| 2025-12-11 | Dodano Web Application Specialist do zespołu  |
| 2025-12-11 | Utworzono dokumentację zespołu wirtualnego    |
