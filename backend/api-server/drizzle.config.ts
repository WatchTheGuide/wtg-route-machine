import { defineConfig } from 'drizzle-kit';

const databaseUrl = process.env.DATABASE_URL || 'file:./data/wtg.db';
const isPostgres =
  databaseUrl.startsWith('postgresql://') ||
  databaseUrl.startsWith('postgres://');

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: isPostgres ? 'postgresql' : 'sqlite',
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});
