/// <reference types="cypress" />

/**
 * E2E Tests for Media Library Page (US 8.10)
 *
 * Tests cover:
 * - Media grid display
 * - Search functionality
 * - Context/Sort filtering
 * - Empty state
 */

describe('Media Library Page', () => {
  beforeEach(() => {
    cy.login();
    cy.mockMediaAPI();
    cy.visit('/admin/media');
    cy.wait('@getMedia');
  });

  describe('Media Grid Display', () => {
    it('should display media grid on page load', () => {
      cy.get('[data-testid="media-grid"]').should('be.visible');
    });

    it('should show media cards with correct information', () => {
      cy.get('[data-testid="media-card"]')
        .first()
        .within(() => {
          // Check that thumbnail element exists (may have opacity 0 during load)
          cy.get('[data-testid="media-thumbnail"]').should('exist');
          cy.get('[data-testid="media-title"]').should(
            'contain.text',
            'Test Image'
          );
        });
    });

    it('should display total media count', () => {
      cy.get('[data-testid="media-count"]').should('be.visible');
    });
  });

  describe('Search Functionality', () => {
    it('should have search input visible', () => {
      cy.get('[data-testid="media-search"]').should('be.visible');
    });

    it('should update search value when typing', () => {
      cy.get('[data-testid="media-search"]').type('Test Image');
      cy.get('[data-testid="media-search"]').should('have.value', 'Test Image');
    });

    it('should trigger API call with search parameter', () => {
      // Set up intercept for search query
      cy.intercept('GET', '**/api/admin/media*search=landscape*', {
        statusCode: 200,
        body: {
          media: [
            {
              id: '1',
              filename: 'landscape.jpg',
              originalName: 'Landscape.jpg',
              mimeType: 'image/jpeg',
              sizeBytes: 102400,
              width: 400,
              height: 300,
              url: 'https://via.placeholder.com/400x300',
              thumbnailUrl: 'https://via.placeholder.com/200x150',
              title: 'Landscape Photo',
              altText: 'Beautiful landscape',
              tags: ['landscape'],
              contextType: null,
              contextId: null,
              uploadedBy: 'test-user-id',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
          total: 1,
          hasMore: false,
        },
      }).as('searchMedia');

      cy.get('[data-testid="media-search"]').type('landscape');

      // Wait for debounced search
      cy.wait(500);
      cy.wait('@searchMedia');
    });
  });

  describe('Context Filtering', () => {
    it('should have context filter dropdown', () => {
      cy.get('[data-testid="context-filter"]').should('be.visible');
    });

    it('should open context filter dropdown', () => {
      cy.get('[data-testid="context-filter"]').click();
      // Wait for dropdown content to appear
      cy.get('[role="listbox"]').should('be.visible');
    });
  });

  describe('Sort Options', () => {
    it('should have sort-by dropdown', () => {
      cy.get('[data-testid="sort-by"]').should('be.visible');
    });

    it('should have sort order button', () => {
      cy.get('[data-testid="sort-order"]').should('be.visible');
    });

    it('should toggle sort order when clicking button', () => {
      cy.get('[data-testid="sort-order"]').should('contain.text', '↓');
      cy.get('[data-testid="sort-order"]').click();
      cy.get('[data-testid="sort-order"]').should('contain.text', '↑');
    });
  });

  describe('Upload Button', () => {
    it('should have upload button visible', () => {
      cy.get('[data-testid="upload-button"]').should('be.visible');
    });

    it('should open upload dialog when clicking upload button', () => {
      cy.get('[data-testid="upload-button"]').click();
      // Upload dialog should appear
      cy.get('[role="dialog"]').should('be.visible');
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no media exists', () => {
      // Override mock with empty response
      cy.intercept('GET', '**/api/admin/media*', {
        statusCode: 200,
        body: {
          media: [],
          total: 0,
          hasMore: false,
        },
      }).as('getEmptyMedia');

      cy.visit('/admin/media');
      cy.wait('@getEmptyMedia');

      cy.get('[data-testid="no-results"]').should('be.visible');
      cy.get('[data-testid="upload-first-media-button"]').should('be.visible');
    });
  });

  describe('Media Card Interactions', () => {
    it('should show media details when clicking on card', () => {
      cy.get('[data-testid="media-card"]').first().click();
      // Details modal should open
      cy.get('[role="dialog"]').should('be.visible');
    });

    it('should show edit and delete options in card menu', () => {
      // Hover to show menu
      cy.get('[data-testid="media-card"]').first().trigger('mouseover');
      // Find and click the menu button
      cy.get('[data-testid="media-card"]')
        .first()
        .find('button')
        .first()
        .click({ force: true });

      cy.get('[data-testid="edit-button"]').should('be.visible');
      cy.get('[data-testid="delete-button"]').should('be.visible');
    });
  });
});
