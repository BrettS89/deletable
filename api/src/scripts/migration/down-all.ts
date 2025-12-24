import { config } from 'dotenv';
config()
import migrate from 'node-pg-migrate';
import { validateEnvironmentVariables } from '../../config/environment-variables';

async function runMigrations() {
  validateEnvironmentVariables();

  await migrate({
    databaseUrl: 'postgres://root:root@localhost:5432/churchcomapi',
    dir: 'migrations',
    direction: 'down',
    count: 99999,
    migrationsTable: 'migrations',
  });
}
runMigrations();
