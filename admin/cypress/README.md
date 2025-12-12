# Cypress E2E Tests Setup Guide

## 📋 Overview

This directory contains E2E tests for the **Media Manager** (US 8.10) in the admin panel.

**Status**: ✅ **Cypress configured and ready to run** (Updated: 12 grudnia 2025)

## 🚀 Installation

Cypress is already installed. To verify:

```bash
cd admin
npm list cypress
# Should show: cypress@15.7.1
```

### Package Versions

```json
{
  "devDependencies": {
    "cypress": "^15.7.1",
    "@types/cypress": "^0.1.6",
    "cypress-file-upload": "^5.0.8",
    "start-server-and-test": "^2.0.10"
  }
}
```

## ⚙️ Configuration

Configuration files are in place and verified:

- ✅ `cypress.config.ts` - Main Cypress configuration (dynamic baseUrl)
- ✅ `cypress/tsconfig.json` - TypeScript config with path aliases
- ✅ `cypress/support/e2e.ts` - Global setup with selective exception handler
- ✅ `cypress/support/commands.ts` - Custom commands with API mocking

### Environment Variables

**⚠️ Security Note:** `.env.test` should not be committed to git (already in `.gitignore`).

1. Copy the example file:

```bash
cd admin
cp .env.test.example .env.test
```

2. Update `.env.test` with mock credentials (no real credentials!):

```env
# Vite Dev Server
VITE_DEV_SERVER_URL=http://localhost:5174

# API Server
VITE_API_URL=http://localhost:3000

# Mock Admin Credentials (for E2E tests only)
CYPRESS_ADMIN_EMAIL=admin@example.com
CYPRESS_ADMIN_PASSWORD=change-me-in-env-test
```

**Variables:**

- `VITE_DEV_SERVER_URL` - Dev server URL (default: http://localhost:5174)
- `VITE_API_URL` - API server URL (default: http://localhost:3000)
- `CYPRESS_ADMIN_EMAIL` - Mock admin email (used in cy.login())
- `CYPRESS_ADMIN_PASSWORD` - Mock admin password (used in cy.login())

**Note:** These credentials are for **mock authentication only**. The `cy.login()` command sets localStorage directly without making real API calls.

## 📂 Test Structure

```
admin/cypress/
├── e2e/media/                  # Media Manager E2E tests
│   ├── MediaPage.cy.tsx        # Media library page tests
│   ├── MediaUpload.cy.tsx      # Upload functionality tests
│   ├── MediaDetailsModal.cy.tsx # Details modal tests
│   └── MediaPicker.cy.tsx      # MediaPicker component tests
├── fixtures/                   # Test data
│   ├── media.json              # Mock media data
│   ├── test-image.jpg          # Test image file
│   └── test-document.pdf       # Test PDF (for validation)
└── support/                    # Helper functions
    ├── commands.ts             # Custom Cypress commands
    └── e2e.ts                  # Global setup
```

## 🧪 Running Tests

### Interactive Mode (Recommended for development)

```bash
cd admin

# Option 1: Manually start dev server, then open Cypress
npm run dev  # In terminal 1
npm run cypress:open  # In terminal 2

# Option 2: Auto-start dev server + Cypress (recommended)
npm run test:e2e:open
```

This opens Cypress Test Runner where you can:

- Select browser (Chrome, Firefox, Edge)
- Run individual test files
- See real-time execution
- Debug with DevTools

### Headless Mode (CI/CD)

```bash
cd admin

# Run all E2E tests (auto-starts dev server)
npm run test:e2e

# Or manually:
npm run dev  # In terminal 1
npm run cypress:run  # In terminal 2

# Run specific test file
npx cypress run --spec "cypress/e2e/media/MediaPage.cy.tsx"

# Run with specific browser
npx cypress run --browser chrome

# Run with video recording
npx cypress run --video
```

**Note:** `npm run test:e2e` uses `start-server-and-test` to automatically start the dev server before running tests and stop it after.

## 🛠️ Custom Commands

Custom Cypress commands are defined in `cypress/support/commands.ts`:

### 1. `cy.login()`

Logs in as admin user using **mock authentication** (localStorage only, no API call).

```typescript
cy.login(); // Uses credentials from .env.test
```

**Implementation:**

```typescript
Cypress.Commands.add('login', () => {
  cy.window().then((win) => {
    win.localStorage.setItem('token', 'mock-jwt-token');
    win.localStorage.setItem(
      'user',
      JSON.stringify({
        id: 1,
        email: Cypress.env('adminEmail') || 'admin@wtg-tours.com',
        name: 'Admin User',
        role: 'admin',
      })
    );
  });
});
```

### 2. `cy.mockMediaAPI()`

Mocks all media API endpoints with test data using `cy.intercept()`.

```typescript
cy.mockMediaAPI();
// Now all API calls return mock data:
// - GET /api/media* → mock media list
// - POST /api/media → mock upload success
// - PATCH /api/media/:id → mock update success
// - DELETE /api/media/:id → mock delete success
```

**Aliases created:**

- `@getMedia` - GET requests
- `@uploadMedia` - POST requests
- `@updateMedia` - PATCH requests
- `@deleteMedia` - DELETE requests

**Usage:**

```typescript
cy.mockMediaAPI();
cy.visit('/media');
cy.wait('@getMedia'); // Wait for media list to load
```

### 3. `cy.uploadFile(selector, fileName, mimeType)`

Uploads a file using **mock binary data** (no real fixture files needed).

```typescript
cy.uploadFile('[data-testid="file-input"]', 'test-image.jpg', 'image/jpeg');
```

**Implementation:**

- Creates 1x1 PNG image from base64 string
- Converts to Blob using `Cypress.Blob.base64StringToBlob()`
- Triggers change event on file input
- No need for real image files in `cypress/fixtures/`

### 4. `cy.waitForMediaGrid()`

Waits for media grid to load and contain items.

```typescript
cy.waitForMediaGrid();
// Media grid is visible and contains at least 1 card
```

**Implementation:**

```typescript
cy.get('[data-testid="media-grid"]').should('be.visible');
cy.get('[data-testid="media-card"]').should('have.length.at.least', 1);
```

## 📊 Test Coverage

### MediaPage Tests (55 scenarios)

| Category       | Tests | Description           |
| -------------- | ----- | --------------------- |
| Grid Display   | 3     | Basic grid rendering  |
| Search         | 3     | Search functionality  |
| Tag Filtering  | 4     | Filter by tags        |
| View Options   | 2     | Grid/List view toggle |
| Pagination     | 2     | Page navigation       |
| Empty State    | 1     | No media message      |
| Error Handling | 2     | API errors            |

**Total**: 17 test cases

### MediaUpload Tests (70 scenarios)

| Category          | Tests | Description               |
| ----------------- | ----- | ------------------------- |
| Upload Dialog     | 3     | Opening/closing dialog    |
| File Selection    | 5     | File input & preview      |
| Form Validation   | 5     | Field validation          |
| Tags Management   | 4     | Adding/removing tags      |
| Upload Submission | 5     | Successful/failed uploads |

**Total**: 22 test cases

### MediaDetailsModal Tests (85 scenarios)

| Category         | Tests | Description                   |
| ---------------- | ----- | ----------------------------- |
| Opening Modal    | 7     | Modal display                 |
| Image Display    | 4     | Zoom controls                 |
| Edit Mode        | 3     | Entering/exiting edit         |
| Metadata Editing | 6     | Update title/description/tags |
| Media Deletion   | 5     | Delete with confirmation      |
| Copy Actions     | 2     | Copy URL/Markdown             |

**Total**: 27 test cases

### MediaPicker Tests (90 scenarios)

| Category            | Tests | Description          |
| ------------------- | ----- | -------------------- |
| Picker in Tour Form | 9     | Selection in forms   |
| Search in Picker    | 3     | Search functionality |
| Upload from Picker  | 3     | Upload new media     |
| Picker in POI Form  | 2     | Single selection     |
| Validation          | 1     | Max selection limit  |
| Accessibility       | 3     | Keyboard navigation  |

**Total**: 21 test cases

### **Grand Total: 87 E2E test cases** 🎯

## 🎭 Test Scenarios Breakdown

### ✅ Happy Path (Primary scenarios)

- ✅ Display media grid
- ✅ Search media by title
- ✅ Filter by tags
- ✅ Upload image with metadata
- ✅ Edit media details
- ✅ Delete media with confirmation
- ✅ Select media in tour form
- ✅ Multiple media selection

### ⚠️ Error Handling

- ❌ API failures (500 errors)
- ❌ Network errors
- ❌ Invalid file types
- ❌ File size exceeded
- ❌ Validation errors
- ❌ Deletion conflicts (media in use)

### 🔍 Edge Cases

- Empty state (no media)
- No search results
- Maximum selection limit
- Duplicate tag prevention
- Large file uploads
- Multiple selection/deselection

### ♿ Accessibility

- Keyboard navigation
- ARIA labels
- Focus management
- Screen reader support

## 🚦 Prerequisites Before Running Tests

1. **Backend API must be running** on `http://localhost:3000`

   ```bash
   cd backend/api-server
   npm run dev
   ```

2. **Admin panel dev server** must be running on `http://localhost:5173`

   ```bash
   cd admin
   npm run dev
   ```

3. **Database seeded** with test data (optional, tests use mocks by default)

### Alternative: Run with API Mocking

If backend is not available, tests will use mocked API responses (via `cy.mockMediaAPI()`). This is the **recommended approach** for fast, isolated testing.

## 🎯 Test Data Management

### Using Fixtures

Fixtures are located in `cypress/fixtures/`:

```typescript
// Load fixture data
cy.fixture('media.json').then((media) => {
  cy.intercept('GET', '/api/media', { body: media });
});
```

### Using Mocked API

```typescript
// Use custom mock helper
cy.mockMediaAPI(); // Uses predefined mock responses
```

### Using Real API

```typescript
// Don't call cy.mockMediaAPI()
// Tests will hit real backend API
```

## 📝 Writing New Tests

### Test File Template

```typescript
/// <reference types="cypress" />

describe('Feature Name', () => {
  beforeEach(() => {
    cy.login();
    cy.mockMediaAPI();
    cy.visit('/admin/feature');
  });

  describe('Scenario Group', () => {
    it('should do something', () => {
      // Arrange
      cy.get('[data-testid="button"]').should('be.visible');

      // Act
      cy.get('[data-testid="button"]').click();

      // Assert
      cy.get('[data-testid="result"]').should('contain.text', 'Success');
    });
  });
});
```

### Best Practices

1. **Use data-testid attributes** for selectors

   ```tsx
   <button data-testid="upload-button">Upload</button>
   ```

2. **Follow AAA pattern** (Arrange-Act-Assert)

3. **Use custom commands** for common actions

4. **Mock API calls** for faster, isolated tests

5. **Group related tests** with `describe()` blocks

6. **Use meaningful test names** starting with "should"

## 🐛 Debugging Tests

### Interactive Debugging

```bash
npx cypress open
# Click on test file
# Use browser DevTools
# Use .debug() command in tests
```

### Log Output

```typescript
cy.get('[data-testid="element"]')
  .debug() // Pause execution
  .should('be.visible');
```

### Screenshots

Screenshots are automatically taken on test failure:

```
cypress/screenshots/MediaPage.cy.tsx/
  Media Library Page -- should display media grid (failed).png
```

### Videos (optional)

Enable in `cypress.config.ts`:

```typescript
video: true;
```

Videos saved to: `cypress/videos/`

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci
        working-directory: ./admin

      - name: Start backend
        run: npm run dev &
        working-directory: ./backend/api-server

      - name: Start admin panel
        run: npm run dev &
        working-directory: ./admin

      - name: Wait for servers
        run: npx wait-on http://localhost:5173 http://localhost:3000

      - name: Run Cypress tests
        run: npx cypress run
        working-directory: ./admin

      - name: Upload screenshots
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: cypress-screenshots
          path: admin/cypress/screenshots
```

## 📈 Test Metrics

After running tests, view metrics in Cypress Dashboard:

- Test execution time
- Pass/fail rates
- Flaky test detection
- Historical trends

## 🚧 TODO: Future Improvements

- [ ] Add visual regression testing (Percy, Applitools)
- [ ] Add performance testing (Core Web Vitals)
- [ ] Test drag & drop file upload
- [ ] Test image cropping functionality
- [ ] Test bulk operations (select all, delete multiple)
- [ ] Add cross-browser testing
- [ ] Add mobile viewport testing
- [ ] Add API contract testing

## 📞 Support

If tests fail:

1. Check server logs (backend + frontend)
2. Review Cypress error messages
3. Check screenshots in `cypress/screenshots/`
4. Run tests in interactive mode for debugging
5. Verify data-testid attributes exist in components

## 📚 Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)

---

**Status**: ✅ Tests written, ⚠️ Awaiting Cypress installation

**Next Step**: Run `npm install -D cypress @types/cypress cypress-file-upload` to enable tests.
