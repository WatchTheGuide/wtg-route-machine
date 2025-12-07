/**
 * Auth Service - handles user authentication logic
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from '../config.js';
import type {
  User,
  UserPublic,
  JwtPayload,
  RefreshToken,
  LoginResponse,
} from '../types/index.js';

// In-memory storage (replace with database in production)
const users: Map<string, User> = new Map();
const refreshTokens: Map<string, RefreshToken> = new Map();

// Initialize default admin user
const initDefaultAdmin = async () => {
  const adminId = 'admin-1';
  if (!users.has(adminId)) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    users.set(adminId, {
      id: adminId,
      email: 'admin@wtg.pl',
      passwordHash,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    console.log('Default admin user created: admin@wtg.pl / admin123');
  }
};

// Initialize on module load
initDefaultAdmin();

const SALT_ROUNDS = 10;

class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse | null> {
    // Find user by email
    const user = Array.from(users.values()).find((u) => u.email === email);

    if (!user) {
      return null;
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user.id);

    return {
      accessToken,
      refreshToken: refreshToken.token,
      user: this.toPublicUser(user),
      expiresIn: this.getAccessTokenExpiresIn(),
    };
  }

  /**
   * Logout - invalidate refresh token
   */
  async logout(refreshToken: string): Promise<boolean> {
    // Find and remove refresh token
    for (const [id, token] of refreshTokens.entries()) {
      if (token.token === refreshToken) {
        refreshTokens.delete(id);
        return true;
      }
    }
    return false;
  }

  /**
   * Refresh access token using refresh token
   */
  async refresh(
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number } | null> {
    // Find refresh token
    let storedToken: RefreshToken | undefined;
    for (const token of refreshTokens.values()) {
      if (token.token === refreshToken) {
        storedToken = token;
        break;
      }
    }

    if (!storedToken) {
      return null;
    }

    // Check if expired
    if (new Date(storedToken.expiresAt) < new Date()) {
      refreshTokens.delete(storedToken.id);
      return null;
    }

    // Get user
    const user = users.get(storedToken.userId);
    if (!user) {
      return null;
    }

    // Generate new access token
    const accessToken = this.generateAccessToken(user);

    return {
      accessToken,
      expiresIn: this.getAccessTokenExpiresIn(),
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserPublic | null> {
    const user = users.get(userId);
    return user ? this.toPublicUser(user) : null;
  }

  /**
   * Verify JWT access token
   */
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      return decoded;
    } catch {
      return null;
    }
  }

  /**
   * Generate JWT access token
   */
  private generateAccessToken(user: User): string {
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const expiresInSeconds = this.getAccessTokenExpiresIn();

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: expiresInSeconds,
    });
  }

  /**
   * Generate refresh token and store it
   */
  private async generateRefreshToken(userId: string): Promise<RefreshToken> {
    const token = crypto.randomBytes(64).toString('hex');
    const expiresAt = new Date();

    // Parse expiration (e.g., "7d" -> 7 days)
    const expiresIn = config.jwtRefreshExpiresIn;
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];
      switch (unit) {
        case 'd':
          expiresAt.setDate(expiresAt.getDate() + value);
          break;
        case 'h':
          expiresAt.setHours(expiresAt.getHours() + value);
          break;
        case 'm':
          expiresAt.setMinutes(expiresAt.getMinutes() + value);
          break;
        case 's':
          expiresAt.setSeconds(expiresAt.getSeconds() + value);
          break;
      }
    } else {
      // Default to 7 days
      expiresAt.setDate(expiresAt.getDate() + 7);
    }

    const refreshToken: RefreshToken = {
      id: crypto.randomUUID(),
      userId,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    refreshTokens.set(refreshToken.id, refreshToken);
    return refreshToken;
  }

  /**
   * Get access token expiration in seconds
   */
  private getAccessTokenExpiresIn(): number {
    const expiresIn = config.jwtAccessExpiresIn;
    const match = expiresIn.match(/^(\d+)([dhms])$/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2];
      switch (unit) {
        case 'd':
          return value * 24 * 60 * 60;
        case 'h':
          return value * 60 * 60;
        case 'm':
          return value * 60;
        case 's':
          return value;
      }
    }
    return 3600; // Default 1 hour
  }

  /**
   * Convert User to UserPublic (without sensitive data)
   */
  private toPublicUser(user: User): UserPublic {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Create a new user (for future use)
   */
  async createUser(
    email: string,
    password: string,
    role: User['role'] = 'editor'
  ): Promise<UserPublic> {
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user: User = {
      id,
      email,
      passwordHash,
      role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.set(id, user);
    return this.toPublicUser(user);
  }

  /**
   * Check if email already exists
   */
  async emailExists(email: string): Promise<boolean> {
    return Array.from(users.values()).some((u) => u.email === email);
  }
}

export const authService = new AuthService();
