/// <reference types="cypress" />

/**
 * E2E Tests for Media Upload Component (US 8.10)
 *
 * Tests cover:
 * - Upload dialog opening
 * - File input upload
 * - Form inputs
 * - Upload action
 */

describe('Media Upload', () => {
  beforeEach(() => {
    cy.login();
    cy.mockMediaAPI();
    cy.visit('/admin/media');
    cy.wait('@getMedia');
  });

  describe('Upload Dialog', () => {
    it('should open upload dialog when clicking upload button', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="upload-dialog"]').should('be.visible');
    });

    it('should close upload dialog when clicking cancel', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="upload-dialog"]').should('be.visible');
      // Click X close button in dialog header
      cy.get('[data-testid="upload-dialog"]').find('button.absolute').click();
      cy.get('[data-testid="upload-dialog"]').should('not.exist');
    });

    it('should close dialog on escape key', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="upload-dialog"]').should('be.visible');
      cy.get('body').type('{esc}');
      cy.get('[data-testid="upload-dialog"]').should('not.exist');
    });
  });

  describe('Dropzone', () => {
    it('should display dropzone area', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="dropzone"]').should('be.visible');
    });

    it('should have file input in dropzone', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="file-input"]').should('exist');
    });
  });

  describe('File Selection', () => {
    it('should allow file selection via input', () => {
      cy.get('[data-testid="upload-button"]').click();

      cy.uploadFile(
        '[data-testid="file-input"]',
        'test-image.jpg',
        'image/jpeg'
      );

      cy.get('[data-testid="image-preview"]').should('be.visible');
    });

    it('should display image preview after selection', () => {
      cy.get('[data-testid="upload-button"]').click();

      cy.uploadFile(
        '[data-testid="file-input"]',
        'test-image.jpg',
        'image/jpeg'
      );

      cy.get('[data-testid="image-preview"]').should('be.visible');
      cy.get('[data-testid="image-preview"] img').should('have.attr', 'src');
    });

    it('should allow removing selected file', () => {
      cy.get('[data-testid="upload-button"]').click();

      cy.uploadFile(
        '[data-testid="file-input"]',
        'test-image.jpg',
        'image/jpeg'
      );

      cy.get('[data-testid="image-preview"]').should('be.visible');
      cy.get('[data-testid="remove-file"]').click({ force: true });
      cy.get('[data-testid="image-preview"]').should('not.exist');
    });
  });

  describe('Metadata Inputs', () => {
    it('should have title input', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="title-input"]').should('be.visible');
    });

    it('should have alt text input', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="alttext-input"]').should('be.visible');
    });

    it('should have tags input', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="tags-input"]').should('be.visible');
    });

    it('should allow entering title', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="title-input"]').type('My Test Image');
      cy.get('[data-testid="title-input"]').should(
        'have.value',
        'My Test Image'
      );
    });

    it('should allow entering alt text', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="alttext-input"]').type('Beautiful landscape photo');
      cy.get('[data-testid="alttext-input"]').should(
        'have.value',
        'Beautiful landscape photo'
      );
    });

    it('should allow entering tags', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="tags-input"]').type('nature, landscape, mountains');
      cy.get('[data-testid="tags-input"]').should(
        'have.value',
        'nature, landscape, mountains'
      );
    });
  });

  describe('Upload Submit', () => {
    it('should have submit button', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="submit-upload"]').should('be.visible');
    });

    it('should disable submit button when no files selected', () => {
      cy.get('[data-testid="upload-button"]').click();
      cy.get('[data-testid="submit-upload"]').should('be.disabled');
    });

    it('should enable submit button after file selection', () => {
      cy.get('[data-testid="upload-button"]').click();

      cy.uploadFile(
        '[data-testid="file-input"]',
        'test-image.jpg',
        'image/jpeg'
      );

      cy.get('[data-testid="submit-upload"]').should('not.be.disabled');
    });

    it('should upload file successfully', () => {
      cy.get('[data-testid="upload-button"]').click();

      cy.uploadFile(
        '[data-testid="file-input"]',
        'test-image.jpg',
        'image/jpeg'
      );

      cy.get('[data-testid="title-input"]').type('Test Upload');
      cy.get('[data-testid="submit-upload"]').click();

      cy.wait('@uploadMedia');
      // Dialog should close after successful upload
      cy.get('[data-testid="upload-dialog"]').should('not.exist');
    });
  });

  describe('Multiple Files', () => {
    it('should show multiple image previews when uploading multiple files', () => {
      cy.get('[data-testid="upload-button"]').click();

      // Upload first file
      cy.uploadFile(
        '[data-testid="file-input"]',
        'test-image-1.jpg',
        'image/jpeg'
      );

      cy.get('[data-testid="image-preview"]').should('have.length', 1);

      // Upload second file
      cy.uploadFile(
        '[data-testid="file-input"]',
        'test-image-2.jpg',
        'image/jpeg'
      );

      cy.get('[data-testid="image-preview"]').should('have.length', 2);
    });
  });
});
