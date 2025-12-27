import { config } from 'dotenv';
config()
import { runner } from 'node-pg-migrate';

async function runMigrations() {
  await runner({
    databaseUrl: 'postgres://root:root@localhost:5432/churchcomapi',
    dir: 'migrations',
    direction: 'down',
    count: 99999,
    migrationsTable: 'migrations',
  });
}

runMigrations();
