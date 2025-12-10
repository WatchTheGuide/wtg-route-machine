/**
 * Database connection and Drizzle ORM setup
 *
 * Currently supports SQLite for development.
 * PostgreSQL support is planned for production deployment.
 *
 * DATABASE_URL format:
 *   - SQLite: file:./data/wtg.db (default)
 *   - PostgreSQL: postgresql://user:pass@host:5432/dbname (planned)
 */

import Database, { type Database as DatabaseType } from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import * as schema from './schema/index.js';

// Database dialect (SQLite for now, PostgreSQL planned)
export type DbDialect = 'sqlite' | 'postgresql';
export const dialect: DbDialect = 'sqlite';

// Get database URL from environment or use default SQLite path
const getDatabaseUrl = (): string => {
  const url = process.env.DATABASE_URL || 'file:./data/wtg.db';

  // Validate that we're using SQLite for now
  if (url.startsWith('postgresql://') || url.startsWith('postgres://')) {
    console.warn(
      '⚠️  PostgreSQL is not fully supported yet. Falling back to SQLite.'
    );
    console.warn('   Set DATABASE_URL=file:./data/wtg.db for development.');
    return 'file:./data/wtg.db';
  }

  return url;
};

// Get SQLite path from URL
const getSqlitePath = (url: string): string => {
  if (url.startsWith('file:')) {
    return url.replace('file:', '');
  }
  return url;
};

// Create SQLite connection
const createConnection = () => {
  const url = getDatabaseUrl();
  const dbPath = getSqlitePath(url);

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
export const closeDatabase = async () => {
  sqlite.close();
};

// Re-export schema types
export * from './schema/index.js';
