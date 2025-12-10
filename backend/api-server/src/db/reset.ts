/**
 * Database Reset Script
 *
 * Drops all tables and re-runs migrations.
 * WARNING: This will delete all data!
 *
 * Usage: npm run db:reset
 *
 * Currently supports SQLite only.
 */

import { connection, dialect, closeDatabase } from './index.js';
import { runMigrations } from './migrate.js';

const reset = async () => {
  console.log('\n🗑️  Database Reset\n');
  console.log('⚠️  WARNING: This will delete ALL data!\n');
  console.log(`📦 Dialect: ${dialect}\n`);

  try {
    // Get all table names
    const tables = connection
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      )
      .all() as { name: string }[];

    if (tables.length === 0) {
      console.log('ℹ️  No tables found in database.');
    } else {
      // Disable foreign key checks temporarily
      connection.exec('PRAGMA foreign_keys = OFF;');

      // Drop all tables
      for (const { name } of tables) {
        console.log(`  ❌ Dropping table: ${name}`);
        connection.exec(`DROP TABLE IF EXISTS "${name}";`);
      }

      // Re-enable foreign key checks
      connection.exec('PRAGMA foreign_keys = ON;');

      console.log(`\n✓ Dropped ${tables.length} table(s)\n`);
    }

    // Run migrations to recreate schema
    console.log('📦 Re-running migrations...\n');
    await runMigrations();

    console.log('\n✅ Database reset completed!\n');
    console.log('💡 Run `npm run db:seed` to create default admin user.\n');
  } catch (error) {
    console.error('\n❌ Reset failed:', error);
    process.exit(1);
  } finally {
    await closeDatabase();
  }
};

// Run reset
reset();
