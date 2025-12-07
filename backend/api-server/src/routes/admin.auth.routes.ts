/**
 * Admin Auth Routes
 * POST /api/admin/auth/login - Login
 * POST /api/admin/auth/logout - Logout
 * POST /api/admin/auth/refresh - Refresh token
 * GET  /api/admin/auth/me - Get current user
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authService } from '../services/auth.service.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import type {
  LoginResponse,
  RefreshResponse,
  UserResponse,
  AuthErrorResponse,
} from '../types/index.js';

const router = Router();

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

/**
 * POST /api/admin/auth/login
 * Authenticate user and return tokens
 */
router.post(
  '/login',
  async (
    req: Request,
    res: Response<LoginResponse | AuthErrorResponse>
  ): Promise<void> => {
    try {
      // Validate request body
      const validation = loginSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: validation.error.errors[0].message,
        });
        return;
      }

      const { email, password } = validation.data;

      // Authenticate
      const result = await authService.login(email, password);

      if (!result) {
        res.status(401).json({
          error: 'Authentication Failed',
          message: 'Invalid email or password',
        });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during login',
      });
    }
  }
);

/**
 * POST /api/admin/auth/logout
 * Invalidate refresh token
 */
router.post(
  '/logout',
  async (
    req: Request,
    res: Response<{ success: boolean } | AuthErrorResponse>
  ): Promise<void> => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        // Still return success even if no token provided
        res.json({ success: true });
        return;
      }

      await authService.logout(refreshToken);
      res.json({ success: true });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during logout',
      });
    }
  }
);

/**
 * POST /api/admin/auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  '/refresh',
  async (
    req: Request,
    res: Response<RefreshResponse | AuthErrorResponse>
  ): Promise<void> => {
    try {
      // Validate request body
      const validation = refreshSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          error: 'Validation Error',
          message: validation.error.errors[0].message,
        });
        return;
      }

      const { refreshToken } = validation.data;

      // Refresh token
      const result = await authService.refresh(refreshToken);

      if (!result) {
        res.status(401).json({
          error: 'Token Expired',
          message: 'Invalid or expired refresh token',
        });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error('Refresh error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred during token refresh',
      });
    }
  }
);

/**
 * GET /api/admin/auth/me
 * Get current authenticated user
 */
router.get(
  '/me',
  authMiddleware,
  async (
    req: Request,
    res: Response<UserResponse | AuthErrorResponse>
  ): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          error: 'Unauthorized',
          message: 'User not authenticated',
        });
        return;
      }

      const user = await authService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          error: 'Not Found',
          message: 'User not found',
        });
        return;
      }

      res.json({ user });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'An error occurred while fetching user',
      });
    }
  }
);

export default router;
