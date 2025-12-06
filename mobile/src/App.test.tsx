import React from 'react';
import { render } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';

// Mock dla useTheme hook
vi.mock('./hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    isDarkMode: false,
    setTheme: vi.fn(),
    toggleTheme: vi.fn(),
  }),
}));

test('renders without crashing', () => {
  const { baseElement } = render(<App />);
  expect(baseElement).toBeDefined();
});
