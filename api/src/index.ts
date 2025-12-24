import { config } from 'dotenv';
config();
import { initApp } from './app';
import { postgres } from './storage/db/postgres/db';
import { validateEnvironmentVariables } from './config/environment-variables';

const run = async () => {
  validateEnvironmentVariables();

  try {
    await postgres.connect({
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    });

    const fastify = await initApp();

    console.log('Connected to postgres')
    
    process.on('SIGTERM', async () => {
      await postgres.close();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      await postgres.close();
      process.exit(0);
    });

    process.on('uncaughtException', async () => {
      await postgres.close();
      process.exit(1);
    });

    await fastify.listen({ port: Number(process.env.PORT), host: '0.0.0.0' });
    console.log(`Server running on port ${process.env.PORT}`);
  } catch(e) {
    console.error('Caught error:', e);
    // if (fastify && fastify.log) fastify.log.error(e);
    process.exit(1);
  }
};

run();
