/**
 * Database connection and Drizzle ORM setup
 * Supports SQLite for development
 */

import Database, { type Database as DatabaseType } from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import * as schema from './schema/index.js';

// Get database URL from environment or use default SQLite path
const getDatabasePath = (): string => {
  const url = process.env.DATABASE_URL || 'file:./data/wtg.db';

  // Handle SQLite file:// URL format
  if (url.startsWith('file:')) {
    return url.replace('file:', '');
  }

  return url;
};

// Create database connection
const createConnection = () => {
  const dbPath = getDatabasePath();

  // Ensure data directory exists
  const dir = dirname(dbPath);
  if (dir && dir !== '.' && !existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  // Create SQLite connection
  const sqlite = new Database(dbPath);

  // Enable WAL mode for better performance
  sqlite.pragma('journal_mode = WAL');

  // Enable foreign keys
  sqlite.pragma('foreign_keys = ON');

  return sqlite;
};

// SQLite connection instance
const sqlite = createConnection();

// Drizzle ORM instance with schema
export const db = drizzle(sqlite, { schema });

// Export the raw SQLite connection for migrations
export const connection: DatabaseType = sqlite;

// Close database connection (for graceful shutdown)
export const closeDatabase = () => {
  sqlite.close();
};

// Re-export schema types
export * from './schema/index.js';
