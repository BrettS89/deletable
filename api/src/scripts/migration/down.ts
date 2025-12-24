import { config } from 'dotenv';
config()
import migrate from 'node-pg-migrate';
import { validateEnvironmentVariables } from '../../config/environment-variables';

async function runMigrations() {
  validateEnvironmentVariables();

  if (process.env)

  await migrate({
    databaseUrl: process.env.POSTGRES_URL as string,
    dir: 'migrations',
    direction: 'down',
    migrationsTable: 'migrations',
  });
}
runMigrations();
