# WTG Route Machine - Admin Panel

Admin panel aplikacji WTG Route Machine do zarządzania kuratorowanymi wycieczkami i punktami turystycznymi (POI).

## Stack Technologiczny

- **Framework:** Vite 7 + React 19 + TypeScript
- **UI Components:** shadcn/ui (Radix UI + Tailwind CSS)
- **Routing:** React Router v6 (TODO)
- **State Management:** TanStack Query + Zustand (TODO)
- **Forms:** React Hook Form + Zod validation (TODO)
- **Maps:** OpenLayers (TODO)
- **Styling:** Tailwind CSS v4 + CSS Variables

## Development

### Prerequisites

- Node.js 18+
- npm lub yarn

### Installation

```bash
cd admin
npm install
```

### Development Server

```bash
npm run dev
```

Aplikacja będzie dostępna na http://localhost:5173/

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Struktura Projektu

```
admin/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── landing/         # Landing page components
│   │   ├── tours/           # Tour-specific components (TODO)
│   │   └── common/          # Shared components (TODO)
│   ├── pages/               # Page components
│   │   └── LandingPage.tsx  # Landing page
│   ├── hooks/               # Custom React hooks (TODO)
│   ├── services/            # API services (TODO)
│   ├── stores/              # Zustand stores (TODO)
│   ├── types/               # TypeScript type definitions
│   ├── lib/                 # Utility functions
│   │   └── utils.ts         # cn() helper
│   └── App.tsx              # Main App component
├── public/
│   └── icon.png             # App icon
└── package.json
```

## Features Roadmap

### US 8.1: Projekt i struktura ✅ COMPLETED

- [x] Vite + React + TypeScript setup
- [x] Tailwind CSS v4 configuration
- [x] shadcn/ui initialization
- [x] Folder structure
- [x] Path aliases (`@/`)
- [x] Landing page with Navbar, Hero, Features, Cities, About, Footer

### US 8.2-8.16: TODO

Zobacz [epic_8_admin_panel_and_website.md](../user_stories/epic_8_admin_panel_and_website.md) dla pełnej listy funkcjonalności.

## Landing Page Components

Aktualnie zaimplementowane komponenty landing page:

- **Navbar** - Nawigacja z linkami i CTA
- **Hero** - Sekcja hero z opisem projektu
- **Features** - Grid z funkcjami aplikacji
- **Cities** - Karty dostępnych miast
- **About** - Informacje o projekcie
- **Footer** - Stopka z linkami

## Available Components (shadcn/ui)

Zainstalowane komponenty:

- `Button`
- `Card`
- `Collapsible`

Aby dodać nowe komponenty:

```bash
npx shadcn@latest add [component-name]
```

## Code Style

- **TypeScript:** Strict mode enabled
- **ESLint:** Konfiguracja z Vite

## License

MIT
