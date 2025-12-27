import { RegisterEndpoint } from '../../../types/api';
import { IngestBatchDto } from '../types/ingest.dto';
import { IngestService } from '../ingest.service';
import { ingestBatchRequestSchema } from '../ingest.validators';

export const ingestBatchEndpoint: RegisterEndpoint = ({ route, fastify }) => {
  fastify.route<{ Body: IngestBatchDto }>({
    method: 'POST',
    url: route,
    schema: {
      tags: ['ingest batch'],
      body: ingestBatchRequestSchema,
      response: {
        204: { type: 'null' },
      }
    },
    handler: async (request, reply) => {
      const ingestService = new IngestService(fastify.db.pool);

      await ingestService.ingestBatch(request.body);
      
      reply.status(204).send();
    }
  });
};
