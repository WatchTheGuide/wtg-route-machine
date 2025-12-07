import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';

// Test component to render inside ProtectedRoute
function TestContent() {
  return <div data-testid="protected-content">Protected Content</div>;
}

// Login page mock
function LoginPage() {
  return <div data-testid="login-page">Login Page</div>;
}

// Wrapper component for testing with MemoryRouter
function TestApp({
  initialPath = '/protected',
  requiredRole,
}: {
  initialPath?: string;
  requiredRole?: 'admin' | 'editor' | 'viewer';
}) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute requiredRole={requiredRole}>
              <TestContent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={<div data-testid="admin-page">Admin</div>}
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute', () => {
  beforeEach(() => {
    // Reset auth store before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      rememberMe: false,
    });
  });

  describe('when not authenticated', () => {
    it('should redirect to login page', () => {
      render(<TestApp />);

      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('when authenticated', () => {
    beforeEach(() => {
      useAuthStore.setState({
        user: {
          id: '1',
          email: 'admin@wtg.pl',
          name: 'Administrator',
          role: 'admin',
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        rememberMe: false,
      });
    });

    it('should render protected content', () => {
      render(<TestApp />);

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    });

    it('should allow access when user has required role', () => {
      render(<TestApp requiredRole="admin" />);

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should allow access when user has higher role than required', () => {
      // Admin accessing editor-only page
      render(<TestApp requiredRole="editor" />);

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });
  });

  describe('role-based access', () => {
    it('should redirect viewer to admin when accessing admin-only route', () => {
      useAuthStore.setState({
        user: {
          id: '3',
          email: 'viewer@wtg.pl',
          name: 'Viewer',
          role: 'viewer',
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        rememberMe: false,
      });

      render(<TestApp requiredRole="admin" />);

      expect(screen.getByTestId('admin-page')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect editor to admin when accessing admin-only route', () => {
      useAuthStore.setState({
        user: {
          id: '2',
          email: 'editor@wtg.pl',
          name: 'Editor',
          role: 'editor',
        },
        token: 'test-token',
        isAuthenticated: true,
        isLoading: false,
        error: null,
        rememberMe: false,
      });

      render(<TestApp requiredRole="admin" />);

      expect(screen.getByTestId('admin-page')).toBeInTheDocument();
    });
  });
});
