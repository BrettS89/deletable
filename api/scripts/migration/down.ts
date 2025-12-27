import { config } from 'dotenv';
config()
import { runner } from 'node-pg-migrate';

async function runMigrations() {
  await runner({
    databaseUrl: process.env.POSTGRES_URL as string,
    dir: 'migrations',
    direction: 'down',
    migrationsTable: 'migrations',
  });
}

runMigrations();
