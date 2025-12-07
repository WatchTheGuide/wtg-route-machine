# WTG Route Machine - Admin Panel

Admin panel aplikacji WTG Route Machine do zarządzania kuratorowanymi wycieczkami i punktami turystycznymi (POI).

## Stack Technologiczny

- **Framework:** Vite + React 18 + TypeScript
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
│   │   ├── layout/          # Layout components (Header, Sidebar)
│   │   ├── tours/           # Tour-specific components (TODO)
│   │   └── common/          # Shared components (TODO)
│   ├── pages/               # Page components
│   │   └── Dashboard.tsx    # Dashboard page
│   ├── hooks/               # Custom React hooks (TODO)
│   ├── services/            # API services (TODO)
│   ├── stores/              # Zustand stores (TODO)
│   ├── types/               # TypeScript type definitions
│   ├── lib/                 # Utility functions
│   │   ├── utils.ts         # cn() helper
│   │   └── format.ts        # Formatting utilities
│   └── App.tsx              # Main App component
├── public/
└── package.json
```

## Features Roadmap

### US 8.1: Projekt i struktura ✅ COMPLETED

- [x] Vite + React + TypeScript setup
- [x] Tailwind CSS v4 configuration
- [x] shadcn/ui initialization
- [x] Folder structure
- [x] Path aliases (`@/`)
- [x] Basic layout (Header + Sidebar + Content)

### US 8.2-8.16: TODO

Zobacz [epic_8_admin_panel_and_website.md](../user_stories/epic_8_admin_panel_and_website.md) dla pełnej listy funkcjonalności.

## Available Components (shadcn/ui)

Zainstalowane komponenty:

- `Button`
- `Card`
- `Input`
- `Label`
- `Separator`
- `Sidebar`
- `Sheet`
- `Skeleton`
- `Tooltip`

Aby dodać nowe komponenty:

```bash
npx shadcn@latest add [component-name]
```

## Code Style

- **TypeScript:** Strict mode enabled
- **ESLint:** Konfiguracja z vite
- **Prettier:** TODO
- **Naming:** camelCase dla zmiennych, PascalCase dla komponentów

## License

MIT

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
