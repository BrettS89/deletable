import { FastifyInstance } from 'fastify';
import { ingestBatchEndpoint } from './handlers/ingest-batch';
import { IngestService } from './ingest.service';

export const registerIngestRoutes = (fastify: FastifyInstance) => {
  const ingestService = new IngestService(fastify.db.pool);

  ingestBatchEndpoint({ route: '/ingest/batch', fastify, service: ingestService });
};
