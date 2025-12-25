import { FastifyInstance } from 'fastify';
import { ingestBatchEndpoint } from './handlers/ingest-batch';

export const registerIngestRoutes = (fastify: FastifyInstance) => {
  ingestBatchEndpoint({ route: '/ingest/batch', fastify });
};
