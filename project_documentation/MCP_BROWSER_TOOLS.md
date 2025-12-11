# MCP Browser Tools - Konfiguracja

## Zainstalowane serwery MCP

Projekt posiada skonfigurowane serwery MCP (Model Context Protocol) dla automatyzacji przeglądarki i debugowania:

### 1. @playwright/mcp (Oficjalny)

Automatyzacja przeglądarki z pełnym dostępem do:

- **Interakcja z elementami** - klikanie, wypełnianie formularzy, scroll
- **Screenshots** - zrzuty ekranu całej strony lub elementów
- **Navigation** - nawigacja między stronami
- **DOM inspection** - analiza struktury HTML
- **Console logs** - przechwytywanie logów konsoli
- **Network requests** - monitorowanie żądań sieciowych

### 2. chrome-devtools-mcp

Bezpośredni dostęp do Chrome DevTools API:

- **Console** - pełny dostęp do konsoli JavaScript
- **Network** - monitorowanie i debugowanie sieci
- **Performance** - analiza wydajności
- **Elements** - inspekcja i modyfikacja DOM
- **Emulation** - symulacja urządzeń mobilnych

### 3. @modelcontextprotocol/server-filesystem

Dostęp do systemu plików projektu dla operacji na plikach.

## Jak używać

### W VS Code

Serwery są automatycznie uruchamiane przez GitHub Copilot Chat. Możesz:

1. Poprosić o wykonanie akcji w przeglądarce
2. Poprosić o screenshot strony
3. Debugować błędy konsoli
4. Analizować żądania sieciowe

### Przykłady promptów

```
- "Otwórz http://localhost:5173 i zrób screenshot"
- "Sprawdź co jest w konsoli przeglądarki"
- "Kliknij przycisk 'Submit' i pokaż wynik"
- "Przeanalizuj błędy sieciowe na stronie"
- "Wypełnij formularz logowania"
```

## Konfiguracja

### Lokalizacja plików konfiguracyjnych

- **Workspace**: `.vscode/mcp.json`
- **User Settings**: `~/Library/Application Support/Code/User/settings.json`

### Uruchomienie Chrome z debugowaniem (opcjonalne)

Dla chrome-devtools-mcp możesz uruchomić Chrome ręcznie z remote debugging:

```bash
# macOS
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

# Lub użyj headless mode
npx chrome-devtools-mcp --headless
```

## Wymagania

- Node.js 18+
- Playwright browsers (`npx playwright install chromium`)
- Chrome/Chromium (dla chrome-devtools-mcp)

## Troubleshooting

### Serwer nie startuje

```bash
# Sprawdź czy pakiety są dostępne
npx -y @playwright/mcp@latest --version
npx -y chrome-devtools-mcp@latest --version
```

### Brak przeglądarek Playwright

```bash
npx playwright install chromium
```

### Przeładuj VS Code

Po zmianach w konfiguracji MCP należy przeładować VS Code:

- `Cmd+Shift+P` → "Developer: Reload Window"
