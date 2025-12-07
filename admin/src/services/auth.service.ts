/**
 * Auth Service - Authentication API calls
 */

import apiClient, {
  setAccessToken,
  setRefreshToken,
  clearTokens,
  getRefreshToken,
  ApiClientError,
} from './api.client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  expiresIn: number;
}

export interface RefreshResponse {
  accessToken: string;
  expiresIn: number;
}

/**
 * Auth Service
 */
export const authService = {
  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/api/admin/auth/login',
      credentials
    );

    // Store tokens
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);

    return response;
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/api/admin/auth/logout', { refreshToken });
      }
    } catch {
      // Ignore errors during logout
    } finally {
      clearTokens();
    }
  },

  /**
   * Refresh access token
   */
  async refresh(): Promise<RefreshResponse | null> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await apiClient.post<RefreshResponse>(
        '/api/admin/auth/refresh',
        { refreshToken }
      );

      setAccessToken(response.accessToken);
      return response;
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        clearTokens();
      }
      return null;
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await apiClient.get<{ user: AuthUser }>(
        '/api/admin/auth/me'
      );
      return response.user;
    } catch (error) {
      if (error instanceof ApiClientError && error.status === 401) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Check if user is authenticated (has valid token)
   */
  async checkAuth(): Promise<AuthUser | null> {
    // First try to get current user
    const user = await this.getCurrentUser();
    if (user) {
      return user;
    }

    // If failed, try to refresh token
    const refreshed = await this.refresh();
    if (refreshed) {
      return this.getCurrentUser();
    }

    return null;
  },
};

export default authService;
