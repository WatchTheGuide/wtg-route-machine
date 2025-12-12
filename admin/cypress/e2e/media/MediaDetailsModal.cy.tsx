/// <reference types="cypress" />

/**
 * E2E Tests for Media Details Modal (US 8.10)
 *
 * Tests cover:
 * - Opening modal from media card
 * - Viewing media details
 * - Edit mode
 * - Close modal
 */

describe('Media Details Modal', () => {
  beforeEach(() => {
    cy.login();
    cy.mockMediaAPI();
    cy.visit('/admin/media');
    cy.wait('@getMedia');
  });

  describe('Opening Modal', () => {
    it('should open modal when clicking on media card', () => {
      cy.get('[data-testid="media-card"]').first().click();
      cy.get('[data-testid="media-details-modal"]').should('be.visible');
    });

    it('should display image in modal', () => {
      cy.get('[data-testid="media-card"]').first().click();
      cy.get('[data-testid="media-image"]').should('be.visible');
      cy.get('[data-testid="media-image"]').should('have.attr', 'src');
    });

    it('should close modal when clicking close or pressing escape', () => {
      cy.get('[data-testid="media-card"]').first().click();
      cy.get('[data-testid="media-details-modal"]').should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('[data-testid="media-details-modal"]').should('not.exist');
    });
  });

  describe('Edit Mode', () => {
    it('should have edit button in modal', () => {
      cy.get('[data-testid="media-card"]').first().click();
      cy.get('[data-testid="edit-button"]').should('be.visible');
    });

    it('should show edit form when clicking edit button', () => {
      cy.get('[data-testid="media-card"]').first().click();
      cy.get('[data-testid="edit-button"]').click();
      cy.get('[data-testid="edit-title-input"]').should('be.visible');
      cy.get('[data-testid="edit-alttext-input"]').should('be.visible');
      cy.get('[data-testid="edit-tags-input"]').should('be.visible');
    });

    it('should allow editing title', () => {
      cy.get('[data-testid="media-card"]').first().click();
      cy.get('[data-testid="edit-button"]').click();
      cy.get('[data-testid="edit-title-input"]').clear().type('New Title');
      cy.get('[data-testid="edit-title-input"]').should('have.value', 'New Title');
    });
  });
});
