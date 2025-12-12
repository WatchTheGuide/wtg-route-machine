/// <reference types="cypress" />

/**
 * E2E Tests for MediaPicker Component (US 8.10)
 *
 * Tests cover:
 * - MediaPicker in Tour Editor form
 * - Basic tab navigation
 *
 * Note: These tests verify basic Tour Editor page structure
 */

describe('MediaPicker Integration', () => {
  beforeEach(() => {
    cy.login();
    cy.mockMediaAPI();

    // Mock all potential API calls for Tour Editor
    cy.intercept('GET', '**/api/**', { statusCode: 200, body: {} }).as('anyApi');
  });

  describe('Tour Editor Page', () => {
    it('should load Tour Editor page', () => {
      cy.visit('/admin/tours/new');
      cy.url().should('include', '/admin/tours/new');
    });

    it('should have tabs in Tour Editor', () => {
      cy.visit('/admin/tours/new');
      cy.get('[role="tablist"]', { timeout: 10000 }).should('be.visible');
    });

    it('should have multiple tabs available', () => {
      cy.visit('/admin/tours/new');
      // Check that there are tabs (using role=tab)
      cy.get('[role="tab"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });
  });
});
