import { RegisterEndpoint } from '../../../types/api';
import { AccountService } from '../account.service';
import { CreateAccountDto } from '../types/account.dto';
import { createAccountSchema, accountResponseSchema } from '../account.validators';
import { toAccountResponseDto } from '../account.mappers';

export const createAccountEndpoint: RegisterEndpoint = ({ route, fastify }) => {
  fastify.route<{ Body: CreateAccountDto }>({
    method: 'POST',
    url: route,
    schema: {
      tags: ['account'],
      body: createAccountSchema,
      response: {
        201: accountResponseSchema,
      }
    },
    handler: async (request, reply) => {
      const service = new AccountService(fastify.db.pool);

      const createdAccount = await service.createAccount(request.body);

      const response = toAccountResponseDto(createdAccount);

      reply.status(201).send(response);
    }
  });
};
