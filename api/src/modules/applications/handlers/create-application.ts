import { RegisterEndpoint } from '../../../types/api';
import { ApplicationService } from '../application.service';
import { ApplicationResponseDto, CreateApplicationDto } from '../types/application.dto';
import { createApplicationSchema } from '../application.validators';
import { createApplicationResponseSchema } from '../application.validators';
import { toApplicationDto } from '../application.mappers';

export const createApplicationEndpoint: RegisterEndpoint = ({ route, fastify }) => {
  fastify.route<{ Body: CreateApplicationDto }>({
    method: 'POST',
    url: route,
    schema: {
      tags: ['application'],
      body: createApplicationSchema,
      response: {
        201: createApplicationResponseSchema,
      }
    },
    handler: async (request, reply) => {
      const service = new ApplicationService(fastify.db.pool);
      const createdApplication = await service.createApplication({
        name: request.body.name,
        accountId: request.account_id!
      });

      const response: { application: ApplicationResponseDto; application_api_key: string } = {
        application: toApplicationDto(createdApplication.application),
        application_api_key: createdApplication.applicationApiKey,
      };

      reply.status(201).send(response);
    }
  });
};
