/**
 * Auth Middleware - JWT token verification
 */

import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import type { JwtPayload, UserRole } from '../types/index.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to verify JWT access token
 * Adds user payload to request object
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'No authorization header provided',
    });
    return;
  }

  // Check Bearer token format
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid authorization header format. Use: Bearer <token>',
    });
    return;
  }

  const token = parts[1];
  const payload = authService.verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token',
    });
    return;
  }

  // Add user to request
  req.user = payload;
  next();
};

/**
 * Middleware factory to check user role
 * Must be used after authMiddleware
 */
export const roleMiddleware = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Insufficient permissions. Required role: ${allowedRoles.join(
          ' or '
        )}`,
      });
      return;
    }

    next();
  };
};

/**
 * Shorthand middlewares for common role checks
 */
export const adminOnly = roleMiddleware('admin');
export const editorOrAdmin = roleMiddleware('admin', 'editor');
export const anyRole = roleMiddleware('admin', 'editor', 'viewer');
