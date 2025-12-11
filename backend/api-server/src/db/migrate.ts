/**
 * Database migration runner
 * Applies pending migrations to the database
 *
 * Currently supports SQLite only.
 * PostgreSQL support is planned for production.
 */

import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db, connection, dialect, closeDatabase } from './index.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const runMigrations = async () => {
  console.log(`Running database migrations (${dialect})...`);

  try {
    // Migrations folder is relative to the project root
    const migrationsFolder = join(__dirname, '../../drizzle/migrations');

    // Currently only SQLite is supported
    migrate(db, { migrationsFolder });

    console.log('Migrations completed successfully.');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

// Run migrations if this file is executed directly
const isMainModule = process.argv[1]?.includes('migrate');
if (isMainModule) {
  runMigrations()
    .then(async () => {
      await closeDatabase();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error(error);
      await closeDatabase();
      process.exit(1);
    });
}
