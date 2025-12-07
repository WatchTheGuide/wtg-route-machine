/**
 * Auth Service Tests
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { authService, ensureInitialized } from './auth.service.js';

describe('Auth Service', () => {
  // Ensure default admin user is initialized before tests
  beforeAll(async () => {
    await ensureInitialized();
  });

  describe('login', () => {
    it('should login with valid credentials', async () => {
      const result = await authService.login('admin@wtg.pl', 'admin123');

      expect(result).not.toBeNull();
      expect(result?.accessToken).toBeDefined();
      expect(result?.refreshToken).toBeDefined();
      expect(result?.user).toBeDefined();
      expect(result?.user.email).toBe('admin@wtg.pl');
      expect(result?.user.role).toBe('admin');
      expect(result?.expiresIn).toBeGreaterThan(0);
    });

    it('should return null for invalid email', async () => {
      const result = await authService.login('wrong@email.com', 'admin123');
      expect(result).toBeNull();
    });

    it('should return null for invalid password', async () => {
      const result = await authService.login('admin@wtg.pl', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should not include passwordHash in user response', async () => {
      const result = await authService.login('admin@wtg.pl', 'admin123');

      expect(result?.user).not.toHaveProperty('passwordHash');
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify valid access token', async () => {
      // First login to get a token
      const loginResult = await authService.login('admin@wtg.pl', 'admin123');
      expect(loginResult).not.toBeNull();

      const payload = authService.verifyAccessToken(loginResult!.accessToken);

      expect(payload).not.toBeNull();
      expect(payload?.email).toBe('admin@wtg.pl');
      expect(payload?.role).toBe('admin');
      expect(payload?.userId).toBeDefined();
    });

    it('should return null for invalid token', () => {
      const payload = authService.verifyAccessToken('invalid-token');
      expect(payload).toBeNull();
    });

    it('should return null for malformed token', () => {
      const payload = authService.verifyAccessToken(
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid'
      );
      expect(payload).toBeNull();
    });
  });

  describe('refresh', () => {
    it('should refresh access token with valid refresh token', async () => {
      // First login to get tokens
      const loginResult = await authService.login('admin@wtg.pl', 'admin123');
      expect(loginResult).not.toBeNull();

      const result = await authService.refresh(loginResult!.refreshToken);

      expect(result).not.toBeNull();
      expect(result?.accessToken).toBeDefined();
      expect(result?.expiresIn).toBeGreaterThan(0);
    });

    it('should return null for invalid refresh token', async () => {
      const result = await authService.refresh('invalid-refresh-token');
      expect(result).toBeNull();
    });
  });

  describe('logout', () => {
    it('should invalidate refresh token on logout', async () => {
      // First login to get tokens
      const loginResult = await authService.login('admin@wtg.pl', 'admin123');
      expect(loginResult).not.toBeNull();

      // Logout
      const logoutResult = await authService.logout(loginResult!.refreshToken);
      expect(logoutResult).toBe(true);

      // Try to refresh with the same token
      const refreshResult = await authService.refresh(
        loginResult!.refreshToken
      );
      expect(refreshResult).toBeNull();
    });

    it('should return false for unknown refresh token', async () => {
      const result = await authService.logout('unknown-refresh-token');
      expect(result).toBe(false);
    });
  });

  describe('getUserById', () => {
    it('should return user by ID', async () => {
      // Admin user ID is 'admin-1'
      const user = await authService.getUserById('admin-1');

      expect(user).not.toBeNull();
      expect(user?.email).toBe('admin@wtg.pl');
      expect(user?.role).toBe('admin');
    });

    it('should return null for unknown user ID', async () => {
      const user = await authService.getUserById('unknown-user-id');
      expect(user).toBeNull();
    });

    it('should not expose passwordHash', async () => {
      const user = await authService.getUserById('admin-1');
      expect(user).not.toHaveProperty('passwordHash');
    });
  });
});
