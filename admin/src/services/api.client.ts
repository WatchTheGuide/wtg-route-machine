/**
 * API Client - Base HTTP client with interceptors
 * Handles authentication, token refresh, and error handling
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Token storage keys
const ACCESS_TOKEN_KEY = 'wtg_access_token';
const REFRESH_TOKEN_KEY = 'wtg_refresh_token';

// Token storage (in memory for access token, localStorage for refresh)
let accessToken: string | null = null;

export interface ApiError {
  error: string;
  message: string;
  status: number;
}

export class ApiClientError extends Error {
  status: number;
  errorCode: string;

  constructor(status: number, errorCode: string, message: string) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.errorCode = errorCode;
  }
}

/**
 * Get access token from memory
 */
export function getAccessToken(): string | null {
  return accessToken;
}

/**
 * Set access token in memory
 */
export function setAccessToken(token: string | null): void {
  accessToken = token;
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Set refresh token in localStorage
 */
export function setRefreshToken(token: string | null): void {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

/**
 * Clear all tokens (on logout)
 */
export function clearTokens(): void {
  accessToken = null;
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

/**
 * Try to refresh the access token
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/admin/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      clearTokens();
      return false;
    }

    const data = await response.json();
    setAccessToken(data.accessToken);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

/**
 * Base fetch function with auth headers
 */
async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Add auth header if we have a token
  if (accessToken) {
    (headers as Record<string, string>)[
      'Authorization'
    ] = `Bearer ${accessToken}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Handle 401 - try to refresh token
  if (response.status === 401 && retry) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return fetchWithAuth<T>(endpoint, options, false);
    }

    // Refresh failed - user needs to login again
    throw new ApiClientError(
      401,
      'Unauthorized',
      'Session expired. Please login again.'
    );
  }

  // Handle other error responses
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: 'Unknown Error',
      message: response.statusText,
    }));

    throw new ApiClientError(
      response.status,
      errorData.error || 'Unknown Error',
      errorData.message || response.statusText
    );
  }

  // Return JSON response
  return response.json();
}

/**
 * API Client methods
 */
export const apiClient = {
  /**
   * GET request
   */
  get: <T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>
  ) => {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    return fetchWithAuth<T>(url, { method: 'GET' });
  },

  /**
   * POST request
   */
  post: <T>(endpoint: string, body?: unknown) => {
    return fetchWithAuth<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PUT request
   */
  put: <T>(endpoint: string, body?: unknown) => {
    return fetchWithAuth<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * DELETE request
   */
  delete: <T>(endpoint: string) => {
    return fetchWithAuth<T>(endpoint, { method: 'DELETE' });
  },
};

export default apiClient;
