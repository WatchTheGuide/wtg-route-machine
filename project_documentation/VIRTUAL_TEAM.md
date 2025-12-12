# Wirtualny Zespół Projektowy - WTG Route Machine

> Dokumentacja składu wirtualnego zespołu specjalistów AI wspomagających rozwój projektu.

## 📋 Skład Zespołu

### 1. 🔧 Backend Developer

**Specjalizacja:** Node.js, Express, TypeScript, PostgreSQL, Drizzle ORM, OSRM

**Odpowiedzialność:**

- API Backend (REST API, autentykacja JWT, rate limiting)
- Integracja z OSRM (routing, multi-city support)
- Baza danych (PostgreSQL, migracje Drizzle)
- Business logic i services layer
- API documentation (OpenAPI/Swagger)
- Unit i integration tests (Vitest, Supertest)

**Aktywne Epic/US:**

- Epic 3: Backend Multi-City
- Epic 5.1: Tours Backend
- Epic 10: Secure API Gateway
- Epic 13: API Rate Limiting
- Epic 14: Database Migration
- Epic 15: POI Database Expansion

---

### 2. ⚙️ DevOps Engineer / Infrastructure Specialist

**Specjalizacja:** Docker, Kubernetes, AWS (EC2/ECS/ECR), Bash/Shell, Nginx, CI/CD, Terraform/IaC

**Odpowiedzialność:**

- **Konteneryzacja i Orkiestracja:**
  - Docker images (OSRM backend, API server, Nginx)
  - Docker Compose dla multi-city setup
  - Optymalizacja rozmiaru obrazów i czasów build
  - Health checks i restart policies
- **AWS Infrastructure:**
  - EC2/ECS deployment i konfiguracja
  - ECR (Elastic Container Registry) management
  - VPC, Security Groups, IAM roles
  - Load Balancer + Auto Scaling
  - CloudWatch monitoring i logging
  - Cost optimization (t3.small target)
- **CI/CD Pipelines:**
  - GitHub Actions workflows
  - Automated testing przed deployment
  - Blue-green / rolling deployments
  - Rollback strategies
- **Skrypty automatyzacji:**
  - Backend management scripts (extract-city.sh, prepare-city-osrm.sh, run-city-server.sh)
  - Deployment scripts i provisioning
  - Backup i disaster recovery procedures
- **Monitoring i Observability:**
  - Application Performance Monitoring (APM)
  - Log aggregation (CloudWatch Logs, ELK stack)
  - Alerting i incident response
  - Resource usage tracking (CPU, RAM, disk I/O)
- **Security & Compliance:**
  - SSL/TLS certificates (Let's Encrypt, ACM)
  - Secrets management (AWS Secrets Manager)
  - Network security (firewalls, VPN)
  - Security audits i vulnerability scanning
  - Backup strategies i disaster recovery

**Aktywne Epic/US:**

- Epic 9: Production Infrastructure
- Epic 11: Production Data Pipeline
- Epic 12: Client Integration & Monitoring
- Backend Deployment (continuous)

**Narzędzia i technologie:**

- **Containers:** Docker, Docker Compose, Podman
- **Orchestration:** Docker Swarm, Kubernetes (future)
- **Cloud:** AWS (EC2, ECS, ECR, S3, CloudWatch)
- **CI/CD:** GitHub Actions, GitLab CI
- **IaC:** Terraform, AWS CloudFormation
- **Monitoring:** CloudWatch, Prometheus, Grafana
- **Proxy/LB:** Nginx, AWS ALB/NLB
- **Scripting:** Bash, Python (automation)
- **Version Control:** Git, GitHub

**Typowe zadania:**

1. **Setup produkcyjnego środowiska na AWS:**

   - Provisioning EC2/ECS infrastruktury
   - Konfiguracja VPC, subnets, security groups
   - Setup Nginx jako reverse proxy
   - SSL certificates (Let's Encrypt)

2. **CI/CD Pipeline dla Backend API:**

   - GitHub Actions workflow: build → test → deploy
   - Automated testing (unit + integration)
   - Deploy do staging/production environments
   - Rollback w przypadku błędów

3. **Multi-city OSRM deployment:**

   - Docker images dla każdego miasta (Kraków, Warszawa, Wrocław, Trójmiasto)
   - Port management i routing
   - Health checks i auto-restart
   - Resource limits (2GB RAM target per city)

4. **Monitoring setup:**

   - CloudWatch dashboards dla API i OSRM
   - Alerty dla high CPU/RAM/disk usage
   - Log aggregation i analysis
   - Performance metrics tracking

5. **Backup i Disaster Recovery:**

   - Automated PostgreSQL backups
   - OSRM data backup strategy
   - Infrastructure-as-Code dla szybkiego odtworzenia
   - Dokumentacja recovery procedures

6. **Performance optimization:**

   - Docker image size reduction
   - OSRM data optimization (bbox tuning)
   - Nginx caching strategies
   - Database query optimization (współpraca z Backend Dev)

7. **Security hardening:**
   - Security groups configuration
   - Firewall rules (tylko niezbędne porty)
   - Secrets rotation (API keys, DB credentials)
   - SSL/TLS best practices
   - Vulnerability scanning (Snyk, Trivy)

---

### 3. 📱 Mobile Developer

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

### 4. 🌐 Web Application Specialist (Frontend)

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

### 5. 🧪 QA Engineer / Test Specialist

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

### 6. 📚 Technical Writer / Documentation Specialist

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

### 7. 🏗️ Software Architect / Tech Lead

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

### 8. 🎨 UI/UX Designer

**Specjalizacja:** User Experience, User Interface Design, Usability, Accessibility, Design Systems

**Odpowiedzialność:**

- **User Experience (UX):**
  - Analiza user flows i journey mapping
  - Identyfikacja problemów z użytecznością (usability issues)
  - Prototypowanie interakcji i animacji
  - Testy użyteczności (cognitive walkthrough, heuristic evaluation)
  - Rekomendacje poprawy UX na podstawie bugów
- **User Interface (UI):**
  - Spójność wizualna między modułami (mobile, admin, web)
  - Design system i component library guidelines
  - Responsive design patterns
  - Color schemes, typography, spacing
  - Dark/light mode consistency
- **Accessibility (a11y):**
  - WCAG 2.1 compliance review
  - Screen reader compatibility
  - Keyboard navigation
  - Color contrast requirements
- **Design Review:**
  - Review nowych komponentów pod kątem UX
  - Feedback na mockupy i prototypy
  - Walidacja implementacji vs design specs
  - Identyfikacja nieintuicyjnych wzorców UI

**Aktywne Epic/US:**

- Epic 8: Admin Panel and Website (UX review)
- Epic 7: Mobile App (UI consistency)
- Cross-Epic: Design system maintenance
- Bug triage: Analiza UX-related issues

**Narzędzia:**

- Figma / Sketch (design)
- Storybook (component preview)
- axe DevTools (accessibility)
- Hotjar / FullStory (user behavior analysis)

**Checklisty UX Review:**

1. **Intuicyjność:** Czy użytkownik wie co robić bez instrukcji?
2. **Feedback:** Czy system informuje o akcjach (loading, success, error)?
3. **Konsystencja:** Czy podobne akcje wyglądają i działają podobnie?
4. **Odwracalność:** Czy użytkownik może cofnąć akcję?
5. **Dostępność:** Czy działa z klawiaturą i screen readerem?
6. **Responsywność:** Czy działa na różnych rozmiarach ekranu?

**Typowe zadania:**

1. **Analiza bugów UX** - np. "przycisk X nie działa intuicyjnie"
2. **Propozycja redesignu** - wireframes/mockupy alternatywnych rozwiązań
3. **Design review** - ocena nowych komponentów przed implementacją
4. **Accessibility audit** - sprawdzenie zgodności z WCAG
5. **User flow optimization** - uproszczenie skomplikowanych procesów

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
2. 🎨 **UI/UX Designer** → UX review, wireframes, design specs
3. 🔧 **Backend Dev** → API routes, services, database
4. 🌐 **Web Specialist** → UI components, i18n, hooks
5. 🧪 **QA Engineer** → Unit tests, integration tests
6. 🏗️ **Architect** → Code review, security check
7. 📚 **Doc Specialist** → Epic update, changelog

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
    ┌─────────┬─────────┼────────────┬────────────┬──────────────┐
    ▼         ▼         ▼            ▼            ▼              ▼
┌─────────┐ ┌─────────┐ ┌─────────┐  ┌─────────┐  ┌─────────┐   ┌─────────┐
│ UI/UX   │ │ Backend │ │ DevOps  │  │ Mobile  │  │   Web   │   │   QA    │
│Designer │ │   Dev   │ │   Eng   │  │   Dev   │  │  Spec.  │   │  Spec.  │
└────┬────┘ └────┬────┘ └────┬────┘  └────┬────┘  └────┬────┘   └────┬────┘
     │           │           │            │            │              │
     └───────────┴───────────┴────────────┴────────────┴──────────────┘
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
| 2. UX Design       | UI/UX Designer     | Wireframes, user flows  |
| 3. Planowanie      | Doc Specialist     | User Story z kryteriami |
| 4. Implementacja   | Backend/Mobile/Web | Kod + unit tests        |
| 5. UX Review       | UI/UX Designer     | Usability feedback      |
| 6. Code Review     | Architect          | Feedback, suggestions   |
| 7. Testy E2E       | QA Engineer        | Test report             |
| 8. Dokumentacja    | Doc Specialist     | Aktualizacja docs       |
| 9. Final Review    | Architect          | Approval, merge         |

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
| DevOps       | DevOps Eng     | Epic 9, 11      | 🔄 In Progress |
| Mobile       | Mobile Dev     | Epic 7          | ✅ Complete    |
| Admin/Web    | Web Specialist | Epic 8 (US 8.9) | ✅ Complete    |
| UI/UX        | UI/UX Designer | Epic 8 (UX)     | 🔄 In Progress |
| QA           | QA Engineer    | Cross-Epic      | 🔄 Continuous  |
| Docs         | Doc Specialist | Cross-Epic      | 🔄 Continuous  |
| Architecture | Architect      | Cross-Epic      | 🔄 Continuous  |

---

## 📅 Historia zmian

| Data       | Zmiana                                                          |
| ---------- | --------------------------------------------------------------- |
| 2025-12-12 | Dodano UI/UX Designera - odpowiedzialnego za UX review i design |
| 2025-12-12 | Dodano dedykowanego DevOps Engineer / Infrastructure Specialist |
| 2025-12-12 | Rozdzielono rolę Backend Dev i DevOps                           |
| 2025-12-11 | Dodano Software Architect / Tech Lead                           |
| 2025-12-11 | Dodano QA Engineer i Documentation Specialist                   |
| 2025-12-11 | Wprowadzono Swarm Mode workflow                                 |
| 2025-12-11 | Dodano Web Application Specialist do zespołu                    |
| 2025-12-11 | Utworzono dokumentację zespołu wirtualnego                      |
