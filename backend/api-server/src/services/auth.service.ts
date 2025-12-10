/**
 * Auth Service - handles user authentication logic
 * Uses Drizzle ORM for database operations
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { eq } from 'drizzle-orm';
import config from '../config.js';
import { db, users, refreshTokens } from '../db/index.js';
import type {
  User as DbUser,
  NewUser,
  RefreshToken as DbRefreshToken,
  NewRefreshToken,
} from '../db/schema/index.js';
import type {
  User,
  UserPublic,
  JwtPayload,
  RefreshToken,
  LoginResponse,
} from '../types/index.js';

const SALT_ROUNDS = 10;

// Promise to track initialization completion
let initPromise: Promise<void> | null = null;

/**
 * Initialize default admin user if not exists
 */
const initDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@wtg.pl'))
      .get();

    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash('admin123', SALT_ROUNDS);
      const now = new Date().toISOString();

      db.insert(users)
        .values({
          id: 'admin-1',
          email: 'admin@wtg.pl',
          passwordHash,
          role: 'admin',
          createdAt: now,
          updatedAt: now,
        })
        .run();

      console.log('Default admin user created: admin@wtg.pl / admin123');
    }
  } catch (error) {
    console.error('Failed to initialize default admin:', error);
  }
};

// Initialize on module load
initPromise = initDefaultAdmin();

/**
 * Ensure default admin user is initialized (for testing)
 * Call this before running auth tests
 */
export const ensureInitialized = async (): Promise<void> => {
  if (initPromise) {
    await initPromise;
  }
};

/**
 * Convert DB user to domain User type
 */
function dbUserToUser(dbUser: DbUser): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    passwordHash: dbUser.passwordHash,
    role: dbUser.role as User['role'],
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
  };
}

/**
 * Convert DB refresh token to domain RefreshToken type
 */
function dbTokenToToken(dbToken: DbRefreshToken): RefreshToken {
  return {
    id: dbToken.id,
    userId: dbToken.userId,
    token: dbToken.token,
    expiresAt: dbToken.expiresAt,
    createdAt: dbToken.createdAt,
  };
}

class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse | null> {
    // Find user by email
    const dbUser = db.select().from(users).where(eq(users.email, email)).get();

    if (!dbUser) {
      return null;
    }

    const user = dbUserToUser(dbUser);

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
    const result = db
      .delete(refreshTokens)
      .where(eq(refreshTokens.token, refreshToken))
      .run();

    return result.changes > 0;
  }

  /**
   * Refresh access token using refresh token
   */
  async refresh(
    refreshToken: string
  ): Promise<{ accessToken: string; expiresIn: number } | null> {
    // Find refresh token
    const dbToken = db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, refreshToken))
      .get();

    if (!dbToken) {
      return null;
    }

    const storedToken = dbTokenToToken(dbToken);

    // Check if expired
    if (new Date(storedToken.expiresAt) < new Date()) {
      // Delete expired token
      db.delete(refreshTokens)
        .where(eq(refreshTokens.id, storedToken.id))
        .run();
      return null;
    }

    // Get user
    const dbUser = db
      .select()
      .from(users)
      .where(eq(users.id, storedToken.userId))
      .get();

    if (!dbUser) {
      return null;
    }

    const user = dbUserToUser(dbUser);

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
    const dbUser = db.select().from(users).where(eq(users.id, userId)).get();

    if (!dbUser) {
      return null;
    }

    return this.toPublicUser(dbUserToUser(dbUser));
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
   * Generate refresh token and store it in DB
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

    const refreshToken: NewRefreshToken = {
      id: crypto.randomUUID(),
      userId,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: new Date().toISOString(),
    };

    // Store in database
    db.insert(refreshTokens).values(refreshToken).run();

    return refreshToken as RefreshToken;
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
   * Create a new user
   */
  async createUser(
    email: string,
    password: string,
    role: User['role'] = 'editor'
  ): Promise<UserPublic> {
    const id = crypto.randomUUID();
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const now = new Date().toISOString();

    const newUser: NewUser = {
      id,
      email,
      passwordHash,
      role,
      createdAt: now,
      updatedAt: now,
    };

    db.insert(users).values(newUser).run();

    return this.toPublicUser(dbUserToUser(newUser as DbUser));
  }

  /**
   * Check if email already exists
   */
  async emailExists(email: string): Promise<boolean> {
    const existingUser = db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, email))
      .get();

    return !!existingUser;
  }

  /**
   * Delete all refresh tokens for a user (for cleanup/logout all sessions)
   */
  async deleteAllUserTokens(userId: string): Promise<number> {
    const result = db
      .delete(refreshTokens)
      .where(eq(refreshTokens.userId, userId))
      .run();

    return result.changes;
  }

  /**
   * Clean up expired refresh tokens (for maintenance)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const now = new Date().toISOString();

    // SQLite string comparison works for ISO dates
    const allTokens = db.select().from(refreshTokens).all();
    let deleted = 0;

    for (const token of allTokens) {
      if (token.expiresAt < now) {
        db.delete(refreshTokens).where(eq(refreshTokens.id, token.id)).run();
        deleted++;
      }
    }

    return deleted;
  }
}

export const authService = new AuthService();
