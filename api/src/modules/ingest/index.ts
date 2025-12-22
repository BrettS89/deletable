import { FastifyInstance } from 'fastify';
import { ingestBatchEndpoint } from './handlers/ingest-batch';
import { IngestService } from './ingest.service';
import { Postgres } from '../../storage/db/postgres/db';

export const registerIngestRoutes = (fastify: FastifyInstance, postgres: Postgres) => {
  const ingestService = new IngestService(postgres);

  ingestBatchEndpoint({ route: '/ingest/batch', fastify, service: ingestService });
};
