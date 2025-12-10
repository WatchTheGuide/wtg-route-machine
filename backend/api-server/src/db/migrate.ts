/**
 * Database migration runner
 * Applies pending migrations to the database
 */

import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { db, connection } from './index.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const runMigrations = async () => {
  console.log('Running database migrations...');

  try {
    // Migrations folder is relative to the project root
    const migrationsFolder = join(__dirname, '../../drizzle/migrations');

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
    .then(() => {
      connection.close();
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      connection.close();
      process.exit(1);
    });
}
