/// <reference types="cypress" />

// ***********************************************
// Custom commands for Media Manager E2E tests
// ***********************************************

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login as admin
       * @example cy.login()
       */
      login(email?: string, password?: string): Chainable<void>;

      /**
       * Custom command to intercept and mock media API calls
       * @example cy.mockMediaAPI()
       */
      mockMediaAPI(): Chainable<void>;

      /**
       * Custom command to upload file
       * @example cy.uploadFile('input[type="file"]', 'test-image.jpg', 'image/jpeg')
       */
      uploadFile(
        selector: string,
        fileName: string,
        mimeType: string
      ): Chainable<void>;

      /**
       * Custom command to wait for media to load
       * @example cy.waitForMediaGrid()
       */
      waitForMediaGrid(): Chainable<void>;
    }
  }
}

Cypress.Commands.add(
  'login',
  (
    email = Cypress.env('adminEmail') || 'admin@test.com',
    password = Cypress.env('adminPassword') || 'password'
  ) => {
    // Mock login - set Zustand auth store and tokens in localStorage
    // Visit baseUrl first to establish domain for localStorage
    cy.visit('/');

    cy.window().then((win) => {
      // Set Zustand auth store (wtg-auth-storage)
      const authState = {
        state: {
          user: {
            id: 'test-user-id',
            email: email,
            name: email.split('@')[0],
            role: 'admin',
          },
          isAuthenticated: true,
          rememberMe: true,
        },
        version: 0,
      };
      win.localStorage.setItem('wtg-auth-storage', JSON.stringify(authState));

      // Set refresh token
      win.localStorage.setItem(
        'wtg_refresh_token',
        'mock-refresh-token-for-testing'
      );
    });
  }
);

Cypress.Commands.add('mockMediaAPI', () => {
  // Mock GET /api/admin/media - list all media
  // Structure matches MediaListResponse type: { media: MediaItem[], total: number, hasMore: boolean }
  cy.intercept('GET', '**/api/admin/media*', {
    statusCode: 200,
    body: {
      media: [
        {
          id: '1',
          filename: 'test-image-1.jpg',
          originalName: 'Test Image 1.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 102400,
          width: 400,
          height: 300,
          url: 'https://via.placeholder.com/400x300',
          thumbnailUrl: 'https://via.placeholder.com/200x150',
          title: 'Test Image 1',
          altText: 'Test description',
          tags: ['tour', 'landscape'],
          contextType: 'tour',
          contextId: null,
          uploadedBy: 'test-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          filename: 'test-image-2.png',
          originalName: 'Test Image 2.png',
          mimeType: 'image/png',
          sizeBytes: 204800,
          width: 400,
          height: 300,
          url: 'https://via.placeholder.com/400x300/0000FF',
          thumbnailUrl: 'https://via.placeholder.com/200x150/0000FF',
          title: 'Test Image 2',
          altText: 'Another test',
          tags: ['poi', 'architecture'],
          contextType: 'poi',
          contextId: null,
          uploadedBy: 'test-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      total: 2,
      hasMore: false,
    },
  }).as('getMedia');

  // Mock POST /api/admin/media/upload - upload media
  cy.intercept('POST', '**/api/admin/media/upload', {
    statusCode: 201,
    body: {
      media: [
        {
          id: '3',
          filename: 'uploaded-image.jpg',
          originalName: 'Uploaded Image.jpg',
          mimeType: 'image/jpeg',
          sizeBytes: 153600,
          width: 400,
          height: 300,
          url: 'https://via.placeholder.com/400x300/00FF00',
          thumbnailUrl: 'https://via.placeholder.com/200x150/00FF00',
          title: 'Uploaded Image',
          altText: null,
          tags: [],
          contextType: null,
          contextId: null,
          uploadedBy: 'test-user-id',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    },
  }).as('uploadMedia');

  // Mock PUT /api/admin/media/:id - update media
  cy.intercept('PUT', '**/api/admin/media/*', {
    statusCode: 200,
    body: {
      media: {
        id: '1',
        filename: 'test-image-1.jpg',
        originalName: 'Test Image 1.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 102400,
        width: 400,
        height: 300,
        url: 'https://via.placeholder.com/400x300',
        thumbnailUrl: 'https://via.placeholder.com/200x150',
        title: 'Updated Title',
        altText: 'Updated alt text',
        tags: ['updated'],
        contextType: 'tour',
        contextId: null,
        uploadedBy: 'test-user-id',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    },
  }).as('updateMedia');

  // Mock DELETE /api/admin/media/:id - delete media
  cy.intercept('DELETE', '**/api/admin/media/*', {
    statusCode: 204,
  }).as('deleteMedia');
});

Cypress.Commands.add('uploadFile', (selector, fileName, mimeType) => {
  cy.get(selector).then((input) => {
    // Create mock file without requiring actual fixtures
    // Generate a simple 1x1 pixel image data for image types
    const mockContent = mimeType.startsWith('image/')
      ? 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
      : btoa('mock file content');

    const blob = Cypress.Blob.base64StringToBlob(mockContent, mimeType);
    const file = new File([blob], fileName, { type: mimeType });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    const inputElement = input[0] as HTMLInputElement;
    inputElement.files = dataTransfer.files;

    // Trigger change event
    cy.wrap(input).trigger('change', { force: true });
  });
});

Cypress.Commands.add('waitForMediaGrid', () => {
  cy.get('[data-testid="media-grid"]', { timeout: 10000 }).should('be.visible');
  cy.get('[data-testid="media-card"]').should('have.length.greaterThan', 0);
});

export {};
