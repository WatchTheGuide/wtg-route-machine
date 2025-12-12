// ***********************************************************
// This file is processed and loaded automatically before test files.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Selective uncaught exception handler
// Only ignore specific known non-critical errors
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore ResizeObserver loop limit exceeded (common in React apps)
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false;
  }

  // Ignore hydration mismatches in development
  if (err.message.includes('Hydration')) {
    return false;
  }

  // Ignore network errors during API mocking
  if (
    err.message.includes('NetworkError') ||
    err.message.includes('Failed to fetch')
  ) {
    return false;
  }

  // Allow test to fail for other uncaught exceptions
  return true;
});
